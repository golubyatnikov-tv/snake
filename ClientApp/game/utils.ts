import { FieldPoint } from "./gameState";

export function move(position: FieldPoint, directionVector: FieldPoint): FieldPoint {
    return [position[0] + directionVector[0], position[1] + directionVector[1]];
}

export function isOutOfField(p: FieldPoint, fieldSize: FieldPoint) {
    return p[0] < 0 || p[1] < 0
    || p[0] >= fieldSize[0]
    || p[1] >= fieldSize[1]
}

export function samePoints(p0: FieldPoint, ...otherPoints: FieldPoint[]) {    
    return otherPoints.every(p=>p[0] === p0[0] && p[1] === p0[1])
}

export function splitFlags(enumObject: {}, value: number) {
    const result: number[] = [];
    Object.entries(enumObject).forEach(([k, v])=>{
        const val = v as number;
        if(value & val) {
            result.push(val);
        }
    })
    return result;    
}