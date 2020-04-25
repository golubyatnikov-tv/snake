import { GameState, GameObject, Cell } from "./gameState";

export function findObject(gameState: GameState, cell: Cell): GameObject {
    // gameState.objects

    return gameState.objects.find(o=>o.cells.some(c=>cellEquals(c, cell)))
    
    /*for (let i=0; i<gameState.objects.length; i++){
        const o = gameState.objects[i];        
        for (let j=0; j<o.cells.length; j++){
            const c = o.cells[j];
            if(cell[0]==c[0] && cell[1]==c[1]){
                return o
            }
        }
    }*/
}

export function cellEquals(c1: Cell, c2: Cell){
    return c1[0]==c2[0] && c1[1]==c2[1];
}