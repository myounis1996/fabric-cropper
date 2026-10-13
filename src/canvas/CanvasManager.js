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
			stopContextMenu: true,
		});

		// Viewport state (applied to image object, not canvas viewport)
		this.minZoom = 0.1;
		this.maxZoom = 8;
		this.isPanning = false;
		this.hasPanMoved = false;
		this.panStartPoint = null;
		this.lastPointer = null;
		this.imageObject = null;
		this._isPinching = false;
		this._pinchStartDistance = 0;
		this._pinchStartZoom = 1;

		this._bindInteractions();
	}

	// Public API to register the image for viewport constraints and centering
	setImageObject(image) {
		this.imageObject = image;
		// Ensure image is at original size; no scaling here
		image.set({ scaleX: 1, scaleY: 1, left: 0, top: 0, originX: 'left', originY: 'top' });
		image.setCoords();
		this.centerImage();
		this.canvas.requestRenderAll();
	}

	getZoom() {
		return this.imageObject?.scaleX || 1;
	}

	setZoom(nextZoom, focalPoint) {
		if (!this.imageObject) return;
		const canvasW = this.canvas.getWidth();
		const canvasH = this.canvas.getHeight();
		const point = focalPoint || { x: canvasW / 2, y: canvasH / 2 };
		const oldScale = this.imageObject.scaleX;
		const newScale = Math.max(this.minZoom, Math.min(this.maxZoom, nextZoom));
		const img = this.imageObject;
		// Keep the point under cursor stable during zoom
		const imagePointX = (point.x - img.left) / oldScale;
		const imagePointY = (point.y - img.top) / oldScale;
		img.scaleX = newScale;
		img.scaleY = newScale;
		img.left = point.x - imagePointX * newScale;
		img.top = point.y - imagePointY * newScale;
		img.setCoords();
		this._clampPan();
		this.canvas.requestRenderAll();
	}

	zoomBy(delta, focalPoint) {
		const current = this.getZoom();
		this.setZoom(current * delta, focalPoint);
	}

	centerImage() {
		if (!this.imageObject) return;
		const img = this.imageObject;
		const canvasW = this.canvas.getWidth();
		const canvasH = this.canvas.getHeight();
		const scaledW = img.width * img.scaleX;
		const scaledH = img.height * img.scaleY;
		img.left = Math.round((canvasW - scaledW) / 2);
		img.top = Math.round((canvasH - scaledH) / 2);
		img.setCoords();
		this._clampPan();
	}

	_bindInteractions() {
		// Wheel zoom (Ctrl + wheel)
		this.canvas.on('mouse:wheel', (opt) => {
			const evt = opt.e;
			if (!evt.ctrlKey) return; // Only zoom when Ctrl is pressed
			evt.preventDefault();
			evt.stopPropagation();
			const clientPoint = { x: evt.clientX, y: evt.clientY };
			const pointer = this._clientToCanvasPoint(clientPoint);
			const deltaY = evt.deltaY;
			const zoomFactor = Math.pow(0.999, deltaY);
			this.zoomBy(zoomFactor, pointer);
		});

		// Mouse pan on background drag with small threshold
		this.canvas.on('mouse:down', (opt) => {
			if (opt.target) return; // Do not start panning when interacting with objects
			const evt = opt.e;
			this.isPanning = true;
			this.hasPanMoved = false;
			this.panStartPoint = this._clientToCanvasPoint({ x: evt.clientX, y: evt.clientY });
			this.lastPointer = this.panStartPoint;
			this.canvas.setCursor('grabbing');
		});

		this.canvas.on('mouse:move', (opt) => {
			if (!this.isPanning) return;
			const evt = opt.e;
			const pointer = this._clientToCanvasPoint({ x: evt.clientX, y: evt.clientY });
			const dx = pointer.x - this.lastPointer.x;
			const dy = pointer.y - this.lastPointer.y;
			// Threshold to avoid accidental pans
			if (!this.hasPanMoved) {
				const dist2 = (pointer.x - this.panStartPoint.x) ** 2 + (pointer.y - this.panStartPoint.y) ** 2;
				if (dist2 < 4) return; // ~2px threshold
				this.hasPanMoved = true;
			}
			if (!this.imageObject) return;
			this.imageObject.left += dx;
			this.imageObject.top += dy;
			this.imageObject.setCoords();
			this._clampPan();
			this.canvas.requestRenderAll();
			this.lastPointer = pointer;
		});

		this.canvas.on('mouse:up', () => {
			this.isPanning = false;
			this.panStartPoint = null;
			this.lastPointer = null;
			this.canvas.setCursor('default');
		});

		// Touch interactions: one-finger pan (background), two-finger pinch zoom
		const el = this.canvas.upperCanvasEl;
		el.addEventListener('touchstart', (evt) => {
			if (evt.touches.length === 2) {
				this._isPinching = true;
				this._pinchStartDistance = this._distanceBetweenTouches(evt.touches[0], evt.touches[1]);
				this._pinchStartZoom = this.getZoom();
				evt.preventDefault();
			} else if (evt.touches.length === 1) {
				// Start background pan only when there is no active object interaction
				if (!this.canvas.getActiveObject()) {
					this.isPanning = true;
					this.hasPanMoved = false;
					const p = this._touchToCanvasPoint(evt.touches[0]);
					this.panStartPoint = p;
					this.lastPointer = p;
					this.canvas.setCursor('grabbing');
				}
			}
		}, { passive: false });

		el.addEventListener('touchmove', (evt) => {
			if (this._isPinching && evt.touches.length === 2) {
				const newDist = this._distanceBetweenTouches(evt.touches[0], evt.touches[1]);
				const ratio = newDist / (this._pinchStartDistance || 1);
				const midpoint = this._midpointBetweenTouches(evt.touches[0], evt.touches[1]);
				const canvasPoint = this._clientToCanvasPoint(midpoint);
				this.setZoom(this._pinchStartZoom * ratio, canvasPoint);
				evt.preventDefault();
				return;
			}
			if (this.isPanning && evt.touches.length === 1) {
				const pointer = this._touchToCanvasPoint(evt.touches[0]);
				const dx = pointer.x - this.lastPointer.x;
				const dy = pointer.y - this.lastPointer.y;
				if (!this.hasPanMoved) {
					const dist2 = (pointer.x - this.panStartPoint.x) ** 2 + (pointer.y - this.panStartPoint.y) ** 2;
					if (dist2 < 4) return;
					this.hasPanMoved = true;
				}
				if (!this.imageObject) return;
				this.imageObject.left += dx;
				this.imageObject.top += dy;
				this.imageObject.setCoords();
				this._clampPan();
				this.canvas.requestRenderAll();
				this.lastPointer = pointer;
				evt.preventDefault();
			}
		}, { passive: false });

		const endTouch = () => {
			this._isPinching = false;
			this.isPanning = false;
			this.canvas.setCursor('default');
		};
		el.addEventListener('touchend', endTouch);
		el.addEventListener('touchcancel', endTouch);
	}

	_clampPan() {
		if (!this.imageObject) return;
		const img = this.imageObject;
		const scaledW = img.width * img.scaleX;
		const scaledH = img.height * img.scaleY;
		const canvasW = this.canvas.getWidth();
		const canvasH = this.canvas.getHeight();

		if (scaledW <= canvasW) {
			img.left = Math.round((canvasW - scaledW) / 2);
		} else {
			const minLeft = canvasW - scaledW;
			const maxLeft = 0;
			img.left = Math.min(maxLeft, Math.max(minLeft, img.left));
		}
		if (scaledH <= canvasH) {
			img.top = Math.round((canvasH - scaledH) / 2);
		} else {
			const minTop = canvasH - scaledH;
			const maxTop = 0;
			img.top = Math.min(maxTop, Math.max(minTop, img.top));
		}
		img.setCoords();
	}

	_distanceBetweenTouches(t1, t2) {
		const dx = t1.clientX - t2.clientX;
		const dy = t1.clientY - t2.clientY;
		return Math.sqrt(dx * dx + dy * dy);
	}

	_midpointBetweenTouches(t1, t2) {
		return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
	}

	_clientToCanvasPoint(p) {
		const rect = this.canvas.upperCanvasEl.getBoundingClientRect();
		return { x: p.x - rect.left, y: p.y - rect.top };
	}

	_touchToCanvasPoint(touch) {
		const rect = this.canvas.upperCanvasEl.getBoundingClientRect();
		return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
	}
}