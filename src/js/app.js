// Image Editor Pro - Main Application
class ImageEditor {
    constructor() {
        this.canvas = document.getElementById('preview-canvas');
        this.context = this.canvas.getContext('2d', { willReadFrequently: true });
        this.tools = new Tools();
        this.history = new History();
        this.zoom = 1;
        this.selectedTool = 'select';
        
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.setupDragAndDrop();
        
        this.resizeCanvas();
        this.updateCanvasSize();
    }
    
    setupEventListeners() {
        // 上傳按鈕
        document.getElementById('upload-btn').addEventListener('click', () => {
            document.getElementById('file-input').click();
        });
        
        // 檔案輸入
        document.getElementById('file-input').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files[0]);
        });
        
        // 貼上檔案
        document.getElementById('paste-file').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files[0]);
        });
        
        // 畫布事件
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.onMouseLeave(e));
        
        // 工具選取
        document.querySelectorAll('.tool-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectTool(item.dataset.tool);
            });
        });
        
        // 滑動器事件
        document.querySelectorAll('.slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.handleSliderInput(e);
            });
        });
        
        // 色彩選擇器事件
        document.querySelectorAll('.color-input').forEach(picker => {
            picker.addEventListener('change', (e) => {
                this.handleColorChange(e);
            });
        });
        
        // 文字輸入
        document.getElementById('text-input').addEventListener('change', (e) => {
            this.tools.textInput = e.target.value;
        });
        
        // 旋轉按鈕
        document.querySelectorAll('.rotate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleRotation(e);
            });
        });
        
        // 形狀按鈕
        document.querySelectorAll('.shape-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleShapeSelection(e);
            });
        });
        
        // 主題切換
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // 縮放
        document.getElementById('zoom-btn').addEventListener('click', () => {
            this.toggleZoom();
        });
        
        // 復原/重做
        document.getElementById('undo-btn').addEventListener('click', () => {
            this.history.undo(this);
        });
        document.getElementById('redo-btn').addEventListener('click', () => {
            this.history.redo(this);
        });
        
        // 重置
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.reset();
        });
        
        // 儲存
        document.getElementById('save-btn').addEventListener('click', () => {
            this.save();
        });
        
        // 下載
        document.getElementById('download-btn').addEventListener('click', () => {
            this.download();
        });
        
        // 清除畫布
        document.getElementById('clear-canvas-btn').addEventListener('click', () => {
            this.clearCanvas();
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'z':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.history.undo(this);
                    }
                    break;
                case 'y':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.history.redo(this);
                    }
                    break;
                case '+':
                    e.preventDefault();
                    this.zoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    this.zoomOut();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.reset();
                    break;
                case 's':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.save();
                    }
                    break;
            }
        });
    }
    
    setupDragAndDrop() {
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.canvas.classList.add('drag-over');
        });
        
        this.canvas.addEventListener('dragleave', () => {
            this.canvas.classList.remove('drag-over');
        });
        
        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            this.canvas.classList.remove('drag-over');
            
            if (e.dataTransfer.files.length > 0) {
                this.handleFileUpload(e.dataTransfer.files[0]);
            }
        });
    }
    
    handleFileUpload(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const image = new Image();
            image.onload = () => {
                this.canvas.width = image.width;
                this.canvas.height = image.height;
                this.context.drawImage(image, 0, 0);
                this.updateCanvasSize();
                this.updateStatus('圖片已上傳: ' + file.name);
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    onMouseDown(e) {
        const pos = this.getMousePosition(e);
        this.tools.isDrawing = true;
        
        if (this.selectedTool === 'brush') {
            this.tools.brush.startStroke(pos);
        }
    }
    
    onMouseMove(e) {
        if (!this.tools.isDrawing) return;
        
        const pos = this.getMousePosition(e);
        
        if (this.selectedTool === 'brush') {
            this.tools.brush.addPoint(pos);
            this.tools.brush.draw(this.context, this.selectedTool);
        }
    }
    
    onMouseUp(e) {
        this.tools.isDrawing = false;
        this.tools.brush.endStroke();
    }
    
    onMouseLeave(e) {
        this.tools.isDrawing = false;
        this.tools.brush.endStroke();
    }
    
    selectTool(tool) {
        this.selectedTool = tool;
        this.tools.selectTool(tool);
        this.updateToolMenu(tool);
    }
    
    handleSliderInput(e) {
        const tool = e.target.dataset.tool;
        const value = parseFloat(e.target.value);
        
        switch (tool) {
            case 'brightness':
                this.tools.brightness = value / 100;
                break;
            case 'contrast':
                this.tools.contrast = value / 100;
                break;
            case 'saturation':
                this.tools.saturation = value / 100;
                break;
            case 'hue':
                this.tools.hue = value;
                break;
            case 'lightness':
                this.tools.lightness = value;
                break;
        }
        
        this.applyFilters();
    }
    
    handleColorChange(e) {
        const tool = e.target.dataset.tool;
        const color = e.target.value;
        
        switch (tool) {
            case 'brush':
                this.tools.brush.color = color;
                break;
            case 'text':
                this.tools.text.color = color;
                break;
            case 'shape':
                this.tools.shape.color = color;
                break;
        }
    }
    
    handleRotation(e) {
        const angle = parseFloat(e.target.dataset.angle);
        
        // 保存當前狀態
        this.history.saveState(this);
        
        const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        tempContext.putImageData(imageData, 0, 0);
        
        tempContext.save();
        tempContext.translate(this.canvas.width / 2, this.canvas.height / 2);
        tempContext.rotate(angle * Math.PI / 180);
        tempContext.drawImage(tempCanvas, -this.canvas.width / 2, -this.canvas.height / 2);
        tempContext.restore();
        
        this.context.putImageData(imageData, 0, 0);
    }
    
    handleShapeSelection(e) {
        this.selectedShape = e.target.dataset.shape;
    }
    
    toggleTheme() {
        const body = document.body;
        body.classList.toggle('dark-theme');
        body.classList.toggle('light-theme');
    }
    
    toggleZoom() {
        if (this.zoom < 2) {
            this.zoom += 0.25;
        } else {
            this.zoom = 1;
        }
        this.updateZoom();
    }
    
    zoomIn() {
        if (this.zoom < 2) {
            this.zoom += 0.25;
            this.updateZoom();
        }
    }
    
    zoomOut() {
        if (this.zoom > 0.5) {
            this.zoom -= 0.25;
            this.updateZoom();
        }
    }
    
    updateZoom() {
        this.canvas.style.transform = `scale(${this.zoom})`;
        document.getElementById('zoom-level').textContent = `${this.zoom * 100}%`;
    }
    
    reset() {
        // 重置所有工具
        this.tools.brightness = 0.5;
        this.tools.contrast = 0.5;
        this.tools.saturation = 0.5;
        this.tools.hue = 180;
        this.tools.lightness = 50;
        
        // 重置滑動器
        document.querySelectorAll('.slider').forEach(slider => {
            slider.value = slider.dataset.default || 50;
        });
        
        // 重置顏色
        document.querySelectorAll('.color-input').forEach(picker => {
            picker.value = picker.dataset.default || '#000000';
        });
        
        // 清除畫布
        this.clearCanvas();
        
        // 更新狀態
        this.updateStatus('已重置');
    }
    
    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    save() {
        // 將圖片保存為 base64
        const data = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = data;
        link.download = 'image.png';
        link.click();
    }
    
    download() {
        this.save();
    }
    
    applyFilters() {
        const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // 應用亮度
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * this.tools.brightness);
            data[i + 1] = Math.min(255, data[i + 1] * this.tools.brightness);
            data[i + 2] = Math.min(255, data[i + 2] * this.tools.brightness);
        }
        
        // 應用對比度
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * this.tools.contrast);
            data[i + 1] = Math.min(255, data[i + 1] * this.tools.contrast);
            data[i + 2] = Math.min(255, data[i + 2] * this.tools.contrast);
        }
        
        // 應用飽和度
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * this.tools.saturation);
            data[i + 1] = Math.min(255, data[i + 1] * this.tools.saturation);
            data[i + 2] = Math.min(255, data[i + 2] * this.tools.saturation);
        }
        
        // 應用色相
        for (let i = 0; i < data.length; i += 4) {
            const hue = (data[i] / 255 * 360 + this.tools.hue) % 360;
            const lightness = (data[i] / 255 * 100 + this.tools.lightness) % 100;
            const saturation = data[i] / 255 * 100 * this.tools.saturation;
            data[i] = Math.min(255, hue / 360 * 255);
            data[i + 1] = Math.min(255, lightness / 100 * 255);
            data[i + 2] = Math.min(255, saturation / 100 * 255);
        }
        
        this.context.putImageData(imageData, 0, 0);
    }
    
    updateStatus(text) {
        document.getElementById('status-info-text').textContent = text;
    }
    
    updateCanvasSize() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const status = document.getElementById('status-info-text');
        status.textContent = `寬度: ${width}px, 高度: ${height}px`;
    }
    
    updateToolMenu(tool) {
        document.querySelectorAll('.tool-item').forEach(item => {
            item.classList.remove('active');
            item.classList.remove('selected');
        });
        
        const activeTool = document.querySelector(`.tool-item[data-tool="${tool}"]`);
        if (activeTool) {
            activeTool.classList.add('active');
        }
    }
    
    getMousePosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }
}

// 初始化
const editor = new ImageEditor();