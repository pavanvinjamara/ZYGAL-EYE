/**
 * Generates a "water ripple" polygon clip-path string for a given moment in time.
 * Instead of a perfect circle, the edge wobbles using layered sine waves that
 * settle down as the wave finishes expanding — like a ripple flattening out.
 */
function wavePolygonAt(cx, cy, t, endRadius, opts) {

    const {
        waveCount = 7,
        waveCount2 = 13,
        rotationSpeed = 1.4,
        rotationSpeed2 = -2.1,
        maxAmplitude = 26,
        steps = 90
    } = opts;

    // Overall growth: ease-out so it starts fast, settles near the end
    const eased = 1 - Math.pow(1 - t, 3);
    const baseRadius = eased * endRadius;

    // Ripple envelope: builds up early, tapers to ~0 near completion (settles flat)
    const envelope = maxAmplitude * Math.sin(Math.PI * Math.min(t * 1.15, 1));

    const points = [];

    for (let i = 0; i <= steps; i++) {

        const angle = (i / steps) * Math.PI * 2;

        const wobble1 = envelope * Math.sin(waveCount * angle + t * rotationSpeed * Math.PI * 2);
        const wobble2 = envelope * 0.45 * Math.sin(waveCount2 * angle - t * rotationSpeed2 * Math.PI * 2);

        const r = Math.max(0, baseRadius + wobble1 + wobble2);

        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        points.push(`${x.toFixed(1)}px ${y.toFixed(1)}px`);

    }

    return `polygon(${points.join(", ")})`;

}

/**
 * Builds an array of WAAPI keyframes { clipPath, offset } representing the
 * wave expanding from (cx, cy) out to endRadius over the full duration.
 */
export function buildWaveKeyframes(cx, cy, endRadius, frameCount = 48, opts = {}) {

    const keyframes = [];

    for (let f = 0; f <= frameCount; f++) {

        const t = f / frameCount;

        keyframes.push({
            clipPath: wavePolygonAt(cx, cy, t, endRadius, opts),
            offset: t
        });

    }

    return keyframes;

}