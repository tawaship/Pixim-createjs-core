import createjs from '@tawaship/createjs-exporter';
import { updateDisplayObjectChildren, ITickerData, IExpandedCreatejsDisplayObject } from './core';

/**
 * [[https://createjs.com/docs/easeljs/classes/StageGL.html | createjs.StageGL]]
 */
export class CreatejsStageGL extends createjs.StageGL implements IExpandedCreatejsDisplayObject {
	updateForPixi(props: ITickerData) {
		if (this.tickOnUpdate) { this.tick(props); }
		this.dispatchEvent("drawstart");
		updateDisplayObjectChildren(this, props);
		this.dispatchEvent("drawend");
		
		return true;
	}
}