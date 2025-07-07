import React, { useState } from "react";
import { Button, Modal, Input, message, Upload, Space, Divider, Typography } from "antd";
import { 
  SaveOutlined, 
  FolderOpenOutlined, 
  DownloadOutlined, 
  UploadOutlined,
  FileTextOutlined,
  ClearOutlined
} from "@ant-design/icons";
import yaml from "js-yaml";

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function ConfigManager({ 
  wall, 
  frames, 
  onLoad, 
  onReset 
}) {
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [loadModalVisible, setLoadModalVisible] = useState(false);
  const [configName, setConfigName] = useState("");
  const [yamlContent, setYamlContent] = useState("");
  const [savedConfigs, setSavedConfigs] = useState([]);

  // 从localStorage获取已保存的配置列表
  React.useEffect(() => {
    const saved = localStorage.getItem("artwall_configs");
    if (saved) {
      try {
        setSavedConfigs(JSON.parse(saved));
      } catch (error) {
        console.error("读取配置列表失败:", error);
      }
    }
  }, []);

  // 生成当前配置的YAML
  const generateYAML = () => {
    const config = {
      meta: {
        name: configName || "未命名配置",
        created: new Date().toISOString(),
        version: "1.0"
      },
      wall: {
        width: wall.width,
        height: wall.height,
        bgColor: wall.bgColor,
        bgImage: wall.bgImage ? "已设置背景图片" : null
      },
      frames: frames.map(frame => ({
        id: frame.id,
        shape: frame.shape,
        x: frame.x,
        y: frame.y,
        width: frame.width,
        height: frame.height,
        borderWidth: frame.borderWidth,
        borderColor: frame.borderColor,
        matWidth: frame.matWidth,
        matColor: frame.matColor,
        painting: frame.painting ? "已设置画作" : null,
        paintingUrl: frame.paintingUrl || null,
        fitMode: frame.fitMode || "cover"
      }))
    };
    
    return yaml.dump(config, { 
      indent: 2,
      lineWidth: 80,
      noCompatMode: true
    });
  };

  // 保存配置到本地存储
  const saveConfig = () => {
    if (!configName.trim()) {
      message.error("请输入配置名称");
      return;
    }

    const config = {
      name: configName.trim(),
      created: new Date().toISOString(),
      wall,
      frames
    };

    const saved = localStorage.getItem("artwall_configs");
    let configs = [];
    
    if (saved) {
      try {
        configs = JSON.parse(saved);
      } catch (error) {
        console.error("读取配置失败:", error);
      }
    }

    // 检查是否已存在同名配置
    const existingIndex = configs.findIndex(c => c.name === config.name);
    if (existingIndex !== -1) {
      configs[existingIndex] = config;
      message.success("配置已更新");
    } else {
      configs.push(config);
      message.success("配置已保存");
    }

    localStorage.setItem("artwall_configs", JSON.stringify(configs));
    setSavedConfigs(configs);
    setSaveModalVisible(false);
    setConfigName("");
  };

  // 下载YAML文件
  const downloadYAML = () => {
    const yamlData = generateYAML();
    const blob = new Blob([yamlData], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${configName || 'artwall-config'}.yaml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success("YAML文件已下载");
  };

  // 加载本地配置
  const loadLocalConfig = (config) => {
    onLoad(config.wall, config.frames);
    setLoadModalVisible(false);
    message.success(`已加载配置: ${config.name}`);
  };

  // 删除本地配置
  const deleteLocalConfig = (configName) => {
    const updated = savedConfigs.filter(c => c.name !== configName);
    localStorage.setItem("artwall_configs", JSON.stringify(updated));
    setSavedConfigs(updated);
    message.success("配置已删除");
  };

  // 从YAML文件加载配置
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const yamlData = yaml.load(e.target.result);
        
        if (yamlData.wall && yamlData.frames) {
          onLoad(yamlData.wall, yamlData.frames);
          message.success("YAML配置加载成功");
          setLoadModalVisible(false);
        } else {
          message.error("无效的YAML配置文件");
        }
      } catch (error) {
        console.error("YAML解析失败:", error);
        message.error("YAML文件格式错误");
      }
    };
    reader.readAsText(file);
    return false; // 阻止默认上传行为
  };

  // 从YAML文本加载配置
  const loadFromYAML = () => {
    try {
      const yamlData = yaml.load(yamlContent);
      
      if (yamlData.wall && yamlData.frames) {
        onLoad(yamlData.wall, yamlData.frames);
        message.success("YAML配置加载成功");
        setLoadModalVisible(false);
        setYamlContent("");
      } else {
        message.error("无效的YAML配置格式");
      }
    } catch (error) {
      console.error("YAML解析失败:", error);
      message.error("YAML格式错误");
    }
  };

  // 重置所有配置
  const handleReset = () => {
    Modal.confirm({
      title: "确认重置",
      content: "是否确定要重置所有配置？这将清除当前的所有设置。",
      onOk: () => {
        onReset();
        message.success("配置已重置");
      }
    });
  };

  return (
    <>
      <Space wrap>
        <Button 
          icon={<SaveOutlined />} 
          onClick={() => setSaveModalVisible(true)}
          type="primary"
        >
          保存配置
        </Button>
        
        <Button 
          icon={<FolderOpenOutlined />} 
          onClick={() => setLoadModalVisible(true)}
        >
          加载配置
        </Button>
        
        <Button 
          icon={<DownloadOutlined />} 
          onClick={() => {
            setConfigName("artwall-export");
            downloadYAML();
          }}
        >
          导出YAML
        </Button>
        
        <Button 
          icon={<ClearOutlined />} 
          onClick={handleReset}
          danger
        >
          重置配置
        </Button>
      </Space>

      {/* 保存配置模态框 */}
      <Modal
        title="保存配置"
        open={saveModalVisible}
        onOk={saveConfig}
        onCancel={() => {
          setSaveModalVisible(false);
          setConfigName("");
        }}
        width={600}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Text>配置名称：</Text>
            <Input
              placeholder="输入配置名称"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              style={{ marginTop: 8 }}
            />
          </div>
          
          <Divider />
          
          <div>
            <Text>预览 YAML 配置：</Text>
            <TextArea
              value={generateYAML()}
              readOnly
              rows={10}
              style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 12 }}
            />
          </div>
          
          <Space>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={downloadYAML}
              disabled={!configName.trim()}
            >
              下载 YAML 文件
            </Button>
          </Space>
        </Space>
      </Modal>

      {/* 加载配置模态框 */}
      <Modal
        title="加载配置"
        open={loadModalVisible}
        onCancel={() => {
          setLoadModalVisible(false);
          setYamlContent("");
        }}
        footer={null}
        width={700}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          {/* 本地配置 */}
          <div>
            <Title level={5}>📁 本地配置</Title>
            {savedConfigs.length > 0 ? (
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {savedConfigs.map((config, index) => (
                  <div 
                    key={index}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 12px',
                      border: '1px solid #f0f0f0',
                      borderRadius: 6,
                      marginBottom: 8
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{config.name}</div>
                      <div style={{ fontSize: 12, color: '#999' }}>
                        {new Date(config.created).toLocaleString()}
                      </div>
                    </div>
                    <Space>
                      <Button 
                        size="small" 
                        onClick={() => loadLocalConfig(config)}
                      >
                        加载
                      </Button>
                      <Button 
                        size="small" 
                        danger 
                        onClick={() => deleteLocalConfig(config.name)}
                      >
                        删除
                      </Button>
                    </Space>
                  </div>
                ))}
              </div>
            ) : (
              <Text type="secondary">暂无保存的配置</Text>
            )}
          </div>

          <Divider />

          {/* YAML文件上传 */}
          <div>
            <Title level={5}>📄 从 YAML 文件加载</Title>
            <Upload
              accept=".yaml,.yml"
              beforeUpload={handleFileUpload}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>
                选择 YAML 文件
              </Button>
            </Upload>
          </div>

          <Divider />

          {/* YAML文本输入 */}
          <div>
            <Title level={5}>✏️ 粘贴 YAML 配置</Title>
            <TextArea
              placeholder="粘贴 YAML 配置内容..."
              value={yamlContent}
              onChange={(e) => setYamlContent(e.target.value)}
              rows={8}
              style={{ fontFamily: 'monospace', fontSize: 12 }}
            />
            <Button 
              type="primary" 
              onClick={loadFromYAML}
              disabled={!yamlContent.trim()}
              style={{ marginTop: 8 }}
              icon={<FileTextOutlined />}
            >
              从 YAML 加载
            </Button>
          </div>
        </Space>
      </Modal>
    </>
  );
} 