import { createjs } from './core';
/**
 * @ignore
 */
let _downInstance;

/**
 * @ignore
 */
let _isDown = false;

/**
 * @ignore
 */
const EventMap = {
	mousedown: {
		types: ['pointerdown'],
		factory: function(self, cb) {
			return function(e) {
				e.currentTarget = e.currentTarget.createjs;
				
				e.target = e.target.createjs;
				const ev = e.data;
				e.rawX = ev.global.x;
				e.rawY = ev.global.y;
				
				_isDown = true;
				
				cb(e);
			};
		}
	},
	/*
	mouseup: {
		types: ['pointerup'],
		factory: function(self, cb) {
			return function(e) {
				e.currentTarget = e.currentTarget.createjs;
				
				e.target = e.target.createjs;
				const ev = e.data;
				e.rawX = ev.global.x;
				e.rawY = ev.global.y;
				
				_isDown = true;
				
				cb(e);
			};
		}
	},
	*/
	rollover: {
		types: ['pointerover'],
		factory: function(self, cb) {
			return function(e) {
				e.currentTarget = e.currentTarget.createjs;
				
				e.target = e.currentTarget.createjs;
				const ev = e.data;
				e.rawX = ev.global.x;
				e.rawY = ev.global.y;
				
				_isDown = true;
				
				cb(e);
			};
		}
	},
	rollout: {
		types: ['pointerout'],
		factory: function(self, cb) {
			return function(e) {
				e.currentTarget = e.currentTarget.createjs;
				
				e.target = e.currentTarget.createjs;
				const ev = e.data;
				e.rawX = ev.global.x;
				e.rawY = ev.global.y;
				
				_isDown = true;
				
				cb(e);
			};
		}
	},
	pressmove:{
		types: ['pointermove'],
		factory:  function(self, cb) {
			return function(e) {
				if (!_isDown) {
					return;
				}
				
				e.currentTarget = self;
				
				e.target = e.target && e.target.createjs;
				const ev = e.data;
				e.rawX = ev.global.x;
				e.rawY = ev.global.y;
				
				cb(e);
			};
		}
	},
	pressup: {
		types: ['pointerup', 'pointeupoutside'],
		factory: function(self, cb) {
			return function(e) {
				if (!_isDown) {
					return;
				}
				
				e.currentTarget = self;
				
				_isDown = false;
				
				e.target = e.target && e.target.createjs;
				const ev = e.data;
				e.rawX = ev.global.x;
				e.rawY = ev.global.y;
				
				cb(e);
			};
		}
	}
}

/**
 * @ignore
 */
const DEG_TO_RAD = Math.PI / 180;

/**
 * @ignore
 */
