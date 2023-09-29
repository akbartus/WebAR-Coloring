AFRAME.registerComponent("coloring", {
  init: function () {
    const example3D = this.el;
    // Create canvas for using with OpenCV
    const screenshotCanvas = document.createElement("canvas");
    screenshotCanvas.id = "screenshotCanvas";
    screenshotCanvas.style.display = "none";
    document.body.appendChild(screenshotCanvas);
    const resultCanvas = document.createElement("canvas");
    resultCanvas.id = "resultCanvas";
    resultCanvas.setAttribute("style", "display:block; position: absolute; z-index:5; top:20px; left:20px;")
    //resultCanvas.style.display = "none";
    document.body.appendChild(resultCanvas);
    example3D.addEventListener("click", () => {
      this.onOpenCvReady();
    });
  },

  onOpenCvReady: function () {
    // Get screenshot
    const video = document.querySelector("video");
    const myCanvas = document.createElement("canvas"); // Get reference to the existing canvas element

    // Set the canvas dimensions to match the video
    myCanvas.width = video.videoWidth;
    myCanvas.height = video.videoHeight;

    // Draw the current frame of the video onto the canvas
    const context = myCanvas.getContext("2d");
    context.clearRect(0, 0, myCanvas.width, myCanvas.height);
    context.drawImage(video, 0, 0, myCanvas.width, myCanvas.height);

    const img = cv.imread(myCanvas);
    const edgeDetected = new cv.Mat();
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.Canny(img, edgeDetected, 100, 200, 3, true);
    cv.findContours(
      edgeDetected,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_NONE
    );

    const width = img.cols;
    const height = img.rows;

    const target = this.getApprox(contours, width, height);
    if (!target) {
      console.log("Failed to find a target.");
      this.scaleAndShowImage(img, 640, "screenshotCanvas");
      this.scaleAndShowImage(edgeDetected, 640, "resultCanvas");
      hierarchy.delete();
      contours.delete();
      edgeDetected.delete();
      img.delete();
      return;
    }

    const [srcTri, dstTri, dSize] = this.rectify(target);

    const M = cv.getPerspectiveTransform(srcTri, dstTri);

    const transformed = new cv.Mat();
    cv.warpPerspective(img, transformed, M, dSize);

    const grayed = new cv.Mat();
    cv.cvtColor(transformed, grayed, cv.COLOR_RGBA2GRAY, 0);

    const finalImage = new cv.Mat();
    cv.adaptiveThreshold(
      grayed,
      finalImage,
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY,
      5,
      3
    );

    this.scaleAndShowImage(img, 640, "screenshotCanvas");
    this.scaleAndShowImage(transformed, 640, "resultCanvas");
    const image = resultCanvas.toDataURL("image/jpeg", 1.0); // Specify image format and quality
    const newTexture = new THREE.TextureLoader().load(image);
    newTexture.flipY = false;

    const example3DObject = this.el.getObject3D("mesh");
    example3DObject.traverse((node) => {
      if (node.isMesh) {
        node.material.map = newTexture;
        node.material.needsUpdate = true;
      }
    });

    transformed.delete();
    grayed.delete();
    finalImage.delete();
    M.delete();
    srcTri.delete();
    dstTri.delete();
    target.delete();
    hierarchy.delete();
    contours.delete();
    edgeDetected.delete();
    img.delete();
  },

  getApprox: function (contours, width, height) {
    const sorted = [];
    for (let i = 0; i < contours.size(); i++) {
      const arcLength = cv.arcLength(contours.get(i), true);
      sorted.push({
        arcLength,
        element: contours.get(i),
      });
    }
    sorted.sort((a, b) =>
      a.arcLength < b.arcLength ? 1 : b.arcLength < a.arcLength ? -1 : 0
    );
    const imagePerimeter = 2 * (width + height);
    for (let i = 0; i < contours.size(); i++) {
      if (sorted[i].arcLength >= imagePerimeter) continue;
      const approx = new cv.Mat();
      cv.approxPolyDP(
        sorted[i].element,
        approx,
        0.02 * sorted[i].arcLength,
        true
      );
      if (approx.size().height === 4) return approx;
    }
    return null;
  },

  rectify: function (target) {
    const vertex = [];
    vertex.push(new cv.Point(target.data32S[0 * 4], target.data32S[0 * 4 + 1]));
    vertex.push(
      new cv.Point(target.data32S[0 * 4 + 2], target.data32S[0 * 4 + 3])
    );
    vertex.push(new cv.Point(target.data32S[1 * 4], target.data32S[1 * 4 + 1]));
    vertex.push(
      new cv.Point(target.data32S[1 * 4 + 2], target.data32S[1 * 4 + 3])
    );

    let xMin = vertex[0].x,
      yMin = vertex[0].y,
      xMax = vertex[0].x,
      yMax = vertex[0].y;
    for (let i = 1; i < vertex.length; i++) {
      if (vertex[i].x < xMin) xMin = vertex[i].x;
      if (vertex[i].x > xMax) xMax = vertex[i].x;
      if (vertex[i].y < yMin) yMin = vertex[i].y;
      if (vertex[i].y > yMax) yMax = vertex[i].y;
    }
    const width = Math.floor(Math.abs(xMax - xMin));
    const height = Math.floor(Math.abs(yMax - yMin));

    const nWest = vertex[0].y < vertex[1].y ? vertex[0] : vertex[1];
    const sWest = vertex[0].y < vertex[1].y ? vertex[1] : vertex[0];
    const sEast = vertex[2].y > vertex[3].y ? vertex[2] : vertex[3];
    const nEast = vertex[2].y > vertex[3].y ? vertex[3] : vertex[2];

    const src = [
      nWest.x,
      nWest.y,
      nEast.x,
      nEast.y,
      sEast.x,
      sEast.y,
      sWest.x,
      sWest.y,
    ];
    const dst = [0, 0, width, 0, width, height, 0, height];
    const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, src);
    const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, dst);
    const dSize = new cv.Size(width, height);
    return [srcTri, dstTri, dSize];
  },

  scaleAndShowImage: function (image, maxWidth, canvasId) {
    let longerSide = image.cols > image.rows ? image.cols : image.rows;
    longerSide = image.cols;
    let exponent = 0;
    while (longerSide > maxWidth) {
      longerSide /= 2;
      exponent++;
    }
    const divisor = Math.pow(2, exponent);
    const dSize = new cv.Size(image.cols / divisor, image.rows / divisor);
    const resized = new cv.Mat();
    cv.resize(image, resized, dSize, 0, 0, cv.INTER_AREA);
    cv.imshow(canvasId, resized);
    resized.delete();
  },
});
