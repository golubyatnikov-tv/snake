import { GameObject } from "./gameState";

export function createDrawer(context: CanvasRenderingContext2D, fieldSize: [number, number]) {
    const width = fieldSize[0];
    const height = fieldSize[1];

    const cellWidth = context.canvas.width / width;
    const cellHeight = context.canvas.height / height;

    const canvasHeight = context.canvas.height;
    const canvasWidth = context.canvas.width;

    function drawField() {
        context.beginPath();
        for (let xi = 1; xi < width; xi++) {            
            context.moveTo(xi * cellWidth, 0);
            context.lineTo(xi * cellWidth, canvasHeight);
        }

        for (let yi = 1; yi < height; yi++) {            
            context.moveTo(0, yi * cellHeight);
            context.lineTo(canvasWidth, yi * cellHeight);                        
        }
        context.lineWidth = 0.5;
        context.strokeStyle = '#5050f0'
        context.stroke();
    }

    function drawCells(cells: [number, number][]) {
        cells.forEach(c=>{
            const xi = c[0];
            const yi = c[1];            

            context.fillRect(xi*cellWidth, yi*cellHeight, cellWidth, cellHeight);
        })
    }

    return {
        draw(objects: GameObject[]) {
            context.clearRect(0, 0, canvasWidth, canvasHeight)

            drawField();

            objects.forEach(o=>{
                context.save();
                if(o.type == 'eat')
                {
                    const r = Math.random() * 255;
                    const g = Math.random() * 255;
                    const b = Math.random() * 255;
                    context.fillStyle = `rgb(${r},${g},${b})`;
                }
                drawCells(o.cells)
                context.restore();
            })            
        }
    }
}