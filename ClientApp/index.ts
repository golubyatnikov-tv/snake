import { createDrawer } from "./drawing";
import { GameState, SnakeObject, createObjectManager } from "./gameState";
import { createInputManager } from "./input";
import { ChangeDirectionProcessor, MoveProcessor, EatGeneratorProcessor, EatingProcessor, FieldBoundaryProcessor } from "./processors";

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

const input = createInputManager()
const object = createObjectManager(gameState)
const drawer = createDrawer(context, gameState.fieldSize, object)
const processors = [
    ChangeDirectionProcessor,            
    EatingProcessor,
    FieldBoundaryProcessor,
    MoveProcessor,
    EatGeneratorProcessor,
]

function gameLoop() {
    processors.forEach(p=>p(gameState, {
        input,
        object
    }))

    input.reset()
    // отрисовка
    drawer.draw(gameState.objects)

    setTimeout(gameLoop, 100)
}
gameLoop()