import * as PIXI from 'pixi.js';
import { CreatejsDisplayObject } from './DisplayObject';
import { CreatejsColorFilter } from './ColorFilter';

/**
 * @private
 */
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
	mask: CreatejsDisplayObject | null,
	filters: CreatejsColorFilter[] | null
};

/**
 * @private
 */
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
 * @private
 */
declare class PixiPoint extends PIXI.Point {}

/**
 * @private
 */
export type TPixiData = {
	regObj: PixiPoint,
	events: { [name: string]: Function[] }
};

/**
 * @private
 */
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

export function updateDisplayObjectChildren(self: CreatejsDisplayObject, e: TTickerData) {
	const list = self.children.slice();
	for (let i = 0,l = list.length; i < l; i++) {
		const child = list[i];
		if (!child.isVisible()) { continue; }
		//child.draw();
		child.updateForPixi(e);
	}
	
	return true;
}