import React, { useRef, useCallback } from "react";
import { Stage, Layer, Rect, Circle, Wedge, Image as KonvaImage, Transformer } from "react-konva";
import { Button, Space, message } from "antd";
import { DownloadOutlined, ExpandOutlined } from "@ant-design/icons";
import useImage from "use-image";

// Frame shape component
function FrameShape({ frame, isSelected, onSelect, onChange }) {
  const shapeRef = useRef();
  const trRef = useRef();
  const [bgImage] = useImage(frame.painting || frame.paintingUrl);

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = useCallback((e) => {
    onChange({
      x: e.target.x(),
      y: e.target.y(),
    });
  }, [onChange]);

  const handleTransformEnd = useCallback(() => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    onChange({
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });
  }, [onChange]);

  const commonProps = {
    ref: shapeRef,
    x: frame.x,
    y: frame.y,
    draggable: true,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
  };

  // Render different shapes based on frame.shape
  const renderShape = () => {
    const { shape, width, height, borderWidth, borderColor, matWidth, matColor } = frame;
    
    switch (shape) {
      case "circle":
        const radius = width / 2;
        return (
          <>
            {/* Mat (if exists) */}
            {matWidth > 0 && (
              <Circle
                x={frame.x + radius}
                y={frame.y + radius}
                radius={radius + matWidth}
                fill={matColor}
                stroke={borderColor}
                strokeWidth={borderWidth}
              />
            )}
            {/* Main frame */}
            <Circle
              {...commonProps}
              x={frame.x + radius}
              y={frame.y + radius}
              radius={radius}
              fill={bgImage ? undefined : "#fff"}
              stroke={borderColor}
              strokeWidth={borderWidth}
              fillPatternImage={bgImage}
              fillPatternScaleX={bgImage ? (radius * 2) / bgImage.width : 1}
              fillPatternScaleY={bgImage ? (radius * 2) / bgImage.height : 1}
            />
          </>
        );

      case "wedge":
        return (
          <>
            {/* Mat (if exists) */}
            {matWidth > 0 && (
              <Wedge
                x={frame.x + width / 2}
                y={frame.y + height / 2}
                radius={Math.min(width, height) / 2 + matWidth}
                angle={90}
                fill={matColor}
                stroke={borderColor}
                strokeWidth={borderWidth}
              />
            )}
            {/* Main frame */}
            <Wedge
              {...commonProps}
              x={frame.x + width / 2}
              y={frame.y + height / 2}
              radius={Math.min(width, height) / 2}
              angle={90}
              fill={bgImage ? undefined : "#fff"}
              stroke={borderColor}
              strokeWidth={borderWidth}
              fillPatternImage={bgImage}
              fillPatternScaleX={bgImage ? width / bgImage.width : 1}
              fillPatternScaleY={bgImage ? height / bgImage.height : 1}
            />
          </>
        );

      default: // rect or square
        return (
          <>
            {/* Mat (if exists) */}
            {matWidth > 0 && (
              <Rect
                x={frame.x - matWidth}
                y={frame.y - matWidth}
                width={width + matWidth * 2}
                height={height + matWidth * 2}
                fill={matColor}
                stroke={borderColor}
                strokeWidth={borderWidth}
              />
            )}
            {/* Main frame */}
            <Rect
              {...commonProps}
              width={width}
              height={height}
              fill={bgImage ? undefined : "#fff"}
              stroke={borderColor}
              strokeWidth={borderWidth}
              fillPatternImage={bgImage}
              fillPatternScaleX={bgImage ? width / bgImage.width : 1}
              fillPatternScaleY={bgImage ? height / bgImage.height : 1}
            />
          </>
        );
    }
  };

  return (
    <>
      {renderShape()}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}

function CanvasDisplay({ wall, frames, onFrameUpdate }) {
  const stageRef = useRef();
  const [selectedId, setSelectedId] = React.useState(null);
  const [wallBgImage] = useImage(wall.bgImage);

  const handleStageClick = useCallback((e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  }, []);

  const handleFrameSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const handleFrameChange = useCallback((index, changes) => {
    onFrameUpdate(index, changes);
  }, [onFrameUpdate]);

  const handleExport = useCallback(() => {
    const stage = stageRef.current;
    const dataURL = stage.toDataURL({ pixelRatio: 2 });
    
    const link = document.createElement('a');
    link.download = `artwall-${Date.now()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success('效果图已导出！');
  }, []);

  const handleFullscreen = useCallback(() => {
    const canvas = stageRef.current.getStage().container();
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    }
  }, []);

  return (
    <div className="canvas-wrapper">
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleExport}
          >
            导出效果图
          </Button>
          <Button 
            icon={<ExpandOutlined />} 
            onClick={handleFullscreen}
          >
            全屏预览
          </Button>
        </Space>
      </div>
      
      <div style={{ 
        border: "1px solid #d9d9d9", 
        borderRadius: "8px", 
        overflow: "hidden",
        display: "inline-block"
      }}>
        <Stage
          ref={stageRef}
          width={wall.width}
          height={wall.height}
          onClick={handleStageClick}
          onTap={handleStageClick}
        >
          <Layer>
            {/* Wall background */}
            <Rect
              x={0}
              y={0}
              width={wall.width}
              height={wall.height}
              fill={wall.bgColor}
              fillPatternImage={wallBgImage}
              fillPatternScaleX={wallBgImage ? wall.width / wallBgImage.width : 1}
              fillPatternScaleY={wallBgImage ? wall.height / wallBgImage.height : 1}
            />
            
            {/* Frames */}
            {frames.map((frame, index) => (
              <FrameShape
                key={frame.id}
                frame={frame}
                isSelected={frame.id === selectedId}
                onSelect={() => handleFrameSelect(frame.id)}
                onChange={(changes) => handleFrameChange(index, changes)}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

export default CanvasDisplay;