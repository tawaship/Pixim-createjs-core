import * as PIXI from 'pixi.js';

/**
 * @ignore
 */
declare const window: any;

export type TCreatejsLibrary = {
	[ name: string ]: any;
}

/**
 * Prepare createjs content published with Adobe Animate.
 * @param id "lib.properties.id" in Animate content.
 * @param basepath Directory path of Animate content.
 */
export function prepareCreatejsAsync(id: string, basepath: string) {
	const comp = window.AdobeAn.getComposition(id);
	if (!comp) {
		throw new Error('no composition');
	}
	
	const lib: TCreatejsLibrary = comp.getLibrary();
	
	return new Promise((resolve, reject) => {
		if (lib.properties.manifest.length === 0) {
			resolve({});
		}
		
		const loader = new window.createjs.LoadQueue(false);
		
		loader.installPlugin(window.createjs.Sound);
		
		loader.addEventListener('fileload', function(evt: any) {
			handleFileLoad(evt, comp);
		});
		
		loader.addEventListener('complete', function(evt: any) {
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

/**
 * @ignore
 */
function handleFileLoad(evt: any, comp: any) {
	const images = comp.getImages();
	if (evt && (evt.item.type == 'image')) {
		images[evt.item.id] = evt.result;
	}
}