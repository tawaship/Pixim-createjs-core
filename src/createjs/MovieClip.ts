import * as PIXI from 'pixi.js';
import { createPixiData, createOriginParams, IPixiData, IOriginParam, updateDisplayObjectChildren, ITickerData } from './core';
import { appendDisplayObjectDescriptor } from './append';

/**
 * @ignore
 */
declare const window: any;

/**
 * [[http://pixijs.download/release/docs/PIXI.Container.html | PIXI.Container]]
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

export interface IMovieClipOriginParam extends IOriginParam {

}

export interface IMovieClipPixiData extends IPixiData {
	instance: PixiMovieClip;
	subInstance: PIXI.Container;
}

function createMovieClipPixiData(cjs: CreatejsMovieClip | {}): IMovieClipPixiData {
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
 * @ignore
 */
let _funcFlag = true;

/**
 * @see https://createjs.com/docs/easeljs/classes/MovieClip.html
 */
export class CreatejsMovieClip extends window.createjs.MovieClip {
	protected _originParams: IMovieClipOriginParam;
	protected _pixiData: IMovieClipPixiData;
	public updateForPixi: (e: ITickerData) => boolean;
	
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
		
		if (!_funcFlag) {
			this.updateForPixi = this._updateForPixiUnsynched;
		} else {
			this.updateForPixi = this._updateForPixiSynched;
		}
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
	
	static selectUpdateFunc(flag: boolean) {
		_funcFlag = flag;
	}
	
	protected _updateForPixiSynched(e: ITickerData) {
		this._updateState();
		
		return updateDisplayObjectChildren(this, e);
	}
	
	protected _updateForPixiUnsynched(e: ITickerData) {
		return this._tick(e);
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