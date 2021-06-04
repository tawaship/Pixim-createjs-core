import { DisplayObject, Container, Point } from 'pixi.js';
import { CreatejsColorFilter } from './ColorFilter';
import { CreatejsButtonHelper } from './ButtonHelper';
import { CreatejsStage } from './Stage';
import { CreatejsStageGL } from './StageGL';
import { CreatejsMovieClip, PixiMovieClip } from './MovieClip';
import { CreatejsSprite } from './Sprite';
import { CreatejsShape } from './Shape';
import { CreatejsBitmap } from './Bitmap';
import { CreatejsGraphics } from './Graphics';
import { CreatejsText } from './Text';

type TCreatejsDisplayObject = any/* createjs.DisplayObject */;

/**
 * [[http://pixijs.download/release/docs/PIXI.Point.html | PIXI.Point]]
 */
declare class PixiPoint {};

export { Point as PixiPoint };

export interface ITickerData {
	delta: number;
}

export interface IPixiContainerClass<T = {}> {
	new (...args: any[]): T;
}

export function mixinPixiContainer<TBase extends IPixiContainerClass>(Base: TBase) {
	return class extends Base {
		
	}
}

export interface IPixiData<T extends DisplayObject> {
	regObj: Point;
	instance: T;
}

export function createPixiData<TPixiDisplayObject extends DisplayObject>(pixi: TPixiDisplayObject, regObj: Point): IPixiData<TPixiDisplayObject> {
	return {
		regObj,
		instance: pixi
	};
}

export interface ICreatejsParam {
	x: number;
	y: number;
	scaleX: number;
	scaleY: number;
	regX: number;
	regY: number;
	skewX: number;
	skewY: number;
	rotation: number;
	visible: boolean;
	alpha: number;
	_off: boolean;
	mask: CreatejsShape | null;
	filters: CreatejsColorFilter[] | null;
}

/**
 * @ignore
 */
const DEG_TO_RAD = Math.PI / 180;

export type TCreatejsInteractionEvent = 'mousedown' | 'rollover' | 'rollout' | 'pressmove' | 'pressup';

export type TPixiInteractionEvent = 'pointerdown' | 'pointerover' | 'pointerout' | 'pointermove' | 'pointerup' | 'pointerupoutside';

export interface ICreatejsInteractionEventDelegate {
	 (e: any): void;
}

export interface IPixiInteractionEventDelegate {
	 (e: any): void;
}

export interface ICreatejsInteractionEventData {
	types: TPixiInteractionEvent[];
	factory(cb: ICreatejsInteractionEventDelegate): IPixiInteractionEventDelegate;
}

export class EventManager {
	private _isDown: boolean = false;
	private _events: { [name in TPixiInteractionEvent]: { func: IPixiInteractionEventDelegate, origin: ICreatejsInteractionEventDelegate  }[] };
	private _data: { [name in TCreatejsInteractionEvent]: ICreatejsInteractionEventData };
	
	constructor(cjs: TCreatejsObject) {
		this._events = {
			pointerdown: [],
			pointerover: [],
			pointerout: [],
			pointermove: [],
			pointerup: [],
			pointerupoutside: []
		};
		
		this._data = {
			mousedown:{
				types: ['pointerdown'],
				factory: (cb: ICreatejsInteractionEventDelegate) => {
					return this._mousedownFactory(cjs, cb);
				}
			},
			rollover: {
				types: ['pointerover'],
				factory: (cb: ICreatejsInteractionEventDelegate) => {
					return this._rolloverFactory(cjs, cb);
				}
			},
			rollout: {
				types: ['pointerout'],
				factory: (cb: ICreatejsInteractionEventDelegate) => {
					return this._rolloutFactory(cjs, cb);
				}
			},
			pressmove: {
				types: ['pointermove'],
				factory: (cb: ICreatejsInteractionEventDelegate) => {
					console.log(cb)
					return this._pressmoveFactory(cjs, cb);
				}
			},
			pressup: {
				types: ['pointerup', 'pointerupoutside'],
				factory: (cb: ICreatejsInteractionEventDelegate) => {
					return this._pressupFactory(cjs, cb);
				}
			}
		}
	}
	
	add(pixi: DisplayObject, type: TCreatejsInteractionEvent, cb: ICreatejsInteractionEventDelegate) {
		const data = this._data[type];
		
		const types = data.types;
		const func = data.factory(cb);
		
		for (let i = 0; i < types.length; i++) {
			const t = types[i];
			this._events[t].push({ func, origin: cb });
			
			pixi.on(t, func);
		}
		
		pixi.interactive = true;
	}
	
