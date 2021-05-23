import * as PIXI from 'pixi.js';
import { createjs } from './alias';
import { createPixiData, createCreatejsParams, IPixiData, ICreatejsParam, ITickerData, mixinPixiContainer, mixinCreatejsDisplayObject } from './core';
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
export class PixiTextContainer extends mixinPixiContainer(PIXI.Container) {
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
function createTextOriginParam(text: string, font: string, color: string): ICreatejsTextParam {
	return Object.assign(createCreatejsParams(), {
		text: text,
		font: font,
		color: color,
		textAlign: 'left',
		lineHeight: 0,
		lineWidth: 0
	});
}

export interface ICreatejsTextParam extends ICreatejsParam {
	text: string;
	font: string;
	color: string;
	textAlign: string;
	lineHeight: number;
	lineWidth: number;
}

export interface IPiximTextData extends IPixiData<PixiTextContainer> {

}

/**
 * @ignore
 */
function createPixiTextData(cjs: CreatejsText | {}, text: PixiText): IPiximTextData {
	const pixi = new PixiTextContainer(cjs, text);
	
	return createPixiData(pixi, pixi.pivot);
}

export interface IParsedText {
	fontSize: number;
	fontFamily: string;
	fontWeight?: string | number;
}

/**
 * @ignore
 */
const P = createjs.Text;

/**
 * [[https://createjs.com/docs/easeljs/classes/Text.html | createjs.Text]]
 */
export class CreatejsText extends mixinCreatejsDisplayObject<PixiTextContainer, ICreatejsTextParam>(createjs.Text) {
	protected _createjsParams: ICreatejsTextParam;
	protected _pixiData: IPiximTextData;
	
	constructor(text: string, font: string, color: string = '#000000', ...args: any[]) {
		super(text, font, color, ...args);
		
		this._initForPixi(text, font, color, ...args);
		
		P.call(this, text, font, color, ...args);
	}
	
	protected _initForPixi(text: string, font: string, color: string = '#000000', ...args: any[]) {
		this._createjsParams = createTextOriginParam(text, font, color);
		
		const _font = this._parseFont(font);
		
		const t = new PixiText(text, {
			fontWeight: _font.fontWeight,
			fontSize: _font.fontSize,
			fontFamily: _font.fontFamily,
			fill: this._parseColor(color),
			wordWrap: true
		});
		
		this._pixiData = createPixiTextData(this, t);
		this._pixiData.instance.addChild(t);
	}
	
	get text() {
		return this._createjsParams.text;
	}
	
	set text(text) {
		this._pixiData.instance.text.text = text;
		this._align(this.textAlign);
		
		this._createjsParams.text = text;
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
		return this._createjsParams.font;
	}
	
	set font(font) {
		const _font = this._parseFont(font);
		this._pixiData.instance.text.style.fontSize = _font.fontSize;
		this._pixiData.instance.text.style.fontFamily = _font.fontFamily;
		
		this._createjsParams.font = font;
	}
	
	_parseColor(color) {
		return parseInt(color.slice(1), 16);
	}
	
	get color() {
		return this._createjsParams.color;
	}
	
	set color(color) {
		this._pixiData.instance.text.style.fill = this._parseColor(color);
		
		this._createjsParams.color = color;
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
		return this._createjsParams.textAlign;
	}
	
	set textAlign(align) {
		this._pixiData.instance.text.style.align = align;
		this._align(align);
		
		this._createjsParams.textAlign = align;
	}
	
	get lineHeight() {
		return this._createjsParams.lineHeight;
	}
	
	set lineHeight(height) {
		this._pixiData.instance.text.style.lineHeight = height;
		
		this._createjsParams.lineHeight = height;
	}
	
	get lineWidth() {
		return this._createjsParams.lineWidth;
	}
	
	set lineWidth(width) {
		this._pixiData.instance.text.style.wordWrapWidth = width;
		this._align(this.textAlign);
		
		this._createjsParams.lineWidth = width;
	}
	
	get pixi() {
		return this._pixiData.instance;
	}
	
	updateForPixi(e: ITickerData) {
		return true;
	}
}

// temporary prototype
Object.defineProperties(CreatejsText.prototype, {
	_createjsParams: {
		value: createCreatejsParams(),
		writable: true
	},
	_pixiData: {
		value: createPixiTextData({}, new PixiText('')),
		writable: true
	}
});