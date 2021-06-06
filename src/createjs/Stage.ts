import createjs from '@tawaship/createjs-exporter';
import { updateDisplayObjectChildren, ITickerData, IExpandedCreatejsDisplayObject } from './core';

/**
 * [[https://createjs.com/docs/easeljs/classes/Stage.html | createjs.Stage]]
 */
export class CreatejsStage extends createjs.Stage implements IExpandedCreatejsDisplayObject {
	updateForPixi(props: ITickerData) {
		if (this.tickOnUpdate) { this.tick(props); }
		this.dispatchEvent("drawstart");
		updateDisplayObjectChildren(this, props);
		this.dispatchEvent("drawend");
		
		return true;
	}
}