import {FabricImage} from 'fabric';
import {CanvasManager} from './src/canvas/CanvasManager.js';
import {CropperBox} from './src/canvas/CropperBox.js';
import {CropSettingsPanel} from './src/ui/CropSettingsPanel.js';

document.addEventListener('DOMContentLoaded', async () => {
    const loadingEl = document.createElement('div');
    loadingEl.className = 'loading';
    loadingEl.innerHTML = 'Loading Image...';
    loadingEl.style = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 15px 30px;
        border-radius: 4px;
        font-family: Arial, sans-serif;
        z-index: 1000;
    `;
    document.body.appendChild(loadingEl);

    // Initialize canvas manager
    const mgr = new CanvasManager('c');
    const fabricImg = await FabricImage.fromURL('/985-800x600.jpg', { crossOrigin: 'anonymous' });
    document.body.removeChild(loadingEl);
    const canvasWidth = mgr.canvas.getWidth();
    const canvasHeight = mgr.canvas.getHeight();
    fabricImg.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
    });

    mgr.canvas.add(fabricImg);
    mgr.canvas.renderAll();

    // Create CropperBox
    const cropperBox = new CropperBox(mgr.canvas);
    cropperBox.createCropRectangle();

    // Create a UI panel and connect it to the cropper
    const settingsPanel = new CropSettingsPanel(cropperBox, mgr.canvas);

    // Render everything
    mgr.canvas.requestRenderAll();
});