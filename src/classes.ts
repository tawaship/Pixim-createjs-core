import * as PIXI from 'pixi.js';

/**
 * @see http://pixijs.download/release/docs/PIXI.Container.html
 * @private
 */
export class PixiMovieClip extends PIXI.Container {
	private _createjs: createjs.MovieClip;
	
	constructor(cjs: createjs.MovieClip) {
		super();
		
		this._createjs = cjs;
	}
	
	getCreatejs() {
		return this._createjs;
	}
}

/**
 * @see http://pixijs.download/release/docs/PIXI.Sprite.html
 * @private
 */
export class PixiSprite extends PIXI.Sprite {
	private _createjs: createjs.Sprite;
	
	constructor(cjs: createjs.Sprite) {
		super();
		
		this._createjs = cjs;
	}
	
	getCreatejs() {
		return this._createjs;
	}
}

/**
 * @see http://pixijs.download/release/docs/PIXI.Container.html
 * @private
 */
export class PixiShape extends PIXI.Container {
	private _createjs: createjs.Shape;
	
	constructor(cjs: createjs.Shape) {
		super();
		
		this._createjs = cjs;
	}
	
	getCreatejs() {
		return this._createjs;
	}
}

/**
 * @see http://pixijs.download/release/docs/PIXI.Graphics.html
 * @private
 */
export class PixiGraphics extends PIXI.Graphics {
	private _createjs: createjs.Graphics;
	
	constructor(cjs: createjs.Graphics) {
		super();
		
		this._createjs = cjs;
	}
	
	getCreatejs() {
		return this._createjs;
	}
}

/**
 * @see http://pixijs.download/release/docs/PIXI.Container.html
 * @private
 */
export class PixiTextContainer extends PIXI.Container {
	private _createjs: createjs.Text;
	private _text: PIXI.Text;
	
	constructor(cjs: createjs.Text, text: PIXI.Text) {
		super();
		
		this._createjs = cjs;
		this._text = text;
	}
	
	get text() {
		return this._text;
	}
	
	getCreatejs() {
		return this._createjs;
	}
}

/**
 * @see http://pixijs.download/release/docs/PIXI.Container.html
 * @private
 */
 export class PixiButtonHelper extends PIXI.Container {
	private _createjs: createjs.ButtonHelper;
	
	constructor(cjs: createjs.ButtonHelper) {
		super();
		
		this._createjs = cjs;
	}
	
	getCreatejs() {
		return this._createjs;
	}
}

/**
 * @see http://pixijs.download/release/docs/PIXI.Point.html
 * @private
 */
declare class PixiPoint extends PIXI.Point {}

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
	mask: createjs.DisplayObject | null,
	filters: createjs.ColorFilter[] | null
};

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
interface ICreatejsMixin {
	getPixi(): PIXI.DisplayObject;
}

export namespace createjs {
	/**
	 * @see https://createjs.com/docs/easeljs/classes/MovieClip.html
	 * @mixin
	 */
	export declare class MovieClip implements ICreatejsMixin {
		getPixi(): PixiMovieClip;
		private _originParams: TOriginParam;
		private _pixiData: TPixiData & { instance: PixiMovieClip };
	}
	
	/**
	 * @see https://createjs.com/docs/easeljs/classes/Sprite.html
	 * @mixin
	 */
	export declare class Sprite implements ICreatejsMixin {
		getPixi(): PixiSprite;
		private _originParams: TOriginParam;
		private _pixiData: TPixiData & { instance: PixiSprite };
	}
	
	/**
	 * @see https://createjs.com/docs/easeljs/classes/Shape.html
	 * @mixin
	 */
	export declare class Shape implements ICreatejsMixin {
		getPixi(): PixiShape;
		private _originParams: TOriginParam;
		private _pixiData: TPixiData & { instance: PixiShape, masked: PIXI.DisplayObject[] };
	}
	
	/**
	 * @see https://createjs.com/docs/easeljs/classes/Graphics.html
	 * @mixin
	 */
	export declare class Graphics implements ICreatejsMixin {
		getPixi(): PixiGraphics;
		private _originParams: TOriginParam;
		private _pixiData: TPixiData & { instance: PixiGraphics, stroleFill: number, strokeAlpha: number };
	}
	
	/**
	 * @see https://createjs.com/docs/easeljs/classes/Text.html
	 * @mixin
	 */
	export declare class Text implements ICreatejsMixin {
		getPixi(): PixiTextContainer;
		private _originParams: TOriginParam & { text: string, fonr: string, color: string, textAlign: string, lineHeight: number, lineWidth: number };
		private _pixiData: TPixiData & { instance: PixiTextContainer };
	}
	
	/**
	 * @see https://createjs.com/docs/easeljs/classes/ButtonHelper.html
	 * @mixin
	 */
	export declare class ButtonHelper implements ICreatejsMixin {
		getPixi(): PixiButtonHelper;
		private _originParams: TOriginParam;
		private _pixiData: TPixiData & { instance: PixiButtonHelper };
	}
	
	/**
	 * @see https://createjs.com/docs/easeljs/classes/DisplayObject.html
	 * @mixin
	 */
	export declare class DisplayObject {
	}
	
	/**
	 * @see https://createjs.com/docs/easeljs/classes/ColorFilter.html
	 * @mixin
	 */
	export declare class ColorFilter {
	}
}