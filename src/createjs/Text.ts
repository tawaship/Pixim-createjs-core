import * as PIXI from 'pixi.js';
import { createPixiData, createOriginParams, TPixiData, TOriginParam, TTickerData } from './core';
import { appendDisplayObjectDescriptor } from './append';

/**
 * @ignore
 */
declare const window: any;

/**
 * @see http://pixijs.download/release/docs/PIXI.Text.html
 */
export class PixiText extends PIXI.Text {}

/**
 * @see http://pixijs.download/release/docs/PIXI.Container.html
 */
export class PixiTextContainer extends PIXI.Container {
	private _createjs: CreatejsText | {};
	private _text: PixiText;
	
	constructor(cjs: CreatejsText | {}, text: PixiText) {
		super();
		
		this._createjs = cjs;
		this._text = text;
	}
	
	get createjs() {
		return this._createjs;
	}
	
	get text() {
		return this._text;
	}
}

/**
 * @ignore
 */
function createTextOriginParam(text: string, font: string, color: string): TTextOriginParam {
	return Object.assign(createOriginParams(), {
		text: text,
		font: font,
		color: color,
		textAlign: 'left',
		lineHeight: 0,
		lineWidth: 0
	});
}

/**
 * @since 1.1.0
 */
export type TTextOriginParam = TOriginParam  & { text: string, font: string, color: string, textAlign: string, lineHeight: number, lineWidth: number };

/**
 * @since 1.1.0
 */
export type TTextPixiData = TPixiData & { instance: PixiTextContainer };

/**
 * @ignore
 */
function createTextPixiData(cjs: CreatejsText | {}, text: PixiText): TTextPixiData {
	const pixi = new PixiTextContainer(cjs, text);
	
	return Object.assign(createPixiData(pixi.pivot), {
		instance: pixi
	});
}

/**
 * @ignore
 */
const CreatejsTextTemp = window.createjs.Text;

/**
 * @private
 */
type TParsedText = {
	fontSize: number,
	fontFamily: string,
	fontWeight?: string | number
}

/**
 * @see https://createjs.com/docs/easeljs/classes/Text.html
 */
export class CreatejsText extends window.createjs.Text {
	protected _originParams: TTextOriginParam;
	protected _pixiData: TTextPixiData;
	
	constructor(text: string, font: string, color: string = '#000000', ...args: any[]) {
		super(...arguments);
		
		this._initForPixi(text, font, color, ...args);
		
		CreatejsTextTemp.apply(this, arguments);
	}
	
	/**
	 * @since 1.1.0
	 */
	protected _initForPixi(text: string, font: string, color: string = '#000000', ...args: any[]) {
		this._originParams = createTextOriginParam(text, font, color);
		
		const _font = this._parseFont(font);
		
		const t = new PixiText(text, {
			fontWeight: _font.fontWeight,
			fontSize: _font.fontSize,
			fontFamily: _font.fontFamily,
			fill: this._parseColor(color),
			wordWrap: true
		});
		
		this._pixiData = createTextPixiData(this, t);
		this._pixiData.instance.addChild(t);
	}
	
	get text() {
		return this._originParams.text;
	}
	
	set text(text) {
		this._pixiData.instance.text.text = text;
		this._align(this.textAlign);
		
		this._originParams.text = text;
	}
	
	_parseFont(font) {
		const p = font.split(' ');
		
		let w = 'normal';
		let s = p.shift();
		
		if (s.indexOf('px') === -1) {
			w = s;
			s = p.shift();
		}
		
		return {
			fontWeight: w,
			fontSize: Number((s || '0px').replace('px', '')),
			fontFamily: p.join(' ').replace(/'/g, '') //'
		};
	}
	
	get font() {
		return this._originParams.font;
	}
	
	set font(font) {
		const _font = this._parseFont(font);
		this._pixiData.instance.text.style.fontSize = _font.fontSize;
		this._pixiData.instance.text.style.fontFamily = _font.fontFamily;
		
		this._originParams.font = font;
	}
	
	_parseColor(color) {
		return parseInt(color.slice(1), 16);
	}
	
	get color() {
		return this._originParams.color;
	}
	
	set color(color) {
		this._pixiData.instance.text.style.fill = this._parseColor(color);
		
		this._originParams.color = color;
	}
	
	_align(align) {
		if (align === 'left') {
			this._pixiData.instance.text.x = 0;
			return;
		}
		
		if (align === 'center') {
			this._pixiData.instance.text.x = -this._pixiData.instance.text.width / 2;
			return;
		}
		
		if (align === 'right') {
			this._pixiData.instance.text.x =  -this._pixiData.instance.text.width;
			return;
		}
	}
	
	get textAlign() {
		return this._originParams.textAlign;
	}
	
	set textAlign(align) {
		this._pixiData.instance.text.style.align = align;
		this._align(align);
		
		this._originParams.textAlign = align;
	}
	
	get lineHeight() {
		return this._originParams.lineHeight;
	}
	
	set lineHeight(height) {
		this._pixiData.instance.text.style.lineHeight = height;
		
		this._originParams.lineHeight = height;
	}
	
	get lineWidth() {
		return this._originParams.lineWidth;
	}
	
	set lineWidth(width) {
		this._pixiData.instance.text.style.wordWrapWidth = width;
		this._align(this.textAlign);
		
		this._originParams.lineWidth = width;
	}
	
	get pixi() {
		return this._pixiData.instance;
	}
	
	updateForPixi(e: TTickerData) {
		return true;
	}
}

appendDisplayObjectDescriptor(CreatejsText);

// temporary prototype
Object.defineProperties(CreatejsText.prototype, {
	_originParams: {
		value: createOriginParams(),
		writable: true
	},
	_pixiData: {
		value: createTextPixiData({}, new PixiText('')),
		writable: true
	}
});