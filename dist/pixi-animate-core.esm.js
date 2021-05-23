/*!
 * @tawaship/pixi-animate-core - v2.1.2
 * 
 * @require pixi.js v5.3.2
 * @author tawaship (makazu.mori@gmail.com)
 * @license MIT
 */

import { Container, filters, Sprite, BaseTexture, Texture, Graphics, LINE_CAP, LINE_JOIN, Text } from 'pixi.js';
export { Point as PixiPoint } from 'pixi.js';

/**
 * createjsオブジェクト
 */
const createjs = window.createjs;

/**
 * [[https://createjs.com/docs/easeljs/classes/ButtonHelper.html | createjs.ButtonHelper]]
 */
class CreatejsButtonHelper extends createjs.ButtonHelper {
    constructor(...args) {
        super(...args);
        const createjs = args[0];
        const pixi = createjs.pixi;
        const baseFrame = args[1];
        const overFrame = args[2];
        const downFrame = args[3];
        const hit = arguments[5];
        const hitFrame = args[6];
        hit.gotoAndStop(hitFrame);
        const hitPixi = pixi.addChild(hit.pixi);
        hitPixi.alpha = 0.00001;
        let isOver = false;
        let isDown = false;
        hitPixi.on('pointerover', function () {
            isOver = true;
            if (isDown) {
                createjs.gotoAndStop(downFrame);
            }
            else {
                createjs.gotoAndStop(overFrame);
            }
        });
        hitPixi.on('pointerout', function () {
            isOver = false;
            if (isDown) {
                createjs.gotoAndStop(overFrame);
            }
            else {
                createjs.gotoAndStop(baseFrame);
            }
        });
        hitPixi.on('pointerdown', function () {
            isDown = true;
            createjs.gotoAndStop(downFrame);
        });
        hitPixi.on('pointerup', function () {
            isDown = false;
            if (isOver) {
                createjs.gotoAndStop(overFrame);
            }
            else {
                createjs.gotoAndStop(baseFrame);
            }
        });
        hitPixi.on('pointerupoutside', function () {
            isDown = false;
            if (isOver) {
                createjs.gotoAndStop(overFrame);
            }
            else {
                createjs.gotoAndStop(baseFrame);
            }
        });
        hitPixi.interactive = true;
        hitPixi.cursor = 'pointer';
    }
}

function mixinPixiContainer(Base) {
    return class extends Base {
    };
}
function createPixiData(pixi, regObj) {
    return {
        regObj,
        instance: pixi
    };
}
/**
 * @ignore
 */
