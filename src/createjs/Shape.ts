import * as PIXI from 'pixi.js';
import { createPixiData, createOriginParams, IPixiData, IOriginParam, ITickerData } from './core';
import { appendDisplayObjectDescriptor } from './append';
import { CreatejsGraphics } from './Graphics';

/**
 * @ignore
 */
declare const window: any;

/**
 * [[http://pixijs.download/release/docs/PIXI.Container.html | PIXI.Container]]
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
function createShapeOriginParam(graphics: CreatejsGraphics | null): IShapeOriginParam {
	return Object.assign(createOriginParams(), {
		graphics: graphics
	});
}

export interface IShapeOriginParam extends IOriginParam {
	graphics: CreatejsGraphics;
}

export interface IShapePixiData extends IPixiData {
	instance: PixiShape;
	/**
	 * [[http://pixijs.download/release/docs/PIXI.DisplayObject.html | PIXI.DisplayObject]]
	 */
	masked: PIXI.DisplayObject[];
};

/**
 * @ignore
 */
function createShapePixiData(cjs: CreatejsShape | {}): IShapePixiData {
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
 * [[https://createjs.com/docs/easeljs/classes/Shape.html | createjs.Shape]]
 */
export class CreatejsShape extends window.createjs.Shape {
	protected _originParams: IShapeOriginParam;
	protected _pixiData: IShapePixiData;
	
	constructor(...args: any[]) {
		super(...arguments);
		
		this._initForPixi();
		
		CreatejsShapeTemp.apply(this, arguments);
	}
	
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
	
	updateForPixi(e: ITickerData) {
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