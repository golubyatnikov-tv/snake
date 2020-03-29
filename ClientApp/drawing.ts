import { GameObject, FieldPoint, ObjectManager } from "./gameState";

export function createDrawer(context: CanvasRenderingContext2D, fieldSize: [number, number], object: ObjectManager) {
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

    function drawCells(cells: ReadonlyArray<FieldPoint>, color?: string) {
        cells.forEach(c=>{
            const xi = c[0];
            const yi = c[1];
            context.save()
            if(color)
                context.fillStyle = color;
            context.fillRect(xi*cellWidth, yi*cellHeight, cellWidth, cellHeight);
            context.restore()
        })
    }

    function drawBoundaryMap() {
        context.save()
        context.translate(cellWidth/2, cellHeight/2)
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.globalCompositeOperation = 'xor'
        object.boundaryMap.forEach((col, ci)=>{
            col.forEach((row, ri)=>{
                const v = object.boundaryMap[ci][ri];                
                context.fillText(v, ci*cellWidth, ri*cellHeight)
            })
        })
        context.restore()
    }

    return {
        draw(objects: ReadonlyArray<GameObject>) {
            context.clearRect(0, 0, canvasWidth, canvasHeight)

            drawField();

            objects.forEach(o=>{                
                drawCells(o.cells, o.type === 'eat' && 'yellow')
            })

            drawBoundaryMap()
        }
    }
}