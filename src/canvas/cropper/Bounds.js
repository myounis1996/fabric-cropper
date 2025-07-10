export function checkBounds(cropRect, canvas, fromScale = false) {
    if (!cropRect || !canvas) return;
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const boundingRect = cropRect.getBoundingRect();

    let newLeft = cropRect.left;
    let newTop = cropRect.top;
    let newScaleX = cropRect.scaleX;
    let newScaleY = cropRect.scaleY;

    if (fromScale) {
        // When scaling, ensure the scaled size doesn't exceed canvas bounds
        const maxWidth = canvasWidth;
        const maxHeight = canvasHeight;

        const currentWidth = cropRect.getScaledWidth();
        const currentHeight = cropRect.getScaledHeight();

        if (currentWidth > maxWidth) {
            newScaleX = (maxWidth / cropRect.width);
        }
        if (currentHeight > maxHeight) {
            newScaleY = (maxHeight / cropRect.height);
        }

        // After potential scale adjustment, check position bounds
        const projectedBoundingRect = {
            left: cropRect.left - (cropRect.width * newScaleX) / 2,
            top: cropRect.top - (cropRect.height * newScaleY) / 2,
            width: cropRect.width * newScaleX,
            height: cropRect.height * newScaleY
        };

        // Adjust position if scaled rect would go outside canvas
        if (projectedBoundingRect.left < 0) {
            newLeft = projectedBoundingRect.width / 2;
        }
        if (projectedBoundingRect.top < 0) {
            newTop = projectedBoundingRect.height / 2;
        }
        if (projectedBoundingRect.left + projectedBoundingRect.width > canvasWidth) {
            newLeft = canvasWidth - projectedBoundingRect.width / 2;
        }
        if (projectedBoundingRect.top + projectedBoundingRect.height > canvasHeight) {
            newTop = canvasHeight - projectedBoundingRect.height / 2;
        }
    } else {
        // When moving, constrain position within canvas bounds
        const halfWidth = boundingRect.width / 2;
        const halfHeight = boundingRect.height / 2;

        // Calculate bounds considering the crop rect is centered
        const minLeft = halfWidth;
        const minTop = halfHeight;
        const maxLeft = canvasWidth - halfWidth;
        const maxTop = canvasHeight - halfHeight;

        // Constrain position
        newLeft = Math.max(minLeft, Math.min(maxLeft, cropRect.left));
        newTop = Math.max(minTop, Math.min(maxTop, cropRect.top));
    }

    // Apply constraints if needed
    if (newLeft !== cropRect.left || newTop !== cropRect.top ||
        newScaleX !== cropRect.scaleX || newScaleY !== cropRect.scaleY) {

        cropRect.set({
            left: newLeft,
            top: newTop,
            scaleX: newScaleX,
            scaleY: newScaleY
        });

        cropRect.setCoords();
        canvas.requestRenderAll();
    }
}
