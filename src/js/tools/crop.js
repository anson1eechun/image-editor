// Image Editor Pro - Crop Tool
class Crop {
    constructor() {
        this.selection = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        this.isSelecting = false;
    }

    setSelection(x, y, width, height) {
        this.selection = { x, y, width, height };
    }

    getSelection() {
        return this.selection;
    }

    applyCrop(imageData, context) {
        const selection = this.selection;
        const cropWidth = selection.width - selection.x;
        const cropHeight = selection.height - selection.y;
        
        const croppedImageData = context.getImageData(
            selection.x,
            selection.y,
            cropWidth,
            cropHeight
        );
        
        const canvas = document.createElement('canvas');
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        const tempContext = canvas.getContext('2d');
        tempContext.putImageData(croppedImageData, 0, 0);
        
        return canvas;
    }
}