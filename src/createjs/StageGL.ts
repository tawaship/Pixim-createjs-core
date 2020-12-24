import { updateDisplayObjectChildren, ITickerData } from './core';

/**
 * @ognore
 */
declare const window: any;

/**
 * [[https://createjs.com/docs/easeljs/classes/StageGL.html | createjs.StageGL]]
 */
export class CreatejsStageGL extends window.createjs.StageGL {
	updateForPixi(props: ITickerData) {
		if (this.tickOnUpdate) { this.tick(props); }
		this.dispatchEvent("drawstart");
		updateDisplayObjectChildren(this, props);
		this.dispatchEvent("drawend");
	}
}