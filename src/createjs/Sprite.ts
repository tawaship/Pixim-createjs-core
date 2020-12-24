import * as PIXI from 'pixi.js';
import { createPixiData, createOriginParams, IPixiData, IOriginParam, ITickerData } from './core';
import { appendDisplayObjectDescriptor } from './append';

/**
 * @ignore
 */
declare const window: any;

/**
 * [[http://pixijs.download/release/docs/PIXI.Sprite.html | PIXI.Sprite]]
 */
export class PixiSprite extends PIXI.Sprite {
	private _createjs: CreatejsSprite | {};
	
	constructor(cjs: CreatejsSprite | {}) {
		super();
		
		this._createjs = cjs;
	}
	
	get createjs() {
		return this._createjs;
	}
}

export interface ISpriteOriginParam extends IOriginParam {

}

export interface ISpritePixiData extends IPixiData {
	instance: PixiSprite;
}

/**
 * @ignore
 */
function createSpritePixiData(cjs: CreatejsSprite | {}): ISpritePixiData {
	const pixi = new PixiSprite(cjs);
	
	return Object.assign(createPixiData(pixi.anchor), {
		instance: pixi
	});
}

/**
 * @ignore
 */
const CreatejsSpriteTemp = window.createjs.Sprite;

/**
 * [[https://createjs.com/docs/easeljs/classes/Sprite.html | createjs.Sprite]]
 */
export class CreatejsSprite extends window.createjs.Sprite {
	protected _originParams: ISpriteOriginParam;
	protected _pixiData: ISpritePixiData;
	
	constructor(...args: any[]) {
		super();
		
		this._initForPixi();
		
		CreatejsSpriteTemp.apply(this, arguments);
	}
	
	protected _initForPixi() {
		this._originParams = createOriginParams();
		this._pixiData = createSpritePixiData(this);
	}
	
	initialize(...args: any[]) {
		this._initForPixi();
		
		return super.initialize(...arguments);
	}
	
	gotoAndStop(...args: any[]) {
		super.gotoAndStop(...arguments);
		
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

appendDisplayObjectDescriptor(CreatejsSprite);

// temporary prototype
Object.defineProperties(CreatejsSprite.prototype, {
	_originParams: {
		value: createOriginParams(),
		writable: true
	},
	_pixiData: {
		value: createSpritePixiData({}),
		writable: true
	}
});