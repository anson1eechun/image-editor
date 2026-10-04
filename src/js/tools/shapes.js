// Image Editor Pro - Shapes Tool
class Shapes {
    constructor() {
        this.color = '#000000';
        this.lineWidth = 2;
        this.selectedShape = null;
        this.points = [];
        this.isDrawing = false;
        this.startPoint = null;
        this.endPoint = null;
    }

    setShape(shape) {
        this.selectedShape = shape;
    }

    setColor(color) {
        this.color = color;
    }

    setLineWidth(width) {
        this.lineWidth = width;
    }

    startShape(startPoint) {
        this.isDrawing = true;
        this.startPoint = startPoint;
        this.points = [startPoint];
    }

    drawShape(context, endPoint) {
        if (!this.isDrawing || !this.selectedShape) return;
        
        context.beginPath();
        context.strokeStyle = this.color;
        context.lineWidth = this.lineWidth;
        context.fillStyle = this.color;
        
        const startX = this.startPoint.x;
        const startY = this.startPoint.y;
        const endX = endPoint.x;
        const endY = endPoint.y;
        
        switch (this.selectedShape) {
            case 'circle':
                context.beginPath();
                context.arc(startX, startY, Math.abs(endX - startX) / 2, 0, 2 * Math.PI);
                context.stroke();
                break;
                
            case 'rectangle':
                context.beginPath();
                context.rect(startX, startY, endX - startX, endY - startY);
                context.stroke();
                break;
                
            case 'triangle':
                context.beginPath();
                context.moveTo(startX, startY);
                context.lineTo(endX, endY);
                context.closePath();
                context.stroke();
                break;
                
            case 'line':
                context.beginPath();
                context.moveTo(startX, startY);
                context.lineTo(endX, endY);
                context.stroke();
                break;
        }
    }

    endShape() {
        this.isDrawing = false;
        this.points = [];
    }
}