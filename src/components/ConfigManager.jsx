import React from "react";
import { Button, Space, Upload, message, Modal } from "antd";
import { SaveOutlined, FolderOpenOutlined, ExportOutlined, ReloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import yaml from "js-yaml";

const { confirm } = Modal;

function ConfigManager({ wall, frames, onLoad, onReset }) {
  const handleSave = () => {
    try {
      const config = {
        meta: {
          name: "ArtWall 配置",
          created: new Date().toISOString(),
          version: "1.0"
        },
        wall,
        frames: frames.map(frame => ({
          ...frame,
          painting: frame.painting ? "已设置画作" : null
        }))
      };
      
      localStorage.setItem('artwall_saved_config', JSON.stringify(config));
      message.success('配置已保存到本地！');
    } catch (error) {
      message.error('保存配置失败：' + error.message);
    }
  };

  const handleLoad = () => {
    try {
      const saved = localStorage.getItem('artwall_saved_config');
      if (!saved) {
        message.warning('没有找到保存的配置！');
        return;
      }
      
      const config = JSON.parse(saved);
      onLoad(config.wall, config.frames);
      message.success('配置已加载！');
    } catch (error) {
      message.error('加载配置失败：' + error.message);
    }
  };

  const handleExportYAML = () => {
    try {
      const config = {
        meta: {
          name: "ArtWall 配置导出",
          created: new Date().toISOString(),
          version: "1.0"
        },
        wall,
        frames: frames.map(frame => ({
          ...frame,
          painting: frame.painting ? "已设置画作" : null
        }))
      };
      
      const yamlStr = yaml.dump(config, {
        indent: 2,
        lineWidth: -1,
        noRefs: true
      });
      
      const blob = new Blob([yamlStr], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `artwall-config-${Date.now()}.yaml`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      message.success('YAML 配置文件已导出！');
    } catch (error) {
      message.error('导出失败：' + error.message);
    }
  };

  const handleImportYAML = (info) => {
    const file = info.file;
    if (file && file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = yaml.load(e.target.result);
          if (config.wall && config.frames) {
            onLoad(config.wall, config.frames);
            message.success('YAML 配置已导入！');
          } else {
            message.error('配置文件格式不正确！');
          }
        } catch (error) {
          message.error('导入失败：' + error.message);
        }
      };
      reader.readAsText(file.originFileObj);
    }
  };

  const handleReset = () => {
    confirm({
      title: '确认重置',
      icon: <ExclamationCircleOutlined />,
      content: '这将清除所有当前设置，确定要重置吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        onReset();
        message.success('配置已重置！');
      },
    });
  };

  return (
    <Space wrap>
      <Button 
        type="primary" 
        icon={<SaveOutlined />} 
        onClick={handleSave}
      >
        保存配置
      </Button>
      
      <Button 
        icon={<FolderOpenOutlined />} 
        onClick={handleLoad}
      >
        加载配置
      </Button>
      
      <Button 
        icon={<ExportOutlined />} 
        onClick={handleExportYAML}
      >
        导出YAML
      </Button>
      
      <Upload
        accept=".yaml,.yml"
        showUploadList={false}
        beforeUpload={() => false}
        onChange={handleImportYAML}
      >
        <Button icon={<FolderOpenOutlined />}>
          导入YAML
        </Button>
      </Upload>
      
      <Button 
        danger 
        icon={<ReloadOutlined />} 
        onClick={handleReset}
      >
        重置配置
      </Button>
    </Space>
  );
}

export default ConfigManager;