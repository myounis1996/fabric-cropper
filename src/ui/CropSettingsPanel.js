export class CropSettingsPanel {
    constructor(cropper, canvas) {
        this.cropper = cropper;
        this.canvas = canvas;
        this.isCropped = false;
        this._buildUI();
        this._bindCanvasEvents();
        this._bindFormEvents();
        this._syncInputs();
    }

    resetToInitialState() {
        this.isCropped = false;
        this._updateButtonVisibility();
        this._syncInputs();
        this.cropper.resetToInitialState();
        this.updateConstraints();
    }

    _buildUI() {
        const host = document.getElementById('crop-settings');
        const canvasWidth = this.canvas.getWidth();
        const canvasHeight = this.canvas.getHeight();
        
        host.innerHTML = `
            <div class="crop-controls">
                <div class="dimension-inputs">
                    <label data-label="Width"><input id="crop-width"  type="number" min="1" max="${canvasWidth}" placeholder="Width"></label>
                    <label data-label="Height"><input id="crop-height" type="number" min="1" max="${canvasHeight}" placeholder="Height"></label>
                </div>
                <div class="action-buttons">
                    <button id="reset-crop" type="button" class="btn">↺ Reset</button>
                    <button id="apply-crop" type="button" class="btn">✂️ Crop</button>
                    <button id="save-crop" type="button" class="btn" style="display: none;">💾 Save PNG</button>
                </div>
            </div>
        `;

        this.wInput = host.querySelector('#crop-width');
        this.hInput = host.querySelector('#crop-height');
        this.resetBtn = host.querySelector('#reset-crop');
        this.cropBtn = host.querySelector('#apply-crop');
        this.saveBtn = host.querySelector('#save-crop');
    }

    _bindCanvasEvents() {
        const refresh = (e) => {
            if (e.target === this.cropper.cropRect) this._syncInputs();
        };
        this.canvas.on('object:scaling', refresh);
        this.canvas.on('object:modified', refresh);
        this.canvas.on('object:moving', refresh);
    }

    _bindFormEvents() {
        const push = () => {
            const w = parseInt(this.wInput.value, 10);
            const h = parseInt(this.hInput.value, 10);
            if (Number.isFinite(w) && Number.isFinite(h)) {
                const canvasWidth = this.canvas.getWidth();
                const canvasHeight = this.canvas.getHeight();
                
                const constrainedW = Math.max(1, Math.min(w, canvasWidth));
                const constrainedH = Math.max(1, Math.min(h, canvasHeight));
                
                if (constrainedW !== w || constrainedH !== h) {
                    this.wInput.value = constrainedW;
                    this.hInput.value = constrainedH;
                }
                
                this.cropper.setDimensions(constrainedW, constrainedH);
                this.canvas.requestRenderAll();
            }
        };

        ['input', 'blur'].forEach(evt => {
            this.wInput.addEventListener(evt, push);
            this.hInput.addEventListener(evt, push);
        });

        this.resetBtn.addEventListener('click', () => {
            this.cropper.resetDimensions();
            this._syncInputs();
            if (this.isCropped) {
                this.isCropped = false;
                this._updateButtonVisibility();
            }
        });

        this.cropBtn.addEventListener('click', async () => {
            await this.cropper.applyCrop();
            this.isCropped = true;
            this._updateButtonVisibility();
        });

        this.saveBtn.addEventListener('click', () => {
            this._saveCroppedImage();
        });
    }

    _syncInputs() {
        const { width, height } = this.cropper.getDimensions();
        this.wInput.value = Math.round(width);
        this.hInput.value = Math.round(height);
    }

    updateConstraints() {
        const canvasWidth = this.canvas.getWidth();
        const canvasHeight = this.canvas.getHeight();
        
        this.wInput.max = canvasWidth;
        this.hInput.max = canvasHeight;
        
        const currentW = parseInt(this.wInput.value, 10);
        const currentH = parseInt(this.hInput.value, 10);
        
        if (currentW > canvasWidth) {
            this.wInput.value = canvasWidth;
        }
        if (currentH > canvasHeight) {
            this.hInput.value = canvasHeight;
        }
    }

    _updateButtonVisibility() {
        const dimensionInputs = document.querySelector('.dimension-inputs');

        if (this.isCropped) {
            this.resetBtn.style.display = 'none';
            this.cropBtn.style.display = 'none';
            this.saveBtn.style.display = 'inline-block';
            if (dimensionInputs) {
                dimensionInputs.style.opacity = '0';
                dimensionInputs.style.transform = 'translateY(-10px)';
                dimensionInputs.style.maxHeight = '0';
                dimensionInputs.style.padding = '0 var(--spacing-xl)';
                dimensionInputs.style.margin = '0';
                
                setTimeout(() => {
                    dimensionInputs.style.display = 'none';
                }, 300);
            }
        } else {
            this.resetBtn.style.display = 'inline-block';
            this.cropBtn.style.display = 'inline-block';
            this.saveBtn.style.display = 'none';
            if (dimensionInputs) {
                dimensionInputs.style.display = 'flex';
                dimensionInputs.offsetHeight;
                dimensionInputs.style.opacity = '1';
                dimensionInputs.style.transform = 'translateY(0)';
                dimensionInputs.style.maxHeight = 'none';
                dimensionInputs.style.padding = 'var(--spacing-xxxl) var(--spacing-xl) var(--spacing-xl) var(--spacing-xl)';
                dimensionInputs.style.margin = '';
            }
        }
    }

    _saveCroppedImage() {
        const dataURL = this.canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 1
        });

        const link = document.createElement('a');
        link.download = `cropped-image-${Date.now()}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
