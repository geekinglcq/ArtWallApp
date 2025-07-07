#!/bin/bash

# ArtWall 挂画展示应用 - 一键启动脚本

echo "🎨 ArtWall 挂画展示应用启动脚本"
echo "================================="

# 检查是否安装了 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: 未安装 Docker"
    echo "请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查是否安装了 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ 错误: 未安装 Docker Compose"
    echo "请先安装 Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker 环境检查通过"

# 停止现有容器（如果存在）
echo "🔄 停止现有容器..."
docker-compose down 2>/dev/null || true

# 构建并启动应用
echo "🚀 构建并启动应用..."
docker-compose up --build -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
if docker-compose ps | grep -q "Up"; then
    echo "✅ 应用启动成功！"
    echo ""
    echo "🌐 访问地址:"
    echo "   本地访问: http://localhost:8080"
    echo "   网络访问: http://$(hostname -I | awk '{print $1}'):8080"
    echo ""
    echo "📝 使用说明:"
    echo "   1. 设置墙面尺寸和颜色"
    echo "   2. 添加画框并设置样式"
    echo "   3. 上传画作或输入图片URL"
    echo "   4. 导出效果图"
    echo ""
    echo "🛑 停止应用: docker-compose down"
    echo "📊 查看日志: docker-compose logs -f"
else
    echo "❌ 应用启动失败！"
    echo "📋 查看详细日志:"
    docker-compose logs
    exit 1
fi 