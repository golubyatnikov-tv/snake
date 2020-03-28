export type GameState = {
    fieldSize: [number, number];    
    objects: (SnakeObject | EatObject)[];
}

export type GameObject = {
    id: string;
    type: 'snake' | 'eat';
    cells: Array<[number,number]>;
}

export type SnakeObject = GameObject & {
    type: 'snake';
    direction: [number, number];
}

export type EatObject = GameObject & {
    type: 'eat'
}