@echo off
chcp 65001 >nul
title ArtWall 挂画展示应用

echo 🎨 ArtWall 挂画展示应用启动脚本
echo =================================

REM 检查是否安装了 Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未安装 Docker
    echo 请先安装 Docker Desktop: https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

REM 检查是否安装了 Docker Compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未安装 Docker Compose
    echo Docker Desktop 通常已包含 Docker Compose
    pause
    exit /b 1
)

echo ✅ Docker 环境检查通过

REM 停止现有容器（如果存在）
echo 🔄 停止现有容器...
docker-compose down >nul 2>&1

REM 构建并启动应用
echo 🚀 构建并启动应用...
docker-compose up --build -d

REM 等待服务启动
echo ⏳ 等待服务启动...
timeout /t 10 /nobreak >nul

REM 检查服务状态
docker-compose ps | findstr "Up" >nul
if errorlevel 1 (
    echo ❌ 应用启动失败！
    echo 📋 查看详细日志:
    docker-compose logs
    pause
    exit /b 1
) else (
    echo ✅ 应用启动成功！
    echo.
    echo 🌐 访问地址:
    echo    本地访问: http://localhost:8080
    echo.
    echo 📝 使用说明:
    echo    1. 设置墙面尺寸和颜色
    echo    2. 添加画框并设置样式
    echo    3. 上传画作或输入图片URL
    echo    4. 导出效果图
    echo.
    echo 🛑 停止应用: docker-compose down
    echo 📊 查看日志: docker-compose logs -f
    echo.
    echo 按任意键打开浏览器...
    pause >nul
    start http://localhost:8080
) 