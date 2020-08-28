import * as PIXI from 'pixi.js';
import { createPixiData, createOriginParams, updateDisplayObjectChildren } from './core';
import { appendDisplayObjectDescriptor } from './append';

/**
 * @ignore
 */
export class PixiMovieClip extends PIXI.Container {
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
function createMovieClipPixiData(cjs) {
	const pixi = new PixiMovieClip(cjs);
	
	return Object.assign(createPixiData(pixi.pivot), {
		instance: pixi,
		subInstance: pixi
	});
}

/**
 * @ignore
 */
export class CreatejsMovieClip extends window.createjs.MovieClip {
	constructor() {
		this._originParams = createOriginParams();
		this._pixiData = createMovieClipPixiData(this);
		
		super(...arguments);
	}
	
	initialize() {
		this._originParams = createOriginParams();
		this._pixiData = createMovieClipPixiData(this);
		
		return super.initialize(...arguments);
	}
	
	addChild(child) {
		this._pixiData.subInstance.addChild(child._pixiData.instance);
		
		return super.addChild(child);
	}
	
	addChildAt(child, index) {
		this._pixiData.subInstance.addChildAt(child._pixiData.instance, index);
		
		return super.addChildAt(child, index);
	}
	
	removeChild(child) {
		this._pixiData.subInstance.removeChild(child._pixiData.instance);
		
		return super.removeChild(child);
	}
	
	removeChildAt(index) {
		this._pixiData.subInstance.removeChildAt(index);
		
		return super.removeChildAt(index);
	}
	
	removeAllChldren() {
		this._pixiData.subInstance.removeChildren();
		
		return super.removeAllChldren();
	}
	
	get pixi() {
		return this._pixiData.instance;
	}
	
	updateForPixi(e) {
		this._updateState();
		
		return updateDisplayObjectChildren(this, e);
	}
}

appendDisplayObjectDescriptor(CreatejsMovieClip);