import React from "react";
import { Form, InputNumber, Button, Upload, ColorPicker, Space, Card } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

export default function WallEditor({ wall, onChange }) {
  const [form] = Form.useForm();

  const handleValuesChange = (_, values) => {
    onChange({ ...wall, ...values });
  };

  const handleBgImage = (info) => {
    if (info.file.status === "done" || info.file.originFileObj) {
      const file = info.file.originFileObj || info.file;
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange({ ...wall, bgImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBgImage = () => {
    onChange({ ...wall, bgImage: null });
  };

  return (
    <Card size="small">
      <Form
        form={form}
        layout="vertical"
        initialValues={wall}
        onValuesChange={handleValuesChange}
      >
        <Space wrap style={{ width: "100%" }}>
          <Form.Item label="宽度(px)" name="width" style={{ marginBottom: 8 }}>
            <InputNumber min={200} max={2000} style={{ width: 120 }} />
          </Form.Item>
          
          <Form.Item label="高度(px)" name="height" style={{ marginBottom: 8 }}>
            <InputNumber min={200} max={2000} style={{ width: 120 }} />
          </Form.Item>
          
          <Form.Item label="墙面颜色" name="bgColor" style={{ marginBottom: 8 }}>
            <ColorPicker
              showText
              onChange={(color) => onChange({ ...wall, bgColor: color.toHexString() })}
              value={wall.bgColor}
            />
          </Form.Item>
        </Space>
        
        <Space wrap style={{ width: "100%", marginTop: 8 }}>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleBgImage}
          >
            <Button icon={<UploadOutlined />} size="small">
              上传背景图
            </Button>
          </Upload>
          
          {wall.bgImage && (
            <Button
              icon={<DeleteOutlined />}
              onClick={removeBgImage}
              size="small"
              danger
            >
              移除背景图
            </Button>
          )}
        </Space>
        
        {wall.bgImage && (
          <div style={{ marginTop: 8 }}>
            <img 
              src={wall.bgImage} 
              alt="背景预览" 
              style={{ 
                maxWidth: "100px", 
                maxHeight: "60px", 
                objectFit: "cover",
                borderRadius: "4px",
                border: "1px solid #d9d9d9"
              }} 
            />
          </div>
        )}
      </Form>
    </Card>
  );
} 