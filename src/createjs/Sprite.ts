import { Sprite, Texture, BaseTexture } from 'pixi.js';
import { createjs } from './alias';
import { createPixiData, createCreatejsParams, IPixiData, ICreatejsParam, ITickerData, mixinPixiContainer, mixinCreatejsDisplayObject } from './core';
import { createObject } from './utils';

/**
 * [[http://pixijs.download/release/docs/PIXI.Sprite.html | PIXI.Sprite]]
 */
export class PixiSprite extends mixinPixiContainer(Sprite) {
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
	
	return createPixiData(pixi, pixi.anchor)
}

/**
 * @ignore
 */
const P = createjs.Sprite;

/**
 * [[https://createjs.com/docs/easeljs/classes/Sprite.html | createjs.Sprite]]
 */
export class CreatejsSprite extends mixinCreatejsDisplayObject<IPixiSpriteData, ICreatejsSpriteParam>(createjs.Sprite) {
	constructor(...args: any[]) {
		super(...args);
		
		this._initForPixi();
		
		P.apply(this, args);
	}
	
	private _initForPixi() {
		this._createjsParams = createCreatejsSpriteParams();
		this._pixiData = createPixiSpriteData(this);
	}
	
	initialize(...args: any[]) {
		this._initForPixi();
		
		return super.initialize(...args);
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