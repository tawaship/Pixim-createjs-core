export * from './core';
export * from './Stage';
export * from './StageGL';
export * from './MovieClip';
export * from './Sprite';
export * from './Shape';
export * from './Bitmap';
export * from './Graphics';
export * from './Text';
export * from './ButtonHelper';

import { CreatejsButtonHelper } from './ButtonHelper';
import { CreatejsStage } from './Stage';
import { CreatejsStageGL } from './StageGL';
import { CreatejsMovieClip, PixiMovieClip } from './MovieClip';
import { CreatejsSprite } from './Sprite';
import { CreatejsShape } from './Shape';
import { CreatejsBitmap } from './Bitmap';
import { CreatejsGraphics } from './Graphics';
import { CreatejsText } from './Text';

import { createjs as originalCreatejs } from './alias';

export const createjs = Object.assign(originalCreatejs, {
	Stage: CreatejsStage,
	StageGL: CreatejsStageGL,
	MovieClip: CreatejsMovieClip,
	Sprite: CreatejsSprite,
	Shape: CreatejsShape,
	Bitmap: CreatejsBitmap,
	Graphics: CreatejsGraphics,
	Text: CreatejsText
});