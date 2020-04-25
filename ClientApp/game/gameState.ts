export type GameState = {
    fps: number;
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
    color?: string;
}

type WritableObject = Omit<GameObject, 'cells'> & {
    cells: FieldPoint[];
}

export type SnakeObject = GameObject & {
    type: 'snake';
    direction: FieldPoint;    
    lives: number;
    skipMove?: boolean;
    score: 0;
}

export type EatObject = GameObject & {
    type: 'eat';
    modifier?: {
        name: 'life' | 'decrease';        
    }
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
    type CellChildren = {
        [id: string]: GameObject
    }    
    const boundaryMap = {} as {[p: string]: CellChildren};
    for(let c = -1; c <= gameState.fieldSize[0]; c++) {                
        for(let r = -1; r <= gameState.fieldSize[1]; r++){
            boundaryMap[`${c}_${r}`] = {};
        }
    }    

    gameState.objects.forEach(o=>{        
        o.cells.forEach(c=>boundaryMap[`${c[0]}_${c[1]}`][o.id] = o)
    })        
    
    return {
        nextId() {
            return (++id).toString();
        },

        replaceCells(object: GameObject, cells: FieldPoint[]){
            const writable = object as WritableObject;        
            object.cells.forEach(c=>delete boundaryMap[`${c[0]}_${c[1]}`][object.id])
            writable.cells = cells;
            object.cells.forEach(c=>{                
                boundaryMap[`${c[0]}_${c[1]}`][object.id] = object
            })
        },

        addObject(object: AnyObject) {            
            writableGameState.objects.push(object)                                  
            object.cells.forEach(c=>boundaryMap[`${c[0]}_${c[1]}`][object.id] = object)
        },

        removeObject(object: AnyObject){
            const index = gameState.objects.indexOf(object);
            writableGameState.objects.splice(index, 1);            
            object.cells.forEach(c=>delete boundaryMap[`${c[0]}_${c[1]}`][object.id])
        },

        getCellChildren(p: FieldPoint) {
            return boundaryMap[`${p[0]}_${p[1]}`];
        },

        getRandomFreeCell(): FieldPoint {
            while (true) {
                const c: FieldPoint = [Math.trunc(Math.random() * gameState.fieldSize[0]), Math.trunc(Math.random() * gameState.fieldSize[1])];
                if (Object.keys(this.getCellChildren(c)).length)
                    continue;
                return c;
            }
        },

        boundaryMap
    }
}

export type ObjectManager = ReturnType<typeof createObjectManager>;