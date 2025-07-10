import {Path} from 'fabric';

export class OverlayMask {
    constructor(canvas) {
        this.canvas = canvas;
        this.dimmedOverlay = null;
    }

    create(cropBounds) {
        this.remove();
        const canvasWidth = this.canvas.getWidth();
        const canvasHeight = this.canvas.getHeight();

        const pathData = [
            'M', 0, 0,
            'L', canvasWidth, 0,
            'L', canvasWidth, canvasHeight,
            'L', 0, canvasHeight,
            'Z',
            'M', cropBounds.left, cropBounds.top,
            'L', cropBounds.left, cropBounds.top + cropBounds.height,
            'L', cropBounds.left + cropBounds.width, cropBounds.top + cropBounds.height,
            'L', cropBounds.left + cropBounds.width, cropBounds.top,
            'Z'
        ].join(' ');

        this.dimmedOverlay = new Path(pathData, {
            fill: 'rgba(0, 0, 0, 0.5)',
            fillRule: 'evenodd',
            strokeWidth: 0,
            selectable: false,
            evented: false,
            hoverCursor: 'default'
        });
        this.canvas.add(this.dimmedOverlay);
        this.canvas.requestRenderAll();
    }

    update(cropBounds) {
        this.create(cropBounds);
    }

    remove() {
        if (this.dimmedOverlay) {
            this.canvas.remove(this.dimmedOverlay);
            this.dimmedOverlay = null;
            this.canvas.requestRenderAll();
        }
    }

    setVisible(visible) {
        if (this.dimmedOverlay) {
            this.dimmedOverlay.visible = visible;
            this.canvas.requestRenderAll();
        }
    }

    get visible() {
        return this.dimmedOverlay?.visible || false;
    }
}
