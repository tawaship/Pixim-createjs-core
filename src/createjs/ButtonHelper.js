import * as PIXI from 'pixi.js';
import { createPixiData, createOriginParams} from './core';
import { appendDisplayObjectDescriptor } from './append';

/**
 * @ignore
 */
export class PixiButtonHelper extends PIXI.Container {
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
function createButtonHelperPixiData(cjs) {
	const pixi = new PixiButtonHelper(cjs);
	
	return Object.assign(createPixiData(pixi.pivot), {
		instance: pixi
	});
}

/**
 * @ignore
 */
export class CreatejsButtonHelper extends window.createjs.ButtonHelper {
	constructor() {
		this._originParams = createOriginParams();
		this._pixiData = createButtonHelperPixiData(this);
		
		super(...arguments);
		
		const createjs = arguments[0];
		const pixi = createjs._pixiData.instance;
		
		const baseFrame = arguments[1];
		const overFrame = arguments[2];
		const downFrame = arguments[3];
		const hit = arguments[5];
		const hitFrame = arguments[6];
		
		hit.gotoAndStop(hitFrame);
		const hitPixi = pixi.addChild(hit._pixiData.instance);
		hitPixi.alpha = 0.00001
		
		let isOver = false;
		let isDown = false;
		
		hitPixi.on('pointerover', function() {
			isOver = true;
			if (isDown) {
				createjs.gotoAndStop(downFrame);
			} else {
				createjs.gotoAndStop(overFrame);
			}
		});
		
		hitPixi.on('pointerout', function() {
			isOver = false;
			
			if (isDown) {
				createjs.gotoAndStop(overFrame);
			} else {
				createjs.gotoAndStop(baseFrame);
			}
		});
		
		hitPixi.on('pointerdown', function() {
			isDown = true;
			createjs.gotoAndStop(downFrame);
		});
		
		hitPixi.on('pointerup', function() {
			isDown = false;
			if (isOver) {
				createjs.gotoAndStop(overFrame);
			} else {
				createjs.gotoAndStop(baseFrame);
			}
		});
		
		hitPixi.on('pointerupoutside', function() {
			isDown = false;
			if (isOver) {
				createjs.gotoAndStop(overFrame);
			} else {
				createjs.gotoAndStop(baseFrame);
			}
		});
		
		hitPixi.interactive = true;
		hitPixi.cursor = 'pointer';
	}
	
	get pixi() {
		return this._pixiData.instance;
	}
}

appendDisplayObjectDescriptor(CreatejsButtonHelper);
window.createjs.ButtonHelper = CreatejsButtonHelper;