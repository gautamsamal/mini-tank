import Utils from './utils.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cWidth = canvas.width;
const cHeight = canvas.height;
const direction = 'right';

// Set view port size
const vWidth = cWidth;
const vHeight = cHeight;

// Angle in degree and power/velocity without unit.
const angle = 45;
const velocity = 60;

// Set origin point for our projection. Defaults to center.
// Will be used to translate our coordinate to canvas.
const canvasOrigin = {
    x: cWidth / 2,
    y: cHeight / 2
}

const [xOrigin] = Utils.canvasToViewPort(canvasOrigin.x, canvasOrigin.y, vWidth, vHeight, cWidth, cHeight);
const xEnd = findXLimitBasedOnAngle(xOrigin);

// Landscape
const landscape = Utils.getLandscape(vWidth, vHeight);

function drawAxis() {
    ctx.beginPath();
    ctx.moveTo(0, canvasOrigin.y);
    ctx.lineTo(canvas.width, canvasOrigin.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasOrigin.x, 0);
    ctx.lineTo(canvasOrigin.x, canvas.height);
    ctx.stroke();
}

function findXLimitBasedOnAngle(xOrigin) {
    const a = angle % 360;
    if (a > 90 && a < 270) {
        return direction === 'right' ? 0 - xOrigin : vWidth - xOrigin;
    }
    return direction === 'right' ? vWidth - xOrigin : 0 - xOrigin;
}

function drawPoint(x = 0) {
    const y = Utils.calculateY(angle, velocity, x, direction);
    const [normX, normY] = Utils.viewPortToCanvas(x, y, vWidth, vHeight, cWidth, cHeight);
    ctx.beginPath();
    ctx.arc(...Utils.getCanvasPt(canvasOrigin, normX, normY), 1, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function drawLandscape() {
    ctx.beginPath();
    ctx.moveTo(0, cHeight);
    landscape.forEach(([x, y]) => {
        const [normX, normY] = Utils.viewPortToCanvas(x, y, vWidth, vHeight, cWidth, cHeight);
        ctx.lineTo(normX, cHeight - normY);
    });
    ctx.lineTo(cWidth, cHeight);
    ctx.closePath();
    ctx.fillStyle = '#f00';
    ctx.fill();
    ctx.stroke();
}

function drawWithAnimation(x = 0, xEnd) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxis();
    if (angle === 90) {
        drawPoint(0);
    } else {
        drawPoint(x);
    }
    // drawLandscape();
    if (xEnd < 0) {
        x -= 0.5;
        // go left
        if (x < xEnd) {
            return null;
        }
    } else {
        x += 0.5;
        //go right
        if (x > xEnd) {
            return null;
        }
    }
    requestAnimationFrame(function () {
        drawWithAnimation(x, xEnd);
    });
}
console.log(xEnd);
drawWithAnimation(0, xEnd);
//dodo: handle 90

