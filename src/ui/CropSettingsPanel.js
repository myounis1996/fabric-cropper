import { CropperBox } from '../canvas/CropperBox.js';

/**
 * UI panel that lets the user tweak the crop rectangle and
 * finally perform the crop.
 *
 * @param {CropperBox} cropper
 * @param {import('fabric').Canvas} canvas
 */
export class CropSettingsPanel {
    constructor(cropper, canvas) {
        this.cropper = cropper;
        this.canvas  = canvas;
        this._buildUI();
        this._bindCanvasEvents();
        this._bindFormEvents();
        this._syncInputs();
    }

    _buildUI() {
        const host = document.getElementById('crop-settings');
        host.innerHTML = `
            <label>W&nbsp;<input id="crop-width"  type="number" min="1"></label>
            <label>H&nbsp;<input id="crop-height" type="number" min="1"></label>
            <button id="reset-crop" type="button">Reset</button>
            <button id="apply-crop" type="button">Crop</button>
        `;

        this.wInput   = host.querySelector('#crop-width');
        this.hInput   = host.querySelector('#crop-height');
        this.resetBtn = host.querySelector('#reset-crop');
        this.cropBtn  = host.querySelector('#apply-crop');
    }

    _bindCanvasEvents() {
        const refresh = (e) => {
            if (e.target === this.cropper.cropRect) this._syncInputs();
        };
        this.canvas.on('object:scaling',  refresh);
        this.canvas.on('object:modified', refresh);
        this.canvas.on('object:moving',   refresh);
    }

    _bindFormEvents() {
        const push = () => {
            const w = parseInt(this.wInput.value, 10);
            const h = parseInt(this.hInput.value, 10);
            if (Number.isFinite(w) && Number.isFinite(h)) {
                this.cropper.setDimensions(w, h);
                this.canvas.requestRenderAll();
            }
        };


        ['input'].forEach(evt => {
            this.wInput.addEventListener(evt,  push);
            this.hInput.addEventListener(evt, push);
        });

        // reset
        this.resetBtn.addEventListener('click', () => {
            this.cropper.resetDimensions();
            this._syncInputs();
        });

        // perform crop
        this.cropBtn.addEventListener('click', () => {
            void this.cropper.applyCrop();
        });
    }

    _syncInputs() {
        const { width, height } = this.cropper.getDimensions();
        this.wInput.value = Math.round(width);
        this.hInput.value = Math.round(height);
    }
}
