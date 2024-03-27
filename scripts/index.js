const MOVE_TIME = 200;
const MOVE_DISTANCE_OF_WRAPPER = [10, 35];
const MOVE_DISTANCE_OF_IMG = [5, 35];
const CLOSER_MOUSE_PX = 250;

const wrapper = document.createElement("div");
wrapper.style = `
  position: fixed;
  top: 0;
  left: 0;
  z-index: 15000;
  user-select: none;
  transition: transform ${MOVE_TIME / 1000}s linear;
`;

const chienWen = document.createElement("img");
chienWen.src = chrome.runtime.getURL("images/icon_96.png");
chienWen.style = `
  display: block;
  filter: drop-shadow(0px 0px 5px #333);
  transition: transform ${MOVE_TIME / 1000}s linear;
`;

wrapper.appendChild(chienWen);
document.body.appendChild(wrapper);

let mouseX = null;
let mouseY = null;
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX ?? null;
  mouseY = e.clientY ?? null;
});
window.addEventListener("mouseout", () => {
  mouseX = null;
  mouseY = null;
});

function getRandomNumber(min, max) {
  const number = Math.floor(Math.random() * max) + 1;
  return number < min ? min : number;
}

function getRandomBoolean() {
  return Math.random() > 0.5;
}

function getNewX(rawX, maxX, addX) {
  const isToRight = getRandomBoolean() && rawX < maxX;
  if (isToRight) {
    const addedX = rawX + addX;
    return addedX > maxX ? maxX : addedX;
  }
  const minusX = rawX - addX;
  return minusX < 0 ? 0 : minusX;
}
function getNewXWithMouse(rawX, maxX, addX, offsetX = 0) {
  const offsetMouseX = mouseX - offsetX;
  const curMouseX = offsetMouseX < 0 ? 0 : offsetMouseX;
  const isToRight = curMouseX - rawX > 0;
  if (isToRight) {
    const addedX = rawX + addX;
    return addedX > maxX ? maxX : addedX;
  }
  const minusX = rawX - addX;
  return minusX < 0 ? 0 : minusX;
}

function getNewY(rawY, maxY, addY) {
  const isToBottom = getRandomBoolean() && rawY < maxY;
  if (isToBottom) {
    const addedY = rawY + addY;
    return addedY > maxY ? maxY : addedY;
  }
  const minusY = rawY - addY;
  return minusY < 0 ? 0 : minusY;
}
function getNewYWithMouse(rawY, maxY, addY, offsetY = 0) {
  const offsetMouseY = mouseY - offsetY;
  const curMouseY = offsetMouseY < 0 ? 0 : offsetMouseY;
  const isToBottom = curMouseY - rawY > 0;
  if (isToBottom) {
    const addedY = rawY + addY;
    return addedY > maxY ? maxY : addedY;
  }
  const minusY = rawY - addY;
  return minusY < 0 ? 0 : minusY;
}

let start = null;
function step(timestamp) {
  const isRun = start === null || timestamp - start > MOVE_TIME;
  if (isRun) {
    start = timestamp;

    const regex = /-?\d+(\.\d+)?/g;
    const [wrapX = 0, wrapY = 0] = wrapper.style.transform.match(regex) ?? [];

    // Mouse
    const isAttractedX =
      mouseX !== null && Math.abs(mouseX - wrapX) < CLOSER_MOUSE_PX;
    const isAttractedY =
      mouseY !== null && Math.abs(mouseY - wrapY) < CLOSER_MOUSE_PX;

    // X
    const addWrapX = getRandomNumber(
      MOVE_DISTANCE_OF_WRAPPER[0],
      MOVE_DISTANCE_OF_WRAPPER[1]
    );
    const newWrapX = isAttractedX
      ? getNewXWithMouse(+wrapX, window.innerWidth, addWrapX)
      : getNewX(+wrapX, window.innerWidth, addWrapX);
    // Y
    const addWrapY = getRandomNumber(
      MOVE_DISTANCE_OF_WRAPPER[0],
      MOVE_DISTANCE_OF_WRAPPER[1]
    );
    const newWrapY = isAttractedY
      ? getNewYWithMouse(+wrapY, window.innerHeight, addWrapY)
      : getNewY(+wrapY, window.innerHeight, addWrapY);

    wrapper.style.transform = `translate(${newWrapX}px, ${newWrapY}px)`;

    // move chien wen
    const IMG_MOVE_BOUNDARY = 200;
    const [imgX = 0, imgY = 0] = chienWen.style.transform.match(regex) ?? [];

    // X
    const addImgX = getRandomNumber(
      MOVE_DISTANCE_OF_IMG[0],
      MOVE_DISTANCE_OF_IMG[1]
    );
    const newImgX = isAttractedX
      ? getNewXWithMouse(+imgX, IMG_MOVE_BOUNDARY, addImgX, +wrapX)
      : getNewX(+imgX, IMG_MOVE_BOUNDARY, addImgX);
    // Y
    const addImgY = getRandomNumber(
      MOVE_DISTANCE_OF_IMG[0],
      MOVE_DISTANCE_OF_IMG[1]
    );
    const newImgY = isAttractedY
      ? getNewYWithMouse(+imgY, IMG_MOVE_BOUNDARY, addImgY, +wrapY)
      : getNewY(+imgY, IMG_MOVE_BOUNDARY, addImgY);

    chienWen.style.transform = `translate(${newImgX}px, ${newImgY}px)`;
  }

  window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);
