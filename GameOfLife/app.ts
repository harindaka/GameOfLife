/// <reference path="Singularity.ts" />
/// <reference path="Universe.ts" />
/// <reference path="SpaceTimeSector.ts" />
/// <reference path="LifeSustainability.ts" />
/// <reference path="IEvaluatedSpaceTime.ts" />
/// <reference path="GenerationTicker.ts" />
/// <reference path="Scripts/typings/fabricjs/fabricjs.d.ts" />

window.onload = () => {

    //In the begining....
    var singularity: GameOfLife.Singularity = new GameOfLife.Singularity(); 
    singularity.draw();   
};

