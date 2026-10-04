// Image Editor Pro - Tools Manager
class Tools {
    constructor() {
        this.currentTool = 'select';
        this.brush = new Brush();
        this.text = new TextTool();
        this.shapes = new Shapes();
        this.filters = new Filters();
        this.crop = new Crop();
        
        this.selectedShape = null;
        this.textInput = '';
        this.isDrawing = false;
        this.isSelecting = false;
        
        // 初始工具狀態
        this.brightness = 0.5;
        this.contrast = 0.5;
        this.saturation = 0.5;
        this.hue = 180;
        this.lightness = 50;
        this.colorTemp = 50;
        this.sharpness = 50;
    }

    selectTool(tool) {
        this.currentTool = tool;
    }

    setToolState(key, value) {
        this[key] = value;
    }

    getToolState(key) {
        return this[key];
    }

    getSelection() {
        return this.crop.selection;
    }

    setSelection(x, y, width, height) {
        this.crop.setSelection(x, y, width, height);
    }

    getSelectionSize() {
        return {
            width: this.crop.selection.width - this.crop.selection.x,
            height: this.crop.selection.height - this.crop.selection.y
        };
    }
}