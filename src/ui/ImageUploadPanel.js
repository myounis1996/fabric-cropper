export class ImageUploadPanel {
    constructor(canvasManager, onImageLoad) {
        this.canvasManager = canvasManager;
        this.onImageLoad = onImageLoad;
        this.testImages = [
            { name: 'Sample Landscape', path: '/images/dom-of-the-rock.jpg' },
            { name: 'Sample Portrait', path: '/images/pexels-5004002.jpg' },
            { name: 'Sample Square', path: '/images/pexels-8832092.jpg' },
            { name: 'Wide Landscape', path: this.generatePlaceholderImage(1200, 600) },
            { name: 'Portrait', path: this.generatePlaceholderImage(600, 900) },
            { name: 'Square', path: this.generatePlaceholderImage(800, 800) }
        ];
        this.createPanel();
        
        if (this.testImages.length > 0) {
            setTimeout(() => {
                this.loadTestImage(0);
            }, 100);
        }
    }

    setCropSettingsPanel(settingsPanel) {
        this.settingsPanel = settingsPanel;
    }

    generatePlaceholderImage(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#4facfe');
        gradient.addColorStop(1, '#00f2fe');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(width * 0.3, height * 0.3, 50, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(width * 0.6, height * 0.6, 80, 80);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${width}×${height}`, width / 2, height / 2);
        
        return canvas.toDataURL();
    }

    createPanel() {
        const panel = document.createElement('div');
        panel.className = 'image-upload-panel';
        panel.innerHTML = `
            <h2>Choose Image</h2>
            <div class="upload-section">
                <div class="test-images">
                    <h3>Test Images</h3>
                    <div class="test-image-grid">
                        ${this.testImages.map((img, index) => `
                            <div class="test-image-item" data-index="${index}">
                                <img src="${img.path}" alt="${img.name}" />
                                <span>${img.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="custom-upload">
                    <h3>Upload Custom Image</h3>
                    <div class="drop-zone" id="drop-zone">
                        <div class="drop-zone-content">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7,10 12,15 17,10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            <p>Drag & drop an image here</p>
                            <p>or</p>
                            <button type="button" class="upload-btn" id="upload-btn" aria-label="Choose image file to upload">Choose File</button>
                        </div>
                        <input type="file" id="file-input" accept="image/*" style="display: none;" aria-label="File input for image upload" />
                    </div>
                </div>
            </div>
        `;

        const canvasContainer = document.querySelector('.canvas-container');
        canvasContainer.parentNode.insertBefore(panel, canvasContainer);
        this.setupEventListeners();
    }

    setupEventListeners() {
        const testImageItems = document.querySelectorAll('.test-image-item');
        testImageItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.loadTestImage(index);
            });
        });

        const uploadBtn = document.getElementById('upload-btn');
        const fileInput = document.getElementById('file-input');
        
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.loadCustomImage(file);
            }
        });

        const dropZone = document.getElementById('drop-zone');
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    this.loadCustomImage(file);
                } else {
                    alert('Please select an image file.');
                }
            }
        });
    }

    async loadTestImage(index) {
        const image = this.testImages[index];
        if (image) {
            await this.loadImage(image.path, { crossOrigin: 'anonymous' });
        }
    }

    async loadCustomImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.loadImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    async loadImage(path, opts ={}) {
        this.showLoading();
        try {
            const { FabricImage } = await import('fabric');
            const fabricImg = await FabricImage.fromURL(path, opts);
            this.setupImage(fabricImg);
        } catch (error) {
            alert('Error loading image. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    setupImage(fabricImg) {
        const existingImages = this.canvasManager.canvas.getObjects().filter(obj => obj.type === 'image');
        existingImages.forEach(img => this.canvasManager.canvas.remove(img));

        const imageWidth = fabricImg.width;
        const imageHeight = fabricImg.height;
        
        const { scale } = this.canvasManager.resizeCanvasToImage(imageWidth, imageHeight);
        
        fabricImg.set({
            left: 0,
            top: 0,
            originX: 'left',
            originY: 'top',
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            evented: false
        });

        this.canvasManager.canvas.add(fabricImg);
        this.canvasManager.canvas.renderAll();

        if (this.settingsPanel) {
            this.settingsPanel.resetToInitialState();
        }

        if (this.onImageLoad) {
            this.onImageLoad(fabricImg);
        }
    }

    showLoading() {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading-overlay';
        loadingEl.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <p>Loading Image...</p>
            </div>
        `;
        document.body.appendChild(loadingEl);
    }

    hideLoading() {
        const loadingEl = document.querySelector('.loading-overlay');
        if (loadingEl) {
            document.body.removeChild(loadingEl);
        }
    }

} 