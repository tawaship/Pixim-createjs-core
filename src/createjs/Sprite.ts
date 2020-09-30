import * as PIXI from 'pixi.js';
import { createPixiData, createOriginParams, TPixiData, TOriginParam, TTickerData } from './core';
import { appendDisplayObjectDescriptor } from './append';

/**
 * @ignore
 */
declare const window: any;

/**
 * @see http://pixijs.download/release/docs/PIXI.Sprite.html
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

/**
 * @since 1.1.0
 */
export type TSpriteOriginParam = TOriginParam;

/**
 * @since 1.1.0
 */
export type TSpritePixiData = TPixiData & { instance: PixiSprite };

/**
 * @ignore
 */
function createSpritePixiData(cjs: CreatejsSprite | {}): TSpritePixiData {
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
 * @see https://createjs.com/docs/easeljs/classes/Sprite.html
 */
export class CreatejsSprite extends window.createjs.Sprite {
	protected _originParams: TSpriteOriginParam;
	protected _pixiData: TSpritePixiData;
	
	constructor(...args: any[]) {
		super();
		
		this._initForPixi();
		
		CreatejsSpriteTemp.apply(this, arguments);
	}
	
	/**
	 * @since 1.1.0
	 */
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
	
	updateForPixi(e: TTickerData) {
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