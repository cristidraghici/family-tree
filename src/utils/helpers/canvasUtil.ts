import type { PersonIdType } from '../PersonRegistry'

export type BoxId = PersonIdType

export type Box = {
  id: BoxId
  text: string

  x: number
  y: number
  width: number
  height: number
}

export type Line = {
  startX: number
  startY: number
  endX: number
  endY: number
}

class CanvasUtil {
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D

  private offsetX: number = 0
  private offsetY: number = 0
  private scaleFactor: number = 1.0

  private boxes: Box[] = []
  private connections: [BoxId, BoxId][] = []

  private selectedBox: Box | null = null
  private isCanvasDragging: boolean = false

  private dblClick: (id: BoxId) => void

  private touchStartPos: { x: number; y: number } | null = null

  constructor({ canvas, dblClick }: { canvas: HTMLCanvasElement; dblClick: (id: BoxId) => void }) {
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D

    this.dblClick = dblClick
  }

  private drawBox(box: Box) {
    this.context.globalAlpha = 0.9 // Set slight transparency
    this.context.fillStyle = '#aaf'
    this.context.fillRect(box.x, box.y, box.width, box.height)
    this.context.strokeStyle = '#000'
    this.context.lineWidth = 2
    this.context.strokeRect(box.x, box.y, box.width, box.height)
    this.context.font = '14px Arial'
    this.context.fillStyle = '#000'
    this.context.fillText(box.text, box.x + 10, box.y + 25)
    this.context.globalAlpha = 1 // Reset transparency
  }

  private drawLine({ startX, startY, endX, endY }: Line) {
    this.context.beginPath()
    this.context.moveTo(startX, startY)
    this.context.lineTo(endX, endY)
    this.context.stroke()
  }

  public connectBoxes(a: BoxId, b: BoxId, { straight = false }: { straight?: boolean } = {}) {
    const box1 = this.getBoxById(a)
    const box2 = this.getBoxById(b)

    if (!box1 || !box2) {
      return
    }

    if (!straight) {
      this.drawLine({
        startX: box1.x + box1.width / 2,
        startY: box1.y + box1.height / 2,
        endX: box2.x + box2.width / 2,
        endY: box2.y + box2.height / 2,
      })

      return
    }

    const midX1 = box1.x + box1.width / 2
    const midY1 = box1.y + box1.height / 2
    const midX2 = box2.x + box2.width / 2
    const midY2 = box2.y + box2.height / 2

    // Adjust the line's path for 90-degree angles
    if (Math.abs(midX1 - midX2) > Math.abs(midY1 - midY2)) {
      this.drawLine({ startX: midX1, startY: midY1, endX: midX2, endY: midY1 })
      this.drawLine({ startX: midX2, startY: midY1, endX: midX2, endY: midY2 })
    } else {
      this.drawLine({ startX: midX1, startY: midY1, endX: midX1, endY: midY2 })
      this.drawLine({ startX: midX1, startY: midY2, endX: midX2, endY: midY2 })
    }
  }

  public draw() {
    // Update the canvas context size to match the canvas element size
    this.context.canvas.width = this.canvas.width
    this.context.canvas.height = this.canvas.height

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.setTransform(this.scaleFactor, 0, 0, this.scaleFactor, 0, 0)

    this.connections.forEach(([a, b]) => this.connectBoxes(a, b))
    this.boxes.forEach((box) => this.drawBox(box))
  }

  public findBox(x: number, y: number) {
    for (const box of this.boxes) {
      if (x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height) {
        return box
      }
    }

    return null
  }

  private getMousePosition(e: MouseEvent) {
    const { left, top } = this.canvas.getBoundingClientRect()
    return {
      mouseX: e.clientX - left,
      mouseY: e.clientY - top,
    }
  }

  private handleMouseDown(e: MouseEvent) {
    const { mouseX, mouseY } = this.getMousePosition(e)

    this.selectedBox = this.findBox(mouseX, mouseY)

    if (!this.selectedBox) {
      this.isCanvasDragging = true

      this.offsetX = mouseX
      this.offsetY = mouseY
    } else {
      this.offsetX = mouseX - this.selectedBox.x
      this.offsetY = mouseY - this.selectedBox.y
    }
  }

  private handleMouseMove(e: MouseEvent) {
    const { mouseX, mouseY } = this.getMousePosition(e)

    if (this.isCanvasDragging) {
      const dx = mouseX - this.offsetX
      const dy = mouseY - this.offsetY

      this.boxes.forEach((box) => {
        box.x += dx
        box.y += dy
      })

      this.offsetX = mouseX
      this.offsetY = mouseY

      this.draw()
    } else if (this.selectedBox) {
      this.selectedBox.x = mouseX - this.offsetX
      this.selectedBox.y = mouseY - this.offsetY

      this.draw()
    }
  }

  private handleMouseUp() {
    this.selectedBox = null
    this.isCanvasDragging = false
  }

