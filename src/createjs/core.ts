import * as PIXI from 'pixi.js';
import { CreatejsColorFilter } from './ColorFilter';

import { CreatejsStage } from './Stage';
import { CreatejsStageGL } from './StageGL';
import { CreatejsMovieClip } from './MovieClip';
import { CreatejsSprite } from './Sprite';
import { CreatejsShape } from './Shape';
import { CreatejsBitmap } from './Bitmap';
import { CreatejsGraphics } from './Graphics';
import { CreatejsText } from './Text';

export type TCreatejsObject =
	  CreatejsStage
	| CreatejsStageGL
	| CreatejsMovieClip
	| CreatejsSprite
	| CreatejsShape
	| CreatejsBitmap
	| CreatejsGraphics
	| CreatejsText;

export type TOriginParam = {
	x: number,
	y: number,
	scaleX: number,
	scaleY: number,
	regx: number,
	regy: number,
	skewX: number,
	skewY: number,
	rotation: number,
	visible: boolean,
	alpha: number,
	_off: boolean,
	mask: TCreatejsObject | null,
	filters: CreatejsColorFilter[] | null
};

export function createOriginParams(): TOriginParam {
	return {
		x: 0,
		y: 0,
		scaleX: 0,
		scaleY: 0,
		regx: 0,
		regy: 0,
		skewX: 0,
		skewY: 0,
		rotation: 0,
		visible: true,
		alpha: 1,
		_off: false,
		mask: null,
		filters: null
	};
}

/**
 * @see http://pixijs.download/release/docs/PIXI.Point.html
 */
export declare class PixiPoint extends PIXI.Point {}

export type TPixiData = {
	regObj: PixiPoint,
	events: { [name: string]: Function[] }
};

export function createPixiData(regObj: PixiPoint): TPixiData {
	return {
		regObj,
		events: {}
	};
}

/**
 * @since 1.0.9
 */
export type TTickerData = { delta: number };

export function updateDisplayObjectChildren(self: TCreatejsObject, e: TTickerData) {
	const list = self.children.slice();
	for (let i = 0,l = list.length; i < l; i++) {
		const child = list[i];
		if (!child.isVisible()) { continue; }
		//child.draw();
		child.updateForPixi(e);
	}
	
	return true;
}