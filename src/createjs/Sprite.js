import * as PIXI from 'pixi.js';
import { createPixiData, createOriginParams } from './core';
import { appendDisplayObjectDescriptor } from './append';

/**
 * @ignore
 */
export class PixiSprite extends PIXI.Sprite {
	constructor(cjs) {
		super();
		
		this._createjs = cjs;
	}
	
	get createjs() {
		return this._createjs;
	}
}

/**
 * @ignore
 */
function createSpritePixiData(cjs) {
	const pixi = new PixiSprite(cjs);
	
	return Object.assign(createPixiData(pixi.anchor), {
		instance: pixi
	});
}

/**
 * @ignore
 */
export class CreatejsSprite extends window.createjs.Sprite {
	constructor() {
		this._originParams = createOriginParams();
		this._pixiData = createSpritePixiData(this);
		
		super(...arguments);
	}
	
	initialize() {
		this._originParams = createOriginParams();
		this._pixiData = createSpritePixiData(this);
		
		return super.initialize(...arguments);
	}
	
	gotoAndStop() {
		super.gotoAndStop(...arguments);
		
		const frame = this.spriteSheet.getFrame(this.currentFrame);
		const baseTexture = PIXI.BaseTexture.from(frame.image);
		const texture = new PIXI.Texture(baseTexture, frame.rect);
		
		this._pixiData.instance.texture = texture;
	}
	
	get pixi() {
		return this._pixiData.instance;
	}
	
	updateForPixi() {
		return true;
	}
}

appendDisplayObjectDescriptor(CreatejsSprite);
window.createjs.Sprite = CreatejsSprite;