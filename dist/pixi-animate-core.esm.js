/*!
 * @tawaship/pixi-animate-core.js - v1.0.3
 * 
 * @require pixi.js v5.3.2
 * @author tawaship (makazu.mori@gmail.com)
 * @license MIT
 */

import { Container, Sprite, Graphics, BaseTexture, Texture, LINE_JOIN, Text, filters } from 'pixi.js';

/**
 * @see http://pixijs.download/release/docs/PIXI.Container.html
 * @private
 */
class PixiMovieClip extends Container {
    constructor(cjs) {
        super();
        this._createjs = cjs;
    }
    getCreatejs() {
        return this._createjs;
    }
}
/**
 * @see http://pixijs.download/release/docs/PIXI.Sprite.html
 * @private
 */
class PixiSprite extends Sprite {
    constructor(cjs) {
        super();
        this._createjs = cjs;
    }
    getCreatejs() {
        return this._createjs;
    }
}
/**
 * @see http://pixijs.download/release/docs/PIXI.Container.html
 * @private
 */
class PixiShape extends Container {
    constructor(cjs) {
        super();
        this._createjs = cjs;
    }
    getCreatejs() {
        return this._createjs;
    }
}
/**
 * @see http://pixijs.download/release/docs/PIXI.Graphics.html
 * @private
 */
class PixiGraphics extends Graphics {
    constructor(cjs) {
        super();
        this._createjs = cjs;
    }
    getCreatejs() {
        return this._createjs;
    }
}
/**
 * @see http://pixijs.download/release/docs/PIXI.Container.html
 * @private
 */
class PixiTextContainer extends Container {
    constructor(cjs, text) {
        super();
        this._createjs = cjs;
        this._text = text;
    }
    get text() {
        return this._text;
    }
    getCreatejs() {
        return this._createjs;
    }
}
/**
 * @see http://pixijs.download/release/docs/PIXI.Container.html
 * @private
 */
class PixiButtonHelper extends Container {
    constructor(cjs) {
        super();
        this._createjs = cjs;
    }
    getCreatejs() {
        return this._createjs;
    }
}

/**
 * @ignore
 */
const createjsOrigin = {
	DisplayObject: createjs.DisplayObject,
	MovieClip: createjs.MovieClip,
	Sprite: createjs.Sprite,
	Container: createjs.Container,
	Text: createjs.Text,
	Shape: createjs.Shape,
	Graphics: createjs.Graphics,
	ButtonHelper: createjs.ButtonHelper
};

/**
 * @ignore
 */
function overrideCreatejs(self, pixi) {
	self._originParams = {
		x: 0,
		y: 0,
		scaleX: 0,
		scaleY: 0,
		regx: 0,
		regy: 0,
		skewX: 0,
		skewY: 0,
		rotation: 0,
		visible: true,
		alpha: 1,
		_off: false,
		mask: null,
		filters: null
	};
	
	self._pixiData = {
		instance: pixi,
		regObj: pixi.anchor || pixi.pivot,
		events: {}
	};
}

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
				e.currentTarget = e.currentTarget.getCreatejs();
				
				e.target = e.target.getCreatejs();
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
				e.currentTarget = e.currentTarget.getCreatejs();
				
				e.target = e.target.getCreatejs();
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
				e.currentTarget = e.currentTarget.getCreatejs();
				
				e.target = e.target.getCreatejs();
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
				e.currentTarget = e.currentTarget.getCreatejs();
				
				e.target = e.currentTarget.getCreatejs();
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
				
				e.target = e.target && e.target.getCreatejs();
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
				
				e.target = e.target && e.target.getCreatejs();
				const ev = e.data;
				e.rawX = ev.global.x;
				e.rawY = ev.global.y;
				
				cb(e);
			};
		}
	}
};

/**
 * @ignore
 */
const DEG_TO_RAD = Math.PI / 180;

/**
 * @ignore
 */
const COLOR_RED = 16 * 16 * 16 * 16;

/**
 * @ignore
 */
const COLOR_GREEN = 16 * 16;

