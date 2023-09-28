# WebAR Coloring
<img src="img/screenshot.gif" title="screen capture" alt="screen capture" width="250" style="text-align: center">

### **Description / Rationale**
This repository contains the algorithm and various implementations of a coloring task for web-based augmented reality. Creation of this repository was dictated by the fact that at present there no similar works, which are open-source and affordable. I hope that open-sourcing this repository will help to advance further immersive technologies as web AR and attract more developers to them.

### **Instructions**
The repository contains the following implementations/demos: 
* MindAR.js: 
    - Simple Web AR coloring of a plane.
    - Simple Web AR coloring of a box.
    - Web AR coloring of a 3D model with animation.
    - Runtime web AR coloring of a 3D model with webcamera feed.
* AR.js:
    - Marker-based Web AR coloring of a 3D model.
* SimpleAR:
    - Web AR coloring of a 3D model

Besides these, the repository contains A-Frame component, which can be used in the following way: 

```html
<html>
<head>
  <title>WebAR Coloring with OpenCV.js: Component </title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="https://docs.opencv.org/4.8.0/opencv.js"></script>
  <script src="https://aframe.io/releases/1.4.2/aframe.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.2/dist/mindar-image-aframe.prod.js"></script>
  <script src="webar-coloring-component.js"></script>
</head>
<body>
  <a-scene mindar-image="imageTargetSrc: target_3d.mind;" vr-mode-ui="enabled: false"
    device-orientation-permission-ui="enabled: false">
    <a-entity mindar-image-target="targetIndex: 0">
    <!-- add component to a gltf entity -->
      <a-entity coloring gltf-model="raccoon.glb" class="clickable" scale="0.1 0.1 0.1"></a-entity>
    </a-entity>
    <a-camera position="0 0 0" look-controls="enabled: false" cursor="fuse: false; rayOrigin: mouse;"
    raycaster="near: 1; far: 10000; objects: .clickable"></a-camera>
  </a-scene>
</body>
</html>
```
Please note: Current version only supports single image tracking. Sample target, used in this example can be found <a href="img/target.jpg">here</a>. In order to improve smoothness of tracking to the desired level, play with One Euro filter values.

### **Events Handling**
The library has the following events:
* <b>targetFound</b>: Triggered when the target image is found by Simple AR.
```js
document.addEventListener("targetFound", function (event) {
    console.log("Target found!");
});
```
* <b>targetLost</b>: Triggered when the target image is lost by Simple AR.
```js
document.addEventListener("targetLost", function (event) {
    console.log("Target lost!");
});
```
* <b>onVideoStarted</b>: Triggered when webcamera video is started.
```js
document.addEventListener("onVideoStarted", () => {
    console.log("video started!");
});
```
* <b>arPause</b>: A toggle, which lets pause tracking system or unpause.
```js
const pauseButton = document.createElement("button");
pauseButton.setAttribute("style", "position: absolute; left:10px; top:10px; z-index:3");
pauseButton.textContent = "Pause";
pauseButton.addEventListener("click", arPause); // call here
document.body.appendChild(pauseButton);
```
* <b>onDistance</b>: Show distance between camera and image target.
```js
document.addEventListener("onDistance", (event) => {
 const distance = event.detail;
 console.log("Distance:", distance);
});
```

### **Version**
Most current version is 0.1.2.

### **Updates / Bug Fixes**
Please note that the work on this library (platform) is in progress. Future updates:
* <del>Adding "onDistance" event, which will let measuring distance between camera and AR target and trigger interactive events</del>.
* <del>Fixing rotation bug</del>.
* <del>Fixing positioning bug</del>.
* <del>Fixing centering issue</del>.
* <del>Full Babylon.js example created</del>.
* <del>Full Three.js example created</del>.
* Adding runtime target image loading feature.
* Adding a computer vision example for reading/segmenting texture of image target on a screen.
* Adding interactive examples.
* Adding Unity support (Unity WebGL exporter for Simple AR) 

### **Tech Stack**
The library(platform) is powered by AFrame, Three.js and WebAssembly (Emscripten). One Euro Filter was taken/adapted from the following sources ( https://github.com/hiukim/mind-ar-js/blob/master/src/libs/one-euro-filter.js, https://jaantollander.com/post/noise-filtering-using-one-euro-filter/#mjx-eqn%3A1).
The library(platform) is compatible with latest version of A-Frame (1.4.2). Tests with older versions of A-Frame were not perfomed yet.

Example implementation of Simple AR is also given for Three.js and Babylon.js (see "other_frameworks" folder).   

### **Demo**
See A-Frame demo here: [Demo](https://webar-simple.glitch.me/)

See ThreeJs demo here: [Demo](https://simplear-threejs.glitch.me/)

See BabylonJs demo here: [Demo](https://simplear-babylonjs.glitch.me/)