const appendixDescriptor = {
	x: {
		get: function() {
			return this._createjsParams.x;
		},
		
		set: function(value) {
			this._pixiData.instance.x = value;
			return this._createjsParams.x = value;
		}
	},
	y: {
		get: function() {
			return this._createjsParams.y;
		},
		
		set: function(value) {
			this._pixiData.instance.y = value;
			return this._createjsParams.y = value;
		}
	},
	scaleX: {
		get: function() {
			return this._createjsParams.scaleX;
		},
		
		set: function(value) {
			this._pixiData.instance.scale.x = value;
			return this._createjsParams.scaleX = value;
		}
	},
	scaleY: {
		get: function() {
			return this._createjsParams.scaleY;
		},
		
		set: function(value) {
			this._pixiData.instance.scale.y = value;
			return this._createjsParams.scaleY = value;
		}
	},
	skewX: {
		get: function() {
			return this._createjsParams.skewX;
		},
		
		set: function(value) {
			this._pixiData.instance.skew.x = -value * DEG_TO_RAD;
			return this._createjsParams.skewX = value;
		}
	},
	skewY: {
		get: function() {
			return this._createjsParams.skewY;
		},
		
		set: function(value) {
			this._pixiData.instance.skew.y = value * DEG_TO_RAD;
			return this._createjsParams.skewY = value;
		}
	
	},
	regX: {
		get: function() {
			return this._createjsParams.regX;
		},
		
		set: function(value) {
			this._pixiData.regObj.x = value;
			return this._createjsParams.regX = value;
		}
	},
	regY: {
		get: function() {
			return this._createjsParams.regY;
		},
		
		set: function(value) {
			this._pixiData.regObj.y = value;
			return this._createjsParams.regY = value;
		}
	},
	rotation: {
		get: function() {
			return this._createjsParams.rotation;
		},
		
		set: function(value) {
			this._pixiData.instance.rotation = value * DEG_TO_RAD;
			return this._createjsParams.rotation = value;
		}
	},
	visible: {
		get: function() {
			return this._createjsParams.visible;
		},
		
		set: function(value) {
			value = !!value;
			this._pixiData.instance.visible = value;
			return this._createjsParams.visible = value;
		}
	},
	alpha: {
		get: function() {
			return this._createjsParams.alpha;
		},
		
		set: function(value) {
			this._pixiData.instance.alpha = value;
			return this._createjsParams.alpha = value;
		}
	},
	_off: {
		get: function() {
			return this._createjsParams._off;
		},
		
		set: function(value) {
			this._pixiData.instance.renderable = !value;
			return this._createjsParams._off = value;
		}
	},
	/*
	dispatchEvent: {
		value: function(eventObj, bubbles, cancelable) {
			var type = eventObj typeof 'string' ? eventObj : eventObj.type;
			
			this._pixiData.instance.emit(type, eventObj);
			
			return createjs.DisplayObject.prototype.dispatchEvent.apply(this, arguments);
		}
	},
	*/
	addEventListener: {
		value: function(type, cb) {
			if (!(cb instanceof Function)) {
				return
			}
			
			if (type in EventMap) {
				const ev = EventMap[type];
				
				const func = ev.factory(this, cb);
				
				const types = ev.types;
				
				for (let i = 0; i < types.length; i++) {
					const t = types[i];
					
					this._pixiData.events[t] = this._pixiData.events[t] || [];
					this._pixiData.events[t].push({ func: func, origin: cb });
					
					this._pixiData.instance.on(t, func);
				}
				
				this._pixiData.instance.interactive = true;
			}
			
			return createjs.DisplayObject.prototype.addEventListener.apply(this, arguments);
		}
	},
	removeEventListener: {
		value: function(type, cb) {
			if (type in EventMap) {
				const ev = EventMap[type];
				
				const types = ev.types;
				
				for (let i = 0; i < types.length; i++) {
					const t = types[i];
					
					const list = this._pixiData.events[t];
					
					if (list) {
						for (var j = list.length - 1; j >= 0; j--) {
							if (list[j].origin === cb) {
								this._pixiData.instance.off(t, list[j].func);
								
								list.splice(j, 1);
								break;
							}
						}
						
						if (list.length === 0) {
							delete(this._pixiData.events[t]);
						}
					}
				}
			}
			
			const res = createjs.DisplayObject.prototype.removeEventListener.apply(this, arguments);
			
			const listeners = this._listeners;
			if (!listeners) {
				return res;
			}
			
			let f = false;
			
			for (let i in EventMap) {
				if (!listeners[i]) {
					continue;
				}
				
				if (listeners[i].length > 0) {
					f = true;
					break;
				}
			}
			
			return res;
		}
	},
	removeAllEventListeners: {
		value: function(type) {
			this._pixiData.instance.removeAllListeners(type);
			this._pixi.instance.interactive = false;
			this._pixiData.events = {};
			
			return createjs.DisplayObject.prototype.removeAllEventListeners.apply(this, arguments);
		}
	},
	mask: {
		get: function() {
			return this._createjsParams.mask;
		},
		
		set: function(value) {
			if (value) {
				value._pixiData.masked.push(this._pixiData.instance);
				this._pixiData.instance.mask = value._pixiData.instance;
				
				this._pixiData.instance.once('added', function() {
					this.parent.addChild(value._pixiData.instance);
				});
			} else {
				this._pixiData.instance.mask = null;
			}
			
			return this._createjsParams.mask = value;
		}
	},
	filters: {
		get: function() {
			return this._createjsParams.filters;
		},
		
		set: function(value) {
			if (this._pixiData.subInstance) {
				if (value) {
					const list = [];
					
					for (var i = 0; i < value.length; i++) {
						const f = value[i];
						
						if (f instanceof createjs.ColorMatrixFilter) {
							continue;
						}
						
						const m = new PIXI.filters.ColorMatrixFilter();
						m.matrix = [
							f.redMultiplier, 0, 0, 0, f.redOffset / 255,
							0, f.greenMultiplier, 0, 0, f.greenOffset / 255,
							0, 0, f.blueMultiplier, 0, f.blueOffset / 255,
							0, 0, 0, f.alphaMultiplier, f.alphaOffset / 255,
							0, 0, 0, 0, 1
						];
						list.push(m);
					}
					
					var o = this._pixiData.instance;
					var c = o.children;
					var n = new PIXI.Container();
					var nc = this._pixiData.subInstance = n.addChild(new PIXI.Container());
					
					while (c.length) {
						nc.addChild(c[0]);
					}
					
					o.addChild(n);
					o._filterContainer = nc;
					
					nc.updateTransform();
					nc.calculateBounds();
					
					const b = nc.getLocalBounds();
					const x = b.x;
					const y = b.y;
					
					for (var i = 0; i < nc.children.length; i++) {
						nc.children[i].x -= x;
						nc.children[i].y -= y;
						
						if (nc.children[i]._filterContainer) {
							nc.children[i]._filterContainer.cacheAsBitmap = false;
						}
					}
					n.x = x;
					n.y = y;
					
					nc.filters = list;
					nc.cacheAsBitmap = true;
				} else {
					const o = this._pixiData.instance;
					
					if (o._filterContainer) {
						const nc = this._pixiData.subInstance;
						const n = nc.parent;
						const c = nc.children;
						
						o.removeChildren();
						o._filterContainer = null;
						while (c.length) {
							const v = o.addChild(c[0]);
							v.x += n.x;
							v.y += n.y;
						}
						
						nc.filters = null;
						nc.cacheAsBitmap = false;
						
						this._pixiData.subInstance = o;
					}
				}
			}
			
			return this._createjsParams.filters = value;
		}
	}
};

/**
 * @ignore
 */
export function appendDisplayObjectDescriptor(cls) {
	Object.defineProperties(cls.prototype, appendixDescriptor);
}