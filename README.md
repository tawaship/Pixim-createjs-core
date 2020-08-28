# @tawaship/pixi-animate-core

A module for processing the content published by Adobe Animate with "[pixi.js](https://github.com/pixijs/pixi.js)".

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

- A complete set of content published with Adobe Animate version 20.02
- pixi.js 5.3.2

I have not confirmed the operation on other versions.

## How to install

```sh
npm install --save @tawaship/pixi-animate-core
```

## Overrides

- createjs.StageGL = [CreatejsStageGL](https://tawaship.github.io/pixi-animate-core/classes/createjsstagegl.html)
- createjs.Movieclip = [CreatejsMovieClip](https://tawaship.github.io/pixi-animate-core/classes/createjsmovieclip.html)
- createjs.Sprite = [CreatejsSprite](https://tawaship.github.io/pixi-animate-core/classes/createjssprite.html)
- createjs.Shape = [CreatejsShape](https://tawaship.github.io/pixi-animate-core/classes/createjsshape.html)
- createjs.Graphics = [CreatejsGraphics](https://tawaship.github.io/pixi-animate-core/classes/createjsgraphics.html)
- createjs.Text = [CreatejsText](https://tawaship.github.io/pixi-animate-core/classes/createjstext.html)
- createjs.ButtonHelper = [CreatejsButtonHelper](https://tawaship.github.io/pixi-animate-core/classes/createjsbuttonhelper.html)

## Unimplemented

- Filter effects
- Unexpected processing method