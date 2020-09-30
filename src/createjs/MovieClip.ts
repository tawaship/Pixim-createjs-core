import * as PIXI from 'pixi.js';
import { createPixiData, createOriginParams, TPixiData, TOriginParam, updateDisplayObjectChildren, TTickerData } from './core';
import { appendDisplayObjectDescriptor } from './append';

/**
 * @ignore
 */
declare const window: any;

/**
 * @see http://pixijs.download/release/docs/PIXI.Container.html
 */
export class PixiMovieClip extends PIXI.Container {
	private _createjs: CreatejsMovieClip | {};
	
	constructor(cjs: CreatejsMovieClip | {}) {
		super();
		
		this._createjs = cjs;
	}
	
	get createjs() {
		return this._createjs;
	}
}

/**
 * @since 1.1.0
 */
export type TMovieClipOriginParam = TOriginParam;

/**
 * @since 1.1.0
 */
export type TMovieClipPixiData = TPixiData & { instance: PixiMovieClip, subInstance: PIXI.Container };

/**
 * @ignore
 */
function createMovieClipPixiData(cjs: CreatejsMovieClip | {}): TMovieClipPixiData {
	const pixi = new PixiMovieClip(cjs);
	
	return Object.assign(createPixiData(pixi.pivot), {
		instance: pixi,
		subInstance: pixi
	});
}

/**
 * @ignore
 */
const CreatejsMovieClipTemp = window.createjs.MovieClip;

/**
 * @see https://createjs.com/docs/easeljs/classes/MovieClip.html
 */
export class CreatejsMovieClip extends window.createjs.MovieClip {
	protected _originParams: TMovieClipOriginParam;
	protected _pixiData: TMovieClipPixiData;
	
	constructor(...args: any[]) {
		super();
		
		this._initForPixi();
		
		CreatejsMovieClipTemp.apply(this, arguments);
	}
	
	/**
	 * @since 1.1.0
	 */
	protected _initForPixi() {
		this._originParams = createOriginParams();
		this._pixiData = createMovieClipPixiData(this);
	}
	
	initialize(...args: any[]) {
		this._initForPixi();
		
		return super.initialize(...arguments);
	}
	
	addChild(child) {
		this._pixiData.subInstance.addChild(child._pixiData.instance);
		
		return super.addChild(child);
	}
	
	addChildAt(child, index) {
		this._pixiData.subInstance.addChildAt(child._pixiData.instance, index);
		
		return super.addChildAt(child, index);
	}
	
	removeChild(child) {
		this._pixiData.subInstance.removeChild(child._pixiData.instance);
		
		return super.removeChild(child);
	}
	
	removeChildAt(index) {
		this._pixiData.subInstance.removeChildAt(index);
		
		return super.removeChildAt(index);
	}
	
	removeAllChldren() {
		this._pixiData.subInstance.removeChildren();
		
		return super.removeAllChldren();
	}
	
	get pixi() {
		return this._pixiData.instance;
	}
	
	updateForPixi(e: TTickerData) {
		this._updateState();
		
		return updateDisplayObjectChildren(this, e);
	}
}

appendDisplayObjectDescriptor(CreatejsMovieClip);

// temporary prototype
Object.defineProperties(CreatejsMovieClip.prototype, {
	_originParams: {
		value: createOriginParams(),
		writable: true
	},
	_pixiData: {
		value: createMovieClipPixiData({}),
		writable: true
	}
});