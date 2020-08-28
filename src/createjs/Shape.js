import * as PIXI from 'pixi.js';
import { createPixiData, createOriginParams } from './core';
import { appendDisplayObjectDescriptor } from './append';

/**
 * @ignore
 */
export class PixiShape extends PIXI.Container {
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
function createShapePixiData(cjs) {
	const pixi = new PixiShape(cjs);
	
	return Object.assign(createPixiData(pixi.pivot), {
		instance: pixi,
		masked: []
	});
}

/**
 * @ignore
 */
export class CreatejsShape extends window.createjs.Shape {
	constructor() {
		this._originParams = createOriginParams();
		this._pixiData = createShapePixiData(this);
		
		super(...arguments);
	}
	
	get graphics() {
		return this._graphics;
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
			this._pixiData.instance.addChild(value._pixiData.instance);
		}
		
		this._graphics = value;
	}
	
	get pixi() {
		return this._pixiData.instance;
	}
	
	updateForPixi() {
		return true;
	}
}

appendDisplayObjectDescriptor(CreatejsShape);
window.createjs.Shape = CreatejsShape;