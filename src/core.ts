import * as PIXI from 'pixi.js';
import * as createjs from './createjs/index';

/**
 * @ignore
 */
declare const window: any;

export interface IAnimateLibrary {
	[ name: string ]: any;
}

export interface IPrepareOption {
	/**
	 * Whether synchronous playback of movie clips is enabled.
	 * If set to "false", the behavior will be a little faster.
	 */
	useSynchedTimeline?: boolean;
	
	/**
	 * Whether to use motion guides.
	 */
	useMotionGuide?: boolean;
};

export interface ILoadAssetOption {
	/**
	 * Whether to use assets on a server in another domain.
	 */
	crossOrigin?: boolean;
};

/**
 * @ignore
 */
let _isPrepare = false;

/**
 * Prepare createjs content published with Adobe Animate.
 */
export function prepareAnimate(options: IPrepareOption = {}) {
	if (_isPrepare) {
		return;
	}
	
	createjs.CreatejsMovieClip.selectUpdateFunc(options.useSynchedTimeline);
	
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
export function loadAssetAsync(id: string, basepath: string, options: ILoadAssetOption = {}) {
	const comp = window.AdobeAn.getComposition(id);
	if (!comp) {
		throw new Error('no composition');
	}
	
	const lib: IAnimateLibrary = comp.getLibrary();
	
	return new Promise((resolve, reject) => {
		if (lib.properties.manifest.length === 0) {
			resolve({});
		}
		
		if (basepath) {
			basepath = (basepath + '/').replace(/([^\:])\/\//, "$1/");
		}
		
		const loader = new window.createjs.LoadQueue(false, basepath);
		
		loader.installPlugin(window.createjs.Sound);
		
		loader.addEventListener('fileload', function(evt: any) {
			handleFileLoad(evt, comp);
		});
		
		loader.addEventListener('complete', function(evt: any) {
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
	.then((evt: any) => {
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

export function initializeAnimate(obj: { [name: string]: any } = {}) {
	window.createjs.Stage = createjs.CreatejsStage;
	window.createjs.StageGL = createjs.CreatejsStageGL;
	window.createjs.MovieClip = createjs.CreatejsMovieClip;
	window.createjs.Sprite = createjs.CreatejsSprite;
	window.createjs.Shape = createjs.CreatejsShape;
	window.createjs.Bitmap = createjs.CreatejsBitmap;
	window.createjs.Graphics = createjs.CreatejsGraphics;
	window.createjs.Text = createjs.CreatejsText;
	window.createjs.ButtonHelper = createjs.CreatejsButtonHelper;
	
	for (let i in obj) {
		window.createjs[i] = obj[i];
	}
}

/**
 * @ignore
 */
function handleFileLoad(evt: any, comp: any) {
	const images = comp.getImages();
	if (evt && (evt.item.type == 'image')) {
		images[evt.item.id] = evt.result;
	}
}