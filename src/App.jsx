import React, { useState, useCallback, useMemo } from "react";
import { Button, Typography, Divider, Row, Col, FloatButton, Tour } from "antd";
import { QuestionCircleOutlined, BulbOutlined } from "@ant-design/icons";
import WallEditor from "./components/WallEditor";
import FrameEditor from "./components/FrameEditor";
import CanvasDisplay from "./components/CanvasDisplay";
import ConfigManager from "./components/ConfigManager";
import { useLocalStorage } from "./hooks/useLocalStorage";

const { Title, Paragraph } = Typography;

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
  const [wall, setWall] = useLocalStorage('artwall_current_wall', getDefaultWall());
  const [frames, setFrames] = useLocalStorage('artwall_current_frames', [getDefaultFrame()]);
  const [tourOpen, setTourOpen] = useState(false);

  const handleFrameChange = useCallback((idx, newFrame) => {
    setFrames(prev => prev.map((f, i) => (i === idx ? { ...f, ...newFrame } : f)));
  }, [setFrames]);

  const handleFrameDelete = useCallback((idx) => {
    setFrames(prev => prev.filter((_, i) => i !== idx));
  }, [setFrames]);

  const handleAddFrame = useCallback(() => {
    setFrames(prev => [...prev, getDefaultFrame()]);
  }, [setFrames]);

  const handleLoadConfig = useCallback((newWall, newFrames) => {
    setWall(newWall);
    setFrames(newFrames);
  }, [setWall, setFrames]);

  const handleResetConfig = useCallback(() => {
    setWall(getDefaultWall());
    setFrames([getDefaultFrame()]);
  }, [setWall, setFrames]);

  // Tour steps for new users
  const tourSteps = useMemo(() => [
    {
      title: '欢迎使用 ArtWall！',
      description: '这是一个现代化的挂画展示设计工具，让我们开始快速导览。',
      target: null,
    },
    {
      title: '墙面设置',
      description: '在这里设置墙面的尺寸、颜色和背景图片。',
      target: () => document.querySelector('.wall-editor'),
    },
    {
      title: '画框管理',
      description: '添加和编辑画框，支持多种形状和样式。',
      target: () => document.querySelector('.frame-editor'),
    },
    {
      title: '实时预览',
      description: '在这里查看实时效果，可以拖拽调整画框位置和大小。',
      target: () => document.querySelector('.canvas-wrapper'),
    },
    {
      title: '配置管理',
      description: '保存、加载和导出你的设计配置。',
      target: () => document.querySelector('.config-manager'),
    },
  ], []);

  return (
    <div className="app-container">
      <header className="app-header">
        <Title level={1} className="app-title">
          🎨 ArtWall
        </Title>
        <Paragraph className="app-subtitle">
          现代化的挂画展示设计工具 - 让艺术装点生活
        </Paragraph>
      </header>
      
      <div className="config-manager" style={{ textAlign: "center", marginBottom: 24 }}>
        <ConfigManager
          wall={wall}
          frames={frames}
          onLoad={handleLoadConfig}
          onReset={handleResetConfig}
        />
      </div>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={10}>
          <div className="wall-editor">
            <Title level={3} className="section-title">
              🏠 墙面设置
            </Title>
            <WallEditor wall={wall} onChange={setWall} />
          </div>
          
          <Divider />
          
          <div className="frame-editor">
            <div className="section-header">
              <Title level={3} className="section-title">
                🖼️ 画框设置
              </Title>
              <div className="frame-count">
                共 {frames.length} 个画框
              </div>
            </div>
            
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
              className="add-frame-btn"
              size="large"
            >
              ➕ 新增画框
            </Button>
          </div>
        </Col>
        
        <Col xs={24} lg={14}>
          <Title level={3} className="section-title">
            👁️ 效果预览
          </Title>
          <CanvasDisplay 
            wall={wall} 
            frames={frames} 
            onFrameUpdate={handleFrameChange}
          />
        </Col>
      </Row>
      
      <footer className="app-footer">
        <Divider />
        <div className="footer-content">
          <div className="footer-features">
            <span>💡 移动端友好</span>
            <span>🚀 一键部署</span>
            <span>💾 配置管理</span>
            <span>📱 PWA 支持</span>
          </div>
          <div className="footer-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="#" onClick={() => setTourOpen(true)}>
              使用教程
            </a>
          </div>
        </div>
      </footer>

      {/* Floating help button */}
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24 }}
        icon={<QuestionCircleOutlined />}
      >
        <FloatButton 
          icon={<BulbOutlined />} 
          tooltip="使用教程"
          onClick={() => setTourOpen(true)}
        />
      </FloatButton.Group>

      {/* User guide tour */}
      <Tour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        steps={tourSteps}
        indicatorsRender={(current, total) => (
          <span>{current + 1} / {total}</span>
        )}
      />
    </div>
  );
}