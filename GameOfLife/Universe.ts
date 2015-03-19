module GameOfLife {

    export class Universe {

        public onPaused: Function;

        private matrix: Array<Array<SpaceTimeSector>>;
        private canvas: fabric.ICanvas;
        private evolutionHandle: number;
        private evolving: boolean;
        private ticker: GenerationTicker;
        private seedingInProgress: boolean;
                
        public constructor(canvas: fabric.ICanvas) {
            this.canvas = canvas;
            this.evolving = false;
            this.ticker = new GenerationTicker(canvas);
            this.seedingInProgress = false;    

            this.canvas.on('mouse:move', (e) => {
                if (this.seedingInProgress) {
                    var target: any = canvas.findTarget(<MouseEvent>(e.e), true);
                    this.seedSector(target);
                }
            });

            this.canvas.on('mouse:down', (e) => {
                this.seedingInProgress = true;
                this.seedSector(e.target);
            });

            this.canvas.on('mouse:up', (e) => {
                this.seedingInProgress = false;
                this.seedSector(e.target);
            });
        }

        private seedSector(target: any): void {
            if (target !== undefined) {
                if (target.sector !== undefined) {
                    if (target.sector instanceof SpaceTimeSector) {
                        var sector: SpaceTimeSector = <SpaceTimeSector>target.sector;
                        sector.giveBirth();
                        this.canvas.renderAll();
                    }
                }
            }
        }

        public isEvolving(): boolean {
            return this.evolving;
        }

        public explode(universeSizeConstant: number, sectorSizeConstant: number): void {
            var sectorCountPerDimension = universeSizeConstant / sectorSizeConstant;

            this.matrix = new Array<Array<SpaceTimeSector>>();
            if (sectorCountPerDimension > 0) {
                for (var r: number = 0; r < sectorCountPerDimension; r++) {
                    this.matrix.push(new Array<SpaceTimeSector>());

                    for (var c: number = 0; c < sectorCountPerDimension; c++) {
                        var spaceTimeBlock: SpaceTimeSector = new SpaceTimeSector(this, r, c);
                        this.matrix[r].push(spaceTimeBlock);
                        spaceTimeBlock.draw();
                    }
                }
            }

            this.ticker.reset();
            this.ticker.draw();
        }

        public implode(): void {
            this.pause();            
        }

        public pause(): void {
            if (this.evolving) {
                window.clearInterval(this.evolutionHandle);
                this.evolving = false;
                if (this.onPaused !== undefined) {
                    this.onPaused();
                }
            }
        }

        public evolve(): void {
            var rowCount: number = this.getRowCount();
            var columnCount: number = this.getColumnCount();
                        
            this.evolutionHandle = window.setInterval(() => {

                var changedSectors: Array<IEvaluatedSpaceTime> = new Array<IEvaluatedSpaceTime>();
                for (var r: number = 0; r < rowCount; r++) {
                    for (var c: number = 0; c < columnCount; c++) {
                        var sector: SpaceTimeSector = this.getSector(r, c);
                        var sustainability: LifeSustainability = sector.evaluateLifeSustainability();
                        if (sustainability != LifeSustainability.unchanged) {
                            var evaledSpaceTime: IEvaluatedSpaceTime = {
                                sector: sector,
                                sustainability: sustainability
                            }

                            changedSectors.push(evaledSpaceTime);
                        }
                    }
                }

                if (changedSectors.length > 0) {
                    for (var i: number = 0; i < changedSectors.length; i++) {
                        var evaluationResult: IEvaluatedSpaceTime = changedSectors[i];
                        if (evaluationResult.sustainability == LifeSustainability.birth) {
                            evaluationResult.sector.giveBirth();
                        }
                        else if (evaluationResult.sustainability == LifeSustainability.death) {
                            evaluationResult.sector.dieOff();
                        }
                    }

                    this.ticker.tick();
                    this.canvas.renderAll();
                }
                else {
                    this.pause();
                }
            }, 500);

            this.evolving = true;
        }

        public getCanvas(): fabric.ICanvas {
            return this.canvas;
        }

        public getSector(row: number, column: number): SpaceTimeSector {
            if (row >= this.matrix.length || row < 0) {
                return null;
            }
            else if (column < 0) {
                return null;
            }
            else if (this.matrix.length > 0) {
                if (column >= this.matrix[0].length) {
                    return null;
                }
            }

            return this.matrix[row][column];
        }

        private getColumnCount(): number {
            if (this.matrix.length > 0) {
                return this.matrix[0].length;
            }

            return 0;
        }

        private getRowCount(): number {
            return this.matrix.length;
        }        
    }
}