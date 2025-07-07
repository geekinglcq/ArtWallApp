import React, { useState } from "react";
import { Button, Typography, Divider, Row, Col } from "antd";
import WallEditor from "./components/WallEditor";
import FrameEditor from "./components/FrameEditor";
import CanvasDisplay from "./components/CanvasDisplay";
import ConfigManager from "./components/ConfigManager";

const { Title } = Typography;

function getDefaultWall() {
  return {
    width: 800,
    height: 500,
    bgColor: "#f5f5f5",
    bgImage: null
  };
}

function getDefaultFrame() {
  return {
    id: Date.now() + Math.random(),
    shape: "rect",
    width: 120,
    height: 160,
    borderWidth: 4,
    borderColor: "#333",
    x: 100,
    y: 100,
    painting: null,
    paintingUrl: "",
    matWidth: 0,
    matColor: "#fff",
    fitMode: "cover"
  };
}

export default function App() {
  const [wall, setWall] = useState(getDefaultWall());
  const [frames, setFrames] = useState([getDefaultFrame()]);

  const handleFrameChange = (idx, newFrame) => {
    setFrames((prev) => prev.map((f, i) => (i === idx ? { ...f, ...newFrame } : f)));
  };

  const handleFrameDelete = (idx) => {
    setFrames((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddFrame = () => {
    setFrames((prev) => [...prev, getDefaultFrame()]);
  };

  const handleLoadConfig = (newWall, newFrames) => {
    setWall(newWall);
    setFrames(newFrames);
  };

  const handleResetConfig = () => {
    setWall(getDefaultWall());
    setFrames([getDefaultFrame()]);
  };

  return (
    <div className="app-container">
      <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
        🎨 ArtWall 挂画展示
      </Title>
      
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <ConfigManager
          wall={wall}
          frames={frames}
          onLoad={handleLoadConfig}
          onReset={handleResetConfig}
        />
      </div>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Title level={4}>墙面设置</Title>
          <WallEditor wall={wall} onChange={setWall} />
          
          <Divider />
          
          <div>
            <Title level={4} style={{ marginBottom: 8 }}>
              画框设置 ({frames.length}个)
            </Title>
            <div className="frame-editor-container">
              <FrameEditor 
                frames={frames} 
                onChange={handleFrameChange} 
                onDelete={handleFrameDelete} 
              />
            </div>
            <Button 
              type="dashed" 
              onClick={handleAddFrame} 
              style={{ marginTop: 12, width: "100%" }}
            >
              + 新增画框
            </Button>
          </div>
        </Col>
        
        <Col xs={24} lg={12}>
          <Title level={4}>效果预览</Title>
          <CanvasDisplay 
            wall={wall} 
            frames={frames} 
            onFrameUpdate={handleFrameChange}
          />
        </Col>
      </Row>
      
      <Divider />
      
      <div style={{ 
        color: "#888", 
        fontSize: 12, 
        textAlign: "center",
        padding: "16px 0"
      }}>
        💡 移动端友好，支持导出效果图<br />
        🚀 可使用 Vercel/Netlify 或 Docker 一键部署
      </div>
    </div>
  );
} 