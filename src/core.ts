import * as PIXI from 'pixi.js';
import * as PA from './createjs/index';

/**
 * @ignore
 */
declare const AdobeAn: any;

export interface IAnimateLibrary {
	[ name: string ]: any;
}

export interface ILoadAssetOption {
	/**
	 * Whether to use assets on a server in another domain.
	 */
	crossOrigin?: boolean;
};

/**
 * Load assets of createjs content published with Adobe Animate.
 * 
 * @param id "lib.properties.id" in Animate content.
 * @param basepath Directory path of Animate content.
 */
export function loadAssetAsync(id: string, basepath: string, options: ILoadAssetOption = {}) {
	const comp = AdobeAn.getComposition(id);
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
		
		const loader = new PA.createjs.LoadQueue(false, basepath);
		
		loader.installPlugin(PA.createjs.Sound);
		
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
			ss[ssMetadata[i].name] = new PA.createjs.SpriteSheet({
				images: [
					queue.getResult(ssMetadata[i].name)
				],
				frames: ssMetadata[i].frames
			});
		}
		
		return lib;
	});
}

// overrides
PA.createjs.Stage = PA.CreatejsStage;
PA.createjs.StageGL = PA.CreatejsStageGL;
PA.createjs.MovieClip = PA.CreatejsMovieClip;
PA.createjs.Sprite = PA.CreatejsSprite;
PA.createjs.Shape = PA.CreatejsShape;
PA.createjs.Bitmap = PA.CreatejsBitmap;
PA.createjs.Graphics = PA.CreatejsGraphics;
PA.createjs.Text = PA.CreatejsText;
PA.createjs.ButtonHelper = PA.CreatejsButtonHelper;

// install plugins
PA.createjs.MotionGuidePlugin.install();

/**
 * @ignore
 */
function handleFileLoad(evt: any, comp: any) {
	const images = comp.getImages();
	if (evt && (evt.item.type == 'image')) {
		images[evt.item.id] = evt.result;
	}
}