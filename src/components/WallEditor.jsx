@@ .. @@
 import React from "react";
-import { Form, InputNumber, Button, Upload, ColorPicker, Space, Card } from "antd";
+import { Form, InputNumber, Button, Upload, ColorPicker, Space, Card, Tooltip, Slider } from "antd";
 import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

@@ .. @@
   return (
-    <Card size="small">
+    <Card size="small" className="wall-editor-card">
       <Form
         form={form}
         layout="vertical"
@@ .. @@
         onValuesChange={handleValuesChange}
       >
-        <Space wrap style={{ width: "100%" }}>
-          <Form.Item label="宽度(px)" name="width" style={{ marginBottom: 8 }}>
-            <InputNumber min={200} max={2000} style={{ width: 120 }} />
+        <div className="wall-controls">
+          <Form.Item label="墙面尺寸" style={{ marginBottom: 16 }}>
+            <Space.Compact>
+              <Tooltip title="墙面宽度">
+                <Form.Item name="width" noStyle>
+                  <InputNumber 
+                    min={200} 
+                    max={2000} 
+                    style={{ width: 120 }} 
+                    addonBefore="宽"
+                    addonAfter="px"
+                  />
+                </Form.Item>
+              </Tooltip>
+              <Tooltip title="墙面高度">
+                <Form.Item name="height" noStyle>
+                  <InputNumber 
+                    min={200} 
+                    max={2000} 
+                    style={{ width: 120 }} 
+                    addonBefore="高"
+                    addonAfter="px"
+                  />
+                </Form.Item>
+              </Tooltip>
+            </Space.Compact>
           </Form.Item>
           
-          <Form.Item label="高度(px)" name="height" style={{ marginBottom: 8 }}>
-            <InputNumber min={200} max={2000} style={{ width: 120 }} />
-          </Form.Item>
-          
-          <Form.Item label="墙面颜色" name="bgColor" style={{ marginBottom: 8 }}>
+          <Form.Item label="墙面颜色" name="bgColor" style={{ marginBottom: 16 }}>
             <ColorPicker
               showText
+              size="large"
               onChange={(color) => onChange({ ...wall, bgColor: color.toHexString() })}
               value={wall.bgColor}
+              presets={[
+                {
+                  label: '推荐色彩',
+                  colors: [
+                    '#f5f5f5', '#ffffff', '#fafafa', '#f0f0f0',
+                    '#e8f4fd', '#fff2e8', '#f6ffed', '#fff1f0'
+                  ]
+                }
+              ]}
             />
           </Form.Item>
-        </Space>
+        </div>
         
-        <Space wrap style={{ width: "100%", marginTop: 8 }}>
+        <div className="wall-background">
           <Upload
             accept="image/*"
             showUploadList={false}
@@ .. @@
             onChange={handleBgImage}
           >
-            <Button icon={<UploadOutlined />} size="small">
+            <Button icon={<UploadOutlined />} type="dashed" block>
               上传背景图
             </Button>
           </Upload>
           
           {wall.bgImage && (
-            <Button
-              icon={<DeleteOutlined />}
-              onClick={removeBgImage}
-              size="small"
-              danger
-            >
-              移除背景图
-            </Button>
+            <div style={{ marginTop: 12 }}>
+              <div className="bg-preview">
+                <img 
+                  src={wall.bgImage} 
+                  alt="背景预览" 
+                  className="bg-preview-img"
+                />
+                <Button
+                  icon={<DeleteOutlined />}
+                  onClick={removeBgImage}
+                  size="small"
+                  danger
+                  className="bg-remove-btn"
+                >
+                  移除
+                </Button>
+              </div>
+            </div>
           )}
-        </Space>
-        
-        {wall.bgImage && (
-          <div style={{ marginTop: 8 }}>
-            <img 
-              src={wall.bgImage} 
-              alt="背景预览" 
-              style={{ 
-                maxWidth: "100px", 
-                maxHeight: "60px", 
-                objectFit: "cover",
-                borderRadius: "4px",
-                border: "1px solid #d9d9d9"
-              }} 
-            />
-          </div>
-        )}
+        </div>
       </Form>
+      
+      <style jsx>{`
+        .wall-editor-card {
+          background: rgba(255, 255, 255, 0.9);
+          backdrop-filter: blur(10px);
+        }
+        
+        .wall-controls {
+          margin-bottom: 16px;
+        }
+        
+        .bg-preview {
+          position: relative;
+          display: inline-block;
+          border-radius: 8px;
+          overflow: hidden;
+          border: 1px solid #d9d9d9;
+        }
+        
+        .bg-preview-img {
+          width: 120px;
+          height: 80px;
+          object-fit: cover;
+          display: block;
+        }
+        
+        .bg-remove-btn {
+          position: absolute;
+          top: 4px;
+          right: 4px;
+          opacity: 0;
+          transition: opacity 0.2s;
+        }
+        
+        .bg-preview:hover .bg-remove-btn {
+          opacity: 1;
+        }
+      `}</style>
     </Card>
   );
 }