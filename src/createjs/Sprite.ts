import * as PIXI from 'pixi.js';
import { createjs } from './alias';
import { createPixiData, createCreatejsParams, IPixiData, ICreatejsParam, ITickerData, mixinPixiContainer, mixinCreatejsDisplayObject } from './core';
import { appendDisplayObjectDescriptor } from './append';

/**
 * @ignore
 */
declare const window: any;

/**
 * [[http://pixijs.download/release/docs/PIXI.Sprite.html | PIXI.Sprite]]
 */
export class PixiSprite extends mixinPixiContainer(PIXI.Sprite) {
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

export interface IPixiSpriteData extends IPixiData<PixiSprite> {

}

/**
 * @ignore
 */
function createPixiSpriteData(cjs: CreatejsSprite | {}): IPixiSpriteData {
	const pixi = new PixiSprite(cjs);
	
	return createPixiData(pixi, pixi.anchor)
}

/**
 * @ignore
 */
const P = createjs.Sprite;

/**
 * [[https://createjs.com/docs/easeljs/classes/Sprite.html | createjs.Sprite]]
 */
export class CreatejsSprite extends mixinCreatejsDisplayObject<PixiSprite, ICreatejsSpriteParam>(createjs.Sprite) {
	protected _createjsParams: ICreatejsSpriteParam;
	protected _pixiData: IPixiSpriteData;
	
	constructor(...args: any[]) {
		super(...args);
		
		this._initForPixi();
		
		P.apply(this, args);
	}
	
	protected _initForPixi() {
		this._createjsParams = createCreatejsParams();
		this._pixiData = createPixiSpriteData(this);
	}
	
	initialize(...args: any[]) {
		this._initForPixi();
		
		return super.initialize(...args);
	}
	
	gotoAndStop(...args: any[]) {
		super.gotoAndStop(...args);
		
		const frame = this.spriteSheet.getFrame(this.currentFrame);
		const baseTexture = PIXI.BaseTexture.from(frame.image);
		const texture = new PIXI.Texture(baseTexture, frame.rect);
		
		this._pixiData.instance.texture = texture;
	}
	
	get pixi() {
		return this._pixiData.instance;
	}
	
	updateForPixi(e: ITickerData) {
		return true;
	}
}

// temporary prototype
Object.defineProperties(CreatejsSprite.prototype, {
	_createjsParams: {
		value: createCreatejsParams(),
		writable: true
	},
	_pixiData: {
		value: createPixiSpriteData({}),
		writable: true
	}
});