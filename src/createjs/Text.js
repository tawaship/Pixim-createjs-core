import * as PIXI from 'pixi.js';
import { createPixiData, createOriginParams } from './core';
import { appendDisplayObjectDescriptor } from './append';

/**
 * @ignore
 */
export class PixiText extends PIXI.Text {
}

/**
 * @ignore
 */
export class PixiTextContainer extends PIXI.Container {
	constructor(cjs, text) {
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
function createTextOriginParam(text, font, color) {
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
 * @ignore
 */
function createTextPixiData(cjs, text) {
	const pixi = new PixiTextContainer(cjs, text);
	
	return Object.assign(createPixiData(pixi.pivot), {
		instance: pixi
	});
}

/**
 * @ignore
 */
export class CreatejsText extends window.createjs.Text {
	constructor(text, font, color) {
		this._originParams = createTextOriginParam(text, font, color);
		
		const _font = this._parseFont(font);
		
		const t = new PixiText(text, {
			fontSize: _font.fontSize,
			fontFamily: _font.fontFamily,
			fill: this._parseColor(color),
			wordWrap: true
		});
		
		this._pixiData = createTextPixiData(this, t);
		this._pixiData.instance.addChild(t);
		
		super(...arguments);
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
		
		return {
			fontSize: Number((p.shift() || '0px').replace('px', '')),
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
			this._pixiData.instance.text.x = -this.lineWidth / 2;
			return;
		}
		
		if (align === 'right') {
			this._pixiData.instance.text.x =  -this.lineWidth;
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
		
		this._originParams.lineWidth = width;
	}
	
	get pixi() {
		return this._pixiData.instance;
	}
	
	updateForPixi() {
		return true;
	}
}

appendDisplayObjectDescriptor(CreatejsText);