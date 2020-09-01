import * as PIXI from 'pixi.js';
import { createPixiData, createOriginParams, TPixiData, TOriginParam, TTickerData } from './core';
import { appendDisplayObjectDescriptor } from './append';

/**
 * @ignore
 */
declare const window: any;

/**
 * @see http://pixijs.download/release/docs/PIXI.Sprite.html
 * @private
 * @since 1.0.9
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

/**
 * @private
 * @since 1.0.9
 */
type TBitmapPixiData = TPixiData & { instance: PixiBitmap };

/**
 * @ignore
 */
function createBitmapPixiData(cjs: CreatejsBitmap | {}): TBitmapPixiData {
	const pixi = new PixiBitmap(cjs);
	
	return Object.assign(createPixiData(pixi.anchor), {
		instance: pixi
	});
}

/**
 * @see https://createjs.com/docs/easeljs/classes/Bitmap.html
 * @since 1.0.9
 */
export class CreatejsBitmap extends window.createjs.Bitmap {
	private _originParams: TOriginParam;
	private _pixiData: TBitmapPixiData;
	
	initialize() {
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
	
	updateForPixi(e: TTickerData) {
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