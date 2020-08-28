import * as PIXI from 'pixi.js';
import { TPixiData, TOriginParam } from './core';

/**
 * @ignore
 */
declare const window: any;

/**
 * @see http://pixijs.download/release/docs/PIXI.Graphics.html
 * @private
 */
export declare class PixiGraphics extends PIXI.Graphics {
	private _createjs: CreatejsGraphics | null;
	constructor(cjs: CreatejsGraphics | null) ;
	get createjs(): CreatejsGraphics | null;
}

/**
 * @private
 */
type TGraphicsPixiData = TPixiData & { instance: PixiGraphics, strokeFill: number, strokeAlpha: number };

/**
 * @see https://createjs.com/docs/easeljs/classes/Graphics.html
 */
export declare class CreatejsGraphics extends window.createjs.Graphics {
	private _originParams: TOriginParam;
	private _pixiData: TGraphicsPixiData;
	get pixi(): PixiGraphics;
	updateForPixi(): boolean;
}