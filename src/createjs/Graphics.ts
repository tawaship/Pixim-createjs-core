import { Graphics, LINE_CAP, LINE_JOIN} from 'pixi.js';
import { createjs } from './alias';
import { createPixiData, createCreatejsParams, IPixiData, ICreatejsParam,  ITickerData, mixinPixiContainer, mixinCreatejsDisplayObject } from './core';
import { createObject } from './utils';

/**
 * [[http://pixijs.download/release/docs/PIXI.Graphics.html | PIXI.Graphics]]
 */
export class PixiGraphics extends mixinPixiContainer(Graphics) {
	private _createjs: CreatejsGraphics;
	
	constructor(cjs: CreatejsGraphics) {
		super();
		
		this._createjs = cjs;
	}
	
	get createjs() {
		return this._createjs;
	}
}

export interface ICreatejsGraphicsParam extends ICreatejsParam {

}

/**
 * @ignore
 */
function createCreatejsGraphicsParams(): ICreatejsGraphicsParam {
	return createCreatejsParams();
}

export interface IPixiGraphicsData extends IPixiData<PixiGraphics> {
	strokeFill: number;
	strokeAlpha: number;
}

/**
 * @ignore
 */
function createGraphicsPixiData(cjs: CreatejsGraphics): IPixiGraphicsData {
	const pixi = new PixiGraphics(cjs);
	
	return Object.assign(createPixiData(pixi, pixi.pivot), {
		strokeFill: 0,
		strokeAlpha: 1
	});
}

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
const LineCap = {
	0: LINE_CAP.BUTT,
	1: LINE_CAP.ROUND,
	2: LINE_CAP.SQUARE
};

/**
 * @ignore
 */
const LineJoin = {
	0: LINE_JOIN.MITER,
	1: LINE_JOIN.ROUND,
	2: LINE_JOIN.BEVEL
};

/**
 * @ignore
 */
const DEG_TO_RAD = Math.PI / 180;

/**
 * @ignore
 */
const P = createjs.Graphics;

/**
 * [[https://createjs.com/docs/easeljs/classes/Graphics.html | createjs.Graphics]]
 */
export class CreatejsGraphics extends mixinCreatejsDisplayObject<PixiGraphics, ICreatejsGraphicsParam>(createjs.Graphics) {
	protected _createjsParams: ICreatejsGraphicsParam;
	protected _pixiData: IPixiGraphicsData;
	
	constructor(...args: any[]) {
		super(...args);
		
		this._initForPixi();
		
		P.apply(this, args);
		
		this._pixiData.instance.beginFill(0xFFEEEE, 1);
		this._pixiData.strokeFill = 0;
		this._pixiData.strokeAlpha = 1;
	}
	
	protected _initForPixi() {
		this._createjsParams = createCreatejsGraphicsParams();
		this._pixiData = createGraphicsPixiData(this);
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
	
	arcTo(x1, y1, x2, y2, radius) {
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
		
		const colors = color.replace(/rgba|\(|\)|\s/g, '').split(',');
		
		res.color = Number(colors[0]) * COLOR_RED + Number(colors[1]) * COLOR_GREEN + Number(colors[2]);
		res.alpha = Number(colors[3]);
		
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
		this._pixiData.instance.lineTextureStyle({
			width: thickness,
			color: this._pixiData.strokeFill,
			alpha: this._pixiData.strokeAlpha,
			cap: (caps in LineCap) ? LineCap[caps] : LineCap[0],
			join: (joints in LineJoin) ? LineJoin[joints] : LineJoin[0],
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
	
	get pixi() {
		return this._pixiData.instance;
	}
	
	updateForPixi(e: ITickerData) {
		return true;
	}
}

// alias
Object.defineProperties(CreatejsGraphics.prototype, {
	curveTo: {
		value: CreatejsGraphics.prototype.quadraticCurveTo
	},
	
	drawRect: {
		value: CreatejsGraphics.prototype.rect
	},
	
	mt: {
		value: CreatejsGraphics.prototype.moveTo
	},
	
	lt: {
		value: CreatejsGraphics.prototype.lineTo
	},
	
	at: {
		value: CreatejsGraphics.prototype.arcTo
	},
	
	bt: {
		value: CreatejsGraphics.prototype.bezierCurveTo
	},
	
	qt: {
		value: CreatejsGraphics.prototype.quadraticCurveTo
	},
	
	a: {
		value: CreatejsGraphics.prototype.arc
	},
	
	r: {
		value: CreatejsGraphics.prototype.rect
	},
	
	cp: {
		value: CreatejsGraphics.prototype.closePath
	},
	
	c: {
		value: CreatejsGraphics.prototype.clear
	},
	
	f: {
		value: CreatejsGraphics.prototype.beginFill
	},
	
	ef: {
		value: CreatejsGraphics.prototype.endFill
	},
	
	ss: {
		value: CreatejsGraphics.prototype.setStrokeStyle
	},
	
	s: {
		value: CreatejsGraphics.prototype.beginStroke
	},
	
	dr: {
		value: CreatejsGraphics.prototype.drawRect
	},
	
	rr: {
		value: CreatejsGraphics.prototype.drawRoundRect
	},
	
	dc: {
		value: CreatejsGraphics.prototype.drawCircle
	},
	
	de: {
		value: CreatejsGraphics.prototype.drawEllipse
	},
	
	dp: {
		value: CreatejsGraphics.prototype.drawPolyStar
	}
});

// temporary prototype
Object.defineProperties(CreatejsGraphics.prototype, {
	_createjsParams: {
		value: createCreatejsGraphicsParams(),
		writable: true
	},
	_pixiData: {
		value: createGraphicsPixiData(createObject<CreatejsGraphics>(CreatejsGraphics.prototype)),
		writable: true
	}
});