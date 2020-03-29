import { GameState, ObjectManager, FieldPoint, GameObjectType } from "./gameState";
import { InputManager } from "./input";
import { move, samePoints } from "./utils";

export type Processor = {
    (gameState: GameState, managers: {
        input: InputManager;
        object: ObjectManager;
    })
}

export const ChangeDirectionProcessor: Processor = (gameState, { input }) => {
    const keys = input.getPressedKeys();

    if (keys.length)
        console.log(...keys);

    keys.reverse()

    const snake = gameState.objects.find(o => o.type === 'snake');
    if (snake?.type === 'snake') {
        keys.some(key => {
            if (['ArrowUp', 'w', 'W'].includes(key)) {
                if (snake.direction[1] != 1)
                    snake.direction = [0, -1]
                return true;
            }
            if (['ArrowDown', 's', 'S'].includes(key)) {
                if (snake.direction[1] != -1)
                    snake.direction = [0, 1]
                return true;
            }
            if (['ArrowLeft', 'a', 'A'].includes(key)) {
                if (snake.direction[0] != 1)
                    snake.direction = [-1, 0]
                return true;
            }
            if (['ArrowRight', 'd', 'D'].includes(key)) {
                if (snake.direction[0] != -1)
                    snake.direction = [1, 0]
                return true;
            }
            return false;
        })
    }
}

export const MoveProcessor: Processor = (gameState, { object }) => {
    gameState.objects.forEach(o => {
        if (o.type === 'snake') {
            if ((
                o.direction[0] != 0 || o.direction[1] != 0
            ) && !o.skipMove) {
                const cells = o.cells.slice();
                const head = cells[0];
                cells.pop()
                const nextHead: FieldPoint = [o.direction[0] + head[0], o.direction[1] + head[1]];
                if (object.checkCell(nextHead) & GameObjectType[o.type]) {
                    object.removeObject(o);
                }
                else {
                    cells.unshift(nextHead)
                    object.replaceCells(o, cells);
                }
            }
            o.skipMove = false;
        }
    })
}

export const EatGeneratorProcessor: Processor = (gameState, { object }) => {
    const snakes = gameState.objects.filter(o => o.type === 'snake');
    const eats = gameState.objects.filter(o => o.type === 'eat');
    if (eats.length < snakes.length) {
        const c: FieldPoint = [Math.trunc(Math.random() * gameState.fieldSize[0]), Math.trunc(Math.random() * gameState.fieldSize[1])];
        object.addObject({
            type: 'eat',
            id: 'eat' + object.nextId(),
            cells: [c]
        })
    }
}

export const EatingProcessor: Processor = (gameState, { object }) => {
    const eats = gameState.objects.filter(o => o.type === 'eat')
    gameState.objects.forEach(o => {
        if (o.type === 'snake') {
            const nextHead = move(o.cells[0], o.direction);
            const eat = eats.find(e => samePoints(e.cells[0], nextHead))
            if (eat) {
                //o.direction = [0,0];
                o.skipMove = true;
                object.replaceCells(o, [eat.cells[0], ...o.cells])
                object.removeObject(eat)
            }
        }
    });
}

export const FieldBoundaryProcessor: Processor = (gameState, { object }) => {
    gameState.objects.forEach(o => {
        if (o.type === 'snake') {
            const nextHead = move(o.cells[0], o.direction);
            if (nextHead[0] < 0 || nextHead[0] >= gameState.fieldSize[0]
                || nextHead[1] < 0 || nextHead[1] >= gameState.fieldSize[1]) {
                object.removeObject(o)
            }
        }
    })
}