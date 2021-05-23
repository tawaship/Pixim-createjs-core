import { createjs } from './alias';
import { updateDisplayObjectChildren, ITickerData, mixinPixiContainer, mixinCreatejsDisplayObject } from './core';

/**
 * [[https://createjs.com/docs/easeljs/classes/StageGL.html | createjs.StageGL]]
 */
export class CreatejsStageGL extends createjs.StageGL {
	updateForPixi(props: ITickerData) {
		if (this.tickOnUpdate) { this.tick(props); }
		this.dispatchEvent("drawstart");
		updateDisplayObjectChildren(this, props);
		this.dispatchEvent("drawend");
	}
}