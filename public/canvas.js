const paintCanvas = document.querySelector(".js-paint");
const context = paintCanvas.getContext("2d");
context.lineCap = "round";

const sig = document.getElementById("sig");

let x = 0,
    y = 0;
let isMouseDown = false;

const stopDrawing = () => {
    isMouseDown = false;
};

const startDrawing = event => {
    isMouseDown = true;
    [x, y] = [event.offsetX, event.offsetY];
};
const drawLine = event => {
    if (isMouseDown) {
        const newX = event.offsetX;
        const newY = event.offsetY;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(newX, newY);
        context.stroke();
        [x, y] = [newX, newY];
        // now we store the value of the signature;
        let dataURL = paintCanvas.toDataURL();
        sig.value = dataURL;
        console.log(dataURL);
    }
};

paintCanvas.addEventListener("mousedown", startDrawing);
paintCanvas.addEventListener("mousemove", drawLine);
paintCanvas.addEventListener("mouseup", stopDrawing);
paintCanvas.addEventListener("mouseout", stopDrawing);
