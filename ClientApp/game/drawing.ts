import { GameObject, FieldPoint, ObjectManager } from "./gameState";

export function createDrawer(context: CanvasRenderingContext2D, fieldSize: [number, number], images: { [key: string]: HTMLImageElement }) {    
    return {
        draw(objects: ReadonlyArray<GameObject>) {
            const width = fieldSize[0];
            const height = fieldSize[1];

            const bounds = context.canvas.parentElement.getBoundingClientRect();
            const cellSize = Math.min(bounds.width/width, bounds.height/height);            

            const canvasWidth = cellSize * width;
            if (Math.abs(context.canvas.width - canvasWidth) > 0.01) {
                context.canvas.width = canvasWidth;
                context.canvas.style.width = canvasWidth + 'px';
            }

            const canvasHeight = cellSize * height;
            if (Math.abs(context.canvas.height - canvasHeight) > 0.01) {
                context.canvas.height = canvasHeight;
                context.canvas.style.height = canvasHeight + 'px';
            }

            function drawField() {
                context.beginPath();
                for (let xi = 1; xi < width; xi++) {
                    context.moveTo(xi * cellSize, 0);
                    context.lineTo(xi * cellSize, canvasHeight);
                }

                for (let yi = 1; yi < height; yi++) {
                    context.moveTo(0, yi * cellSize);
                    context.lineTo(canvasWidth, yi * cellSize);
                }
                context.lineWidth = 0.5;
                context.strokeStyle = '#5050f0'
                context.stroke();
            }

            function drawCells(cells: ReadonlyArray<FieldPoint>, color?: string) {
                
            }

            function drawObject(o: GameObject) {
                if(o.type === 'eat' ){
                    o.cells.forEach(([xi, yi]) => {
                        context.drawImage(images['apple'], xi* cellSize, yi * cellSize, cellSize, cellSize);
                    });                    
                }
                else{
                    o.cells.forEach(([xi, yi]) => {                        
                        context.save()
                        if (o.color)
                            context.fillStyle = o.color;
                        context.fillRect(xi * cellSize, yi * cellSize, cellSize, cellSize);
                        context.restore()
                    })
                }
            }

            context.clearRect(0, 0, canvasWidth, canvasHeight)

            drawField();

            objects.forEach(o => {
                drawObject(o);
                //drawCells(o.cells, o.color)
            })

            //drawBoundaryMap()
        }
    }
}