	remove(pixi: DisplayObject, type: TCreatejsInteractionEvent, cb: ICreatejsInteractionEventDelegate) {
		const data = this._data[type];
		
		const types = data.types;
		
		for (let i = 0; i < types.length; i++) {
			const t = types[i];
			
			const list = this._events[t];
			
			if (list) {
				for (var j = list.length - 1; j >= 0; j--) {
					if (list[j].origin === cb) {
						pixi.off(t, list[j].func);
						
						list.splice(j, 1);
						break;
					}
				}
				
				if (list.length === 0) {
					this._events[t] = [];
				}
			}
		}
	}
	
	private _mousedownFactory(cjs: TCreatejsObject, cb: ICreatejsInteractionEventDelegate) {
		return (e: any) => {
			e.currentTarget = e.currentTarget.createjs;
			
			e.target = e.target.createjs;
			const ev = e.data;
			e.rawX = ev.global.x;
			e.rawY = ev.global.y;
			
			this._isDown = true;
			
			cb(e);
		};
	}
	
	private _rolloverFactory(cjs: TCreatejsObject, cb: ICreatejsInteractionEventDelegate) {
		return (e: any) => {
			e.currentTarget = e.currentTarget.createjs;
			
			e.target = e.currentTarget.createjs;
			const ev = e.data;
			e.rawX = ev.global.x;
			e.rawY = ev.global.y;
			
			this._isDown = true;
			
			cb(e);
		};
	}
	
	private _rolloutFactory(cjs: TCreatejsObject, cb: ICreatejsInteractionEventDelegate) {
		return (e: any) => {
			e.currentTarget = e.currentTarget.createjs;
			
			e.target = e.currentTarget.createjs;
			const ev = e.data;
			e.rawX = ev.global.x;
			e.rawY = ev.global.y;
			
			this._isDown = true;
			
			cb(e);
		};
	}
	
	private _pressmoveFactory(cjs: TCreatejsObject, cb: ICreatejsInteractionEventDelegate) {
		return (e: any) => {
			if (!this._isDown) {
				return;
			}
			
			e.currentTarget = cjs;
			
			e.target = e.target && e.target.createjs;
			const ev = e.data;
			e.rawX = ev.global.x;
			e.rawY = ev.global.y;
			
			cb(e);
		};
	}
	
	private _pressupFactory(cjs: TCreatejsObject, cb: ICreatejsInteractionEventDelegate) {
		return (e: any) => {
			if (!this._isDown) {
				return;
			}
			
			e.currentTarget = cjs;
			
			this._isDown = false;
			
			e.target = e.target && e.target.createjs;
			const ev = e.data;
			e.rawX = ev.global.x;
			e.rawY = ev.global.y;
			
			cb(e);
		};
	}
}

export interface ICreatejsDisplayObjectClass<T = TCreatejsDisplayObject> {
	new (...args: any[]): T;
}

export function mixinCreatejsDisplayObject<TPixiData extends IPixiData<DisplayObject>, TCreatejsParam extends ICreatejsParam, TBase extends ICreatejsDisplayObjectClass = ICreatejsDisplayObjectClass>(Base: TBase) {
	return class C extends Base {
		protected _pixiData: TPixiData;
		protected _createjsParams: TCreatejsParam;
		private _createjsEventManager: EventManager;
		
		constructor(...args: any[]) {
			super(...args);
			
			this._createjsEventManager = new EventManager(this);
		}
		
		initialize(...args: any[]) {
			this._createjsEventManager = new EventManager(this);
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
		/*
		dispatchEvent: {
			dispatchEvent(eventObj, bubbles, cancelable) {
				var type = eventObj typeof 'string' ? eventObj : eventObj.type;
				
				this._pixiData.instance.emit(type, eventObj);
				
				return createjs.DisplayObject.prototype.dispatchEvent.apply(this, arguments);
			}
		},
		*/
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
				
				this._pixiData.instance.once('added', function() {
					this.parent.addChild(value.pixi);
				});
			} else {
				this._pixiData.instance.mask = null;
			}
			
			this._createjsParams.mask = value;
		}
	}
}

export type TCreatejsObject =
	CreatejsStage
	| CreatejsStageGL
	| CreatejsMovieClip
	| CreatejsSprite
	| CreatejsShape
	| CreatejsBitmap
	| CreatejsGraphics
	| CreatejsText;

export function createCreatejsParams(): ICreatejsParam {
	return {
		x: 0,
		y: 0,
		scaleX: 0,
		scaleY: 0,
		regX: 0,
		regY: 0,
		skewX: 0,
		skewY: 0,
		rotation: 0,
		visible: true,
		alpha: 1,
		_off: false,
		mask: null,
		filters: null
	};
}

export function updateDisplayObjectChildren(cjs: TCreatejsObject, e: ITickerData) {
	const list = cjs.children.slice();
	for (let i = 0,l = list.length; i < l; i++) {
		const child = list[i];
		if (!child.isVisible()) { continue; }
		//child.draw();
		child.updateForPixi(e);
	}
	
	return true;
}