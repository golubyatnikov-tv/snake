import { FieldPoint } from "./gameState";

export function move(position: FieldPoint, directionVector: FieldPoint): FieldPoint {
    return [position[0] + directionVector[0], position[1] + directionVector[1]];
}

export function samePoints(p0: FieldPoint, ...otherPoints: FieldPoint[]) {    
    return otherPoints.every(p=>p[0] === p0[0] && p[1] === p0[1])
}