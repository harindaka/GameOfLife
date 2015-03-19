module GameOfLife {
        
    export class SpaceTimeSector {

        private static dimensionSizeConstant: number = 10;
        private universe: Universe
        private row: number;
        private column: number;
        private canvas: fabric.ICanvas;
        private rect: fabric.IRect;
        private hasLife: boolean;
        private static aliveColor = 'red';
        private static emptyColor = '#FFFFCC';
        private static borderColor = 'red'; 
               
        public constructor(
            universe: Universe,            
            row: number,
            column: number            
            ) {

            this.universe = universe;
            this.row = row;
            this.column = column;
            this.canvas = universe.getCanvas();
            this.hasLife = false;            
        }
                     
        public draw(): void {
            var brush: fabric.IRectOptions = {};
            brush.borderColor = SpaceTimeSector.borderColor;
            brush.fill = SpaceTimeSector.emptyColor;
            brush.hasControls = false;
            brush.hasRotatingPoint = false;
            brush.hasBorders = true;
            brush.stroke = SpaceTimeSector.borderColor;
            brush.strokeWidth = 1;            
            brush.originX = 'left';
            brush.originY = 'top';
            brush.top = (this.row) * SpaceTimeSector.dimensionSizeConstant;
            brush.left = (this.column) * SpaceTimeSector.dimensionSizeConstant;
            brush.height = SpaceTimeSector.dimensionSizeConstant;
            brush.width = SpaceTimeSector.dimensionSizeConstant;            
            brush.lockMovementX = true;
            brush.lockMovementY = true;
            brush.lockRotation = true;
            brush.lockScalingX = true;
            brush.lockScalingY = true;
            brush.lockUniScaling = true;
            brush.selectable = false;
                        
            this.rect = new fabric.Rect(brush);

            var canvasObject: any = this.rect;
            canvasObject.sector = this;

            this.canvas.add(canvasObject);
        }

        public giveBirth(): void {
            this.hasLife = true;
            this.rect.fill = SpaceTimeSector.aliveColor;                        
        }

        public dieOff(): void {
            this.hasLife = false;
            this.rect.fill = SpaceTimeSector.emptyColor;
        }

        public evaluateLifeSustainability(): LifeSustainability {
            var neighbours: Array<SpaceTimeSector> = new Array<SpaceTimeSector>();

            neighbours.push(this.universe.getSector(this.row - 1, this.column));
            neighbours.push(this.universe.getSector(this.row - 1, this.column + 1));
            neighbours.push(this.universe.getSector(this.row, this.column + 1));
            neighbours.push(this.universe.getSector(this.row + 1, this.column + 1));
            neighbours.push(this.universe.getSector(this.row + 1, this.column));
            neighbours.push(this.universe.getSector(this.row + 1, this.column - 1));
            neighbours.push(this.universe.getSector(this.row, this.column - 1));
            neighbours.push(this.universe.getSector(this.row - 1, this.column - 1));

            var liveNeighbourCount: number = 0;
            for (var i: number = 0; i < neighbours.length; i++) {
                if (neighbours[i] != null && neighbours[i].hasLife) {
                    liveNeighbourCount += 1;
                }
            }

            if (!this.hasLife && liveNeighbourCount == 3) {
                return LifeSustainability.birth;
            }
            else if (this.hasLife && (liveNeighbourCount == 2 || liveNeighbourCount == 3)) {
                return LifeSustainability.unchanged;
            }
            else if (!this.hasLife) {
                return LifeSustainability.unchanged;
            }
            else {
                return LifeSustainability.death;
            }
        }    
    }
}