/**
 * @ignore
 */
const appendixDescriptor = {
	x: {
		get: function() {
			return this._originParams.x;
		},
		
		set: function(value) {
			this._pixiData.instance.x = value;
			return this._originParams.x = value;
		}
	},
	y: {
		get: function() {
			return this._originParams.y;
		},
		
		set: function(value) {
			this._pixiData.instance.y = value;
			return this._originParams.y = value;
		}
	},
	scaleX: {
		get: function() {
			return this._originParams.scaleX;
		},
		
		set: function(value) {
			this._pixiData.instance.scale.x = value;
			return this._originParams.scaleX = value;
		}
	},
	scaleY: {
		get: function() {
			return this._originParams.scaleY;
		},
		
		set: function(value) {
			this._pixiData.instance.scale.y = value;
			return this._originParams.scaleY = value;
		}
	},
	skewX: {
		get: function() {
			return this._originParams.skewX;
		},
		
		set: function(value) {
			this._pixiData.instance.skew.x = -value * DEG_TO_RAD;
			return this._originParams.skewX = value;
		}
	},
	skewY: {
		get: function() {
			return this._originParams.skewY;
		},
		
		set: function(value) {
			this._pixiData.instance.skew.y = value * DEG_TO_RAD;
			return this._originParams.skewY = value;
		}
	
	},
	regX: {
		get: function() {
			return this._originParams.regX;
		},
		
		set: function(value) {
			this._pixiData.regObj.x = value;
			return this._originParams.regX = value;
		}
	},
	regY: {
		get: function() {
			return this._originParams.regY;
		},
		
		set: function(value) {
			this._pixiData.regObj.y = value;
			return this._originParams.regY = value;
		}
	},
	rotation: {
		get: function() {
			return this._originParams.rotation;
		},
		
		set: function(value) {
			this._pixiData.instance.rotation = value * DEG_TO_RAD;
			return this._originParams.rotation = value;
		}
	},
	visible: {
		get: function() {
			return this._originParams.visible;
		},
		
		set: function(value) {
			value = !!value;
			this._pixiData.instance.visible = value;
			return this._originParams.visible = value;
		}
	},
	alpha: {
		get: function() {
			return this._originParams.alpha;
		},
		
		set: function(value) {
			this._pixiData.instance.alpha = value;
			return this._originParams.alpha = value;
		}
	},
	_off: {
		get: function() {
			return this._originParams._off;
		},
		
		set: function(value) {
			this._pixiData.instance.renderable = !value;
			return this._originParams._off = value;
		}
	},
	/*
	dispatchEvent: {
		value: function(eventObj, bubbles, cancelable) {
			var type = eventObj typeof 'string' ? eventObj : eventObj.type;
			
			this._pixiData.instance.emit(type, eventObj);
			
			return createjsOrigin.DisplayObject.prototype.dispatchEvent.apply(this, arguments);
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
			
			return createjsOrigin.DisplayObject.prototype.addEventListener.apply(this, arguments);
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
			
			const res = createjsOrigin.DisplayObject.prototype.removeEventListener.apply(this, arguments);
			
			const listeners = this._listeners;
			if (!listeners) {
				return res;
			}
			
			for (let i in EventMap) {
				if (!listeners[i]) {
					continue;
				}
				
				if (listeners[i].length > 0) {
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
			
			return createjsOrigin.DisplayObject.prototype.removeAllEventListeners.apply(this, arguments);
		}
	},
	mask: {
		get: function() {
			return this._originParams.mask;
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
			
			return this._originParams.mask = value;
		}
	},
	filters: {
		get: function() {
			return this._originParams.filters;
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
						
						const m = new filters.ColorMatrixFilter();
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
					var n = new Container();
					var nc = this._pixiData.subInstance = n.addChild(new Container());
					
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
			
			return this._originParams.filters = value;
		}
	},
	getPixi: {
		value: function() {
			return this._pixiData.instance;
		}
	}
};

/**
 * @ignore
 */
function makeClass(parent, unuseAppendix = false) {
	class CjsWrap extends parent {
		_overrideCreatejs(pixi) {
			overrideCreatejs(this, pixi);
		}
	}
	
	if (!unuseAppendix) {
		Object.defineProperties(CjsWrap.prototype, appendixDescriptor);
	}
	
	return CjsWrap;
}

createjs.MovieClip = class MovieClip extends makeClass(createjsOrigin.MovieClip) {
	constructor() {
		this._overrideCreatejs(new PixiMovieClip(this));
		
		super(...arguments);
	}
	
	initialize() {
		this._overrideCreatejs(new PixiMovieClip(this));
		this._pixiData.subInstance = this._pixiData.instance;//.addChild(new PIXI.Container());
		
		return super.initialize(...arguments);
	}
	
	addChild(child) {
		this._pixiData.subInstance.addChild(child._pixiData.instance);
		
		return super.addChild(child);
	}
	
	addChildAt(child, index) {
		this._pixiData.subInstance.addChildAt(child._pixiData.instance, index);
		
		return super.addChildAt(child, index);
	}
	
	removeChild(child) {
		this._pixiData.subInstance.removeChild(child._pixiData.instance);
		
		return super.removeChild(child);
	}
	
	removeChildAt(index) {
		this._pixiData.subInstance.removeChildAt(index);
		
		return super.removeChildAt(index);
	}
	
	removeAllChldren() {
		this._pixiData.subInstance.removeChildren();
		
		return super.removeAllChldren();
	}
};

createjs.Sprite = class Sprite extends makeClass(createjsOrigin.Sprite) {
	constructor() {
		this._overrideCreatejs(new PixiSprite(this));
		
		super(...arguments);
	}
	
	initialize() {
		this._overrideCreatejs(new PixiSprite(this));
		
		return super.initialize(...arguments);
	}
	
	gotoAndStop() {
		super.gotoAndStop(...arguments);
		
		const frame = this.spriteSheet.getFrame(this.currentFrame);
		const baseTexture = BaseTexture.from(frame.image);
		const texture = new Texture(baseTexture, frame.rect);
		
		this._pixiData.instance.texture = texture;
	}
};

createjs.Shape = class Shape extends makeClass(createjsOrigin.Shape) {
	constructor() {
		this._overrideCreatejs(new PixiShape(this));
		this._pixiData.masked = [];
		
		super(...arguments);
	}
	
	get graphics() {
		return this._graphics;
	}
	
	set graphics(value) {
		if (this._pixiData.masked.length) {
			this._pixiData.instance.removeChildren();
			
			if (value) {
				for (let i = 0; i < this._pixiData.masked.length; i++) {
					this._pixiData.masked[i].mask = this._pixiData.instance;
				}
			} else {
				for (let i = 0; i < this._pixiData.masked.length; i++) {
					this._pixiData.masked[i].mask = null;
				}
			}
		}
		
		if (value) {
			this._pixiData.instance.addChild(value._pixiData.instance);
		}
		
		return this._graphics = value;
	}
};

createjs.Graphics = class Graphics extends makeClass(createjsOrigin.Graphics) {
	constructor() {
		this._overrideCreatejs(new PixiGraphics(this));
		
		this._pixiData.instance.beginFill(0xFFEEEE, 1);
		
		this._pixiData.strokeFill = 0;
		this._pixiData.strokeAlpha = 1;
		
		super(...arguments);
	}
	
	moveTo(x, y) {
		if (this._pixiData.instance.clone().endFill().containsPoint({x: x, y: y})) {
			this._pixiData.instance.beginHole();
		} else {
			this._pixiData.instance.endHole();
		}
		
		this._pixiData.instance.moveTo(x, y);
		
		return super.moveTo(x, y);
	}
	
	lineTo(x, y) {
		this._pixiData.instance.lineTo(x, y);
		
		return super.lineTo(x, y);
	}
	
	arcTon(x1, y1, x2, y2, radius) {
		this._pixiData.instance.arcTo(x1, y1, x2, y2, radius);
		
		return super.arcTo(x1, y1, x2, y2, radius);
	}
	
	arc(x, y, radius, startAngle, endAngle, anticlockwise) {
		this._pixiData.instance.arc(x, y, radius, startAngle, endAngle, anticlockwise);
		
		return super.arc(x, y, radius, startAngle, endAngle, anticlockwise);
	}
	
	quadraticCurveTo(cpx, cpy, x, y) {
		this._pixiData.instance.quadraticCurveTo(cpx, cpy, x, y);
		
		return super.quadraticCurveTo(cpx, cpy, x, y);
	}
	
	bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
		this._pixiData.instance.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
		
		return super.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
	}
	
	rect(x, y, w, h) {
		this._pixiData.instance.drawRect(x, y, w, h);
		
		return super.rect(x, y, w, h);
	}
	
	closePath() {
		this._pixiData.instance.closePath();
		
		const points = this._pixiData.instance.currentPath.points;
		
		return super.closePath();
	}
	
	clear() {
		this._pixiData.instance.clear();
		
		return super.clear();
	}
	
	_parseColor(color) {
		const res = {
			color: 0,
			alpha: 1
		};
		
		if (!color) {
			res.alpha = 0;
			return res;
		}
		
		if (color.charAt(0) === '#') {
			res.color = parseInt(color.slice(1), 16);
			return res;
		}
		
		color = color.replace(/rgba|\(|\)|\s/g, '').split(',');
		
		res.color = Number(color[0]) * COLOR_RED + Number(color[1]) * COLOR_GREEN + Number(color[2]);
		res.alpha = Number(color[3]);
		
		return res;
	}
	
	beginFill(color) {
		const c = this._parseColor(color);
		this._pixiData.instance.beginFill(c.color, c.alpha);
		
		return super.beginFill(color);
	}
		
	endFill() {
		this._pixiData.instance.endFill();
		
		return super.endFill();
	}
	
	setStrokeStyle(thickness, caps, joints, miterLimit, ignoreScale) {
		this._pixiData.instance.lineStyle({
			width: thickness,
			color: this._pixiData.strokeFill,
			alpha: this._pixiData.strokeAlpha,
			cap: (caps in LineCap) ? LineCap[caps] : caps,
			join: (joints in LineJoin) ? LineJoin[joints] : joints,
			miterLimit: miterLimit
		});
		
		return super.setStrokeStyle(thickness, caps, joints, miterLimit, ignoreScale);
	}
	
	beginStroke(color) {
		const c = this._parseColor(color);
		this._pixiData.strokeFill = c.color;
		this._pixiData.strokeAlpha = c.alpha;
		
		return super.beginStroke(color);
	}
	
	drawRoundRect(x, y, w, h, radius) {
		this._pixiData.instance.drawRoundedRect(x, y, w, h, radius);
		
		return super.drawRoundRect(x, y, w, h, radius);
	}
	
	drawCircle(x, y, radius) {
		this._pixiData.instance.drawCircle(x, y, radius);
		
		return super.drawCircle(x, y, radius);
	}
	
	drawEllipse(x, y, w, h) {
		this._pixiData.instance.drawEllipse(x, y, w, h);
		
		return super.drawEllipse(x, y, w, h);
	}
	
	drawPolyStar(x, y, radius, sides, pointSize, angle) {
		this._pixiData.instance.drawRegularPolygon(x, y, radius, sides, angle * DEG_TO_RAD);
		
		return super.drawPolyStar(x, y, radius, sides, pointSize, angle);
	}
};

