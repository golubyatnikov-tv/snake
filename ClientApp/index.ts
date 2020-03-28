import { createDrawer } from "./drawing";
import { GameState, SnakeObject } from "./gameState";
import { createKeyboardManager } from "./keyboard";

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

    gameState.objects.forEach(o => {
        if (o.type === 'snake' && (
            o.direction[0] != 0 || o.direction[1] != 0
        )) {
            const head = o.cells[0];
            o.cells.pop()
            o.cells.unshift([o.direction[0] + head[0], o.direction[1] + head[1]])
        }
    })

    keyboard.clear()
    // отрисовка
    drawer.draw(gameState.objects)

    setTimeout(gameLoop, 200)
}
gameLoop()