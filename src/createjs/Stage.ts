import { updateDisplayObjectChildren, TTickerData } from './core';

/**
 * @ognore
 */
declare const window: any;

/**
 * @see https://createjs.com/docs/easeljs/classes/Stage.html
 */
export class CreatejsStage extends window.createjs.Stage {
	updateForPixi(props: TTickerData) {
		if (this.tickOnUpdate) { this.tick(props); }
		this.dispatchEvent("drawstart");
		updateDisplayObjectChildren(this, props);
		this.dispatchEvent("drawend");
	}
}