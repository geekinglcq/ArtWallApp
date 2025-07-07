import React, { useRef } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import InteractiveFrame from "./InteractiveFrame";
import { Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

// 背景图片组件
function BackgroundImage({ src, width, height }) {
  const [image] = useImage(src, "anonymous");
  
  if (!image) return null;
  
  return (
    <KonvaImage
      image={image}
      x={0}
      y={0}
      width={width}
      height={height}
      listening={false}
      opacity={0.8} // 稍微透明，让前景更突出
    />
  );
}

export default function CanvasDisplay({ wall, frames, onFrameUpdate }) {
  const stageRef = useRef();
  const containerRef = useRef();
  const [stageScale, setStageScale] = React.useState(1);
  const [stagePos, setStagePos] = React.useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = React.useState(null);

  // 计算最佳缩放比例
  React.useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth - 40; // 留边距
      const containerHeight = window.innerHeight * 0.6; // 限制高度
      
      const scaleX = containerWidth / wall.width;
      const scaleY = containerHeight / wall.height;
      const optimalScale = Math.min(scaleX, scaleY, 1); // 不超过1倍
      
      setStageScale(optimalScale);
      setStagePos({ x: 0, y: 0 });
    }
  }, [wall.width, wall.height]);

  const handleExport = () => {
    try {
      const uri = stageRef.current.toDataURL({ 
        pixelRatio: 2,
        mimeType: 'image/png',
        quality: 1
      });
      
      const link = document.createElement("a");
      link.download = `artwall-${Date.now()}.png`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success("效果图导出成功！");
    } catch (error) {
      console.error("导出失败:", error);
      message.error("导出失败，请重试");
    }
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    // 限制缩放范围
    const clampedScale = Math.max(0.1, Math.min(3, newScale));
    
    stage.scale({ x: clampedScale, y: clampedScale });
    
    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };
    
    stage.position(newPos);
    setStageScale(clampedScale);
    setStagePos(newPos);
  };

  const handleStageClick = (e) => {
    // 点击空白区域取消选择
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  const handleFrameSelect = (frameId) => {
    setSelectedId(frameId);
  };

  const handleFrameChange = (frameId, newFrameData) => {
    const frameIndex = frames.findIndex(f => f.id === frameId);
    if (frameIndex !== -1 && onFrameUpdate) {
      onFrameUpdate(frameIndex, newFrameData);
    }
  };

  return (
    <div ref={containerRef} className="canvas-wrapper">
      <div style={{ 
        marginBottom: 12, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8
      }}>
        <div style={{ fontSize: 12, color: '#666' }}>
          缩放: {Math.round(stageScale * 100)}% | 鼠标滚轮缩放 | 拖拽移动画布 | 点击画框选择和调整
        </div>
        <div>
          <Button 
            size="small" 
            onClick={() => {
              setStageScale(1);
              setStagePos({ x: 0, y: 0 });
              if (stageRef.current) {
                stageRef.current.scale({ x: 1, y: 1 });
                stageRef.current.position({ x: 0, y: 0 });
              }
            }}
            style={{ marginRight: 8 }}
          >
            重置视图
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            size="small"
          >
            导出效果图
          </Button>
        </div>
      </div>
      
      <div style={{ 
        border: "1px solid #e8e8e8",
        borderRadius: 8,
        overflow: 'hidden',
        background: '#f8f8f8'
      }}>
        <Stage
          width={Math.min(wall.width * stageScale, window.innerWidth - 100)}
          height={Math.min(wall.height * stageScale, window.innerHeight * 0.7)}
          ref={stageRef}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stagePos.x}
          y={stagePos.y}
          draggable
          onWheel={handleWheel}
          onDragEnd={(e) => {
            setStagePos({ x: e.target.x(), y: e.target.y() });
          }}
          onClick={handleStageClick}
          onTap={handleStageClick}
        >
          <Layer>
            {/* 背景 */}
            <Rect
              x={0}
              y={0}
              width={wall.width}
              height={wall.height}
              fill={wall.bgColor}
            />
            
            {/* 背景图片 */}
            {wall.bgImage && (
              <BackgroundImage 
                src={wall.bgImage} 
                width={wall.width} 
                height={wall.height} 
              />
            )}
            
            {/* 画框和画作 */}
            {frames.map((frame) => (
              <InteractiveFrame
                key={frame.id}
                frame={frame}
                isSelected={selectedId === frame.id}
                onSelect={() => handleFrameSelect(frame.id)}
                onChange={(newFrameData) => handleFrameChange(frame.id, newFrameData)}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
} 