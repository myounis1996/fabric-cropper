/**
 * Configure custom L-shaped corner handles and straight side handles.
 * This is purely visual – the hit-testing stays Fabric-native.
 */
export function setupHandles(cropRect) {
    const cornerSize = 24, sideHandleLength = 16, strokeWidth = 3,
        lArmLength = 14, color = '#2196f3', shadow = 'rgba(33, 150, 243, 0.6)';

    /* ---------- painters ------------------------------------------------ */

    // Helper to draw an L-shape inside the corner
    function drawCornerL(ctx, corner, hovered) {
        ctx.save();
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = color;
        ctx.lineCap = 'square';
        ctx.shadowColor = hovered ? shadow : 'transparent';
        ctx.shadowBlur = hovered ? 6 : 0;
        ctx.globalAlpha = hovered ? 1 : 0.85;

        ctx.beginPath();
        const margin = 4; // Distance from edge
        switch (corner) {
            case 'tl': // top-left
                ctx.moveTo(margin, margin + lArmLength);
                ctx.lineTo(margin, margin);
                ctx.lineTo(margin + lArmLength, margin);
                break;
            case 'tr': // top-right
                ctx.moveTo(cornerSize - margin, margin + lArmLength);
                ctx.lineTo(cornerSize - margin, margin);
                ctx.lineTo(cornerSize - margin - lArmLength, margin);
                break;
            case 'bl': // bottom-left
                ctx.moveTo(margin, cornerSize - margin - lArmLength);
                ctx.lineTo(margin, cornerSize - margin);
                ctx.lineTo(margin + lArmLength, cornerSize - margin);
                break;
            case 'br': // bottom-right
                ctx.moveTo(cornerSize - margin, cornerSize - margin - lArmLength);
                ctx.lineTo(cornerSize - margin, cornerSize - margin);
                ctx.lineTo(cornerSize - margin - lArmLength, cornerSize - margin);
                break;
        }
        ctx.stroke();
        ctx.restore();
    }

    // Helper to draw side handles
    function drawSideHandle(ctx, side, hovered) {
        ctx.save();
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = color;
        ctx.lineCap = 'square';
        ctx.shadowColor = hovered ? shadow : 'transparent';
        ctx.shadowBlur = hovered ? 6 : 0;
        ctx.globalAlpha = hovered ? 1 : 0.85;

        ctx.beginPath();
        const handleSize = 20; // px, side handle container size
        const center = handleSize / 2;

        switch (side) {
            case 'mt': // middle top
                ctx.moveTo(center - sideHandleLength / 2, center);
                ctx.lineTo(center + sideHandleLength / 2, center);
                break;
            case 'mb': // middle bottom
                ctx.moveTo(center - sideHandleLength / 2, center);
                ctx.lineTo(center + sideHandleLength / 2, center);
                break;
            case 'ml': // middle left
                ctx.moveTo(center, center - sideHandleLength / 2);
                ctx.lineTo(center, center + sideHandleLength / 2);
                break;
            case 'mr': // middle right
                ctx.moveTo(center, center - sideHandleLength / 2);
                ctx.lineTo(center, center + sideHandleLength / 2);
                break;
        }
        ctx.stroke();
        ctx.restore();
    }

    /* ---------- attach painters ---------------------------------------- */


    // Set up corner handles (L-shaped)
    const corners = ['tl', 'tr', 'bl', 'br'];
    for (const corner of corners) {
        cropRect.controls[corner].render = function (ctx, left, top, styleOverride, fabricObj) {
            const hovered = !!fabricObj.__corner && fabricObj.__corner === corner;
            ctx.save();
            // Position handles inside the rectangle
            let x = left;
            let y = top;

            // Adjust position to be inside the rectangle
            if (corner === 'tl') {
                x = left + cornerSize / 2;
                y = top + cornerSize / 2;
            } else if (corner === 'tr') {
                x = left - cornerSize / 2;
                y = top + cornerSize / 2;
            } else if (corner === 'bl') {
                x = left + cornerSize / 2;
                y = top - cornerSize / 2;
            } else if (corner === 'br') {
                x = left - cornerSize / 2;
                y = top - cornerSize / 2;
            }

            ctx.translate(x - cornerSize / 2, y - cornerSize / 2);
            drawCornerL(ctx, corner, hovered);
            ctx.restore();
        };
        cropRect.controls[corner].sizeX = cornerSize;
        cropRect.controls[corner].sizeY = cornerSize;
    }

    // Set up side handles (lines)
    const sides = ['mt', 'mb', 'ml', 'mr'];
    for (const side of sides) {
        cropRect.controls[side].render = function (ctx, left, top, styleOverride, fabricObj) {
            const hovered = !!fabricObj.__corner && fabricObj.__corner === side;
            ctx.save();
            ctx.translate(left - 10, top - 10); // 20px container
            drawSideHandle(ctx, side, hovered);
            ctx.restore();
        };
        cropRect.controls[side].sizeX = 20;
        cropRect.controls[side].sizeY = 20;
    }

    // Show all 8 handles, hide rotation
    cropRect.setControlsVisibility({
        mt: true, mb: true, ml: true, mr: true, // side handles
        tl: true, tr: true, bl: true, br: true, // corner handles
        mtr: false // hide rotation handle
    });

    // Set cursor styles for better UX
    cropRect.controls['tl'].cursorStyle = 'nw-resize';
    cropRect.controls['tr'].cursorStyle = 'ne-resize';
    cropRect.controls['bl'].cursorStyle = 'sw-resize';
    cropRect.controls['br'].cursorStyle = 'se-resize';
    cropRect.controls['mt'].cursorStyle = 'ns-resize';
    cropRect.controls['mb'].cursorStyle = 'ns-resize';
    cropRect.controls['ml'].cursorStyle = 'ew-resize';
    cropRect.controls['mr'].cursorStyle = 'ew-resize';
}
