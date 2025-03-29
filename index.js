const colorPicker = document.querySelector('input[type="color"]');

const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

(function init() {
  const w = 1000,
    h = 600;
  canvas.width = w * devicePixelRatio;
  canvas.height = h * devicePixelRatio;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
})();

const shapes = [];

class Rectangle {
  constructor(startX, startY, color) {
    this.startX = startX;
    this.startY = startY;
    this.color = color;
    // 最开始的时候，将结束坐标设置为开始坐标
    this.endX = startX;
    this.endY = startY;

  }

  // 因为不确定拖动方向，所以这里可以得到确切的左上角坐标。
  get minX() {
    return Math.min(this.startX, this.endX)
  }
  get minY() {
    return Math.min(this.startY, this.endY)
  }
  get maxX() {
    return Math.max(this.startX, this.endX)
  }
  get maxY() {
    return Math.max(this.startY, this.endY)
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.minX * devicePixelRatio,
      this.minY * devicePixelRatio,
      (this.maxX - this.minX) * devicePixelRatio,
      (this.maxY - this.minY) * devicePixelRatio
    );

    // 绘制边框
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3 * devicePixelRatio;
    ctx.strokeRect(
      this.minX * devicePixelRatio,
      this.minY * devicePixelRatio,
      (this.maxX - this.minX) * devicePixelRatio,
      (this.maxY - this.minY) * devicePixelRatio
    );
  }
  isInsede(x, y) {
    return (x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY);
  }
}


/*
示例：
  const rect =new Rectangle(100,100,'red');
  rect.endX= 500;
  rect.endY= 300;
  rect.draw();
*/

function getShape(x, y) {
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];
    if (shape.isInsede(x, y)) {
      return shape;
    }
  }
}


canvas.addEventListener('mousedown', (e) => {
  const shape = getShape(e.offsetX, e.offsetY);
  if (shape) {

    const sx = e.offsetX,
          sy = e.offsetY;
    const { startX, startY, endX, endY } = shape;
    // 开始拖动改动矩形结束坐标
    const mouseMoveHandler = (e) => {
      const canvasRect = canvas.getBoundingClientRect();

      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      const dx = x - sx;
      const dy = y - sy;
      shape.startX = startX + dx;
      shape.startY = startY + dy;
      shape.endX = endX + dx;
      shape.endY = endY + dy;
    };
    const mouseUpHandler = (e) => {
      // 清理事件监听
      window.removeEventListener('mousemove', mouseMoveHandler)
      window.removeEventListener('mouseup', mouseUpHandler)
    };
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', mouseUpHandler)
  } else {
    const rect = new Rectangle(e.offsetX, e.offsetY, colorPicker.value);
    shapes.push(rect);

    const canvasRect = canvas.getBoundingClientRect();

    // 开始拖动改动矩形结束坐标
    const mouseMoveHandler = (e) => {
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      rect.endX = x
      rect.endY = y
    };
    const mouseUpHandler = (e) => {
      // 清理事件监听
      window.removeEventListener('mousemove', mouseMoveHandler)
      window.removeEventListener('mouseup', mouseUpHandler)
    };
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', mouseUpHandler)
  }

})

function draw() {
  requestAnimationFrame(draw);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const shape of shapes) {
    shape.draw();
  }
}
draw();
