/**
 * 
 * @param value the value to clamp
 * @param min the min bound
 * @param max the max bound
 * @returns the value clamped between min and max
 */
export function clamp(value: number, min: number, max: number) {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    } else {
        return value;
    }
}