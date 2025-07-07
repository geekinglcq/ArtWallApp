import React, { useRef } from "react";
import { Group, Transformer } from "react-konva";
import FrameShape from "./FrameShape";
import PaintingImage from "./PaintingImage";

export default function InteractiveFrame({ 
  frame, 
  isSelected, 
  onSelect, 
  onChange 
}) {
  const shapeRef = useRef();
  const trRef = useRef();

  React.useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      // 将transformer附加到选中的元素
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransform = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // 计算新的尺寸
    const newWidth = Math.max(40, node.width() * scaleX);
    const newHeight = Math.max(40, node.height() * scaleY);
    
    // 重置缩放并更新尺寸
    node.scaleX(1);
    node.scaleY(1);
    
    // 更新frame数据
    onChange({
      ...frame,
      x: Math.round(node.x()),
      y: Math.round(node.y()),
      width: Math.round(newWidth),
      height: Math.round(newHeight)
    });
  };

  const handleDragEnd = (e) => {
    onChange({
      ...frame,
      x: Math.round(e.target.x()),
      y: Math.round(e.target.y())
    });
  };

  return (
    <>
      <Group
        ref={shapeRef}
        x={frame.x}
        y={frame.y}
        width={frame.width}
        height={frame.height}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransform}
      >
        <FrameShape
          shape={frame.shape}
          x={0} // 相对于Group的位置
          y={0}
          width={frame.width}
          height={frame.height}
          borderWidth={frame.borderWidth}
          borderColor={frame.borderColor}
          matWidth={frame.matWidth}
          matColor={frame.matColor}
        />
        
        {frame.painting && (
          <PaintingImage
            src={frame.painting}
            x={0}
            y={0}
            width={frame.width}
            height={frame.height}
            shape={frame.shape}
            borderWidth={frame.borderWidth}
            matWidth={frame.matWidth}
            fitMode={frame.fitMode || 'cover'}
          />
        )}
      </Group>
      
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // 限制最小尺寸
            if (newBox.width < 40 || newBox.height < 40) {
              return oldBox;
            }
            return newBox;
          }}
          // 自定义控制点样式
          borderStroke="#1890ff"
          borderStrokeWidth={2}
          anchorStroke="#1890ff"
          anchorFill="#fff"
          anchorSize={8}
          anchorCornerRadius={4}
        />
      )}
    </>
  );
} 