module GameOfLife {

    export class Singularity {

        private universe: Universe;
        private canvas: fabric.ICanvas;
        private btnBigBang: HTMLButtonElement;
        private btnEvolve: HTMLButtonElement;
        private btnBigCrunch: HTMLButtonElement;
        private singularityRect: fabric.IRect;
        private singularityX: number;
        private singularityY: number;
        private static singularitySizeConstant: number = 20;
        private static universeSizeConstant: number = 300;
        private static sectorSizeConstant: number = 10;
        private static fillColor = '#FFFFCC';
        private static borderColor = 'red';
       
        public constructor() {
            var canvasElement: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas-universe');

            var canvasOptions: any = {};
            canvasOptions.renderOnAddRemove = false;

            this.canvas = new fabric.Canvas(canvasElement, canvasOptions);
            this.canvas.setWidth(310);
            this.canvas.setHeight(350);
            this.canvas.hoverCursor = 'pointer';
            this.canvas.defaultCursor = 'pointer';
            this.canvas.selectionLineWidth = 0;
            this.canvas.selection = false;

            this.btnBigBang = <HTMLButtonElement>document.getElementById('button-bigbang');
            this.btnBigBang.onclick = (e: MouseEvent) => this.bigBang();

            this.btnBigCrunch = <HTMLButtonElement>document.getElementById('button-bigcrunch');
            this.btnBigCrunch.onclick = (e: MouseEvent) => this.bigCrunch();

            this.btnEvolve = <HTMLButtonElement>document.getElementById('button-evolve');
            this.btnEvolve.onclick = (e: MouseEvent) => this.evolve(e);

            this.universe = new GameOfLife.Universe(this.canvas);
            this.universe.onPaused = () => this.btnEvolve.innerHTML = 'Evolve';
        }

        public draw(): void {
            this.singularityRect = new fabric.Rect(Singularity.createBrush());
            this.canvas.add(this.singularityRect);
            this.singularityRect.center();
            this.singularityRect.setCoords();

            this.singularityX = this.singularityRect.left;
            this.singularityY = this.singularityRect.top;

            this.singularityRect.on('mousedown', (e) => {
                this.bigBang();                
            });

            this.canvas.renderAll(); 
        }

        private static createBrush(): fabric.IRectOptions {
            var brush: fabric.IRectOptions = {};
            brush.borderColor = Singularity.borderColor;
            brush.fill = Singularity.fillColor;
            brush.hasControls = false;
            brush.hasRotatingPoint = false;
            brush.hasBorders = true;
            brush.stroke = Singularity.borderColor;
            brush.strokeWidth = 1;
            brush.originX = 'left';
            brush.originY = 'top';
            brush.height = Singularity.singularitySizeConstant;
            brush.width = Singularity.singularitySizeConstant;
            brush.lockMovementX = true;
            brush.lockMovementY = true;
            brush.lockRotation = true;
            brush.lockScalingX = true;
            brush.lockScalingY = true;
            brush.lockUniScaling = true;
            brush.selectable = false;

            return brush;
        }

        private bigBang(): void {            
            this.btnBigBang.disabled = true;

            var rectObject: any = this.singularityRect;
            rectObject.animate({ width: Singularity.universeSizeConstant, height: Singularity.universeSizeConstant, left: 0, top: 0 }, {
                duration: 1000,
                onChange: () => {
                    this.canvas.renderAll();
                },
                onComplete: () => {                                        
                    this.universe.explode(Singularity.universeSizeConstant, Singularity.sectorSizeConstant);

                    this.canvas.remove(this.singularityRect);
                    this.canvas.renderAll();

                    this.btnEvolve.disabled = false;
                    this.btnBigCrunch.disabled = false;
                }
            });            
        }

        private bigCrunch(): void {
            this.btnBigCrunch.disabled = true;
            this.btnEvolve.disabled = true;
            this.btnEvolve.innerHTML = 'Evolve';

            var singularityBrush: fabric.IRectOptions = Singularity.createBrush();
            singularityBrush.left = 0;
            singularityBrush.top = 0;
            singularityBrush.width = Singularity.universeSizeConstant;
            singularityBrush.height = Singularity.universeSizeConstant;

            var rectObject: any = new fabric.Rect(singularityBrush);
                                    
            this.universe.implode();
            this.canvas.clear();
                        
            this.canvas.add(rectObject);
            this.canvas.renderAll();

            rectObject.animate({ width: Singularity.singularitySizeConstant, height: Singularity.singularitySizeConstant, left: this.singularityX, top: this.singularityY }, {
                duration: 1000,
                onChange: () => {
                    this.canvas.renderAll();
                },
                onComplete: () => {
                    this.btnBigBang.disabled = false;
                    this.canvas.remove(rectObject);
                    this.draw();
                }
            });            
        }

        private evolve(e: MouseEvent): void {
            var btnEvolve: HTMLButtonElement = <HTMLButtonElement>e.target;
            if (this.universe.isEvolving()) {
                this.universe.pause();
                btnEvolve.innerHTML = 'Evolve';
            }
            else {
                this.universe.evolve();
                btnEvolve.innerHTML = 'Pause';
            }
        }
    }
}