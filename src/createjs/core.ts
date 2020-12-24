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

export interface IOriginParam {
	x: number;
	y: number;
	scaleX: number;
	scaleY: number;
	regx: number;
	regy: number;
	skewX: number;
	skewY: number;
	rotation: number;
	visible: boolean;
	alpha: number;
	_off: boolean;
	mask: TCreatejsObject | null;
	filters: CreatejsColorFilter[] | null;
}

export function createOriginParams(): IOriginParam {
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
 * [[http://pixijs.download/release/docs/PIXI.Point.html | PIXI.Point]]
 */
export interface IPixiPoint extends PIXI.Point {}

export interface IPixiData {
	regObj: IPixiPoint;
	events: { [name: string]: Function[] };
};

export function createPixiData(regObj: IPixiPoint): IPixiData {
	return {
		regObj,
		events: {}
	};
}

export interface ITickerData {
	delta: number;
}

export function updateDisplayObjectChildren(self: TCreatejsObject, e: ITickerData) {
	const list = self.children.slice();
	for (let i = 0,l = list.length; i < l; i++) {
		const child = list[i];
		if (!child.isVisible()) { continue; }
		//child.draw();
		child.updateForPixi(e);
	}
	
	return true;
}