/**
 * @ignore
 */
const LineCap = {
	0: LINE_JOIN.BUTT,
	1: LINE_JOIN.ROUND,
	2: LINE_JOIN.SQUARE
};

/**
 * @ignore
 */
const LineJoin = {
	0: LINE_JOIN.MITER,
	1: LINE_JOIN.ROUND,
	2: LINE_JOIN.BEVEL
};

Object.defineProperties(createjs.Graphics.prototype, {
	curveTo: {
		value: createjs.Graphics.prototype.quadraticCurveTo
	},
	
	drawRect: {
		value: createjs.Graphics.prototype.rect
	},
	
	mt: {
		value: createjs.Graphics.prototype.moveTo
	},
	
	lt: {
		value: createjs.Graphics.prototype.lineTo
	},
	
	at: {
		value: createjs.Graphics.prototype.arcTo
	},
	
	bt: {
		value: createjs.Graphics.prototype.bezierCurveTo
	},
	
	qt: {
		value: createjs.Graphics.prototype.quadraticCurveTo
	},
	
	a: {
		value: createjs.Graphics.prototype.arc
	},
	
	r: {
		value: createjs.Graphics.prototype.rect
	},
	
	cp: {
		value: createjs.Graphics.prototype.closePath
	},
	
	c: {
		value: createjs.Graphics.prototype.clear
	},
	
	f: {
		value: createjs.Graphics.prototype.beginFill
	},
	
	ef: {
		value: createjs.Graphics.prototype.endFill
	},
	
	ss: {
		value: createjs.Graphics.prototype.setStrokeStyle
	},
	
	s: {
		value: createjs.Graphics.prototype.beginStroke
	},
	
	dr: {
		value: createjs.Graphics.prototype.drawRect
	},
	
	rr: {
		value: createjs.Graphics.prototype.drawRoundRect
	},
	
	dc: {
		value: createjs.Graphics.prototype.drawCircle
	},
	
	de: {
		value: createjs.Graphics.prototype.drawEllipse
	},
	
	dp: {
		value: createjs.Graphics.prototype.drawPolyStar
	}
});

