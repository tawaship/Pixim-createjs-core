import * as PIXI from 'pixi.js';
import { TPixiData, TOriginParam } from './core';

/**
 * @ignore
 */
declare const window: any;

/**
 * @see http://pixijs.download/release/docs/PIXI.Text.html
 * @private
 */
export declare class PixiText extends PIXI.Text {}

/**
 * @see http://pixijs.download/release/docs/PIXI.Container.html
 * @private
 */
export declare class PixiTextContainer extends PIXI.Container {
	private _createjs: CreatejsText | null;
	private _text: PixiText;
	constructor(cjs: CreatejsText | null, text: PixiText);
	get createjs(): CreatejsText | null;
	get text(): PixiText;
}

/**
 * @private
 */
type TTextOriginParam = TOriginParam  & { text: string, font: string, color: string, textAlign: string, lineHeight: number, lineWidth: number };

/**
 * @private
 */
type TTextPixiData = TPixiData & { instance: PixiTextContainer };

/**
 * @see https://createjs.com/docs/easeljs/classes/Text.html
 */
export declare class CreatejsText extends window.createjs.Text {
	private _originParams: TTextOriginParam;
	private _pixiData: TTextPixiData;
	get pixi(): PixiTextContainer;
	updateForPixi(): boolean;
}