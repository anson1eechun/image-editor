// Image Editor Pro - History Management
class History {
    constructor() {
        this.states = [];
        this.currentIndex = -1;
        this.maxStates = 50;
    }

    saveState(editor) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = editor.canvas.width;
        canvas.height = editor.canvas.height;
        context.drawImage(editor.canvas, 0, 0);
        
        const state = {
            canvas: canvas,
            context: context,
            tools: JSON.parse(JSON.stringify(editor.tools))
        };
        
        // 限制狀態數量
        if (this.states.length >= this.maxStates) {
            this.states.shift();
            this.currentIndex--;
        }
        
        this.states.push(state);
        this.currentIndex = this.states.length - 1;
    }

    undo(editor) {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            const state = this.states[this.currentIndex];
            
            // 還原畫布
            editor.context.clearRect(0, 0, editor.canvas.width, editor.canvas.height);
            editor.context.putImageData(state.context.getImageData(0, 0, state.canvas.width, state.canvas.height), 0, 0);
            
            // 還原工具狀態
            editor.tools = JSON.parse(JSON.stringify(state.tools));
            
            // 更新滑動器和選擇器
            this.updateToolUI(editor.tools);
            
            editor.updateStatus('已復原');
        }
    }

    redo(editor) {
        if (this.currentIndex < this.states.length - 1) {
            this.currentIndex++;
            const state = this.states[this.currentIndex];
            
            // 還原畫布
            editor.context.clearRect(0, 0, editor.canvas.width, editor.canvas.height);
            editor.context.putImageData(state.context.getImageData(0, 0, state.canvas.width, state.canvas.height), 0, 0);
            
            // 還原工具狀態
            editor.tools = JSON.parse(JSON.stringify(state.tools));
            
            // 更新滑動器和選擇器
            this.updateToolUI(editor.tools);
            
            editor.updateStatus('已重做');
        }
    }

    clear() {
        this.states = [];
        this.currentIndex = -1;
    }

    getHistorySize() {
        return this.states.length;
    }

    getCurrentPosition() {
        return this.currentIndex;
    }

    updateToolUI(tools) {
        // 更新滑動器
        document.getElementById('brightness-slider').value = tools.brightness * 100;
        document.getElementById('contrast-slider').value = tools.contrast * 100;
        document.getElementById('saturation-slider').value = tools.saturation * 100;
        document.getElementById('color-temp-slider').value = tools.colorTemp;
        document.getElementById('sharpness-slider').value = tools.sharpness;

        // 更新顏色選擇器
        document.getElementById('brush-color').value = tools.brush.color;
        document.getElementById('text-color').value = tools.text.color;
        document.getElementById('shape-color').value = tools.shape.color;

        // 更新文字
        document.getElementById('text-input').value = tools.textInput;
    }
}