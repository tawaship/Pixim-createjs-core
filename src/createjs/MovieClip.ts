import { DisplayObject, Container, filters } from 'pixi.js';
import createjs from '@tawaship/createjs-module';
import { CreatejsColorFilter } from './ColorFilter';
import { createPixiData, createCreatejsParams, IPixiData, ICreatejsParam, updateDisplayObjectChildren, ITickerData, TCreatejsColorFilters, TCreatejsMask, IExpandedCreatejsDisplayObject } from './core';
import { createObject, DEG_TO_RAD } from './utils';
import { EventManager, TCreatejsInteractionEvent, ICreatejsInteractionEventDelegate } from './EventManager';
import { CreatejsButtonHelper } from './ButtonHelper';
import { CreatejsShape } from './Shape';

/**
 * [[http://pixijs.download/release/docs/PIXI.Container.html | PIXI.Container]]
 */
export class PixiMovieClip extends Container {
	private _createjs: CreatejsMovieClip;
	private _filterContainer: Container | null = null;
	
	constructor(cjs: CreatejsMovieClip) {
		super();
		
		this._createjs = cjs;
	}
	
	get filterContainer() {
		return this._filterContainer;
	}
	
	set filterContainer(value) {
		this._filterContainer = value;
	}
	
	get createjs() {
		return this._createjs;
	}
}

export interface ICreatejsMovieClipParam extends ICreatejsParam {

}

/**
 * @ignore
 */
function createCreatejsMovieClipParams(): ICreatejsMovieClipParam {
	return createCreatejsParams();
}

export interface IPixiMovieClipData extends IPixiData<PixiMovieClip> {
	subInstance: Container;
}

/**
 * @ignore
 */
function createPixiMovieClipData(cjs: CreatejsMovieClip): IPixiMovieClipData {
	const pixi = new PixiMovieClip(cjs);
	
	return Object.assign(createPixiData<PixiMovieClip>(pixi, pixi.pivot), {
		subInstance: pixi
	});
}

/**
 * @ignore
 */
const P = createjs.MovieClip;

/**
 * [[https://createjs.com/docs/easeljs/classes/MovieClip.html | createjs.MovieClip]]
 */
export class CreatejsMovieClip extends createjs.MovieClip implements IExpandedCreatejsDisplayObject {
	protected _pixiData: IPixiMovieClipData;
	protected _createjsParams: ICreatejsMovieClipParam;
	private _createjsEventManager: EventManager;
	
	constructor(...args: any[]) {
		super();
		
		this._pixiData = createPixiMovieClipData(this);
		this._createjsParams = createCreatejsMovieClipParams();
		this._createjsEventManager = new EventManager(this);
		
		P.apply(this, args);
	}
	
	initialize(...args: any[]) {
		this._pixiData = createPixiMovieClipData(this);
		this._createjsParams = createCreatejsMovieClipParams();
		this._createjsEventManager = new EventManager(this);
		
		return super.initialize(...args);
	}
	
	get pixi() {
		return this._pixiData.instance;
	}
	
	updateForPixi(e: ITickerData): boolean {
		this._updateState();
		
		return updateDisplayObjectChildren(this, e);
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
	
	set mask(value: TCreatejsMask) {
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
	
	get filters() {
		return this._createjsParams.filters;
	}
	
	set filters(value: TCreatejsColorFilters) {
		if (value) {
			const list = [];
			
			for (var i = 0; i < value.length; i++) {
				const f = value[i];
				
				if (f instanceof createjs.ColorMatrixFilter) {
					continue;
				}
				
				const m = new filters.ColorMatrixFilter();
				m.matrix = [
					f.redMultiplier, 0, 0, 0, f.redOffset / 255,
					0, f.greenMultiplier, 0, 0, f.greenOffset / 255,
					0, 0, f.blueMultiplier, 0, f.blueOffset / 255,
					0, 0, 0, f.alphaMultiplier, f.alphaOffset / 255,
					0, 0, 0, 0, 1
				];
				list.push(m);
			}
			
			var o = this._pixiData.instance;
			var c = o.children;
			var n = new Container();
			var nc = this._pixiData.subInstance = n.addChild(new Container());
			
			while (c.length) {
				nc.addChild(c[0]);
			}
			
			o.addChild(n);
			o.filterContainer = nc;
			
			nc.updateTransform();
			nc.calculateBounds();
			
			const b = nc.getLocalBounds();
			const x = b.x;
			const y = b.y;
			
			for (var i = 0; i < nc.children.length; i++) {
				const child = nc.children[i];
				
				child.x -= x;
				child.y -= y;
				
				if (child instanceof PixiMovieClip) {
					const fc = child.filterContainer;
					if (fc) {
						fc.cacheAsBitmap = false;
					}
				}
			}
			n.x = x;
			n.y = y;
			
			nc.filters = list;
			nc.cacheAsBitmap = true;
		} else {
			const o = this._pixiData.instance;
			
			if (o.filterContainer) {
				const nc = this._pixiData.subInstance;
				const n = nc.parent;
				const c = nc.children;
				
				o.removeChildren();
				o.filterContainer = null;
				while (c.length) {
					const v = o.addChild(c[0]);
					v.x += n.x;
					v.y += n.y;
				}
				
				nc.filters = [];
				nc.cacheAsBitmap = false;
				
				this._pixiData.subInstance = o;
			}
		}
		
		this._createjsParams.filters = value;
	}
	
	addChild(child: IExpandedCreatejsDisplayObject) {
		this._pixiData.subInstance.addChild(child.pixi);
		
		return super.addChild(child);
	}
	
	addChildAt(child: IExpandedCreatejsDisplayObject, index: number) {
		this._pixiData.subInstance.addChildAt(child.pixi, index);
		
		return super.addChildAt(child, index);
	}
	
	removeChild(child: IExpandedCreatejsDisplayObject) {
		this._pixiData.subInstance.removeChild(child.pixi);
		
		return super.removeChild(child);
	}
	
	removeChildAt(index: number) {
		this._pixiData.subInstance.removeChildAt(index);
		
		return super.removeChildAt(index);
	}
	
	removeAllChldren() {
		this._pixiData.subInstance.removeChildren();
		
		return super.removeAllChldren();
	}
}

// temporary prototype
Object.defineProperties(CreatejsMovieClip.prototype, {
	_createjsParams: {
		value: createCreatejsMovieClipParams(),
		writable: true
	},
	_pixiData: {
		value: createPixiMovieClipData(createObject<CreatejsMovieClip>(CreatejsMovieClip.prototype)),
		writable: true
	}
});

