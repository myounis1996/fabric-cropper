import {Rect, Group, FabricImage} from 'fabric';
import {createGridLines, setupHandles, OverlayMask, checkBounds} from './cropper/index.js';

export class CropperBox {
    constructor(canvas) {
        this.canvas = canvas;
        this.overlay = new OverlayMask(canvas);
        this.cropRect = null;
    }

    createCropRectangle() {
        const canvasWidth = this.canvas.getWidth();
        const canvasHeight = this.canvas.getHeight();
        const outline = new Rect({
            left: 0,
            top: 0,
            width: canvasWidth,
            height: canvasHeight,
            fill: 'transparent',
            stroke: '#ffffff',
            strokeWidth: 1.5,
            strokeDashArray: [8, 4],
            selectable: true,
            evented: true,
            hasControls: true,
            hasBorders: false,
            lockRotation: true,
            lockScalingFlip: true,
            transparentCorners: false,
            cornerColor: '#ffffff',
            cornerStrokeColor: '#00a8ff',
            cornerSize: 24,
            cornerStyle: 'circle',
            padding: 0
        });

        const gridLines = createGridLines(this.canvas);
        this.cropRect = new Group([outline, ...gridLines], {
            left: canvasWidth / 2,
            top: canvasHeight / 2,
            selectable: true,
            evented: true,
            hasControls: true,
            hasBorders: false,
            lockRotation: true,
            lockScalingFlip: true,
            transparentCorners: false,
            cornerColor: '#ffffff',
            cornerStrokeColor: '#00a8ff',
            cornerSize: 24,
            cornerStyle: 'circle',
            originX: 'center',
            originY: 'center',
            padding: 0
        });
        setupHandles(this.cropRect);

        this.canvas.add(this.cropRect);
        this.canvas.setActiveObject(this.cropRect);
        this._updateOverlay();
        this._setupEvents();
    }

    bringToFront() {
        if (!this.cropRect) return;
        this.canvas.bringObjectToFront(this.cropRect);
        this.canvas.setActiveObject(this.cropRect);
    }

    getDimensions() {
        if (!this.cropRect) return {width: 0, height: 0};
        return {
            width: this.cropRect.getScaledWidth(),
            height: this.cropRect.getScaledHeight()
        };
    }

    setDimensions(newW, newH) {
        if (!this.cropRect) return;
        const curW = this.cropRect.getScaledWidth();
        const curH = this.cropRect.getScaledHeight();
        const scaleX = newW ? (newW / curW) : 1;
        const scaleY = newH ? (newH / curH) : 1;
        this.cropRect.scaleX *= scaleX;
        this.cropRect.scaleY *= scaleY;
        this.cropRect.setCoords();
        checkBounds(this.cropRect, this.canvas, true);
        this._updateOverlay();
    }

    resetDimensions() {
        if (!this.cropRect) return;
        this.cropRect.set({scaleX: 1, scaleY: 1, left: this.canvas.getWidth() / 2, top: this.canvas.getHeight() / 2});
        this.cropRect.setCoords();
        this._updateOverlay();
    }

    async applyCrop() {
        if (!this.cropRect) return;
        const {left, top, width, height} = this.cropRect.getBoundingRect();
        const prevVis = {rect: this.cropRect.visible, dim: this.overlay.visible};
        this.cropRect.visible = false;
        this.overlay.setVisible(false);
        this.canvas.requestRenderAll();
        const dataURL = this.canvas.toDataURL({
            format: 'png',
            left, top, width, height,
            multiplier: 1
        });
        this.cropRect.visible = prevVis.rect;
        this.overlay.setVisible(prevVis.dim);
        const imgElement = await new Promise(res => {
            const img = new Image();
            img.onload = () => res(img);
            img.src = dataURL;
        });
        this.canvas.clear();
        this.canvas.setWidth(width);
        this.canvas.setHeight(height);
        this.canvas.add(new FabricImage(imgElement, {
            left: 0, top: 0, originX: 'left', originY: 'top',
            selectable: false, evented: false
        }));
        this.canvas.renderAll();
        this.overlay.remove();
        this.cropRect.off('modified');
        this.cropRect.off('scaling');
        this.cropRect.off('moving');
    }

    _updateOverlay() {
        if (!this.cropRect) return;
        this.overlay.update(this.cropRect.getBoundingRect());
        this.bringToFront();
    }

    _setupEvents() {
        this._onMove = () => {
            this._updateOverlay();
            checkBounds(this.cropRect, this.canvas, false);
        };
        this._onScale = () => {
            this._updateOverlay();
            checkBounds(this.cropRect, this.canvas, true);
        };
        this.cropRect.on('moving', this._onMove);
        this.cropRect.on('modified', this._onMove);
        this.cropRect.on('scaling', this._onScale);
    }

}
