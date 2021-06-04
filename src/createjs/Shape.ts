import { DisplayObject, Container } from 'pixi.js';
import { createjs } from './alias';
import { createPixiData, createCreatejsParams, IPixiData, ICreatejsParam, ITickerData } from './core';
import { CreatejsGraphics } from './Graphics';
import { createObject, DEG_TO_RAD } from './utils';
import { EventManager, TCreatejsInteractionEvent, ICreatejsInteractionEventDelegate } from './EventManager';
import { CreatejsButtonHelper } from './ButtonHelper';

/**
 * [[http://pixijs.download/release/docs/PIXI.Container.html | PIXI.Container]]
 */
export class PixiShape extends Container {
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
function createPixiShapeData(cjs: CreatejsShape): IPixiShapeData {
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
export class CreatejsShape extends createjs.Shape {
	protected _pixiData: IPixiShapeData;
	protected _createjsParams: ICreatejsShapeParam;
	private _createjsEventManager: EventManager;
	
	constructor(...args: any[]) {
		super(...args);
		
		this._initForPixi();
		
		P.apply(this, args);
	}
	
	private _initForPixi() {
		this._pixiData = createPixiShapeData(this);
		this._createjsParams = createCreatejsShapeParams(null);
		this._createjsEventManager = new EventManager(this);
	}
	
	initialize(...args: any[]) {
		this._initForPixi();
		
		return super.initialize(...args);
	}
	
	get pixi() {
		return this._pixiData.instance;
	}
	
	updateForPixi(e: ITickerData) {
		return true;
	}
	
	get x() {
		return this._createjsParams.x;
	}
	
	set x(value) {
		this._pixiData.instance.x = value;
		this._createjsParams.x = value;
	}
	
	get y() {
		return this._createjsParams.y;
	}
	
	set y(value) {
		this._pixiData.instance.y = value;
		this._createjsParams.y = value;
	}
	
	get scaleX() {
		return this._createjsParams.scaleX;
	}
		
	set scaleX(value) {
		this._pixiData.instance.scale.x = value;
		this._createjsParams.scaleX = value;
	}
	
	get scaleY() {
		return this._createjsParams.scaleY;
	}
	
	set scaleY(value) {
		this._pixiData.instance.scale.y = value;
		this._createjsParams.scaleY = value;
	}
	
	get skewX() {
		return this._createjsParams.skewX;
	}
	
	set skewX(value) {
		this._pixiData.instance.skew.x = -value * DEG_TO_RAD;
		this._createjsParams.skewX = value;
	}
	
	get skewY() {
		return this._createjsParams.skewY;
	}
	
	set skewY(value) {
		this._pixiData.instance.skew.y = value * DEG_TO_RAD;
		this._createjsParams.skewY = value;
	}
	
	get regX() {
		return this._createjsParams.regX;
	}
	
	set regX(value) {
		this._pixiData.regObj.x = value;
		this._createjsParams.regX = value;
	}
	
	get regY() {
		return this._createjsParams.regY;
	}
	
	set regY(value) {
		this._pixiData.regObj.y = value;
		this._createjsParams.regY = value;
	}
	
	get rotation() {
		return this._createjsParams.rotation;
	}
	
	set rotation(value) {
		this._pixiData.instance.rotation = value * DEG_TO_RAD;
		this._createjsParams.rotation = value;
	}
	
	get visible() {
		return this._createjsParams.visible;
	}
	
	set visible(value) {
		value = !!value;
		this._pixiData.instance.visible = value;
		this._createjsParams.visible = value;
	}
	
	get alpha() {
		return this._createjsParams.alpha;
	}
	
	set alpha(value) {
		this._pixiData.instance.alpha = value;
		this._createjsParams.alpha = value;
	}
	
	get _off() {
		return this._createjsParams._off;
	}
	
	set _off(value) {
		this._pixiData.instance.renderable = !value;
		this._createjsParams._off = value;
	}
	
	addEventListener(type: TCreatejsInteractionEvent | string, cb: ICreatejsInteractionEventDelegate | CreatejsButtonHelper, ...args: any[]) {
		if (!(cb instanceof CreatejsButtonHelper)) {
			if (type === 'mousedown' || type === 'rollover' || type === 'rollout' || type === 'pressmove' || type === 'pressup') {
				this._createjsEventManager.add(this._pixiData.instance, type, cb);
			}
		}
		
		return super.addEventListener(type, cb, ...args);
	}
	
	removeEventListener(type: TCreatejsInteractionEvent | string, cb: ICreatejsInteractionEventDelegate, ...args: any[]) {
		if (!(cb instanceof CreatejsButtonHelper)) {
			if (type === 'mousedown' || type === 'rollover' || type === 'rollout' || type === 'pressmove' || type === 'pressup') {
				this._createjsEventManager.remove(this._pixiData.instance, type, cb);
			}
		}
		
		return super.removeEventListener(type, cb, ...args);
	}
	
	get mask() {
		return this._createjsParams.mask;
	}
	
	set mask(value: CreatejsShape | null) {
		if (value) {
			value.masked.push(this._pixiData.instance);
			this._pixiData.instance.mask = value.pixi;
			
			this._pixiData.instance.once('added', () => {
				this._pixiData.instance.parent.addChild(value.pixi);
			});
		} else {
			this._pixiData.instance.mask = null;
		}
		
		this._createjsParams.mask = value;
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
		value: createPixiShapeData(createObject<CreatejsShape>(CreatejsShape.prototype)),
		writable: true
	}
});