const DEG_TO_RAD = Math.PI / 180;
class EventManager {
    constructor(cjs) {
        this._isDown = false;
        this._events = {
            pointerdown: [],
            pointerover: [],
            pointerout: [],
            pointermove: [],
            pointerup: [],
            pointerupoutside: []
        };
        this._data = {
            mousedown: {
                types: ['pointerdown'],
                factory: (cb) => {
                    return this._mousedownFactory(cjs, cb);
                }
            },
            rollover: {
                types: ['pointerover'],
                factory: (cb) => {
                    return this._rolloverFactory(cjs, cb);
                }
            },
            rollout: {
                types: ['pointerout'],
                factory: (cb) => {
                    return this._rolloutFactory(cjs, cb);
                }
            },
            pressmove: {
                types: ['pointermove'],
                factory: (cb) => {
                    console.log(cb);
                    return this._pressmoveFactory(cjs, cb);
                }
            },
            pressup: {
                types: ['pointerup', 'pointerupoutside'],
                factory: (cb) => {
                    return this._pressupFactory(cjs, cb);
                }
            }
        };
    }
    add(pixi, type, cb) {
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
    remove(pixi, type, cb) {
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
    _mousedownFactory(cjs, cb) {
        return (e) => {
            e.currentTarget = e.currentTarget.createjs;
            e.target = e.target.createjs;
            const ev = e.data;
            e.rawX = ev.global.x;
            e.rawY = ev.global.y;
            this._isDown = true;
            cb(e);
        };
    }
    _rolloverFactory(cjs, cb) {
        return (e) => {
            e.currentTarget = e.currentTarget.createjs;
            e.target = e.currentTarget.createjs;
            const ev = e.data;
            e.rawX = ev.global.x;
            e.rawY = ev.global.y;
            this._isDown = true;
            cb(e);
        };
    }
    _rolloutFactory(cjs, cb) {
        return (e) => {
            e.currentTarget = e.currentTarget.createjs;
            e.target = e.currentTarget.createjs;
            const ev = e.data;
            e.rawX = ev.global.x;
            e.rawY = ev.global.y;
            this._isDown = true;
            cb(e);
        };
    }
    _pressmoveFactory(cjs, cb) {
        return (e) => {
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
    _pressupFactory(cjs, cb) {
        return (e) => {
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
function mixinCreatejsDisplayObject(Base) {
    return class C extends Base {
        constructor(...args) {
            super(...args);
            this._createjsEventManager = new EventManager(this);
        }
        initialize(...args) {
            this._createjsEventManager = new EventManager(this);
            return super.initialize(...args);
        }
        get pixi() {
            return this._pixiData.instance;
        }
        updateForPixi(e) {
            return true;
        }
        get x() {
            return this._createjsParams.x;
        }
        set x(value) {
            this._pixiData.instance.x = value;
            this._createjsParams.x = value;
        }
        get y() {
            return this._createjsParams.y;
        }
        set y(value) {
            this._pixiData.instance.y = value;
            this._createjsParams.y = value;
        }
        get scaleX() {
            return this._createjsParams.scaleX;
        }
        set scaleX(value) {
            this._pixiData.instance.scale.x = value;
            this._createjsParams.scaleX = value;
        }
        get scaleY() {
            return this._createjsParams.scaleY;
        }
        set scaleY(value) {
            this._pixiData.instance.scale.y = value;
            this._createjsParams.scaleY = value;
        }
        get skewX() {
            return this._createjsParams.skewX;
        }
        set skewX(value) {
            this._pixiData.instance.skew.x = -value * DEG_TO_RAD;
            this._createjsParams.skewX = value;
        }
        get skewY() {
            return this._createjsParams.skewY;
        }
        set skewY(value) {
            this._pixiData.instance.skew.y = value * DEG_TO_RAD;
            this._createjsParams.skewY = value;
        }
        get regX() {
            return this._createjsParams.regX;
        }
        set regX(value) {
            this._pixiData.regObj.x = value;
            this._createjsParams.regX = value;
        }
        get regY() {
            return this._createjsParams.regY;
        }
        set regY(value) {
            this._pixiData.regObj.y = value;
            this._createjsParams.regY = value;
        }
        get rotation() {
            return this._createjsParams.rotation;
        }
        set rotation(value) {
            this._pixiData.instance.rotation = value * DEG_TO_RAD;
            this._createjsParams.rotation = value;
        }
        get visible() {
            return this._createjsParams.visible;
        }
        set visible(value) {
            value = !!value;
            this._pixiData.instance.visible = value;
            this._createjsParams.visible = value;
        }
        get alpha() {
            return this._createjsParams.alpha;
        }
        set alpha(value) {
            this._pixiData.instance.alpha = value;
            this._createjsParams.alpha = value;
        }
        get _off() {
            return this._createjsParams._off;
        }
        set _off(value) {
            this._pixiData.instance.renderable = !value;
            this._createjsParams._off = value;
        }
        /*
        dispatchEvent: {
            dispatchEvent(eventObj, bubbles, cancelable) {
                var type = eventObj typeof 'string' ? eventObj : eventObj.type;
                
                this._pixiData.instance.emit(type, eventObj);
                
                return createjs.DisplayObject.prototype.dispatchEvent.apply(this, arguments);
            }
        },
        */
        addEventListener(type, cb, ...args) {
            if (!(cb instanceof CreatejsButtonHelper)) {
                if (type === 'mousedown' || type === 'rollover' || type === 'rollout' || type === 'pressmove' || type === 'pressup') {
                    this._createjsEventManager.add(this._pixiData.instance, type, cb);
                }
            }
            return super.addEventListener(type, cb, ...args);
        }
        removeEventListener(type, cb, ...args) {
            if (!(cb instanceof CreatejsButtonHelper)) {
                if (type === 'mousedown' || type === 'rollover' || type === 'rollout' || type === 'pressmove' || type === 'pressup') {
                    this._createjsEventManager.remove(this._pixiData.instance, type, cb);
                }
            }
            return super.removeEventListener(type, cb, ...args);
        }
        get mask() {
            return this._createjsParams.mask;
        }
        set mask(value) {
            if (value) {
                value.masked.push(this._pixiData.instance);
                this._pixiData.instance.mask = value.pixi;
                this._pixiData.instance.once('added', function () {
                    this.parent.addChild(value.pixi);
                });
            }
            else {
                this._pixiData.instance.mask = null;
            }
            this._createjsParams.mask = value;
        }
    };
}
function createCreatejsParams() {
    return {
        x: 0,
        y: 0,
        scaleX: 0,
        scaleY: 0,
        regX: 0,
        regY: 0,
        skewX: 0,
        skewY: 0,
        rotation: 0,
        visible: true,
        alpha: 1,
        _off: false,
        mask: null,
        filters: null
    };
}
function updateDisplayObjectChildren(cjs, e) {
    const list = cjs.children.slice();
    for (let i = 0, l = list.length; i < l; i++) {
        const child = list[i];
        if (!child.isVisible()) {
            continue;
        }
        //child.draw();
        child.updateForPixi(e);
    }
    return true;
}

/**
 * [[https://createjs.com/docs/easeljs/classes/Stage.html | createjs.Stage]]
 */
class CreatejsStage extends createjs.Stage {
    updateForPixi(props) {
        if (this.tickOnUpdate) {
            this.tick(props);
        }
        this.dispatchEvent("drawstart");
        updateDisplayObjectChildren(this, props);
        this.dispatchEvent("drawend");
    }
}

/**
 * [[https://createjs.com/docs/easeljs/classes/StageGL.html | createjs.StageGL]]
 */
class CreatejsStageGL extends createjs.StageGL {
    updateForPixi(props) {
        if (this.tickOnUpdate) {
            this.tick(props);
        }
        this.dispatchEvent("drawstart");
        updateDisplayObjectChildren(this, props);
        this.dispatchEvent("drawend");
    }
}

/**
 * [[http://pixijs.download/release/docs/PIXI.Container.html | PIXI.Container]]
 */
class PixiMovieClip extends mixinPixiContainer(Container) {
    constructor(cjs) {
        super();
        this._createjs = cjs;
    }
    get filterContainer() {
        return this._filterContainer;
    }
    set filterContainer(value) {
        this._filterContainer = value;
    }
    get createjs() {
        return this._createjs;
    }
}
function createPixiMovieClipData(cjs) {
    const pixi = new PixiMovieClip(cjs);
    return Object.assign(createPixiData(pixi, pixi.pivot), {
        subInstance: pixi
    });
}
/**
 * @ignore
 */
let _funcFlag = true;
/**
 * @ignore
 */
const P = createjs.Bitmap;
/**
 * [[https://createjs.com/docs/easeljs/classes/MovieClip.html | createjs.MovieClip]]
 */
class CreatejsMovieClip extends mixinCreatejsDisplayObject(createjs.MovieClip) {
    constructor(...args) {
        super(...args);
        this._initForPixi();
        P.apply(this, args);
    }
    get filters() {
        return this._createjsParams.filters;
    }
    set filters(value) {
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
            o.filterContainer = nc;
            nc.updateTransform();
            nc.calculateBounds();
            const b = nc.getLocalBounds();
            const x = b.x;
            const y = b.y;
            for (var i = 0; i < nc.children.length; i++) {
                const child = nc.children[i];
                child.x -= x;
                child.y -= y;
                if (child instanceof PixiMovieClip) {
                    const fc = child.filterContainer;
                    if (fc) {
                        fc.cacheAsBitmap = false;
                    }
                }
            }
            n.x = x;
            n.y = y;
            nc.filters = list;
            nc.cacheAsBitmap = true;
        }
        else {
            const o = this._pixiData.instance;
            if (o.filterContainer) {
                const nc = this._pixiData.subInstance;
                const n = nc.parent;
                const c = nc.children;
                o.removeChildren();
                o.filterContainer = null;
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
        this._createjsParams.filters = value;
    }
    _initForPixi() {
        this._createjsParams = createCreatejsParams();
        this._pixiData = createPixiMovieClipData(this);
        if (!_funcFlag) {
            this.updateForPixi = this._updateForPixiUnsynched;
        }
        else {
            this.updateForPixi = this._updateForPixiSynched;
        }
    }
    initialize(...args) {
        this._initForPixi();
        //if (!this._createjsEventManager) {
        //	console.log(this instanceof createjs.MovieClip)
        //	throw new Error
        //}
        return super.initialize(...args);
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
    get pixi() {
        return this._pixiData.instance;
    }
    static selectUpdateFunc(flag) {
        _funcFlag = flag;
    }
    _updateForPixiSynched(e) {
        this._updateState();
        return updateDisplayObjectChildren(this, e);
    }
    _updateForPixiUnsynched(e) {
        return this._tick(e);
    }
}
// temporary prototype
Object.defineProperties(CreatejsMovieClip.prototype, {
    _createjsParams: {
        value: createCreatejsParams(),
        writable: true
    },
    _pixiData: {
        value: createPixiMovieClipData({}),
        writable: true
    }
});

/**
 * [[http://pixijs.download/release/docs/PIXI.Sprite.html | PIXI.Sprite]]
 */
class PixiSprite extends mixinPixiContainer(Sprite) {
    constructor(cjs) {
        super();
        this._createjs = cjs;
    }
    get createjs() {
        return this._createjs;
    }
}
/**
 * @ignore
 */
function createPixiSpriteData(cjs) {
    const pixi = new PixiSprite(cjs);
    return createPixiData(pixi, pixi.anchor);
}
/**
 * @ignore
 */
const P$1 = createjs.Sprite;
/**
 * [[https://createjs.com/docs/easeljs/classes/Sprite.html | createjs.Sprite]]
 */
class CreatejsSprite extends mixinCreatejsDisplayObject(createjs.Sprite) {
    constructor(...args) {
        super(...args);
        this._initForPixi();
        P$1.apply(this, args);
    }
    _initForPixi() {
        this._createjsParams = createCreatejsParams();
        this._pixiData = createPixiSpriteData(this);
    }
    initialize(...args) {
        this._initForPixi();
        return super.initialize(...args);
    }
    gotoAndStop(...args) {
        super.gotoAndStop(...args);
        const frame = this.spriteSheet.getFrame(this.currentFrame);
        const baseTexture = BaseTexture.from(frame.image);
        const texture = new Texture(baseTexture, frame.rect);
        this._pixiData.instance.texture = texture;
    }
    get pixi() {
        return this._pixiData.instance;
    }
    updateForPixi(e) {
        return true;
    }
}
// temporary prototype
Object.defineProperties(CreatejsSprite.prototype, {
    _createjsParams: {
        value: createCreatejsParams(),
        writable: true
    },
    _pixiData: {
        value: createPixiSpriteData({}),
        writable: true
    }
});

/**
 * [[http://pixijs.download/release/docs/PIXI.Container.html | PIXI.Container]]
 */
class PixiShape extends mixinPixiContainer(Container) {
    constructor(cjs) {
        super();
        this._createjs = cjs;
    }
    get createjs() {
        return this._createjs;
    }
}
/**
 * @ignore
 */
function createCreatejsShapeParam(graphics) {
    return Object.assign(createCreatejsParams(), {
        graphics: graphics
    });
}
/**
 * @ignore
 */
function createPixiSpaheData(cjs) {
    const pixi = new PixiShape(cjs);
    return Object.assign(createPixiData(pixi, pixi.pivot), {
        masked: []
    });
}
/**
 * @ignore
 */
const P$2 = createjs.Shape;
/**
 * [[https://createjs.com/docs/easeljs/classes/Shape.html | createjs.Shape]]
 */
class CreatejsShape extends mixinCreatejsDisplayObject(createjs.Shape) {
    constructor(...args) {
        super(...args);
        this._initForPixi();
        P$2.apply(this, args);
    }
    _initForPixi() {
        this._createjsParams = createCreatejsShapeParam(null);
        this._pixiData = createPixiSpaheData(this);
    }
    get graphics() {
        return this._createjsParams.graphics;
    }
    set graphics(value) {
        if (this._pixiData.masked.length) {
            this._pixiData.instance.removeChildren();
            if (value) {
                for (let i = 0; i < this._pixiData.masked.length; i++) {
                    this._pixiData.masked[i].mask = this._pixiData.instance;
                }
            }
            else {
                for (let i = 0; i < this._pixiData.masked.length; i++) {
                    this._pixiData.masked[i].mask = null;
                }
            }
        }
        if (value) {
            this._pixiData.instance.addChild(value.pixi);
        }
        this._createjsParams.graphics = value;
    }
    get pixi() {
        return this._pixiData.instance;
    }
    get masked() {
        return this._pixiData.masked;
    }
    updateForPixi(e) {
        return true;
    }
}
// temporary prototype
Object.defineProperties(CreatejsShape.prototype, {
    _createjsParams: {
        value: createCreatejsShapeParam(null),
        writable: true
    },
    _pixiData: {
        value: createPixiSpaheData({}),
        writable: true
    }
});

/**
 * [[http://pixijs.download/release/docs/PIXI.Sprite.html | PIXI.Sprite]]
 */
class PixiBitmap extends mixinPixiContainer(Sprite) {
    constructor(cjs) {
        super();
        this._createjs = cjs;
    }
    get createjs() {
        return this._createjs;
    }
}
/**
 * @ignore
 */
function createPixiBitmapData(cjs) {
    const pixi = new PixiBitmap(cjs);
    return createPixiData(pixi, pixi.anchor);
}
/**
 * @ignore
 */
function createCreatejsBitmapParams() {
    return createCreatejsParams();
}
/**
 * @ignore
 */
const P$3 = createjs.Bitmap;
/**
 * [[https://createjs.com/docs/easeljs/classes/Bitmap.html | createjs.Bitmap]]
 */
class CreatejsBitmap extends mixinCreatejsDisplayObject(createjs.Bitmap) {
    constructor(...args) {
        super(...args);
        this._initForPixi();
        P$3.apply(this, args);
    }
    _initForPixi() {
        this._pixiData = createPixiBitmapData(this);
        this._createjsParams = createCreatejsBitmapParams();
    }
    initialize(...args) {
        this._initForPixi();
        const res = super.initialize(...args);
        const texture = Texture.from(this.image);
        this._pixiData.instance.texture = texture;
        return res;
    }
}
// temporary prototype
Object.defineProperties(CreatejsBitmap.prototype, {
    _createjsParams: {
        value: createCreatejsParams(),
        writable: true
    },
    _pixiData: {
        value: createPixiBitmapData({}),
        writable: true
    }
});

/**
 * [[http://pixijs.download/release/docs/PIXI.Graphics.html | PIXI.Graphics]]
 */
class PixiGraphics extends mixinPixiContainer(Graphics) {
    constructor(cjs) {
        super();
        this._createjs = cjs;
    }
    get createjs() {
        return this._createjs;
    }
}
/**
 * @ignore
 */
function createGraphicsPixiData(cjs) {
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
const DEG_TO_RAD$1 = Math.PI / 180;
/**
 * @ignore
 */
const P$4 = createjs.Graphics;
/**
 * [[https://createjs.com/docs/easeljs/classes/Graphics.html | createjs.Graphics]]
 */
class CreatejsGraphics extends mixinCreatejsDisplayObject(createjs.Graphics) {
    constructor(...args) {
        super(...args);
        this._initForPixi();
        P$4.apply(this, args);
        this._pixiData.instance.beginFill(0xFFEEEE, 1);
        this._pixiData.strokeFill = 0;
        this._pixiData.strokeAlpha = 1;
    }
    _initForPixi() {
        this._createjsParams = createCreatejsParams();
        this._pixiData = createGraphicsPixiData(this);
    }
    moveTo(x, y) {
        if (this._pixiData.instance.clone().endFill().containsPoint({ x: x, y: y })) {
            this._pixiData.instance.beginHole();
        }
        else {
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
        this._pixiData.instance.drawRegularPolygon(x, y, radius, sides, angle * DEG_TO_RAD$1);
        return super.drawPolyStar(x, y, radius, sides, pointSize, angle);
    }
    get pixi() {
        return this._pixiData.instance;
    }
    updateForPixi(e) {
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
        value: createCreatejsParams(),
        writable: true
    },
    _pixiData: {
        value: createGraphicsPixiData({}),
        writable: true
    }
});

/**
 * [[http://pixijs.download/release/docs/PIXI.Text.html | PIXI.Text]]
 */
class PixiText extends Text {
}
/**
 * [[http://pixijs.download/release/docs/PIXI.Container.html | PIXI.Container]]
 */
class PixiTextContainer extends mixinPixiContainer(Container) {
    constructor(cjs, text) {
        super();
        this._createjs = cjs;
        this._text = text;
    }
    get createjs() {
        return this._createjs;
    }
    get text() {
        return this._text;
    }
}
/**
 * @ignore
 */
function createTextOriginParam(text, font, color) {
    return Object.assign(createCreatejsParams(), {
        text: text,
        font: font,
        color: color,
        textAlign: 'left',
        lineHeight: 0,
        lineWidth: 0
    });
}
/**
 * @ignore
 */
function createPixiTextData(cjs, text) {
    const pixi = new PixiTextContainer(cjs, text);
    return createPixiData(pixi, pixi.pivot);
}
/**
 * @ignore
 */
const P$5 = createjs.Text;
/**
 * [[https://createjs.com/docs/easeljs/classes/Text.html | createjs.Text]]
 */
class CreatejsText extends mixinCreatejsDisplayObject(createjs.Text) {
    constructor(text, font, color = '#000000', ...args) {
        super(text, font, color, ...args);
        this._initForPixi(text, font, color, ...args);
        P$5.call(this, text, font, color, ...args);
    }
    _initForPixi(text, font, color = '#000000', ...args) {
        this._createjsParams = createTextOriginParam(text, font, color);
        const _font = this._parseFont(font);
        const t = new PixiText(text, {
            fontWeight: _font.fontWeight,
            fontSize: _font.fontSize,
            fontFamily: _font.fontFamily,
            fill: this._parseColor(color),
            wordWrap: true
        });
        this._pixiData = createPixiTextData(this, t);
        this._pixiData.instance.addChild(t);
    }
    get text() {
        return this._createjsParams.text;
    }
    set text(text) {
        this._pixiData.instance.text.text = text;
        this._align(this.textAlign);
        this._createjsParams.text = text;
    }
    _parseFont(font) {
        const p = font.split(' ');
        let w = 'normal';
        let s = p.shift();
        if (s.indexOf('px') === -1) {
            w = s;
            s = p.shift();
        }
        return {
            fontWeight: w,
            fontSize: Number((s || '0px').replace('px', '')),
            fontFamily: p.join(' ').replace(/'/g, '') //'
        };
    }
    get font() {
        return this._createjsParams.font;
    }
    set font(font) {
        const _font = this._parseFont(font);
        this._pixiData.instance.text.style.fontSize = _font.fontSize;
        this._pixiData.instance.text.style.fontFamily = _font.fontFamily;
        this._createjsParams.font = font;
    }
    _parseColor(color) {
        return parseInt(color.slice(1), 16);
    }
    get color() {
        return this._createjsParams.color;
    }
    set color(color) {
        this._pixiData.instance.text.style.fill = this._parseColor(color);
        this._createjsParams.color = color;
    }
    _align(align) {
        if (align === 'left') {
            this._pixiData.instance.text.x = 0;
            return;
        }
        if (align === 'center') {
            this._pixiData.instance.text.x = -this._pixiData.instance.text.width / 2;
            return;
        }
        if (align === 'right') {
            this._pixiData.instance.text.x = -this._pixiData.instance.text.width;
            return;
        }
    }
    get textAlign() {
        return this._createjsParams.textAlign;
    }
    set textAlign(align) {
        this._pixiData.instance.text.style.align = align;
        this._align(align);
        this._createjsParams.textAlign = align;
    }
    get lineHeight() {
        return this._createjsParams.lineHeight;
    }
    set lineHeight(height) {
        this._pixiData.instance.text.style.lineHeight = height;
        this._createjsParams.lineHeight = height;
    }
    get lineWidth() {
        return this._createjsParams.lineWidth;
    }
    set lineWidth(width) {
        this._pixiData.instance.text.style.wordWrapWidth = width;
        this._align(this.textAlign);
        this._createjsParams.lineWidth = width;
    }
    get pixi() {
        return this._pixiData.instance;
    }
    updateForPixi(e) {
        return true;
    }
}
// temporary prototype
Object.defineProperties(CreatejsText.prototype, {
    _createjsParams: {
        value: createCreatejsParams(),
        writable: true
    },
    _pixiData: {
        value: createPixiTextData({}, new PixiText('')),
        writable: true
    }
});

/**
 * @ignore
 */
let _isPrepare = false;
/**
 * Prepare createjs content published with Adobe Animate.
 */
function prepareAnimate(options = {}) {
    if (_isPrepare) {
        return;
    }
    CreatejsMovieClip.selectUpdateFunc(options.useSynchedTimeline);
    if (options.useMotionGuide) {
        window.createjs.MotionGuidePlugin.install();
    }
    _isPrepare = true;
}
/**
 * Load assets of createjs content published with Adobe Animate.
 *
 * @param id "lib.properties.id" in Animate content.
 * @param basepath Directory path of Animate content.
 */
function loadAssetAsync(id, basepath, options = {}) {
    const comp = window.AdobeAn.getComposition(id);
    if (!comp) {
        throw new Error('no composition');
    }
    const lib = comp.getLibrary();
    return new Promise((resolve, reject) => {
        if (lib.properties.manifest.length === 0) {
            resolve({});
        }
        if (basepath) {
            basepath = (basepath + '/').replace(/([^\:])\/\//, "$1/");
        }
        const loader = new window.createjs.LoadQueue(false, basepath);
        loader.installPlugin(window.createjs.Sound);
        loader.addEventListener('fileload', function (evt) {
            handleFileLoad(evt, comp);
        });
        loader.addEventListener('complete', function (evt) {
            resolve(evt);
        });
        if (options.crossOrigin) {
            const m = lib.properties.manifest;
            for (let i = 0; i < m.length; i++) {
                m[i].crossOrigin = true;
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
function initializeAnimate(obj = {}) {
    window.createjs.Stage = CreatejsStage;
    window.createjs.StageGL = CreatejsStageGL;
    window.createjs.MovieClip = CreatejsMovieClip;
    window.createjs.Sprite = CreatejsSprite;
    window.createjs.Shape = CreatejsShape;
    window.createjs.Bitmap = CreatejsBitmap;
    window.createjs.Graphics = CreatejsGraphics;
    window.createjs.Text = CreatejsText;
    window.createjs.ButtonHelper = CreatejsButtonHelper;
    for (let i in obj) {
        window.createjs[i] = obj[i];
    }
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

export { CreatejsBitmap, CreatejsButtonHelper, CreatejsGraphics, CreatejsMovieClip, CreatejsShape, CreatejsSprite, CreatejsStage, CreatejsStageGL, CreatejsText, EventManager, PixiBitmap, PixiGraphics, PixiMovieClip, PixiShape, PixiSprite, PixiText, PixiTextContainer, createCreatejsParams, createPixiData, initializeAnimate, loadAssetAsync, mixinCreatejsDisplayObject, mixinPixiContainer, prepareAnimate, updateDisplayObjectChildren };
//# sourceMappingURL=pixi-animate-core.esm.js.map
