import * as PIXI from 'pixi.js';
import { createPixiData, createOriginParams, IPixiData, IOriginParam, ITickerData } from './core';
import { appendDisplayObjectDescriptor } from './append';

/**
 * @ignore
 */
declare const window: any;

/**
 * [[http://pixijs.download/release/docs/PIXI.Sprite.html | PIXI.Sprite]]
 */
export class PixiBitmap extends PIXI.Sprite {
	private _createjs: CreatejsBitmap | {};
	
	constructor(cjs: CreatejsBitmap | {}) {
		super();
		
		this._createjs = cjs;
	}
	
	get createjs() {
		return this._createjs;
	}
}

export interface IBitmapOriginParam extends IOriginParam {

}

export interface IBitmapPixiData extends IPixiData {
	instance: PixiBitmap;
}

/**
 * @ignore
 */
function createBitmapPixiData(cjs: CreatejsBitmap | {}): IBitmapPixiData {
	const pixi = new PixiBitmap(cjs);
	
	return Object.assign(createPixiData(pixi.anchor), {
		instance: pixi
	});
}

/**
 * @ignore
 */
const CreatejsBitmapTemp = window.createjs.Bitmap;

/**
 * [[https://createjs.com/docs/easeljs/classes/Bitmap.html | createjs.Bitmap]]
 */
export class CreatejsBitmap extends window.createjs.Bitmap {
	protected _originParams: IBitmapOriginParam;
	protected _pixiData: IBitmapPixiData;
	
	constructor(...args: any[]) {
		super(...arguments);
		
		this._initForPixi();
		
		CreatejsBitmapTemp.apply(this, arguments);
	}
	
	protected _initForPixi() {
		this._originParams = createOriginParams();
		this._pixiData = createBitmapPixiData(this);
	}
	
	initialize(...args: any[]) {
		this._originParams = createOriginParams();
		this._pixiData = createBitmapPixiData(this);
		
		const res = super.initialize(...arguments);
		
		const texture = PIXI.Texture.from(this.image);
		
		this._pixiData.instance.texture = texture;
		
		return res;
	}
	
	get pixi() {
		return this._pixiData.instance;
	}
	
	updateForPixi(e: ITickerData) {
		return true;
	}
}

appendDisplayObjectDescriptor(CreatejsBitmap);

// temporary prototype
Object.defineProperties(CreatejsBitmap.prototype, {
	_originParams: {
		value: createOriginParams(),
		writable: true
	},
	_pixiData: {
		value: createBitmapPixiData({}),
		writable: true
	}
});