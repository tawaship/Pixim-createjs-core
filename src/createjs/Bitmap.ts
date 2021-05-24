import { Sprite, Texture } from 'pixi.js';
import { createjs } from './alias';
import { createPixiData, createCreatejsParams, IPixiData, ICreatejsParam, ITickerData, mixinPixiContainer, mixinCreatejsDisplayObject } from './core';
import { createObject } from './utils';

/**
 * [[http://pixijs.download/release/docs/PIXI.Sprite.html | PIXI.Sprite]]
 */
export class PixiBitmap extends mixinPixiContainer(Sprite) {
	private _createjs: CreatejsBitmap;
	
	constructor(cjs: CreatejsBitmap) {
		super();
		
		this._createjs = cjs;
	}
	
	get createjs() {
		return this._createjs;
	}
}

export interface ICreatejsBitmapParam extends ICreatejsParam {

}

/**
 * @ignore
 */
function createCreatejsBitmapParams(): ICreatejsBitmapParam {
	return createCreatejsParams();
}

export interface IPixiBitmapData extends IPixiData<PixiBitmap> {

}

/**
 * @ignore
 */
function createPixiBitmapData(cjs: CreatejsBitmap): IPixiBitmapData {
	const pixi = new PixiBitmap(cjs);
	
	return createPixiData<PixiBitmap>(pixi, pixi.anchor);
}

/**
 * @ignore
 */
const P = createjs.Bitmap;

/**
 * [[https://createjs.com/docs/easeljs/classes/Bitmap.html | createjs.Bitmap]]
 */
export class CreatejsBitmap extends mixinCreatejsDisplayObject<PixiBitmap, ICreatejsBitmapParam>(createjs.Bitmap) {
	constructor(...args: any[]) {
		super(...args);
		
		this._initForPixi();
		
		P.apply(this, args);
	}
	
	private _initForPixi() {
		this._pixiData = createPixiBitmapData(this);
		this._createjsParams = createCreatejsBitmapParams();
	}
	
	initialize(...args: any[]) {
		this._initForPixi();
		
		const res = super.initialize(...args);
		
		const texture = Texture.from(this.image);
		
		this._pixiData.instance.texture = texture;
		
		return res;
	}
}

// temporary prototype
Object.defineProperties(CreatejsBitmap.prototype, {
	_createjsParams: {
		value: createCreatejsBitmapParams(),
		writable: true
	},
	_pixiData: {
		value: createPixiBitmapData(createObject<CreatejsBitmap>(CreatejsBitmap.prototype)),
		writable: true
	}
});