createjs.Text = class Text$1 extends makeClass(createjsOrigin.Text) {
	constructor(text, font, color) {
		const _font = this._parseFont(font);
		const t = new Text(text, {
			fontSize: _font.fontSize,
			fontFamily: _font.fontFamily,
			fill: this._parseColor(color),
			wordWrap: true
		});
		
		this._overrideCreatejs(new PixiTextContainer(this, t));
		this._pixiData.instance.addChild(t);
		
		this._originParams = Object.assign(this._originParams, {
			text: text,
			font: font,
			color: color,
			textAlign: 'left',
			lineHeight: 0,
			lineWidth: 0
		});
		
		super(...arguments);
	}
	
	get text() {
		return this._originParams.text;
	}
	
	set text(text) {
		this._pixiData.instance.text.text = text;
		this._align(this.textAlign);
		
		return this._originParams.text = text;
	}
	
	_parseFont(font) {
		const p = font.split(' ');
		
		return {
			fontSize: Number(p.shift().replace('px', '')),
			fontFamily: p.join(' ').replace(/'/g, '') //'
		};
	}
	
	get font() {
		return this._originParams.font;
	}
	
	set font(font) {
		const _font = this._parseFont(font);
		this._pixiData.instance.text.style.fontSize = _font.fontSize;
		this._pixiData.instance.text.style.fontFamily = _font.fontFamily;
		
		return this._originParams.font = font;
	}
	
	_parseColor(color) {
		return parseInt(color.slice(1), 16);
	}
	
	get color() {
		return this._originParams.color;
	}
	set color(color) {
		this._pixiData.instance.text.style.fill = this._parseColor(color);
		
		return this._originParams.color = color;
	}
	
	_align(align) {
		if (align === 'left') {
			this._pixiData.instance.text.x = 0;
			return;
		}
		
		if (align === 'center') {
			this._pixiData.instance.text.x = -this.lineWidth / 2;
			return;
		}
		
		if (align === 'right') {
			this._pixiData.instance.text.x =  -this.lineWidth;
			return;
		}
	}
	
	get textAlign() {
		return this._originParams.textAlign;
	}
	
	set textAlign(align) {
		this._pixiData.instance.text.style.align = align;
		this._align(align);
		
		return this._originParams.textAlign = align;
	}
	
	get lineHeight() {
		return this._originParams.lineHeight;
	}
	
	set lineHeight(height) {
		this._pixiData.instance.text.lineHeight = height;
		
		return this._originParams.lineHeight = height;
	}
	
	get lineWidth() {
		return this._originParams.lineWidth;
	}
	
	set lineWidth(width) {
		this._pixiData.instance.text.lineWidthWrap = width;
		
		return this._originParams.lineWidth = width;
	}
};

createjs.ButtonHelper = class ButtonHelper extends makeClass(createjsOrigin.ButtonHelper, true) {
	constructor() {
		this._overrideCreatejs(new PixiButtonHelper(this));
		
		const createjs = arguments[0];
		const pixi = createjs._pixiData.instance;
		
		const baseFrame = arguments[1];
		const overFrame = arguments[2];
		const downFrame = arguments[3];
		const hit = arguments[5];
		const hitFrame = arguments[6];
		
		hit.gotoAndStop(hitFrame);
		const hitPixi = pixi.addChild(hit._pixiData.instance);
		hitPixi.alpha = 0.00001;
		
		let isOver = false;
		let isDown = false;
		
		hitPixi.on('pointerover', function() {
			isOver = true;
			if (isDown) {
				createjs.gotoAndStop(downFrame);
			} else {
				createjs.gotoAndStop(overFrame);
			}
		});
		
		hitPixi.on('pointerout', function() {
			isOver = false;
			
			if (isDown) {
				createjs.gotoAndStop(overFrame);
			} else {
				createjs.gotoAndStop(baseFrame);
			}
		});
		
		hitPixi.on('pointerdown', function() {
			isDown = true;
			createjs.gotoAndStop(downFrame);
		});
		
		hitPixi.on('pointerup', function() {
			isDown = false;
			if (isOver) {
				createjs.gotoAndStop(overFrame);
			} else {
				createjs.gotoAndStop(baseFrame);
			}
		});
		
		hitPixi.on('pointerupoutside', function() {
			isDown = false;
			if (isOver) {
				createjs.gotoAndStop(overFrame);
			} else {
				createjs.gotoAndStop(baseFrame);
			}
		});
		
		hitPixi.interactive = true;
		hitPixi.cursor = 'pointer';
		
		super(...arguments);
	}
};

/**
 * Prepare createjs content published with Adobe Animate.
 * @param id "lib.properties.id" in Animate content.
 * @param basepath Directory path of Animate content.
 */
function prepareAnimateAsync(id, basepath) {
    const comp = window.AdobeAn.getComposition(id);
    if (!comp) {
        throw new Error('no composition');
    }
    const lib = comp.getLibrary();
    return new Promise((resolve, reject) => {
        if (lib.properties.manifest.length === 0) {
            resolve({});
        }
        const loader = new window.createjs.LoadQueue(false);
        loader.installPlugin(window.createjs.Sound);
        loader.addEventListener('fileload', function (evt) {
            handleFileLoad(evt, comp);
        });
        loader.addEventListener('complete', function (evt) {
            resolve(evt);
        });
        if (basepath) {
            basepath = (basepath + '/').replace(/([^\:])\/\//, "$1/");
            const m = lib.properties.manifest;
            for (let i = 0; i < m.length; i++) {
                m[i].src = basepath + m[i].src;
            }
        }
        loader.loadManifest(lib.properties.manifest);
    })
        .then((evt) => {
        const ss = comp.getSpriteSheet();
        const queue = evt.target;
        const ssMetadata = lib.ssMetadata;
        for (let i = 0; i < ssMetadata.length; i++) {
            ss[ssMetadata[i].name] = new window.createjs.SpriteSheet({
                images: [
                    queue.getResult(ssMetadata[i].name)
                ],
                frames: ssMetadata[i].frames
            });
        }
        return lib;
    });
}
/**
 * @ignore
 */
function handleFileLoad(evt, comp) {
    const images = comp.getImages();
    if (evt && (evt.item.type == 'image')) {
        images[evt.item.id] = evt.result;
    }
}

export { prepareAnimateAsync };
//# sourceMappingURL=pixi-animate-core.esm.js.map
