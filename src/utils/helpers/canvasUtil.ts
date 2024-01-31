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

  public optimizeBoxPositions() {
    this.boxes.forEach((box) => {
      const initialPosition = { x: box.x, y: box.y }

      // Try different displacements and choose the one with the least overlap
      let minOverlap = this.calculateTotalOverlap()
      let bestPosition = initialPosition

      for (let dx = -10; dx <= 10; dx += 5) {
        for (let dy = -10; dy <= 10; dy += 5) {
          box.x = initialPosition.x + dx
          box.y = initialPosition.y + dy

          const currentOverlap = this.calculateTotalOverlap()

          if (currentOverlap < minOverlap) {
            minOverlap = currentOverlap
            bestPosition = { x: box.x, y: box.y }
          }
        }
      }

      // Set the box to the best position found
      box.x = bestPosition.x
      box.y = bestPosition.y
    })

    this.draw() // Redraw the canvas with optimized positions
  }

  private calculateTotalOverlap(): number {
    let totalOverlap = 0

    for (let i = 0; i < this.boxes.length; i++) {
      for (let j = i + 1; j < this.boxes.length; j++) {
        if (this.isOverlap(this.boxes[i], this.boxes[j])) {
          totalOverlap++
        }
      }
    }

    return totalOverlap
  }

  private drawBox(box: Box) {
    const { context } = this
    context.globalAlpha = 0.9
    context.fillStyle = '#aaf'
    context.fillRect(box.x, box.y, box.width, box.height)
    context.strokeStyle = '#000'
    context.lineWidth = 2
    context.strokeRect(box.x, box.y, box.width, box.height)
    context.font = '14px Arial'
    context.fillStyle = '#000'
    context.fillText(box.text, box.x + 10, box.y + 25)
    context.globalAlpha = 1
  }

  private drawLine({ startX, startY, endX, endY }: Line) {
    const { context } = this
    context.beginPath()
    context.moveTo(startX, startY)
    context.lineTo(endX, endY)
    context.stroke()
  }

  public connectBoxes(a: BoxId, b: BoxId, { straight = false }: { straight?: boolean } = {}) {
    const firstBox = this.getBoxById(a)
    const secondBox = this.getBoxById(b)

    if (!firstBox || !secondBox) {
      return
    }

    const startX = firstBox.x + firstBox.width / 2
    const startY = firstBox.y + firstBox.height / 2
    const endX = secondBox.x + secondBox.width / 2
    const endY = secondBox.y + secondBox.height / 2

    const drawStraightLine = () => {
      this.drawLine({
        startX,
        startY,
        endX,
        endY,
      })
    }

    const drawAngledLine = () => {
      if (Math.abs(startX - endX) > Math.abs(startY - endY)) {
        this.drawLine({ startX: startX, startY: startY, endX: endX, endY: startY })
        this.drawLine({ startX: endX, startY: startY, endX: endX, endY: endY })
      } else {
        this.drawLine({ startX: startX, startY: startY, endX: startX, endY: endY })
        this.drawLine({ startX: startX, startY: endY, endX: endX, endY: endY })
      }
    }

    return straight ? drawStraightLine() : drawAngledLine()
  }

  public draw() {
    const { canvas, context } = this
    context.canvas.width = canvas.width
    context.canvas.height = canvas.height
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.setTransform(this.scaleFactor, 0, 0, this.scaleFactor, 0, 0)
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

  public addBox({ id, text, isMiniBox }: { id: BoxId; text: string; isMiniBox?: boolean }) {
    const boxExists = this.boxes.some((box) => box.id === id)

    if (boxExists) {
      return
    }

    const generateRandomPosition = () => {
      let x: number, y: number
      let tries = 0

      do {
        ;[x, y] = [
          Math.random() * (this.canvas.width - 100),
          Math.random() * (this.canvas.height - 50),
        ]

        // ensure we don't get stuck in an infinite loop
        tries++
      } while (this.boxes.some((box) => this.isOverlap({ x, y }, box)) && tries < 10)

      return [x, y]
    }

    // Generate random position
    const [x, y] = generateRandomPosition()

    // Calculate width and height based on text length
    const { width } = this.context.measureText(text)

    this.boxes.push({
      id,
      text,

      x,
      y,
      width: isMiniBox ? 10 : width + 25, // Add padding,
      height: isMiniBox ? 10 : 40,
    })
  }

  public addConnection(a: BoxId, b: BoxId) {
    if (!a || !b) {
      return
    }
    const newConnection = [a, b].sort() as [BoxId, BoxId]

    const isAlreadyConnected = this.connections.some(
      (connection) => connection[0] === a && connection[1] === b,
    )

    if (isAlreadyConnected) {
      return
    }

    this.connections.push(newConnection)
  }

  public getBoxById(id: BoxId) {
    return this.boxes.find((box) => box.id === id)
  }

  public reset() {
    this.boxes = []
    this.connections = []
  }

  public init() {
    const { canvas, context } = this
    const { width, height } = canvas.getBoundingClientRect()

    canvas.width = width
    canvas.height = height

    canvas.addEventListener('mousedown', this.handleMouseDown.bind(this))
    canvas.addEventListener('mousemove', this.handleMouseMove.bind(this))
    canvas.addEventListener('mouseup', this.handleMouseUp.bind(this))
    canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this))

    canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false })
    canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false })
    canvas.addEventListener('touchend', this.handleTouchEnd.bind(this))

    canvas.addEventListener('wheel', this.handleWheel.bind(this))

    context.font = '14px Arial'
  }

  public destroy() {
    const { canvas } = this
    canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this))
    canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this))
    canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this))
    canvas.removeEventListener('dblclick', this.handleDoubleClick.bind(this))
    canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this))
    canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this))
    canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this))
    canvas.removeEventListener('wheel', this.handleWheel.bind(this))
  }
}

export default CanvasUtil
