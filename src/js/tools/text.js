// Image Editor Pro - Text Tool
class TextTool {
    constructor() {
        this.color = '#000000';
        this.fontSize = 30;
        this.fontFamily = 'Arial';
        this.text = '';
        this.position = { x: 0, y: 0 };
        this.isPlacing = false;
    }

    setText(text) {
        this.text = text;
    }

    setColor(color) {
        this.color = color;
    }

    setFontSize(size) {
        this.fontSize = size;
    }

    setPosition(x, y) {
        this.position = { x, y };
    }

    setFontFamily(fontFamily) {
        this.fontFamily = fontFamily;
    }

    placeText(context, x, y) {
        if (!this.text) return;
        
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.fillStyle = this.color;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(this.text, x, y);
    }

    getTextBoxSize(context) {
        const metrics = context.measureText(this.text);
        return {
            width: metrics.width,
            height: this.fontSize
        };
    }
}