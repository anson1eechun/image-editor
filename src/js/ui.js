// Image Editor Pro - UI Manager
class UIManager {
    constructor() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupTheme();
    }
    
    setupEventListeners() {
        // 主題切換
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
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
        
        // 縮放
        document.getElementById('zoom-btn').addEventListener('click', () => {
            this.toggleZoom();
        });
        
        // 復原/重做
        document.getElementById('undo-btn').addEventListener('click', () => {
            // 處理復原
        });
        document.getElementById('redo-btn').addEventListener('click', () => {
            // 處理重做
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
    }
    
    setupDragAndDrop() {
        const canvas = document.getElementById('preview-canvas');
        
        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            canvas.classList.add('drag-over');
        });
        
        canvas.addEventListener('dragleave', () => {
            canvas.classList.remove('drag-over');
        });
        
        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            canvas.classList.remove('drag-over');
            
            if (e.dataTransfer.files.length > 0) {
                this.handleFileUpload(e.dataTransfer.files[0]);
            }
        });
    }
    
    setupTheme() {
        const body = document.body;
        body.classList.add('dark-theme');
    }
    
    handleFileUpload(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const image = new Image();
            image.onload = () => {
                const canvas = document.getElementById('preview-canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);
                this.updateCanvasSize();
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    selectTool(tool) {
        // 更新工具選取狀態
        document.querySelectorAll('.tool-item').forEach(item => {
            item.classList.remove('active');
            item.classList.remove('selected');
        });
        
        const activeTool = document.querySelector(`.tool-item[data-tool="${tool}"]`);
        if (activeTool) {
            activeTool.classList.add('active');
        }
    }
    
    handleSliderInput(e) {
        // 處理滑動器輸入
    }
    
    handleColorChange(e) {
        // 處理色彩選擇器變化
    }
    
    handleRotation(e) {
        const angle = parseFloat(e.target.dataset.angle);
        // 處理旋轉
    }
    
    handleShapeSelection(e) {
        const shape = e.target.dataset.shape;
        // 處理形狀選擇
    }
    
    toggleTheme() {
        const body = document.body;
        body.classList.toggle('dark-theme');
        body.classList.toggle('light-theme');
    }
    
    toggleZoom() {
        // 處理縮放
    }
    
    reset() {
        // 重置所有工具
        document.querySelectorAll('.slider').forEach(slider => {
            slider.value = slider.dataset.default || 50;
        });
        
        document.querySelectorAll('.color-input').forEach(picker => {
            picker.value = picker.dataset.default || '#000000';
        });
        
        this.clearCanvas();
    }
    
    clearCanvas() {
        const canvas = document.getElementById('preview-canvas');
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    save() {
        // 保存圖片
        const canvas = document.getElementById('preview-canvas');
        const data = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = data;
        link.download = 'image.png';
        link.click();
    }
    
    download() {
        this.save();
    }
    
    updateCanvasSize() {
        const canvas = document.getElementById('preview-canvas');
        const width = canvas.width;
        const height = canvas.height;
        document.getElementById('canvas-info-text').textContent = `寬度: ${width}px, 高度: ${height}px`;
    }
    
    getMousePosition(e) {
        const rect = e.target.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
}