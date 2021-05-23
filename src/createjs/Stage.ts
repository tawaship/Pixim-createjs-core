import { createjs } from './alias';
import { updateDisplayObjectChildren, ITickerData, mixinPixiContainer, mixinCreatejsDisplayObject } from './core';

/**
 * [[https://createjs.com/docs/easeljs/classes/Stage.html | createjs.Stage]]
 */
export class CreatejsStage extends createjs.Stage {
	updateForPixi(props: ITickerData) {
		if (this.tickOnUpdate) { this.tick(props); }
		this.dispatchEvent("drawstart");
		updateDisplayObjectChildren(this, props);
		this.dispatchEvent("drawend");
	}
}