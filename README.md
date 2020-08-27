# @tawaship/pixi-animate-core

"pixi-createjs-core" is a module for processing the content published by Adobe Animate with "[pixi.js](https://github.com/pixijs/pixi.js)".

**This plugin is a core module, not intended to run alone.**

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

---

## Overview

### Each original (simplified) flow

![origin](https://raw.githubusercontent.com/tawaship/pixi-animate-core/master/origin.png)

### Flow to be realized

![core](https://raw.githubusercontent.com/tawaship/pixi-animate-core/master/core.png)

## Support version

- A complete set of content published with Adobe Animate version 20.02
- pixi.js 5.3.2

I have not confirmed the operation on other versions.

## How to install

```sh
npm install --save @tawaship/pixi-animate-core
```

## Overrides

- createjs.Movieclip
- createjs.Sprite
- createjs.Shape
- createjs.Graphics
- createjs.Text
- createjs.ButtonHelper