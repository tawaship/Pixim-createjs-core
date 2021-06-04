import { DisplayObject, Container } from 'pixi.js';
import { createjs } from './alias';
import { createPixiData, createCreatejsParams, IPixiData, ICreatejsParam, ITickerData, mixinPixiContainer, mixinCreatejsDisplayObject } from './core';
import { CreatejsGraphics } from './Graphics';
import { createObject } from './utils';

/**
 * [[http://pixijs.download/release/docs/PIXI.Container.html | PIXI.Container]]
 */
export class PixiShape extends mixinPixiContainer(Container) {
	private _createjs: CreatejsShape;
	
	constructor(cjs: CreatejsShape) {
		super();
		
		this._createjs = cjs;
	}
	
	get createjs() {
		return this._createjs;
	}
}

export interface ICreatejsShapeParam extends ICreatejsParam {
	graphics: CreatejsGraphics;
}

/**
 * @ignore
 */
function createCreatejsShapeParams(graphics: CreatejsGraphics | null): ICreatejsShapeParam {
	return Object.assign(createCreatejsParams(), {
		graphics: graphics
	});
}

export interface IPixiShapeData extends IPixiData<PixiShape> {
	/**
	 * [[http://pixijs.download/release/docs/PIXI.DisplayObject.html | PIXI.DisplayObject]]
	 */
	masked: DisplayObject[];
};

/**
 * @ignore
 */
function createPixiSpaheData(cjs: CreatejsShape): IPixiShapeData {
	const pixi = new PixiShape(cjs);
	
	return Object.assign(createPixiData(pixi, pixi.pivot), {
		masked: []
	});
}

/**
 * @ignore
 */
const P = createjs.Shape;

/**
 * [[https://createjs.com/docs/easeljs/classes/Shape.html | createjs.Shape]]
 */
export class CreatejsShape extends mixinCreatejsDisplayObject<IPixiShapeData, ICreatejsShapeParam>(createjs.Shape) {
	protected _createjsParams: ICreatejsShapeParam;
	protected _pixiData: IPixiShapeData;
	
	constructor(...args: any[]) {
		super(...args);
		
		this._initForPixi();
		
		P.apply(this, args);
	}
	
	private _initForPixi() {
		this._createjsParams = createCreatejsShapeParams(null);
		this._pixiData = createPixiSpaheData(this);
	}
	
	get graphics() {
		return this._createjsParams.graphics;
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
		
		this._createjsParams.graphics = value;
	}
	
	get masked() {
		return this._pixiData.masked;
	}
}

// temporary prototype
Object.defineProperties(CreatejsShape.prototype, {
	_createjsParams: {
		value: createCreatejsShapeParams(null),
		writable: true
	},
	_pixiData: {
		value: createPixiSpaheData(createObject<CreatejsShape>(CreatejsShape.prototype)),
		writable: true
	}
});