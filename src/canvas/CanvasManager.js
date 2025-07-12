import { Canvas } from 'fabric';

export class CanvasManager {
    constructor(canvasOrId) {
        const canvasEl = typeof canvasOrId === 'string'
            ? document.getElementById(canvasOrId)
            : canvasOrId;

        this.canvas = new Canvas(canvasEl, {
            preserveObjectStacking: true,
            selection: false,
            renderOnAddRemove: false,
        });
    }

    resizeCanvasToImage(imageWidth, imageHeight, maxWidth = 800, maxHeight = 600) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        const responsiveMaxWidth = Math.min(maxWidth, viewportWidth - 40);
        const responsiveMaxHeight = Math.min(maxHeight, viewportHeight - 200);
        
        const scaleX = responsiveMaxWidth / imageWidth;
        const scaleY = responsiveMaxHeight / imageHeight;
        const scale = Math.min(scaleX, scaleY);
        
        const newWidth = Math.round(imageWidth * scale);
        const newHeight = Math.round(imageHeight * scale);
        
        this.canvas.setWidth(newWidth);
        this.canvas.setHeight(newHeight);
        
        return { width: newWidth, height: newHeight, scale };
    }
}