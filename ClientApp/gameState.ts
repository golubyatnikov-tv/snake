export type GameState = {
    fieldSize: [number, number];    
    readonly objects: readonly AnyObject[];
}

type WritableGameState = Omit<GameState, 'objects'> & {
    objects: AnyObject[];
}

export type GameObject = {
    id: string;
    type: 'snake' | 'eat';
    readonly cells: readonly FieldPoint[];
}

type WritableObject = Omit<GameObject, 'cells'> & {
    cells: FieldPoint[];
}

export type SnakeObject = GameObject & {
    type: 'snake';
    direction: FieldPoint;
    skipMove?: boolean;
}

export type EatObject = GameObject & {
    type: 'eat'
}

export type AnyObject = EatObject | SnakeObject;

export type FieldPoint = [number, number];

export enum GameObjectType {
    snake = 1,
    eat = 2
}

export function createObjectManager(gameState: GameState) {
    const writableGameState = gameState as WritableGameState;
    let id = 0;
    const boundaryMap = new Array(gameState.fieldSize[0])
        .fill(null)
        .map(a=>new Array(gameState.fieldSize[1]).fill(0));

    gameState.objects.forEach(o=>{
        const mark = GameObjectType[o.type];
        o.cells.forEach(c=>boundaryMap[c[0]][c[1]] |= mark)
    })        
    
    return {
        nextId() {
            return (++id).toString();
        },

        replaceCells(object: GameObject, cells: FieldPoint[]){
            const writable = object as WritableObject;
            const mark = GameObjectType[object.type];
            object.cells.forEach(c=>boundaryMap[c[0]][c[1]] ^= mark)
            writable.cells = cells;
            object.cells.forEach(c=>boundaryMap[c[0]][c[1]] |= mark)
        },

        addObject(object: AnyObject) {            
            writableGameState.objects.push(object)
            const mark = GameObjectType[object.type];                        
            object.cells.forEach(c=>boundaryMap[c[0]][c[1]] |= mark)
        },

        removeObject(object: AnyObject){
            const index = gameState.objects.indexOf(object);
            writableGameState.objects.splice(index, 1);
            const mark = GameObjectType[object.type];                      
            object.cells.forEach(c=>boundaryMap[c[0]][c[1]] ^= mark)
        },

        checkCell(p: FieldPoint) {
            return boundaryMap[p[0]][p[1]];
        },

        boundaryMap
    }
}

export type ObjectManager = ReturnType<typeof createObjectManager>;