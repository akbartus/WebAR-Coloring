# WebAR Coloring
<img src="img/screenshot.gif" title="screen capture" alt="screen capture" width="250" style="text-align: center">

### **Description / Rationale**
This repository contains the algorithm and various implementations of web-based augmented reality coloring. Creation of this repository was dictated by the fact that at present there no similar works, which are open-source and affordable. I hope that open-sourcing this repository will help to advance further immersive technologies as web AR and attract more developers to them.

### **Instructions**
The repository contains the implementations/demos for: 
* MindAR.js: 
* AR.js:
* SimpleAR:

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

### **Tech Stack**
The web AR coloring is powered by AFrame, Three.js and OpenCV.js and web AR libraries as MindAR.js, AR.js, SimpleAR.   

### **Demo**
The repository contains the following implementations/demos: 
* MindAR.js: 
    - Simple Web AR coloring of a plane.
    - Simple Web AR coloring of a box.
    - Web AR coloring of a 3D model with animation.
    - Runtime web AR coloring of a 3D model with webcamera feed.
* AR.js:
    - Marker-based Web AR coloring of a 3D model.
* SimpleAR:
    - Web AR coloring of a 3D model.

