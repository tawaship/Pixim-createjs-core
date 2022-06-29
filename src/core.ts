import * as PIXI from 'pixi.js';
import * as PA from './createjs/index';
import createjs from '@tawaship/createjs-module';

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

export function resolvePath(path: string, basepath: string) {
	return PIXI.utils.url.resolve(basepath, path);
}

/**
 * Load assets of createjs content published with Adobe Animate.
 * 
 * @param comp Composition obtained from `AdobeAn.getComposition`.
 */
export function loadAssetAsync(comp: any) {
	if (!comp) {
		return Promise.reject(new Error('no composition'));
	}
	
	const lib: IAnimateLibrary = comp.getLibrary();
	
	return new Promise((resolve, reject) => {
		if (lib.properties.manifest.length === 0) {
			resolve({});
		}
		
		const loader = new createjs.LoadQueue(false);
		
		loader.installPlugin(createjs.Sound);
		
		const errors: any[] = [];
		
		loader.addEventListener('fileload', (evt: any) => {
			handleFileLoad(evt, comp);
		});
		
		loader.addEventListener('complete', (evt: any) => {
			if (errors.length) {
				reject(errors);
				return;
			}
			
			resolve(evt);
		});
		
		loader.addEventListener('error', (evt: any) => {
			errors.push(evt.data);
		});
		
		loader.loadManifest(lib.properties.manifest || []);
	})
	.then((evt: any) => {
		const ss = comp.getSpriteSheet();
		const queue = evt.target;
		const ssMetadata = lib.ssMetadata;
		
		for (let i = 0; i < ssMetadata.length; i++) {
			ss[ssMetadata[i].name] = new createjs.SpriteSheet({
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
createjs.Stage = PA.CreatejsStage;
createjs.StageGL = PA.CreatejsStageGL;
createjs.MovieClip = PA.CreatejsMovieClip;
createjs.Sprite = PA.CreatejsSprite;
createjs.Shape = PA.CreatejsShape;
createjs.Bitmap = PA.CreatejsBitmap;
createjs.Graphics = PA.CreatejsGraphics;
createjs.Text = PA.CreatejsText;
createjs.ButtonHelper = PA.CreatejsButtonHelper;

// install plugins
createjs.MotionGuidePlugin.install();

/**
 * @ignore
 */
function handleFileLoad(evt: any, comp: any) {
	const images = comp.getImages();
	if (evt && (evt.item.type == 'image')) {
		images[evt.item.id] = evt.result;
	}
}