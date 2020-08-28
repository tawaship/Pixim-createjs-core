import * as PIXI from 'pixi.js';
import { TPixiData, TOriginParam } from './core';
import { appendDisplayObjectDescriptor } from './append';

/**
 * @ignore
 */
declare const window: any;

/**
 * @see http://pixijs.download/release/docs/PIXI.Container.html
 * @private
 */
export declare class PixiMovieClip extends PIXI.Container {
	private _createjs: CreatejsMovieClip | null;
	constructor(cjs: CreatejsMovieClip | null);
	get createjs(): CreatejsMovieClip | null;
}

/**
 * @private
 */
type TMovieClipPixiData = TPixiData & { instance: PixiMovieClip, subInstance: PIXI.Container };

/**
 * @see https://createjs.com/docs/easeljs/classes/MovieClip.html
 */
export declare class CreatejsMovieClip extends window.createjs.MovieClip {
	private _originParams: TOriginParam;
	private _pixiData: TMovieClipPixiData;
	get pixi(): PixiMovieClip;
	updateForPixi(): boolean;
}