  private handleDoubleClick(e: MouseEvent) {
    const { mouseX, mouseY } = this.getMousePosition(e)

    const clickedBox = this.findBox(mouseX, mouseY)

    if (clickedBox) {
      this.dblClick(clickedBox.id)
    }
  }

  private getTouchPosition(touch: Touch) {
    const { left, top } = this.canvas.getBoundingClientRect()

    const touchX = touch.clientX - left
    const touchY = touch.clientY - top

    return { touchX, touchY }
  }
  private handleTouchStart(e: TouchEvent) {
    e.preventDefault() // Prevent default touch behavior

    const { touchX, touchY } = this.getTouchPosition(e.touches[0])

    this.selectedBox = this.findBox(touchX, touchY)

    if (!this.selectedBox) {
      this.isCanvasDragging = true

      this.touchStartPos = { x: touchX, y: touchY }
    } else {
      this.touchStartPos = null
      this.offsetX = touchX - this.selectedBox.x
      this.offsetY = touchY - this.selectedBox.y
    }
  }

  private handleTouchMove(e: TouchEvent) {
    e.preventDefault() // Prevent default touch behavior

    if (this.isCanvasDragging && this.touchStartPos) {
      const { touchX, touchY } = this.getTouchPosition(e.touches[0])

      const dx = touchX - this.touchStartPos.x
      const dy = touchY - this.touchStartPos.y

      this.boxes.forEach((box) => {
        box.x += dx
        box.y += dy
      })

      this.touchStartPos = { x: touchX, y: touchY }

      this.draw()
    } else if (this.selectedBox) {
      const { touchX, touchY } = this.getTouchPosition(e.touches[0])

      this.selectedBox.x = touchX - this.offsetX
      this.selectedBox.y = touchY - this.offsetY

      this.draw()
    }
  }

  private handleTouchEnd() {
    this.selectedBox = null
    this.isCanvasDragging = false
    this.touchStartPos = null
  }

  private handleWheel(e: WheelEvent) {
    const { mouseX, mouseY } = this.getMousePosition(e)

    const scaleFactorChange = e.deltaY > 0 ? 0.9 : 1.1 // Adjust the scale factor based on the wheel direction
    this.scaleFactor *= scaleFactorChange

    // Adjust the offsetX and offsetY based on the zoom center
    this.offsetX = mouseX - (mouseX - this.offsetX) * scaleFactorChange
    this.offsetY = mouseY - (mouseY - this.offsetY) * scaleFactorChange

    this.draw()
  }

  private isOverlap(box1: { x: number; y: number }, box2: Box): boolean {
    const box1Right = box1.x + 50
    const box1Bottom = box1.y + 50
    const box2Right = box2.x + 50
    const box2Bottom = box2.y + 50

    return box1.x < box2Right && box1Right > box2.x && box1.y < box2Bottom && box1Bottom > box2.y
  }

  public addBox({ id, text }: { id: BoxId; text: string }) {
    const generateRandomPosition = () => {
      return [Math.random() * (this.canvas.width - 100), Math.random() * (this.canvas.height - 50)]
    }

    let x: number, y: number
    do {
      ;[x, y] = generateRandomPosition()
    } while (this.boxes.some((box) => this.isOverlap({ x, y }, box)))

    // Calculate width and height based on text length
    const { width } = this.context.measureText(text)

    this.boxes.push({
      id,
      text,

      x,
      y,
      width: width + 25, // Add padding,
      height: 40,
    })
  }

  public addConnection(a: BoxId, b: BoxId) {
    if (!a || !b) {
      return
    }

    const isAlreadyConnected = this.connections.some(
      (connection) => connection[0] === a && connection[1] === b,
    )

    if (isAlreadyConnected) {
      return
    }

    this.connections.push([a, b].sort() as [BoxId, BoxId])
  }

  public getBoxById(id: BoxId) {
    return this.boxes.find((box) => box.id === id)
  }

  public reset() {
    this.boxes = []
    this.connections = []
  }

  public init() {
    const { width, height } = this.canvas.getBoundingClientRect()

    this.canvas.width = width
    this.canvas.height = height

    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this))
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this))
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this))
    this.canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this))

    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false })
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false })
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this))

    this.canvas.addEventListener('wheel', this.handleWheel.bind(this))

    this.context.font = '14px Arial'
  }

  public destroy() {
    this.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this))
    this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this))
    this.canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this))
    this.canvas.removeEventListener('dblclick', this.handleDoubleClick.bind(this))

    this.canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this))
    this.canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this))
    this.canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this))

    this.canvas.removeEventListener('wheel', this.handleWheel.bind(this))
  }

  public demo() {
    // Add 10 initial boxes with random positions
    for (let i = 0; i < 5; i++) {
      this.addBox({ id: 'id', text: 'Box ' + (i + 1) })
    }

    // Initial draw
    this.draw()
  }
}

export default CanvasUtil
