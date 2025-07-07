import React from "react";
import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";

// 画作图片组件，支持多种适配模式
export default function PaintingImage({ 
  src, 
  x, 
  y, 
  width, 
  height, 
  shape, 
  borderWidth = 0, 
  matWidth = 0,
  fitMode = 'cover' // cover, contain, fill, none
}) {
  const [image] = useImage(src, "anonymous");
  
  if (!src || !image) return null;

  // 计算实际绘制区域（扣除边框和衬纸）
  const actualX = x + borderWidth + matWidth;
  const actualY = y + borderWidth + matWidth;
  const actualWidth = width - 2 * borderWidth - 2 * matWidth;
  const actualHeight = height - 2 * borderWidth - 2 * matWidth;

  if (actualWidth <= 0 || actualHeight <= 0) return null;

  // 获取原始图片尺寸
  const imgWidth = image.width;
  const imgHeight = image.height;
  const imgRatio = imgWidth / imgHeight;
  const frameRatio = actualWidth / actualHeight;

  let cropX = 0, cropY = 0, cropWidth = imgWidth, cropHeight = imgHeight;
  let renderWidth = actualWidth, renderHeight = actualHeight;
  let renderX = actualX, renderY = actualY;

  // 根据适配模式计算显示参数
  switch (fitMode) {
    case 'cover': // 保持比例，覆盖整个画框，可能裁剪
      if (imgRatio > frameRatio) {
        // 图片更宽，裁剪左右
        cropWidth = imgHeight * frameRatio;
        cropX = (imgWidth - cropWidth) / 2;
      } else {
        // 图片更高，裁剪上下
        cropHeight = imgWidth / frameRatio;
        cropY = (imgHeight - cropHeight) / 2;
      }
      break;
      
    case 'contain': // 保持比例，完整显示图片，可能留白
      if (imgRatio > frameRatio) {
        // 图片更宽，以宽度为准
        renderHeight = actualWidth / imgRatio;
        renderY = actualY + (actualHeight - renderHeight) / 2;
      } else {
        // 图片更高，以高度为准
        renderWidth = actualHeight * imgRatio;
        renderX = actualX + (actualWidth - renderWidth) / 2;
      }
      break;
      
    case 'fill': // 拉伸填满，不保持比例
      // 使用默认值，直接拉伸
      break;
      
    case 'none': // 原始尺寸，居中显示
      renderWidth = Math.min(imgWidth, actualWidth);
      renderHeight = Math.min(imgHeight, actualHeight);
      renderX = actualX + (actualWidth - renderWidth) / 2;
      renderY = actualY + (actualHeight - renderHeight) / 2;
      
      // 如果图片比画框大，需要裁剪
      if (imgWidth > actualWidth) {
        cropX = (imgWidth - actualWidth) / 2;
        cropWidth = actualWidth;
      }
      if (imgHeight > actualHeight) {
        cropY = (imgHeight - actualHeight) / 2;
        cropHeight = actualHeight;
      }
      break;
  }

  // 对于圆形和扇形需要裁剪
  const needsClipping = shape === "circle" || shape === "wedge";
  
  return (
    <KonvaImage
      image={image}
      x={renderX}
      y={renderY}
      width={renderWidth}
      height={renderHeight}
      crop={{
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight
      }}
      listening={false}
      clipFunc={needsClipping ? (ctx) => {
        if (shape === "circle") {
          const radius = Math.min(actualWidth, actualHeight) / 2;
          const centerX = actualX + actualWidth / 2;
          const centerY = actualY + actualHeight / 2;
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
        } else if (shape === "wedge") {
          const radius = Math.min(actualWidth, actualHeight);
          const centerX = actualX + radius;
          const centerY = actualY + radius;
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, 0, Math.PI / 2, false);
          ctx.closePath();
        }
      } : undefined}
    />
  );
} 