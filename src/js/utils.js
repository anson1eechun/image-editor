// Image Editor Pro - Utility Functions

class Utils {
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };
    }

    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    static hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h * 6) % 1 - 1));
        const m = l - c / 2;
        
        let r, g, b;
        if (h < 1/6) { r = c; g = x; b = 0; }
        else if (h < 1/3) { r = x; g = c; b = 0; }
        else if (h < 2/3) { r = 0; g = c; b = x; }
        else if (h < 5/6) { r = x; g = 0; b = c; }
        else { r = c; g = x; b = 0; }
        
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }

    static rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / 6 / d + (b > r ? 1 : 0); break;
                case g: h = (b - r) / 6 / d + 1/3; break;
                case b: h = (r - g) / 6 / d + 2/3;
            }
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    static applyBrightness(imageData, brightness) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * brightness);
            data[i + 1] = Math.min(255, data[i + 1] * brightness);
            data[i + 2] = Math.min(255, data[i + 2] * brightness);
        }
        return imageData;
    }

    static applyContrast(imageData, contrast) {
        const data = imageData.data;
        const factor = (255 * (contrast - 0)) / 255;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, factor * data[i] + 128 - factor * 128);
            data[i + 1] = Math.min(255, factor * data[i + 1] + 128 - factor * 128);
            data[i + 2] = Math.min(255, factor * data[i + 2] + 128 - factor * 128);
        }
        return imageData;
    }

    static applySaturation(imageData, saturation) {
        const data = imageData.data;
        const factor = (saturation - 1) * -1;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = factor * data[i] + (1 - factor) * 128;
            data[i + 1] = factor * data[i + 1] + (1 - factor) * 128;
            data[i + 2] = factor * data[i + 2] + (1 - factor) * 128;
        }
        return imageData;
    }

    static applyColorTemperature(imageData, temperature) {
        const data = imageData.data;
        const temp = temperature / 2000;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] + temp * 20);
            data[i + 2] = Math.max(0, data[i + 2] - temp * 20);
        }
        return imageData;
    }

    static applySharpness(imageData, sharpness) {
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