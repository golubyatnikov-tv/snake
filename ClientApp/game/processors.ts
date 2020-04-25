import { GameState, ObjectManager, FieldPoint, GameObjectType, EatObject, SnakeObject } from "./gameState";
import { InputManager } from "./input";
import { move, samePoints, isOutOfField, splitFlags } from "./utils";
import { Player, Controller } from "./players";
import { GameEvents } from ".";

export type Processor = {
    (gameState: GameState, managers: {
        input: InputManager;
        object: ObjectManager;
        players: Player[];
        events: GameEvents;
        gameTime: GameTime;
        gameMode: 'classic' | 'experimental'
    })
}

export type GameTime = {
    totalTime: number;
    elapsedTime: number;
}

const directionsByKeys = {
    ArrowUp: [0, -1],
    KeyW: [0, -1],
    ArrowDown: [0, 1],
    KeyS: [0, 1],
    ArrowLeft: [-1, 0],
    KeyA: [-1, 0],
    ArrowRight: [1, 0],
    KeyD: [1, 0]
}

const controllerKeys = {
    [Controller.wasd]: ['KeyW', 'KeyD', 'KeyS', 'KeyA'],
    [Controller.arrows]: ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']
}

export const ChangeDirectionProcessor: Processor = (gameState, { input, players }) => {
    const keys = input.getPressedKeys();

    keys.reverse()

    const snakes = gameState.objects.filter(o => o.type === 'snake');
    snakes.forEach(s => {
        if (s.type === 'snake') {
            const player = players.find(p => p.id === s.id);
            if (player) {
                let directions: FieldPoint[] = [];
                if (player.controller & Controller.wasd
                    || player.controller & Controller.arrows) {
                    const controllers = splitFlags(Controller, player.controller);
                    const playerKeys: string[] = [];
                    controllers.forEach(c => {
                        playerKeys.push(...controllerKeys[c])
                    })
                    const keyIndex = keys.findIndex(key => playerKeys.includes(key));
                    if (keyIndex >= 0) {
                        const key = keys[keyIndex];
                        keys.splice(keyIndex, 1);
                        directions.push(directionsByKeys[key]);
                    }
                }
                if (player.controller & Controller.gamepad1
                    || player.controller & Controller.gamepad2) {
                    const gamepadIndex = player.controller === Controller.gamepad1 ? 0 : 1;
                    const gp = navigator.getGamepads()[gamepadIndex];
                    let dx = gp.axes[0];
                    let dy = gp.axes[1];
                    if (Math.abs(dx - dy) >= 0.01) {
                        if (Math.abs(dx) > Math.abs(dy))
                            dy = 0;
                        else if (Math.abs(dy) > Math.abs(dx))
                            dx = 0;
                        directions.push([dx > 0 ? 1 : (dx < 0 ? -1 : 0), dy > 0 ? 1 : (dy < 0 ? -1 : 0)]);
                    }
                }

                if (directions.length) {
                    const nextDirection = directions[0];
                    if (nextDirection) {
                        if (s.direction) {
                            if ((s.direction && nextDirection[0] != -s.direction[0])
                                || (s.direction && nextDirection[1] && nextDirection[1] != -s.direction[1]))
                                s.direction = nextDirection;
                        }
                        else {
                            s.direction = nextDirection;
                        }
                    }
                }
            }
        }
    })

    /*const snake = gameState.objects.find(o => o.type === 'snake');
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
    }*/
}

export const MoveHeadProcessor: Processor = (gameState, { object }) => {
    gameState.objects.forEach(o => {
        if (o.type === 'snake') {
            if (o.direction) {
                const cells = o.cells.slice();
                cells.unshift(move(cells[0], o.direction))
                object.replaceCells(o, cells);
            }
        }
    })
}

