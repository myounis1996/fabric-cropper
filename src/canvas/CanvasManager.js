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
}