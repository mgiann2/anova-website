const jsstats = require('js-stats');

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

export interface StateProps {
    data;
    update;
}

export interface OneWayTreatment {
    level: string;
    amount: number;
}

export interface OneWayObservation {
    level: string;
    value: number;
}

export interface TwoWayTreatment {
    levelA: string;
    levelB: string;
    amount: number;
}

export interface TwoWayObservation {
    levelA: string;
    levelB: string;
    value: number;
}

export interface OneWayAnova {
    dfA: number;
    dfE: number;
    SSA: number;
    SSE: number;
}

export interface TwoWayAnova {
    dfA: number;
    dfB: number;
    dfAB: number;
    dfE: number;
    SSA: number;
    SSB: number;
    SSAB: number;
    SSE: number;
}

export function pf(q: number, df1: number, df2: number) {
    let fdist = new jsstats.FDistribution(df1, df2);
    return 1 - fdist.cumulativeProbability(q);
}