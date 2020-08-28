import * as PIXI from 'pixi.js';
import { TPixiData, TOriginParam } from './core';

/**
 * @ignore
 */
declare const window: any;

/**
 * @see http://pixijs.download/release/docs/PIXI.Container.html
 * @private
 */
export declare class PixiShape extends PIXI.Container {
	private _createjs: CreatejsShape | null;
	constructor(cjs: CreatejsShape | null);
	get createjs(): CreatejsShape | null;
}

/**
 * @private
 */
type TShapePixiData = TPixiData & { instance: PixiShape, masked: PIXI.DisplayObject[] };

/**
 * @see https://createjs.com/docs/easeljs/classes/Shape.html
 */
export declare class CreatejsShape extends window.createjs.Shape {
	private _originParams: TOriginParam;
	private _pixiData: TShapePixiData;
	get pixi(): PixiShape;
	updateForPixi(): boolean;
}