// Image Editor Pro - Brush Tool
class Brush {
    constructor() {
        this.color = '#000000';
        this.size = 5;
        this.opacity = 1;
        this.isDrawing = false;
        this.startPoint = null;
        this.currentPoint = null;
        this.points = [];
    }

    startStroke(startPoint) {
        this.isDrawing = true;
        this.startPoint = startPoint;
        this.currentPoint = startPoint;
        this.points = [startPoint];
    }

    addPoint(point) {
        this.currentPoint = point;
        this.points.push(point);
    }

    draw(context, tool) {
        if (!this.isDrawing || this.points.length < 2) return;
        
        const lastPoint = this.points[this.points.length - 2];
        
        context.beginPath();
        context.strokeStyle = this.color;
        context.lineWidth = this.size;
        context.globalAlpha = this.opacity;
        context.lineCap = 'round';
        
        context.moveTo(lastPoint.x, lastPoint.y);
        context.lineTo(this.currentPoint.x, this.currentPoint.y);
        context.stroke();
    }

    endStroke() {
        this.isDrawing = false;
        this.points = [];
    }

    setColor(color) {
        this.color = color;
    }

    setSize(size) {
        this.size = size;
    }

    setOpacity(opacity) {
        this.opacity = opacity / 100;
    }
}