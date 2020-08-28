import * as PIXI from 'pixi.js';
import { TPixiData, TOriginParam } from './core';

/**
 * @ignore
 */
declare const window: any;

/**
 * @see http://pixijs.download/release/docs/PIXI.Sprite.html
 * @private
 */
export declare class PixiSprite extends PIXI.Sprite {
	private _createjs: CreatejsSprite | null;
	constructor(cjs: CreatejsSprite | null);
	get createjs(): CreatejsSprite | null;
}

/**
 * @private
 */
type TSpritePixiData = TPixiData & { instance: PixiSprite };

/**
 * @see https://createjs.com/docs/easeljs/classes/Sprite.html
 */
export declare class CreatejsSprite extends window.createjs.Sprite {
	private _originParams: TOriginParam;
	private _pixiData: TSpritePixiData;
	get pixi(): PixiSprite;
	updateForPixi(): boolean;
}