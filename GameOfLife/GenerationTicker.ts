module GameOfLife {

    export class GenerationTicker {

        private canvas: fabric.ICanvas;
        private generation: number;
        private generationText: fabric.IText;

        public constructor(canvas: fabric.ICanvas) {
            this.canvas = canvas;
            this.reset();   
        }

        public draw(): void {
            var textOptions: fabric.ITextOptions = {};
            textOptions.fontFamily = 'Arial';
            textOptions.fontSize = 14;
            textOptions.fontStyle = 'normal';
            textOptions.originX = 'left';
            textOptions.originY = 'top';
            textOptions.top = 310;
            textOptions.selectable = false;
            textOptions.lockScalingX = true;
            textOptions.lockMovementY = true;
            textOptions.lockRotation = true;
            textOptions.lockScalingX = true;
            textOptions.lockScalingY = true;
            textOptions.lockUniScaling = true;

            this.generationText = new fabric.Text('Seed to begin...', textOptions);
            this.canvas.add(this.generationText);
            this.generationText.centerH();            
            this.canvas.renderAll();
        }

        public tick(): void {
            this.generation += 1;
            this.generationText.text = 'Generation: ' + this.generation.toString();
            this.generationText.centerH(); 
        }

        public reset() {
            this.generation = 0;
        }
    }
}