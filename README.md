# WebAR Coloring
<img src="img/screenshot.gif" title="screen capture" alt="screen capture" width="250" style="text-align: center">

### **Description / Rationale**
This repository contains the algorithm and various implementations of web-based augmented reality coloring. Creation of this repository was dictated by the fact that at present there are no similar works, which are open-source and affordable (all existing web AR coloring examples are not free).

### **Instructions**
The repository contains the implementations/demos for: 
* MindAR.js (see mindarjs folder)
* AR.js (see arjs folder)
* SimpleAR (see simplear folder)

Besides these, the repository contains A-Frame component (see a-frame-component folder), which can be used in the following way: 

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
And, in order to apply the coloring, just click on 3D model.

### **Texture Mapping**
Web AR coloring works in following way: 
1. 3D model texture map is prepared, which is used as image target and as texture of 3D model.
2. Webcamera video frame is taken.
3. It is passed over to OpenCV algorithm, which segments a rectangular/square region, which contains 4 points (i.e. this is how image targets on white physical papers/documents are segmented; it is also possible to get differently shaped region, which is not a rectangle/square as well, but it is not as common as rectangular/square region; notably, the same algorithm is used in creating Document Scanner Apps).   
4. Segmented region, i.e. rectangle/square texture, is set on 3D model.

Texture mapping represents an important step in making sure that web AR coloring works as intended. Depending on the complexity of a 3D model as well as result to be achieved various texture mapping methods can be applied. I suggest to use Blender to prepare 3D model with texture map.

The following video tutorials can be used to learn texture mapping specifically in the context of AR coloring:
* https://www.youtube.com/watch?v=6_w8tiEo4aI
* https://www.youtube.com/watch?v=32lQxcIjxMU
* https://www.youtube.com/watch?v=kERzhJKYvGo (see in particular from the place, where it shows texture mapping on Blender, 10:11) 

<b>Please note:</b> Make sure to apply texture to 3D model, when creating/preparing the 3D model in Blender. This texture will later be replaced with the new one when OpenCV algorithm is called. Without this step web AR coloring will not work!

<b>Please note:</b> Tracking could be improved in runtime/live web AR coloring by making target with more features and the actual texture, applied to 3D model smaller.

<b>Please note:</b> The texture in the examples containing 3D model is applied only to a part of the model.  

<b>Please note:</b> SimpleAR implementation of web AR coloring requires separately compiled OpenCV.js.  

<b>Please note:</b> The texture mapping could be applied in relation to animated models as well (which means that you can use animated 3D models). It is also possible to apply texture mapping to 3D models, parts of which, during the first load could be placed to different locations in 3D space (for example consider a 3D model of a house separated into parts to make it easier for texture mapping, which come together to create a house after loading of the scene). 


### **UPDATES**
* Added example of texture mapping, which includes Blender file and others (see: "texture-mapping-example" folder).

### **Q&A**
* **What is web AR coloring?** In simple words it is applying the texture of an image target onto 3D model/object.
* **Can I color the image target in web AR coloring?** Yes, you can color the image target. In fact, web AR coloring is made specifically for this, i.e. creating coloring pages, which after coloring can be applied as textures onto 3D models/objects.
* **Is region capture the same thing as AR coloring ?** Yes, while the former is more technical, the latter is more descriptive.
* **When AR coloring appeared?** One of the first examples of AR coloring was provided already in 2015 by Disney Research team (see: https://www.theverge.com/2015/10/5/9453703/disney-research-augmented-reality-coloring-books).

### **Tech Stack**
The web AR coloring is powered by AFrame, Three.js and OpenCV.js and web AR libraries as <a href="https://github.com/hiukim/mind-ar-js">MindAR.js</a>, <a href="https://github.com/AR-js-org/AR.js">AR.js</a>, <a href="https://github.com/akbartus/Simple-AR">SimpleAR</a>. The 3D model of the raccoon was taken from <a href="https://github.com/hiukim/mind-ar-js/tree/master/examples/image-tracking/assets/band-example/raccoon">MindAR.js repository</a> and under MIT License - Copyright (c) 2020 hiukim.

To learn more about OpenCV.js and its various uses, please refer to another repository: https://github.com/akbartus/OpenCV-Examples-in-JavaScript.    

### **Demo**
The repository contains the following implementations/demos: 
* MindAR.js: 
    - <a href="https://webarcoloring-plane.glitch.me/">Simple Web AR coloring of a plane</a> and <a href="img/target_plane.jpg">image target</a>.
    - <a href="https://webarcoloring-box.glitch.me/">Simple Web AR coloring of a box</a> and <a href="img/target_box.jpg">image target</a>.
    - <a href="https://webarcoloring-3d.glitch.me/">Web AR coloring of a 3D model with animation</a> and <a href="img/target_3d.jpg">image target 1</a> or <a href="img/target_3d2.jpg">image target 2</a>.
    - <a href="https://webarcoloring-video.glitch.me/">Runtime/live web AR coloring of a 3D model with webcamera feed</a> and <a href="img/target_3d.jpg">image target 1</a> or <a href="img/target_3d2.jpg">image target 2</a>.
* AR.js:
    - <a href="https://webarcoloring-arjs.glitch.me/">Marker-based Web AR coloring of a 3D model</a> and <a href="img/target_arjs.png">image target</a>.
* SimpleAR:
    - <a href="https://webarcoloring-simplear.glitch.me/">Web AR coloring of a 3D model</a> and <a href="img/target_3d.jpg">image target 1</a> or <a href="img/target_3d2.jpg">image target 2</a>.
* A-Frame component:
    - <a href="https://webarcoloring-component.glitch.me/">Example implementation</a> and <a href="img/target_3d.jpg">image target 1</a> or <a href="img/target_3d2.jpg">image target 2</a>.
