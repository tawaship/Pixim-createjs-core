import * as PIXI from 'pixi.js';
import { createPixiData, createOriginParams, TPixiData, TOriginParam, TTickerData } from './core';
import { appendDisplayObjectDescriptor } from './append';
import { CreatejsGraphics } from './Graphics';

/**
 * @ignore
 */
declare const window: any;

/**
 * @see http://pixijs.download/release/docs/PIXI.Container.html
 */
export class PixiShape extends PIXI.Container {
	private _createjs: CreatejsShape | {};
	
	constructor(cjs: CreatejsShape | {}) {
		super();
		
		this._createjs = cjs;
	}
	
	get createjs() {
		return this._createjs;
	}
}

/**
 * @ignore
 */
function createShapeOriginParam(graphics: CreatejsGraphics | null): TShapeOriginParam {
	return Object.assign(createOriginParams(), {
		graphics: graphics
	});
}

/**
 * @since 1.1.0
 */
export type TShapeOriginParam = TOriginParam & { graphics: CreatejsGraphics };

/**
 * @since 1.1.0
 */
export type TShapePixiData = TPixiData & { instance: PixiShape, masked: PIXI.DisplayObject[] };

/**
 * @ignore
 */
function createShapePixiData(cjs: CreatejsShape | {}): TShapePixiData {
	const pixi = new PixiShape(cjs);
	
	return Object.assign(createPixiData(pixi.pivot), {
		instance: pixi,
		masked: []
	});
}

/**
 * @ignore
 */
const CreatejsShapeTemp = window.createjs.Shape;

/**
 * @see https://createjs.com/docs/easeljs/classes/Shape.html
 */
export class CreatejsShape extends window.createjs.Shape {
	protected _originParams: TShapeOriginParam;
	protected _pixiData: TShapePixiData;
	
	constructor(...args: any[]) {
		super(...arguments);
		
		this._initForPixi();
		
		CreatejsShapeTemp.apply(this, arguments);
	}
	
	/**
	 * @since 1.1.0
	 */
	protected _initForPixi() {
		this._originParams = createShapeOriginParam(null);
		this._pixiData = createShapePixiData(this);
	}
	
	get graphics() {
		return this._originParams.graphics;
	}
	
	set graphics(value) {
		if (this._pixiData.masked.length) {
			this._pixiData.instance.removeChildren();
			
			if (value) {
				for (let i = 0; i < this._pixiData.masked.length; i++) {
					this._pixiData.masked[i].mask = this._pixiData.instance;
				}
			} else {
				for (let i = 0; i < this._pixiData.masked.length; i++) {
					this._pixiData.masked[i].mask = null;
				}
			}
		}
		
		if (value) {
			this._pixiData.instance.addChild(value.pixi);
		}
		
		this._originParams.graphics = value;
	}
	
	get pixi() {
		return this._pixiData.instance;
	}
	
	updateForPixi(e: TTickerData) {
		return true;
	}
}

appendDisplayObjectDescriptor(CreatejsShape);

// temporary prototype
Object.defineProperties(CreatejsShape.prototype, {
	_originParams: {
		value: createShapeOriginParam(null),
		writable: true
	},
	_pixiData: {
		value: createShapePixiData({}),
		writable: true
	}
});