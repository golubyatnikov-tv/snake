import { createDrawer } from "./drawing";
import { GameState, createObjectManager, FieldPoint } from "./gameState";
import { createInputManager } from "./input";
import { ChangeDirectionProcessor, EndMoveProcessor, EatGeneratorProcessor, EatingProcessor, FieldBoundaryProcessor, DieProcessor, SpeedUpProcessor, MoveHeadProcessor } from "./processors";
import { Player } from "./players";

export type GameSettings = {
    fieldSize: FieldPoint;
    players: Player[];
    lives: number;
    gameMode: 'classic' | 'experimental'
} & GameEvents;

export type GameEvents = {
    onGameEnd?: () => void;
    onPlayerChange?: (p: Player, info: {
        lives: number;
        score: number;
    }) => void;
}

const playerColors = [    
    '#2B580C',
    '#639A67',
    '#D8EBB5',
    '#c0ffb3'
]

export function createGame(config: {
    canvas: HTMLCanvasElement;
} & GameSettings) {
    const gameState: GameState = {
        fps: 4,
        fieldSize: config.fieldSize,
        objects: config.players.map((p, i)=>{
            const dx = config.players.length > 1 ? 
                (i%2 == 0 ? -1:1)*(Math.trunc(i/2)+1)*2 : 0;
            return {            
                id: p.id,
                direction: null,
                directions: [],
                //direction: [0,-1],
                cells: [[config.fieldSize[0]/2 - dx, config.fieldSize[1]/2]],
                type: 'snake',
                lives: config.lives,
                score: 0,
                color: playerColors[i]
            }
        })
    }
    
    const appleImage = new Image();
    appleImage.src = '/images/apple.png';
    const images = {
        'apple': appleImage
    }
    const context = config.canvas.getContext('2d')    
    const input = createInputManager()
    const object = createObjectManager(gameState)
    const drawer = createDrawer(context, gameState.fieldSize, images)
    const processors = [];    
    processors.push(EatGeneratorProcessor);
    processors.push(SpeedUpProcessor);
    processors.push(ChangeDirectionProcessor);
    processors.push(MoveHeadProcessor);
    processors.push(EatingProcessor);
    processors.push(EndMoveProcessor);    
    processors.push(DieProcessor);    

    let timeoutHandle: number = null;

    let startTime = Date.now();
    let prevTime = null;

    function gameLoop() {
        const frameTime = Date.now();
        const gameTime = {
            totalTime: frameTime - startTime,
            elapsedTime: prevTime ? frameTime - prevTime : 0            
        };
        processors.forEach(p => p(gameState, {
            gameTime,
            input,
            object,
            players: config.players,
            gameMode: config.gameMode,
            events: {
                onPlayerChange: config.onPlayerChange,
                onGameEnd: config.onGameEnd
            }
        }))

        input.reset()
        // отрисовка        
        drawer.draw(gameState.objects)        
        
        const maxFps = 15;
        const minFps = 2;
        const minTime = 120000;
        const fps = Math.min((maxFps - minFps) * gameTime.totalTime / minTime + minFps, maxFps);
        const frameInterval = 1000/fps;
        timeoutHandle = setTimeout(gameLoop, frameInterval)
        prevTime = frameTime;
    }
    gameLoop()

    return {
        dispose(){
            input.dispose();
            clearTimeout(timeoutHandle);
        }
    }
}