import React from "react";
import { Form, InputNumber, Button, Upload, ColorPicker, Space, Card, Tooltip } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

function WallEditor({ wall, onChange }) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue(wall);
  }, [wall, form]);

  const handleValuesChange = (_, allValues) => {
    onChange({ ...wall, ...allValues });
  };

  const handleBgImage = (info) => {
    const file = info.file;
    if (file && file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange({ ...wall, bgImage: e.target.result });
      };
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const removeBgImage = () => {
    onChange({ ...wall, bgImage: null });
  };

  return (
    <Card size="small" className="wall-editor-card">
      <Form
        form={form}
        layout="vertical"
        initialValues={wall}
        onValuesChange={handleValuesChange}
      >
        <div className="wall-controls">
          <Form.Item label="墙面尺寸" style={{ marginBottom: 16 }}>
            <Space.Compact>
              <Tooltip title="墙面宽度">
                <Form.Item name="width" noStyle>
                  <InputNumber 
                    min={200} 
                    max={2000} 
                    style={{ width: 120 }} 
                    addonBefore="宽"
                    addonAfter="px"
                  />
                </Form.Item>
              </Tooltip>
              <Tooltip title="墙面高度">
                <Form.Item name="height" noStyle>
                  <InputNumber 
                    min={200} 
                    max={2000} 
                    style={{ width: 120 }} 
                    addonBefore="高"
                    addonAfter="px"
                  />
                </Form.Item>
              </Tooltip>
            </Space.Compact>
          </Form.Item>
          
          <Form.Item label="墙面颜色" name="bgColor" style={{ marginBottom: 16 }}>
            <ColorPicker
              showText
              size="large"
              onChange={(color) => onChange({ ...wall, bgColor: color.toHexString() })}
              value={wall.bgColor}
              presets={[
                {
                  label: '推荐色彩',
                  colors: [
                    '#f5f5f5', '#ffffff', '#fafafa', '#f0f0f0',
                    '#e8f4fd', '#fff2e8', '#f6ffed', '#fff1f0'
                  ]
                }
              ]}
            />
          </Form.Item>
        </div>
        
        <div className="wall-background">
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleBgImage}
          >
            <Button icon={<UploadOutlined />} type="dashed" block>
              上传背景图
            </Button>
          </Upload>
          
          {wall.bgImage && (
            <div style={{ marginTop: 12 }}>
              <div className="bg-preview">
                <img 
                  src={wall.bgImage} 
                  alt="背景预览" 
                  className="bg-preview-img"
                />
                <Button
                  icon={<DeleteOutlined />}
                  onClick={removeBgImage}
                  size="small"
                  danger
                  className="bg-remove-btn"
                >
                  移除
                </Button>
              </div>
            </div>
          )}
        </div>
      </Form>
      
      <style jsx>{`
        .wall-editor-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
        }
        
        .wall-controls {
          margin-bottom: 16px;
        }
        
        .bg-preview {
          position: relative;
          display: inline-block;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #d9d9d9;
        }
        
        .bg-preview-img {
          width: 120px;
          height: 80px;
          object-fit: cover;
          display: block;
        }
        
        .bg-remove-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        .bg-preview:hover .bg-remove-btn {
          opacity: 1;
        }
      `}</style>
    </Card>
  );
}

export default WallEditor;