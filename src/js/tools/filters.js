// Image Editor Pro - Filters Tool
class Filters {
    constructor() {
        this.brightness = 0.5;
        this.contrast = 0.5;
        this.saturation = 0.5;
        this.hue = 180;
        this.lightness = 50;
        this.colorTemp = 50;
        this.sharpness = 50;
        this.blur = 0;
    }

    applyAllFilters(imageData, context) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        // 創建臨時的 canvas 來存儲結果
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempContext = tempCanvas.getContext('2d');
        tempContext.putImageData(imageData, 0, 0);
        
        // 應用亮度
        tempContext.filter = `brightness(${this.brightness})`;
        tempContext.drawImage(imageData, 0, 0);
        
        // 應用對比度
        tempContext.filter = `contrast(${this.contrast})`;
        tempContext.drawImage(imageData, 0, 0);
        
        // 應用飽和度
        tempContext.filter = `saturate(${this.saturation})`;
        tempContext.drawImage(imageData, 0, 0);
        
        // 應用色相
        tempContext.filter = `hue-rotate(${this.hue}deg)`;
        tempContext.drawImage(imageData, 0, 0);
        
        // 應用明度
        tempContext.filter = `lightness(${this.lightness}%)`;
        tempContext.drawImage(imageData, 0, 0);
        
        // 應用模糊
        if (this.blur > 0) {
            tempContext.filter = `blur(${this.blur}px)`;
            tempContext.drawImage(imageData, 0, 0);
        }
        
        // 返回處理後的數據
        return tempContext.getImageData(0, 0, width, height);
    }

    applyBrightnessFilter(imageData, brightness) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * brightness);
            data[i + 1] = Math.min(255, data[i + 1] * brightness);
            data[i + 2] = Math.min(255, data[i + 2] * brightness);
        }
        return imageData;
    }

    applyContrastFilter(imageData, contrast) {
        const data = imageData.data;
        const factor = (255 * (contrast - 0)) / 255;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, factor * data[i] + 128 - factor * 128);
            data[i + 1] = Math.min(255, factor * data[i + 1] + 128 - factor * 128);
            data[i + 2] = Math.min(255, factor * data[i + 2] + 128 - factor * 128);
        }
        return imageData;
    }

    applySaturationFilter(imageData, saturation) {
        const data = imageData.data;
        const factor = (saturation - 1) * -1;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = factor * data[i] + (1 - factor) * 128;
            data[i + 1] = factor * data[i + 1] + (1 - factor) * 128;
            data[i + 2] = factor * data[i + 2] + (1 - factor) * 128;
        }
        return imageData;
    }

    applyHueFilter(imageData, hue) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            // 簡化的色相旋轉
            const h = (data[i] / 255 * 360 + hue) % 360;
            data[i] = Math.min(255, h / 360 * 255);
        }
        return imageData;
    }

    applyLightnessFilter(imageData, lightness) {
        const data = imageData.data;
        const factor = (lightness - 100) / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] + factor * 255);
        }
        return imageData;
    }

    applyColorTemperatureFilter(imageData, temperature) {
        const data = imageData.data;
        const temp = temperature / 2000;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] + temp * 20);
            data[i + 2] = Math.max(0, data[i + 2] - temp * 20);
        }
        return imageData;
    }

    applySharpnessFilter(imageData, sharpness) {
        // 使用簡化的銳利化算法
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempContext = tempCanvas.getContext('2d');
        tempContext.putImageData(imageData, 0, 0);
        
        const tempData = tempContext.getImageData(0, 0, width, height);
        const tempPixels = tempData.data;
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) {
                    const i = (y * width + x) * 4 + c;
                    const original = data[i];
                    const neighbor = tempPixels[i - width * 4 + c] +
                                   tempPixels[i + width * 4 + c] +
                                   tempPixels[i - width * 4 + c] +
                                   tempPixels[i + width * 4 + c] +
                                   tempPixels[i - 4 + c] +
                                   tempPixels[i + 4 + c];
                    const sharpened = original * (1 - sharpness * 0.1) + 
                                     neighbor * sharpness * 0.1;
                    data[i] = Math.min(255, Math.max(0, sharpened));
                }
            }
        }
        return imageData;
    }
}