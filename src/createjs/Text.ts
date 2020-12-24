import * as PIXI from 'pixi.js';
import { createPixiData, createOriginParams, IPixiData, IOriginParam, ITickerData } from './core';
import { appendDisplayObjectDescriptor } from './append';

/**
 * @ignore
 */
declare const window: any;

/**
 * [[http://pixijs.download/release/docs/PIXI.Text.html | PIXI.Text]]
 */
export class PixiText extends PIXI.Text {}

/**
 * [[http://pixijs.download/release/docs/PIXI.Container.html | PIXI.Container]]
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
function createTextOriginParam(text: string, font: string, color: string): ITextOriginParam {
	return Object.assign(createOriginParams(), {
		text: text,
		font: font,
		color: color,
		textAlign: 'left',
		lineHeight: 0,
		lineWidth: 0
	});
}

export interface ITextOriginParam extends IOriginParam {
	text: string;
	font: string;
	color: string;
	textAlign: string;
	lineHeight: number;
	lineWidth: number;
}

export interface ITextPixiData extends IPixiData {
	instance: PixiTextContainer;
}

/**
 * @ignore
 */
function createTextPixiData(cjs: CreatejsText | {}, text: PixiText): ITextPixiData {
	const pixi = new PixiTextContainer(cjs, text);
	
	return Object.assign(createPixiData(pixi.pivot), {
		instance: pixi
	});
}

/**
 * @ignore
 */
const CreatejsTextTemp = window.createjs.Text;

export interface IParsedText {
	fontSize: number;
	fontFamily: string;
	fontWeight?: string | number;
}

/**
 * [[https://createjs.com/docs/easeljs/classes/Text.html | createjs.Text]]
 */
export class CreatejsText extends window.createjs.Text {
	protected _originParams: ITextOriginParam;
	protected _pixiData: ITextPixiData;
	
	constructor(text: string, font: string, color: string = '#000000', ...args: any[]) {
		super(text, font, color, ...args);
		
		this._initForPixi(text, font, color, ...args);
		
		CreatejsTextTemp.call(this, text, font, color, ...args);
	}
	
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
	
	_parseFont(font): IParsedText {
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
	
	updateForPixi(e: ITickerData) {
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