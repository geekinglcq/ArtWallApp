import React from "react";
import { Rect, Circle, Line, Group } from "react-konva";

// 扇形组件
function Wedge({ x, y, radius, angle, rotation, ...props }) {
  const points = [];
  const step = 2; // 减少点数以提高性能
  
  // 添加中心点
  points.push(x, y);
  
  // 生成扇形边缘点
  for (let a = 0; a <= angle; a += step) {
    const rad = ((a + rotation) * Math.PI) / 180;
    points.push(x + radius * Math.cos(rad), y + radius * Math.sin(rad));
  }
  
  return (
    <Line 
      points={points} 
      closed 
      fill={props.fill} 
      stroke={props.stroke} 
      strokeWidth={props.strokeWidth} 
    />
  );
}

export default function FrameShape({ 
  shape, 
  x, 
  y, 
  width, 
  height, 
  borderWidth, 
  borderColor, 
  children, 
  matWidth = 0, 
  matColor = "#fff"
}) {
  let frame, mat;
  
  switch (shape) {
    case "rect":
      // 衬纸（如果有）
      mat = matWidth > 0 ? (
        <Rect
          x={x - matWidth}
          y={y - matWidth}
          width={width + matWidth * 2}
          height={height + matWidth * 2}
          fill={matColor}
          cornerRadius={4}
        />
      ) : null;
      
      // 画框
      frame = (
        <Rect
          x={x}
          y={y}
          width={width}
          height={height}
          stroke={borderColor}
          strokeWidth={borderWidth}
          fill="white"
          cornerRadius={2}
        />
      );
      break;
      
    case "square":
      const size = Math.min(width, height);
      
      mat = matWidth > 0 ? (
        <Rect
          x={x - matWidth}
          y={y - matWidth}
          width={size + matWidth * 2}
          height={size + matWidth * 2}
          fill={matColor}
          cornerRadius={4}
        />
      ) : null;
      
      frame = (
        <Rect
          x={x}
          y={y}
          width={size}
          height={size}
          stroke={borderColor}
          strokeWidth={borderWidth}
          fill="white"
          cornerRadius={2}
        />
      );
      break;
      
    case "circle":
      const radius = Math.min(width, height) / 2;
      
      mat = matWidth > 0 ? (
        <Circle 
          x={x + radius} 
          y={y + radius} 
          radius={radius + matWidth} 
          fill={matColor} 
        />
      ) : null;
      
      frame = (
        <Circle
          x={x + radius}
          y={y + radius}
          radius={radius}
          stroke={borderColor}
          strokeWidth={borderWidth}
          fill="white"
        />
      );
      break;
      
    case "wedge":
      const wedgeRadius = Math.min(width, height) / 2;
      const angle = 90; // 90度扇形
      
      mat = matWidth > 0 ? (
        <Wedge
          x={x + wedgeRadius}
          y={y + wedgeRadius}
          radius={wedgeRadius + matWidth}
          angle={angle}
          rotation={0}
          fill={matColor}
        />
      ) : null;
      
      frame = (
        <Wedge
          x={x + wedgeRadius}
          y={y + wedgeRadius}
          radius={wedgeRadius}
          angle={angle}
          rotation={0}
          stroke={borderColor}
          strokeWidth={borderWidth}
          fill="white"
        />
      );
      break;
      
    default:
      frame = null;
      mat = null;
  }
  
  return (
    <Group>
      {mat}
      {frame}
      {children}
    </Group>
  );
} 