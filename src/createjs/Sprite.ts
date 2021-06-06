import { Sprite, Texture, BaseTexture } from 'pixi.js';
import createjs from '@tawaship/createjs-module';
import { createPixiData, createCreatejsParams, IPixiData, ICreatejsParam, ITickerData, TCreatejsMask, IExpandedCreatejsDisplayObject } from './core';
import { createObject, DEG_TO_RAD } from './utils';
import { EventManager, TCreatejsInteractionEvent, ICreatejsInteractionEventDelegate } from './EventManager';
import { CreatejsButtonHelper } from './ButtonHelper';
import { CreatejsShape } from './Shape';

/**
 * [[http://pixijs.download/release/docs/PIXI.Sprite.html | PIXI.Sprite]]
 */
export class PixiSprite extends Sprite {
	private _createjs: CreatejsSprite | {};
	
	constructor(cjs: CreatejsSprite | {}) {
		super();
		
		this._createjs = cjs;
	}
	
	get createjs() {
		return this._createjs;
	}
}

export interface ICreatejsSpriteParam extends ICreatejsParam {

}

/**
 * @ignore
 */
function createCreatejsSpriteParams(): ICreatejsSpriteParam {
	return createCreatejsParams();
}

export interface IPixiSpriteData extends IPixiData<PixiSprite> {

}

/**
 * @ignore
 */
function createPixiSpriteData(cjs: CreatejsSprite | {}): IPixiSpriteData {
	const pixi = new PixiSprite(cjs);
	
	return createPixiData<PixiSprite>(pixi, pixi.anchor)
}

/**
 * @ignore
 */
const P = createjs.Sprite;

/**
 * [[https://createjs.com/docs/easeljs/classes/Sprite.html | createjs.Sprite]]
 */
export class CreatejsSprite extends createjs.Sprite implements IExpandedCreatejsDisplayObject {
	protected _pixiData: IPixiSpriteData;
	protected _createjsParams: ICreatejsSpriteParam;
	private _createjsEventManager: EventManager;
	
	constructor(...args: any[]) {
		super(...args);
		
		this._pixiData = createPixiSpriteData(this);
		this._createjsParams = createCreatejsSpriteParams();
		this._createjsEventManager = new EventManager(this);
		
		P.apply(this, args);
	}
	
	initialize(...args: any[]) {
		this._pixiData = createPixiSpriteData(this);
		this._createjsParams = createCreatejsSpriteParams();
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
	
	gotoAndStop(...args: any[]) {
		super.gotoAndStop(...args);
		
		const frame = this.spriteSheet.getFrame(this.currentFrame);
		const baseTexture = BaseTexture.from(frame.image);
		const texture = new Texture(baseTexture, frame.rect);
		
		this._pixiData.instance.texture = texture;
	}
}

// temporary prototype
Object.defineProperties(CreatejsSprite.prototype, {
	_createjsParams: {
		value: createCreatejsSpriteParams(),
		writable: true
	},
	_pixiData: {
		value: createPixiSpriteData(createObject<CreatejsSprite>(CreatejsSprite.prototype)),
		writable: true
	}
});