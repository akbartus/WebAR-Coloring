let scene = document.querySelector("a-scene");
scene.setAttribute("mindar-image", "uiScanning:#icon-overlay")
function resizeCanvas(origCanvas, width, height) {
let resizedCanvas = document.createElement("canvas");
let resizedContext = resizedCanvas.getContext("2d");
resizedCanvas.height = height;
resizedCanvas.width = width;
resizedContext.drawImage(origCanvas, 0, 0, width, height);
return resizedCanvas.toDataURL();
}

document.getElementById("photo-button").addEventListener("click", function () {
let container = document.getElementById("container");
let photo = document.getElementById("photo");
let aScene = document.querySelector("a-scene").components.screenshot.getCanvas("perspective");
let frame = captureVideoFrame("video", "png");

container.setAttribute("style", "display:block");
photo.setAttribute("style", "display:block");
photo.setAttribute("src", "img/loader.gif")
aScene = resizeCanvas(aScene, frame.width, frame.height);
frame = frame.dataUri;
// Send request to hosted AI 
removeBackground(container, frame)

});

function captureVideoFrame(video, format, width, height) {
if (typeof video === 'string') {
    video = document.querySelector(video);
}
format = format || 'jpeg';
if (!video || (format !== 'png' && format !== 'jpeg')) {
    return false;
}
var canvas = document.createElement("CANVAS");
canvas.width = width || video.videoWidth;
canvas.height = height || video.videoHeight;
canvas.getContext('2d').drawImage(video, 0, 0);
var dataUri = canvas.toDataURL('image/' + format);
var data = dataUri.split(',')[1];
var mimeType = dataUri.split(';')[0].slice(5)
var bytes = window.atob(data);
var buf = new ArrayBuffer(bytes.length);
var arr = new Uint8Array(buf);
for (var i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
}
var blob = new Blob([arr], { type: mimeType });
return { blob: blob, dataUri: dataUri, format: format, width: canvas.width, height: canvas.height };
};


function removeBackground(container, frame) {
fetch('https://hf.space/embed/xiongjie/u2net_rgba/+/api/predict/', {
    method: "POST",
    body: JSON.stringify({
        "data": ["binary", frame]
    }),
    headers: { "Content-Type": "application/json" }
})
    .then(function (response) { return response.json(); })
    .then(function (json_response) {
        document.getElementById("photo").setAttribute("style", "display:block");                
        document.getElementById("photo").setAttribute("src", json_response.data[0]);
        let screenshot = document.querySelector("#screenshot");
        screenshot.setAttribute("material", "src:");
        screenshot.setAttribute("scale", "3 3 3");
        screenshot.setAttribute("material", "src:#photo; transparent: true; opacity: 1; alpha-test: 0.5");
        setTimeout(() => {
            container.setAttribute("style", "display:none;")
        }, 3000);


        // Remove additionally the colors
        // setTimeout(() => {
        //     removeColor(json_response.data[0]);
        // }, 1000);
    })
}

function removeColor() {
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    image = document.getElementById("photo");
canvas.width = image.width;
canvas.height = image.height;
ctx.drawImage(image, 0, 0);

var imgd = ctx.getImageData(0, 0, image.width, image.height),
    pix = imgd.data,
    newColor = { r: 0, g: 0, b: 0, a: 0 };

for (var i = 0, n = pix.length; i < n; i += 4) {
    var r = pix[i],
        g = pix[i + 1],
        b = pix[i + 2];

    if (r > 150 && g > 150 && b > 150) {
        // Change the white to the new color.
        pix[i] = newColor.r;
        pix[i + 1] = newColor.g;
        pix[i + 2] = newColor.b;
        pix[i + 3] = newColor.a;

    }
}

ctx.putImageData(imgd, 0, 0);
// let screenshot = document.querySelector("#screenshot");
// screenshot.setAttribute("material", "src:");
// screenshot.setAttribute("material", "src:#canvas; transparent: true; opacity: 1; alpha-test: 0.5");
}
