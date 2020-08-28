import { updateDisplayObjectChildren } from './core';

export class CreatejsStageGL extends window.createjs.StageGL {
	updateForPixi(props) {
		if (this.tickOnUpdate) { this.tick(props); }
		this.dispatchEvent("drawstart");
		updateDisplayObjectChildren(this);
		this.dispatchEvent("drawend");
	}
}