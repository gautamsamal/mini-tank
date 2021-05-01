// Gravitation force
const g = 9.8;
const noise = window.noise;
noise.seed(0.9);

function random(low, high) {
    if (high === undefined) {
        high = low;
        low = 0;
    }
    return Math.random() * (high - low) + low;
};

const noiseElevation = random(1, 50);
const spikiness = random(60, 85);

export default class Utils {
    static calculateY(angle, velocity, x, dir) {
        const aRad = angle * Math.PI / 180;
        const vx = velocity * Math.cos(aRad);
        const vy = velocity * Math.sin(aRad);
        // Find co-efficient for quadratic equation. C = 0
        const aCoEf = (-1 * g) / (2 * vx * vx);
        const bCoEf = (vy / vx) * (dir === 'right' ? 1 : -1);

        return aCoEf * (x * x) + bCoEf * x;
    }

    static viewPortToCanvas(x, y, vWidth, vHeight, cWidth, cHeight) {
        return [x / vWidth * cWidth, y / vHeight * cHeight];
    }

    static canvasToViewPort(x, y, vWidth, vHeight, cWidth, cHeight) {
        return [x / cWidth * vWidth, y / cHeight * vHeight];
    }

    static getCanvasPt(canvasOrigin, x, y) {
        return [canvasOrigin.x + x, canvasOrigin.y - y];
    }
    static clip(v, a1, b1, a2, b2) {
        return (((v - a1) / (b1 - a1)) * (b2 - a2) + a2);
    }
    static solveQuadEq(a, b, x) {
        return (a * x * x) + (b * x);
    }
    static getLandscape(canvasWidth, canvasHeight) {
        const points = [];
        const midY = Utils.solveQuadEq(-1, 1, 0.5);
        for (let x = 0; x <= canvasWidth; x++) {
            const noiseOutput = Utils.clip(noise.simplex2(x / spikiness, noiseElevation), -1, 1, 0, 50);
            const offset = Utils.clip(Utils.solveQuadEq(-1, 1, x / canvasWidth), 0, midY, 0, canvasHeight / 3);
            points.push([x, Math.max(0, offset + noiseOutput)]);
        }
        return points;
    }
};