export const EndMoveProcessor: Processor = (gameState, { object }) => {
    gameState.objects.forEach(o => {
        if (o.type === 'snake') {
            if (!o.skipMove) {
                if (o.direction) {
                    const cells = o.cells.slice();
                    cells.pop()
                    object.replaceCells(o, cells);
                }
            }
            o.skipMove = false;
        }
    })
}

const modifiers = {
    life: 1,
    decrease: 1,
    fps: 1
}

const modifierChance = 0.5;

export const EatGeneratorProcessor: Processor = (gameState, { object, gameMode }) => {
    const snakes = gameState.objects.filter(o => o.type === 'snake');
    const eats = gameState.objects.filter(o => o.type !== 'snake');
    if (eats.length < snakes.length * 2) {
        const c: FieldPoint = object.getRandomFreeCell()
        let modifier = null;
        if(gameMode === 'experimental' && Math.random() < modifierChance) {            
            const allModifiers = Object.entries(modifiers);
            //const totalFactor = allModifiers.reduce((a,[key, value])=>a + value,0);
            const index = Math.trunc(Math.random() * allModifiers.length);
            const key = allModifiers[index][0]
            modifier = {
                name: key
            }
        }
        object.addObject({
            type: 'eat',
            id: 'eat' + object.nextId(),
            cells: [c],
            color: 'yellow',
            modifier
        })
    }
}

export const EatingProcessor: Processor = (gameState, {
    object,
    events,
    players
}) => {
    //const eats = gameState.objects.filter(o => o.type === 'eat')
    gameState.objects.forEach(o => {
        if (o.type === 'snake') {
            const eat = Object.entries(object.getCellChildren(o.cells[0]) || {}).find(([id, obj]) => obj.type === 'eat')?.[1] as EatObject;
            if (eat) {
                //o.direction = [0,0];                
                o.skipMove = true;
                o.score += 10;

                if (eat.modifier) {
                    if (eat.modifier.name === 'life') {
                        o.lives += 1;
                        o.score += 40
                    }
                    else if(eat.modifier.name === 'decrease'){
                        o.score += 20                    
                        const cells = o.cells.slice();                                                
                        const r = Math.trunc(Math.random() * 10);
                        cells.splice(Math.max(cells.length-r,1), r);                            
                        object.replaceCells(o, cells);                        
                    }
                }

                events.onPlayerChange(players.find(p => p.id === o.id), o);
                object.removeObject(eat)
                //object.replaceCells(o, [eat.cells[0], ...o.cells])
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
                o.lives--;
                object.replaceCells(o, [[10, 10]])
            }
        }
    })
}

export const DieProcessor: Processor = (gameState, {
    object,
    events,
    players
}) => {
    const diedSnakes: SnakeObject[] = [];

    gameState.objects.forEach(o => {
        if (o.type === 'snake') {
            if (o.cells.some((c, i) => i && samePoints(c, o.cells[0]))
                || isOutOfField(o.cells[0], gameState.fieldSize)
                || Object.entries(object.getCellChildren(o.cells[0]))
                    .filter(([id]) => id !== o.id)
                    .some(([id, obj]) => obj.type !== 'eat')) {
                diedSnakes.push(o)
            }
        }
    })

    diedSnakes.forEach(o => {
        o.lives--;
        events.onPlayerChange(players.find(p => p.id === o.id), o);
        if (o.lives === 0)
            object.removeObject(o);
        else {
            object.replaceCells(o, [object.getRandomFreeCell()])
            o.direction = [0, 0];
        }
    });

    if (!gameState.objects.map(o => o.type).includes('snake'))
        events.onGameEnd();
}

export const SpeedUpProcessor: Processor = (gameState, {
    gameTime
}) => {
    const maxFps = 15;
    const minFps = 7;
    const minTime = 180000;
    
    const fps = Math.min((maxFps - minFps) * gameTime.totalTime / minTime + minFps, maxFps);
    //const seconds = Math.trunc(gameTime.totalTime/10000);            
    gameState.fps = fps;
}