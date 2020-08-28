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
export declare class PixiButtonHelper extends PIXI.Container {
	private _createjs: CreatejsButtonHelper | null;
	constructor(cjs: CreatejsButtonHelper | null);
	get createjs(): CreatejsButtonHelper | null;
}

/**
 * @private
 */
type TButtonHelperPixiData = TPixiData & { instance: PixiButtonHelper };

/**
 * @see https://createjs.com/docs/easeljs/classes/ButtonHelper.html
 */
export declare class CreatejsButtonHelper extends window.createjs.ButtonHelper {
	private _originParams: TOriginParam;
	private _pixiData: TButtonHelperPixiData;
	get pixi(): PixiButtonHelper;
}