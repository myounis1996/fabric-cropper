import {CanvasManager} from './src/canvas/CanvasManager.js';
import {CropperBox} from './src/canvas/CropperBox.js';
import {CropSettingsPanel} from './src/ui/CropSettingsPanel.js';
import {ImageUploadPanel} from './src/ui/ImageUploadPanel.js';

document.addEventListener('DOMContentLoaded', async () => {
    const mgr = new CanvasManager('c');
    const cropperBox = new CropperBox(mgr.canvas);
    cropperBox.createCropRectangle();

    const settingsPanel = new CropSettingsPanel(cropperBox, mgr.canvas);
    const imageUploadPanel = new ImageUploadPanel(mgr, (fabricImg) => {
        cropperBox.updateCropRectangle();
        settingsPanel.updateConstraints();
        mgr.canvas.requestRenderAll();
    });

    imageUploadPanel.setCropSettingsPanel(settingsPanel);
    mgr.canvas.requestRenderAll();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            settingsPanel.updateConstraints();
            mgr.canvas.requestRenderAll();
        }, 250);
    });
});