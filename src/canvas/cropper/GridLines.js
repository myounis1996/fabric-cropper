import {Line} from 'fabric';

/**
 * Create “rule-of-thirds” grid lines the size of the canvas.
 * @returns {import('fabric').Line[]} 4 thin white lines
 */
export function createGridLines(canvas) {
    const w = Math.round(canvas.getWidth());
    const h = Math.round(canvas.getHeight());
    const v1 = Math.round(w / 3), v2 = Math.round((w * 2) / 3);
    const h1 = Math.round(h / 3), h2 = Math.round((h * 2) / 3);

    const opts = {
        stroke: 'rgba(255,255,255,0.6)', strokeWidth: 1,
        selectable: false, evented: false, originX: 'left', originY: 'top'
    };

    return [
        new Line([v1, 0, v1, h], opts),
        new Line([v2, 0, v2, h], opts),
        new Line([0, h1, w, h1], opts),
        new Line([0, h2, w, h2], opts)
    ];
}
