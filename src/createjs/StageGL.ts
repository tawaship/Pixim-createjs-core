import { updateDisplayObjectChildren, TTickerData } from './core';

/**
 * @ognore
 */
declare const window: any;

/**
 * @see https://createjs.com/docs/easeljs/classes/StageGL.html
 */
export class CreatejsStageGL extends window.createjs.StageGL {
	updateForPixi(props: TTickerData) {
		if (this.tickOnUpdate) { this.tick(props); }
		this.dispatchEvent("drawstart");
		updateDisplayObjectChildren(this, props);
		this.dispatchEvent("drawend");
	}
}