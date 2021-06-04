import { TCreatejsObject } from './core';
import { DisplayObject } from 'pixi.js';

export type TCreatejsInteractionEvent = 'mousedown' | 'rollover' | 'rollout' | 'pressmove' | 'pressup';

export type TPixiInteractionEvent = 'pointerdown' | 'pointerover' | 'pointerout' | 'pointermove' | 'pointerup' | 'pointerupoutside';

export interface ICreatejsInteractionEventDelegate {
	 (e: any): void;
}

export interface IPixiInteractionEventDelegate {
	 (e: any): void;
}

export interface ICreatejsInteractionEventData {
	types: TPixiInteractionEvent[];
	factory(cb: ICreatejsInteractionEventDelegate): IPixiInteractionEventDelegate;
}

export class EventManager {
	private _isDown: boolean = false;
	private _events: { [name in TPixiInteractionEvent]: { func: IPixiInteractionEventDelegate, origin: ICreatejsInteractionEventDelegate  }[] };
	private _data: { [name in TCreatejsInteractionEvent]: ICreatejsInteractionEventData };
	
	constructor(cjs: TCreatejsObject) {
		this._events = {
			pointerdown: [],
			pointerover: [],
			pointerout: [],
			pointermove: [],
			pointerup: [],
			pointerupoutside: []
		};
		
		this._data = {
			mousedown:{
				types: ['pointerdown'],
				factory: (cb: ICreatejsInteractionEventDelegate) => {
					return this._mousedownFactory(cjs, cb);
				}
			},
			rollover: {
				types: ['pointerover'],
				factory: (cb: ICreatejsInteractionEventDelegate) => {
					return this._rolloverFactory(cjs, cb);
				}
			},
			rollout: {
				types: ['pointerout'],
				factory: (cb: ICreatejsInteractionEventDelegate) => {
					return this._rolloutFactory(cjs, cb);
				}
			},
			pressmove: {
				types: ['pointermove'],
				factory: (cb: ICreatejsInteractionEventDelegate) => {
					console.log(cb)
					return this._pressmoveFactory(cjs, cb);
				}
			},
			pressup: {
				types: ['pointerup', 'pointerupoutside'],
				factory: (cb: ICreatejsInteractionEventDelegate) => {
					return this._pressupFactory(cjs, cb);
				}
			}
		}
	}
	
	add(pixi: DisplayObject, type: TCreatejsInteractionEvent, cb: ICreatejsInteractionEventDelegate) {
		const data = this._data[type];
		
		const types = data.types;
		const func = data.factory(cb);
		
		for (let i = 0; i < types.length; i++) {
			const t = types[i];
			this._events[t].push({ func, origin: cb });
			
			pixi.on(t, func);
		}
		
		pixi.interactive = true;
	}
	
	remove(pixi: DisplayObject, type: TCreatejsInteractionEvent, cb: ICreatejsInteractionEventDelegate) {
		const data = this._data[type];
		
		const types = data.types;
		
		for (let i = 0; i < types.length; i++) {
			const t = types[i];
			
			const list = this._events[t];
			
			if (list) {
				for (var j = list.length - 1; j >= 0; j--) {
					if (list[j].origin === cb) {
						pixi.off(t, list[j].func);
						
						list.splice(j, 1);
						break;
					}
				}
				
				if (list.length === 0) {
					this._events[t] = [];
				}
			}
		}
	}
	
	private _mousedownFactory(cjs: TCreatejsObject, cb: ICreatejsInteractionEventDelegate) {
		return (e: any) => {
			e.currentTarget = e.currentTarget.createjs;
			
			e.target = e.target.createjs;
			const ev = e.data;
			e.rawX = ev.global.x;
			e.rawY = ev.global.y;
			
			this._isDown = true;
			
			cb(e);
		};
	}
	
	private _rolloverFactory(cjs: TCreatejsObject, cb: ICreatejsInteractionEventDelegate) {
		return (e: any) => {
			e.currentTarget = e.currentTarget.createjs;
			
			e.target = e.currentTarget.createjs;
			const ev = e.data;
			e.rawX = ev.global.x;
			e.rawY = ev.global.y;
			
			this._isDown = true;
			
			cb(e);
		};
	}
	
	private _rolloutFactory(cjs: TCreatejsObject, cb: ICreatejsInteractionEventDelegate) {
		return (e: any) => {
			e.currentTarget = e.currentTarget.createjs;
			
			e.target = e.currentTarget.createjs;
			const ev = e.data;
			e.rawX = ev.global.x;
			e.rawY = ev.global.y;
			
			this._isDown = true;
			
			cb(e);
		};
	}
	
	private _pressmoveFactory(cjs: TCreatejsObject, cb: ICreatejsInteractionEventDelegate) {
		return (e: any) => {
			if (!this._isDown) {
				return;
			}
			
			e.currentTarget = cjs;
			
			e.target = e.target && e.target.createjs;
			const ev = e.data;
			e.rawX = ev.global.x;
			e.rawY = ev.global.y;
			
			cb(e);
		};
	}
	
	private _pressupFactory(cjs: TCreatejsObject, cb: ICreatejsInteractionEventDelegate) {
		return (e: any) => {
			if (!this._isDown) {
				return;
			}
			
			e.currentTarget = cjs;
			
			this._isDown = false;
			
			e.target = e.target && e.target.createjs;
			const ev = e.data;
			e.rawX = ev.global.x;
			e.rawY = ev.global.y;
			
			cb(e);
		};
	}
}