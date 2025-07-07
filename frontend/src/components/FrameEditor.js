import React from "react";
import { 
  Form, 
  InputNumber, 
  Select, 
  Input, 
  Button, 
  Upload, 
  ColorPicker, 
  Space, 
  Card,
  Row,
  Col,
  Divider
} from "antd";
import { UploadOutlined, DeleteOutlined, PictureOutlined } from "@ant-design/icons";

const shapeOptions = [
  { label: "长方形", value: "rect" },
  { label: "正方形", value: "square" },
  { label: "圆形", value: "circle" },
  { label: "扇形", value: "wedge" }
];

const fitModeOptions = [
  { label: "覆盖 (裁剪适配)", value: "cover" },
  { label: "包含 (完整显示)", value: "contain" },
  { label: "拉伸 (填满画框)", value: "fill" },
  { label: "原始 (不缩放)", value: "none" }
];

export default function FrameEditor({ frames, onChange, onDelete }) {
  const handleImageUpload = (idx, info) => {
    if (info.file.status === "done" || info.file.originFileObj) {
      const file = info.file.originFileObj || info.file;
      const reader = new FileReader();
      reader.onload = (e) => {
        const frame = frames[idx];
        onChange(idx, { ...frame, painting: e.target.result, paintingUrl: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (idx, url) => {
    const frame = frames[idx];
    if (url.trim()) {
      onChange(idx, { ...frame, painting: url.trim(), paintingUrl: url.trim() });
    }
  };

  return (
    <div>
      {frames.map((frame, idx) => (
        <Card
          key={frame.id}
          size="small"
          style={{ marginBottom: 12 }}
          title={`画框 ${idx + 1}`}
          extra={
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
              onClick={() => onDelete(idx)}
            >
              删除
            </Button>
          }
        >
          <Form
            layout="vertical"
            initialValues={frame}
            onValuesChange={(_, values) => {
              onChange(idx, { ...frame, ...values });
            }}
          >
            <Row gutter={[8, 0]}>
              <Col xs={12} sm={8}>
                <Form.Item label="形状" name="shape">
                  <Select options={shapeOptions} size="small" />
                </Form.Item>
              </Col>
              <Col xs={6} sm={4}>
                <Form.Item label="宽" name="width">
                  <InputNumber min={40} max={800} size="small" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={6} sm={4}>
                <Form.Item label="高" name="height">
                  <InputNumber min={40} max={800} size="small" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={6} sm={4}>
                <Form.Item label="X" name="x">
                  <InputNumber min={0} max={1500} size="small" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={6} sm={4}>
                <Form.Item label="Y" name="y">
                  <InputNumber min={0} max={1500} size="small" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[8, 0]}>
              <Col xs={8} sm={6}>
                <Form.Item label="边框宽度" name="borderWidth">
                  <InputNumber min={1} max={20} size="small" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={8} sm={6}>
                <Form.Item label="边框颜色" name="borderColor">
                  <ColorPicker
                    size="small"
                    showText
                    onChange={(color) => onChange(idx, { ...frame, borderColor: color.toHexString() })}
                    value={frame.borderColor}
                  />
                </Form.Item>
              </Col>
              <Col xs={8} sm={6}>
                <Form.Item label="衬纸宽度" name="matWidth">
                  <InputNumber min={0} max={30} size="small" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={6}>
                <Form.Item label="衬纸颜色" name="matColor">
                  <ColorPicker
                    size="small"
                    showText
                    onChange={(color) => onChange(idx, { ...frame, matColor: color.toHexString() })}
                    value={frame.matColor}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left" plain style={{ margin: "8px 0" }}>
              画作设置
            </Divider>

            <Space direction="vertical" style={{ width: "100%" }}>
              <Space wrap>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={(info) => handleImageUpload(idx, info)}
                >
                  <Button icon={<UploadOutlined />} size="small">
                    上传图片
                  </Button>
                </Upload>
                
                {frame.painting && (
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => onChange(idx, { ...frame, painting: null, paintingUrl: "" })}
                  >
                    移除图片
                  </Button>
                )}
              </Space>

              <Form.Item label="或输入图片URL" name="paintingUrl" style={{ marginBottom: 8 }}>
                <Input
                  placeholder="https://example.com/image.jpg"
                  size="small"
                  prefix={<PictureOutlined />}
                  onBlur={(e) => handleUrlChange(idx, e.target.value)}
                />
              </Form.Item>

              {frame.painting && (
                <div>
                  <Form.Item label="图片适配方式" name="fitMode" style={{ marginBottom: 8 }}>
                    <Select 
                      options={fitModeOptions} 
                      size="small" 
                      defaultValue="cover"
                    />
                  </Form.Item>
                  
                  <div style={{ textAlign: "center" }}>
                    <img 
                      src={frame.painting} 
                      alt="画作预览" 
                      style={{ 
                        maxWidth: "80px", 
                        maxHeight: "60px", 
                        objectFit: "cover",
                        borderRadius: "4px",
                        border: "1px solid #d9d9d9"
                      }} 
                    />
                    <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                      预览图片
                    </div>
                  </div>
                </div>
              )}
            </Space>
          </Form>
        </Card>
      ))}
    </div>
  );
} 