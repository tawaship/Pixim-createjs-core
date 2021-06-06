import { Container, Text } from 'pixi.js';
import createjs from '@tawaship/createjs-exporter';
import { createPixiData, createCreatejsParams, IPixiData, ICreatejsParam, ITickerData, TCreatejsMask, IExpandedCreatejsDisplayObject } from './core';
import { createObject, DEG_TO_RAD } from './utils';
import { EventManager, TCreatejsInteractionEvent, ICreatejsInteractionEventDelegate } from './EventManager';
import { CreatejsButtonHelper } from './ButtonHelper';
import { CreatejsShape } from './Shape';

/**
 * [[http://pixijs.download/release/docs/PIXI.Text.html | PIXI.Text]]
 */
export class PixiText extends Text {}

/**
 * [[http://pixijs.download/release/docs/PIXI.Container.html | PIXI.Container]]
 */
export class PixiTextContainer extends Container {
	private _createjs: CreatejsText;
	private _text: PixiText;
	
	constructor(cjs: CreatejsText, text: PixiText) {
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

export type TTextAlign = 'left' | 'center' | 'right';

/**
 * @ignore
 */
const DEF_ALIGN: TTextAlign = 'left';

export interface ICreatejsTextParam extends ICreatejsParam {
	text: string;
	font: string;
	color: string;
	textAlign: TTextAlign;
	lineHeight: number;
	lineWidth: number;
}

/**
 * @ignore
 */
function createCreatejsTextParams(text: string, font: string, color: string): ICreatejsTextParam {
	return Object.assign(createCreatejsParams(), {
		text: text,
		font: font,
		color: color,
		textAlign: DEF_ALIGN,
		lineHeight: 0,
		lineWidth: 0
	});
}

export interface IPixiTextData extends IPixiData<PixiTextContainer> {

}

/**
 * @ignore
 */
function createPixiTextData(cjs: CreatejsText, text: PixiText): IPixiTextData {
	const pixi = new PixiTextContainer(cjs, text);
	
	return createPixiData<PixiTextContainer>(pixi, pixi.pivot);
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
export class CreatejsText extends createjs.Text implements IExpandedCreatejsDisplayObject {
	protected _pixiData: IPixiTextData;
	protected _createjsParams: ICreatejsTextParam;
	private _createjsEventManager: EventManager;
	
	constructor(text: string, font: string, color: string = '#000000', ...args: any[]) {
		super(text, font, color, ...args);
		
		this._createjsParams = createCreatejsTextParams(text, font, color);
		
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
		
		this._createjsEventManager = new EventManager(this);
		
		P.call(this, text, font, color, ...args);
	}
	
	get pixi() {
		return this._pixiData.instance;
	}
	
	updateForPixi(e: ITickerData) {
		return true;
	}
	
	get x() {
		return this._createjsParams.x;
	}
	
	set x(value) {
		this._pixiData.instance.x = value;
		this._createjsParams.x = value;
	}
	
	get y() {
		return this._createjsParams.y;
	}
	
	set y(value) {
		this._pixiData.instance.y = value;
		this._createjsParams.y = value;
	}
	
	get scaleX() {
		return this._createjsParams.scaleX;
	}
		
	set scaleX(value) {
		this._pixiData.instance.scale.x = value;
		this._createjsParams.scaleX = value;
	}
	
	get scaleY() {
		return this._createjsParams.scaleY;
	}
	
	set scaleY(value) {
		this._pixiData.instance.scale.y = value;
		this._createjsParams.scaleY = value;
	}
	
	get skewX() {
		return this._createjsParams.skewX;
	}
	
	set skewX(value) {
		this._pixiData.instance.skew.x = -value * DEG_TO_RAD;
		this._createjsParams.skewX = value;
	}
	
	get skewY() {
		return this._createjsParams.skewY;
	}
	
	set skewY(value) {
		this._pixiData.instance.skew.y = value * DEG_TO_RAD;
		this._createjsParams.skewY = value;
	}
	
	get regX() {
		return this._createjsParams.regX;
	}
	
	set regX(value) {
		this._pixiData.regObj.x = value;
		this._createjsParams.regX = value;
	}
	
	get regY() {
		return this._createjsParams.regY;
	}
	
	set regY(value) {
		this._pixiData.regObj.y = value;
		this._createjsParams.regY = value;
	}
	
	get rotation() {
		return this._createjsParams.rotation;
	}
	
	set rotation(value) {
		this._pixiData.instance.rotation = value * DEG_TO_RAD;
		this._createjsParams.rotation = value;
	}
	
	get visible() {
		return this._createjsParams.visible;
	}
	
	set visible(value) {
		value = !!value;
		this._pixiData.instance.visible = value;
		this._createjsParams.visible = value;
	}
	
	get alpha() {
		return this._createjsParams.alpha;
	}
	
	set alpha(value) {
		this._pixiData.instance.alpha = value;
		this._createjsParams.alpha = value;
	}
	
	get _off() {
		return this._createjsParams._off;
	}
	
	set _off(value) {
		this._pixiData.instance.renderable = !value;
		this._createjsParams._off = value;
	}
	
	addEventListener(type: TCreatejsInteractionEvent | string, cb: ICreatejsInteractionEventDelegate | CreatejsButtonHelper, ...args: any[]) {
		if (!(cb instanceof CreatejsButtonHelper)) {
			if (type === 'mousedown' || type === 'rollover' || type === 'rollout' || type === 'pressmove' || type === 'pressup') {
				this._createjsEventManager.add(this._pixiData.instance, type, cb);
			}
		}
		
		return super.addEventListener(type, cb, ...args);
	}
	
	removeEventListener(type: TCreatejsInteractionEvent | string, cb: ICreatejsInteractionEventDelegate, ...args: any[]) {
		if (!(cb instanceof CreatejsButtonHelper)) {
			if (type === 'mousedown' || type === 'rollover' || type === 'rollout' || type === 'pressmove' || type === 'pressup') {
				this._createjsEventManager.remove(this._pixiData.instance, type, cb);
			}
		}
		
		return super.removeEventListener(type, cb, ...args);
	}
	
	get mask() {
		return this._createjsParams.mask;
	}
	
	set mask(value: TCreatejsMask) {
		if (value) {
			value.masked.push(this._pixiData.instance);
			this._pixiData.instance.mask = value.pixi;
			
			this._pixiData.instance.once('added', () => {
				this._pixiData.instance.parent.addChild(value.pixi);
			});
		} else {
			this._pixiData.instance.mask = null;
		}
		
		this._createjsParams.mask = value;
	}
	
	get text() {
		return this._createjsParams.text;
	}
	
	set text(text) {
		this._pixiData.instance.text.text = text;
		this._align(this.textAlign);
		
		this._createjsParams.text = text;
	}
	
	private _parseFont(font: string): IParsedText {
		const p = font.split(' ');
		
		let w = 'normal';
		let s = p.shift() || '';
		
		if (s.indexOf('px') === -1) {
			w = s;
			s = p.shift() || '';
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
	
	private _parseColor(color: string) {
		return parseInt(color.slice(1), 16);
	}
	
	get color() {
		return this._createjsParams.color;
	}
	
	set color(color) {
		this._pixiData.instance.text.style.fill = this._parseColor(color);
		
		this._createjsParams.color = color;
	}
	
	private _align(align: TTextAlign) {
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
}

// temporary prototype
Object.defineProperties(CreatejsText.prototype, {
	_createjsParams: {
		value: createCreatejsTextParams('', '', ''),
		writable: true
	},
	_pixiData: {
		value: createPixiTextData(createObject<CreatejsText>(CreatejsText.prototype), new PixiText('')),
		writable: true
	}
});