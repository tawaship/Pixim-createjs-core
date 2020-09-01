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
 * @private
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
 * @private
 */
type TShapePixiData = TPixiData & { instance: PixiShape, masked: PIXI.DisplayObject[] };

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
	private _originParams: TOriginParam;
	private _pixiData: TShapePixiData;
	private _graphics: CreatejsGraphics;
	
	constructor() {
		super(...arguments);
		
		this._originParams = createOriginParams();
		this._pixiData = createShapePixiData(this);
		
		CreatejsShapeTemp.apply(this, arguments);
	}
	
	get graphics() {
		return this._graphics;
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
		
		this._graphics = value;
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
		value: createOriginParams(),
		writable: true
	},
	_pixiData: {
		value: createShapePixiData({}),
		writable: true
	}
});