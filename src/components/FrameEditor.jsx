import React from "react";
import { Card, Form, Select, InputNumber, ColorPicker, Button, Space, Divider, Upload, Input } from "antd";
import { DeleteOutlined, UploadOutlined, LinkOutlined } from "@ant-design/icons";

const { Option } = Select;

function FrameEditor({ frames, onChange, onDelete }) {
  const handleFrameChange = (index, field, value) => {
    onChange(index, { [field]: value });
  };

  const handleImageUpload = (index, info) => {
    const file = info.file;
    if (file && file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(index, { painting: e.target.result, paintingUrl: "" });
      };
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const handleUrlChange = (index, url) => {
    onChange(index, { paintingUrl: url, painting: null });
  };

  return (
    <div className="frame-editor">
      {frames.map((frame, index) => (
        <Card
          key={frame.id}
          size="small"
          title={`画框 ${index + 1}`}
          extra={
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(index)}
              size="small"
            >
              删除
            </Button>
          }
          style={{ marginBottom: 16 }}
        >
          <Form layout="vertical" size="small">
            <Space wrap style={{ width: "100%" }}>
              <Form.Item label="形状" style={{ marginBottom: 8 }}>
                <Select
                  value={frame.shape}
                  onChange={(value) => handleFrameChange(index, "shape", value)}
                  style={{ width: 100 }}
                >
                  <Option value="rect">长方形</Option>
                  <Option value="square">正方形</Option>
                  <Option value="circle">圆形</Option>
                  <Option value="wedge">扇形</Option>
                </Select>
              </Form.Item>

              <Form.Item label="宽度" style={{ marginBottom: 8 }}>
                <InputNumber
                  value={frame.width}
                  onChange={(value) => handleFrameChange(index, "width", value)}
                  min={50}
                  max={500}
                  style={{ width: 80 }}
                />
              </Form.Item>

              <Form.Item label="高度" style={{ marginBottom: 8 }}>
                <InputNumber
                  value={frame.height}
                  onChange={(value) => handleFrameChange(index, "height", value)}
                  min={50}
                  max={500}
                  style={{ width: 80 }}
                  disabled={frame.shape === "circle" || frame.shape === "square"}
                />
              </Form.Item>
            </Space>

            <Space wrap style={{ width: "100%" }}>
              <Form.Item label="边框宽度" style={{ marginBottom: 8 }}>
                <InputNumber
                  value={frame.borderWidth}
                  onChange={(value) => handleFrameChange(index, "borderWidth", value)}
                  min={0}
                  max={20}
                  style={{ width: 80 }}
                />
              </Form.Item>

              <Form.Item label="边框颜色" style={{ marginBottom: 8 }}>
                <ColorPicker
                  value={frame.borderColor}
                  onChange={(color) => handleFrameChange(index, "borderColor", color.toHexString())}
                  size="small"
                />
              </Form.Item>

              <Form.Item label="衬纸宽度" style={{ marginBottom: 8 }}>
                <InputNumber
                  value={frame.matWidth}
                  onChange={(value) => handleFrameChange(index, "matWidth", value)}
                  min={0}
                  max={50}
                  style={{ width: 80 }}
                />
              </Form.Item>

              <Form.Item label="衬纸颜色" style={{ marginBottom: 8 }}>
                <ColorPicker
                  value={frame.matColor}
                  onChange={(color) => handleFrameChange(index, "matColor", color.toHexString())}
                  size="small"
                />
              </Form.Item>
            </Space>

            <Divider style={{ margin: "12px 0" }} />

            <Form.Item label="画作设置" style={{ marginBottom: 8 }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={(info) => handleImageUpload(index, info)}
                >
                  <Button icon={<UploadOutlined />} size="small" block>
                    上传图片
                  </Button>
                </Upload>

                <Input
                  placeholder="或输入图片URL"
                  value={frame.paintingUrl}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  prefix={<LinkOutlined />}
                  size="small"
                />

                <Select
                  value={frame.fitMode || "cover"}
                  onChange={(value) => handleFrameChange(index, "fitMode", value)}
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Option value="cover">裁剪适配</Option>
                  <Option value="contain">完整显示</Option>
                  <Option value="fill">拉伸填满</Option>
                  <Option value="none">原始尺寸</Option>
                </Select>
              </Space>
            </Form.Item>

            {(frame.painting || frame.paintingUrl) && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={frame.painting || frame.paintingUrl}
                  alt="画作预览"
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
      ))}
    </div>
  );
}

export default FrameEditor;