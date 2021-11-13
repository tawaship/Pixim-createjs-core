import { DisplayObject, Container, Point } from 'pixi.js';
import { CreatejsColorFilter } from './ColorFilter';
import { CreatejsButtonHelper } from './ButtonHelper';
import { CreatejsStage } from './Stage';
import { CreatejsStageGL } from './StageGL';
import { CreatejsMovieClip, PixiMovieClip } from './MovieClip';
import { CreatejsSprite } from './Sprite';
import { CreatejsShape } from './Shape';
import { CreatejsBitmap } from './Bitmap';
import { CreatejsGraphics } from './Graphics';
import { CreatejsText } from './Text';

type TCreatejsDisplayObject = any/* createjs.DisplayObject */;

/**
 * [[http://pixijs.download/release/docs/PIXI.Point.html | PIXI.Point]]
 */
declare class PixiPoint {};

export { Point as PixiPoint };

export interface ITickerData {
	delta: number;
}

export interface IPixiData<T extends DisplayObject> {
	regObj: Point;
	instance: T;
}

export function createPixiData<TPixiDisplayObject extends DisplayObject>(pixi: TPixiDisplayObject, regObj: Point): IPixiData<TPixiDisplayObject> {
	return {
		regObj,
		instance: pixi
	};
}

export type TCreatejsMask = CreatejsShape | null;

export type TCreatejsColorFilters = CreatejsColorFilter[] | null;

export interface ICreatejsParam {
	x: number;
	y: number;
	scaleX: number;
	scaleY: number;
	regX: number;
	regY: number;
	skewX: number;
	skewY: number;
	rotation: number;
	visible: boolean;
	alpha: number;
	_off: boolean;
	mask: CreatejsShape | null;
	filters: TCreatejsColorFilters;
}

export type TCreatejsObject =
	CreatejsStage
	| CreatejsStageGL
	| CreatejsMovieClip
	| CreatejsSprite
	| CreatejsShape
	| CreatejsBitmap
	| CreatejsGraphics
	| CreatejsText;

export function createCreatejsParams(): ICreatejsParam {
	return {
		x: 0,
		y: 0,
		scaleX: 0,
		scaleY: 0,
		regX: 0,
		regY: 0,
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

export interface IExpandedCreatejsDisplayObject extends TCreatejsDisplayObject {
	updateForPixi(e: ITickerData): boolean;
}

export function updateDisplayObjectChildren(cjs: IExpandedCreatejsDisplayObject, e: ITickerData) {
	const list = cjs.children.slice();
	for (let i = 0, l = list.length; i < l; i++) {
		const child = list[i];
		child.updateForPixi(e);
	}
	
	return true;
}