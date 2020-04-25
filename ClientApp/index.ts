import { createDrawer } from "./drawing";
import { GameState, SnakeObject, GameObject } from "./gameState";
import { createKeyboardManager } from "./keyboard";
import { findObject } from "./utils";

// отрисовка
// модель игры (игровое состояние)
// обработка управления
// игровые алгоритмы (на клиенте, на сервере для многопользовательской игры)
// игровой цикл

const gameState: GameState = {
    fieldSize: [20, 20],
    objects: [{
        id: 'player1',
        type: 'snake',
        direction: [0, 0],
        cells: [
            [10, 10],
            [11, 10],
            [11, 11]
        ]
    }]
}


const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = 400
canvas.height = 400
canvas.style.border = '1px solid grey'
const context = canvas.getContext('2d')

const drawer = createDrawer(context, gameState.fieldSize)
const keyboard = createKeyboardManager()

function gameLoop() {
    // обработка ввода
    const keys = keyboard.getPressedKeys();

    if (keys.length)
        console.log(...keys);

    // логика игры
    keys.reverse()

    const snake = gameState.objects.find(o => o.type === 'snake');
    if (snake?.type === 'snake') {
        keys.some(key => {
            if (['ArrowUp', 'w', 'W'].includes(key)) {
                if(snake.direction[1] != 1)
                    snake.direction = [0, -1]
                return true;
            }
            if (['ArrowDown', 's', 'S'].includes(key)) {
                if(snake.direction[1] != -1)
                    snake.direction = [0, 1]
                return true;
            }
            if (['ArrowLeft', 'a', 'A'].includes(key)) {
                if(snake.direction[0] != 1)
                    snake.direction = [-1, 0]
                return true;
            }
            if (['ArrowRight', 'd', 'D'].includes(key)) {
                if(snake.direction[0] != -1)
                    snake.direction = [1, 0]
                return true;
            }
            return false;
        })
    }

    gameState.objects.slice().forEach(o => {
        if (o.type === 'snake' && (
            o.direction[0] != 0 || o.direction[1] != 0
        )) {
            const head = o.cells[0];
            const nextHead = [o.direction[0] + head[0], o.direction[1] + head[1]] as [number, number];

            if(nextHead[0] < 0 || nextHead[0] >= gameState.fieldSize[0]
                || nextHead[1] < 0 || nextHead[1] >= gameState.fieldSize[1]){
                    nextHead[0] = (nextHead[0]+gameState.fieldSize[0])%gameState.fieldSize[0];
                    nextHead[1] = (nextHead[1]+gameState.fieldSize[1])%gameState.fieldSize[1];
                }

            const nextHeadObject = findObject(gameState, nextHead);
            if(nextHeadObject?.type == 'eat'){
                o.cells.unshift(nextHead)
                const index = gameState.objects.indexOf(nextHeadObject as any)
                gameState.objects.splice(index, 1);
            }
            else if(nextHeadObject?.type == 'snake') {
                const index = gameState.objects.indexOf(o);
                gameState.objects.splice(index, 1);
            }
            else
            {
                o.cells.pop()
                o.cells.unshift(nextHead)
            }
        }
    })

    const existingEat = gameState.objects.find(o => o.type == 'eat')
    // если еды нет
    if(!existingEat) {
        const x = Math.round(Math.random() * gameState.fieldSize[0]);
        const y = Math.round(Math.random() * gameState.fieldSize[1]);

        gameState.objects.push({
            id: 'eat',
            type: 'eat',
            cells: [[x, y]]
        })
    }

    

    keyboard.clear()
    // отрисовка
    drawer.draw(gameState.objects)

    setTimeout(gameLoop, 200)
}
gameLoop()