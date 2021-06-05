# @tawaship/pixi-animate-core

A module for processing the content created with Adobe Animate with "[pixi.js](https://github.com/pixijs/pixi.js)".

**This plugin is a core module, not intended to run alone.**

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

---

## Overview

### Each original (simplified) flow

- createjs contents published by Adobe Animate
![origin](https://raw.githubusercontent.com/tawaship/pixi-animate-core/master/img/animate.png)

- pixi.js contents
![origin](https://raw.githubusercontent.com/tawaship/pixi-animate-core/master/img/pixi.png)

### Flow to be realized

![core](https://raw.githubusercontent.com/tawaship/pixi-animate-core/master/img/core.png)

## Supported versions

- A complete set of content created with Adobe Animate version 20.02 / 20.5.1
- pixi.js 5.3.2

I have not confirmed the operation on other versions.

## How to install

```sh
npm install --save @tawaship/pixi-animate-core
```

## Change log

### 1.0.0

- Overrides

	|name|class|
	|:--|:--|
	|createjs.StageGL|[CreatejsStageGL](https://tawaship.github.io/pixi-animate-core/classes/createjsstagegl.html)|
	|createjs.MovieClip|[CreatejsMovieClip](https://tawaship.github.io/pixi-animate-core/classes/createjsmovieclip.html)|
	|createjs.Sprite|[CreatejsSprite](https://tawaship.github.io/pixi-animate-core/classes/createjssprite.html)|
	|createjs.Shape|[CreatejsShape](https://tawaship.github.io/pixi-animate-core/classes/createjsshape.html)|
	|createjs.Graphics|[CreatejsGraphics](https://tawaship.github.io/pixi-animate-core/classes/createjsgraphics.html)|
	|createjs.Text|[CreatejsText](https://tawaship.github.io/pixi-animate-core/classes/createjstext.html)|
	|createjs.ButtonHelper|[CreatejsButtonHelper](https://tawaship.github.io/pixi-animate-core/classes/createjsbuttonhelper.html)

### 1.0.9

- Overrides

	|name|class|
	|:--|:--|
	|createjs.Bitmap|[CreatejsBitmap](https://tawaship.github.io/pixi-animate-core/classes/createjsbitmap.html)|

### 1.1.1

- Supports motion guide

### 1.2.0

- Supports Animate 20.5.1
- Overrides

	|name|class|
	|:--|:--|
	|createjs.Stage|[CreatejsStage](https://tawaship.github.io/pixi-animate-core/classes/createjsstage.html)|

### 3.0.0

- Migrated all files to typescript
- Abolition of some options

## Unimplemented

- Filter effects
- Unexpected processing method