import CanvasManager from './managers/CanvasManager'
import BoxManager from './managers/BoxManager'
import DrawUtils from './utils/DrawUtils'

import debounce from '../helpers/debounce'

import type { BoxMeta, BoxId, ConnectionType, Box, BoxClickHandler, X, Y } from './types'

class CanvasUtil {
  private canvasManager: CanvasManager
  private boxManager: BoxManager
  private drawUtils: DrawUtils

  private onDblClick?: BoxClickHandler

  constructor({ canvas, onDblClick }: { canvas: HTMLCanvasElement; onDblClick?: BoxClickHandler }) {
    this.canvasManager = new CanvasManager({ canvas })
    this.boxManager = new BoxManager()
    this.drawUtils = new DrawUtils()

    this.onDblClick = onDblClick

    // Bind methods
    this.handleResize = debounce(this.handleResize.bind(this), 5)
    this.handleWheel = debounce(this.handleWheel.bind(this), 5)
    this.handleDoubleClick = debounce(this.handleDoubleClick.bind(this), 5)
    this.handleMouseDown = debounce(this.handleMouseDown.bind(this), 5)
    this.handleMouseMove = debounce(this.handleMouseMove.bind(this), 3)
    this.handleTouchStart = debounce(this.handleTouchStart.bind(this), 5)
    this.handleTouchMove = debounce(this.handleTouchMove.bind(this), 3)
    this.dragEnd = debounce(this.dragEnd.bind(this), 5)
  }

  public addBox(box: BoxMeta) {
    this.boxManager.addBox(box)
  }

  public addConnection(firstBox: BoxId, secondBox: BoxId, type: ConnectionType) {
    this.boxManager.addConnection(firstBox, secondBox, type)
  }

  public draw() {
    this.canvasManager.initDraw()

    // Assign box coordinates
    const boxes: Box[] = this.boxManager.getBoxes().map((box) => {
      const [width, height] = box.text
        ? [this.canvasManager.textWidth(box.text) + 20, 40]
        : [10, 10]

      const coordinates = this.drawUtils.getBoxCoordinates(
        box.id,
        width,
        height,
        this.canvasManager.getWidth(), // canvas width
        this.canvasManager.getHeight(), // canvas height
      )

      return {
        ...box,
        ...coordinates,
      }
    })

    // Draw connections
    this.boxManager.getConnections().forEach((connection) => {
      const [firstBox, secondBox] = boxes.filter(({ id }) =>
        [connection.firstBoxId, connection.secondBoxId].includes(id),
      )

      if (!firstBox || !secondBox) {
        return
      }

      this.canvasManager.drawAngledLine({
        startX: firstBox.x + firstBox.width / 2,
        startY: firstBox.y + firstBox.height / 2,
        endX: secondBox.x + secondBox.width / 2,
        endY: secondBox.y + secondBox.height / 2,
      })
    })

    // Draw boxes
    boxes.forEach((box) => this.canvasManager.drawBox(box))
  }

  // Event handlers

  public init({ onDblClick }: { onDblClick?: BoxClickHandler }) {
    this.onDblClick = onDblClick

    window.addEventListener('resize', this.handleResize)

    const canvas = this.canvasManager.getCanvas()

    canvas.addEventListener('wheel', this.handleWheel)
    canvas.addEventListener('dblclick', this.handleDoubleClick)

    canvas.addEventListener('mousedown', this.handleMouseDown)
    canvas.addEventListener('mousemove', this.handleMouseMove)
    canvas.addEventListener('mouseup', this.dragEnd)

    canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', this.dragEnd)
  }

  public destroy() {
    window.removeEventListener('resize', this.handleResize)

    const canvas = this.canvasManager.getCanvas()

    canvas.removeEventListener('wheel', this.handleWheel)
    canvas.removeEventListener('dblclick', this.handleDoubleClick)

    canvas.removeEventListener('mousedown', this.handleMouseDown)
    canvas.removeEventListener('mousemove', this.handleMouseMove)
    canvas.removeEventListener('mouseup', this.dragEnd)

    canvas.removeEventListener('touchstart', this.handleTouchStart)
    canvas.removeEventListener('touchmove', this.handleTouchMove)
    canvas.removeEventListener('touchend', this.dragEnd)
  }

  private handleResize() {
    this.canvasManager.updateCanvasSize() // Update the canvas size
    this.draw() // Redraw the canvas content after resizing
  }

  private handleWheel(event: WheelEvent) {
    const { clientX, clientY, deltaY } = event
    this.canvasManager.setScaleFactor({ clientX, clientY, deltaY })

    this.draw()
  }

  private handleDoubleClick(event: MouseEvent) {
    if (!this.onDblClick) {
      return
    }

    const { x: mouseX, y: mouseY } = this.canvasManager.getMousePosition(event)
    const clickedBoxId = this.drawUtils.findBoxByPosition(mouseX, mouseY)

    if (clickedBoxId) {
      this.onDblClick(clickedBoxId)
    }
  }

  private dragStart(x: X, y: Y) {
    const selectedBoxId = this.drawUtils.findBoxByPosition(x, y)

    // box is selected
    if (selectedBoxId) {
      this.boxManager.setSelectedBoxId(selectedBoxId)
      const coords = this.drawUtils.getBoxCoordinates(selectedBoxId)

      this.canvasManager.setOffset({
        x: x - coords.x,
        y: y - coords.y,
      })
    } else {
      // canvas is dragged
      this.canvasManager.setDragging(true)
      this.canvasManager.setOffset({ x, y })
    }
  }

  private handleMouseDown(event: MouseEvent) {
    const { x: mouseX, y: mouseY } = this.canvasManager.getMousePosition(event)
    this.dragStart(mouseX, mouseY)
  }

  private handleTouchStart(event: TouchEvent) {
    const { x: touchX, y: touchY } = this.canvasManager.getTouchPosition(event)
    this.dragStart(touchX, touchY)
  }

  private dragMove(x: X, y: Y) {
    const selectedBox = this.boxManager.getSelectedBox()
    const isDragging = this.canvasManager.isDragging()

    if (!selectedBox && !isDragging) {
      return
    }

    const { x: dx, y: dy } = this.canvasManager.getMoveTo(x, y)

    if (selectedBox) {
      this.drawUtils.moveBoxes(dx, dy, selectedBox.id)
    } else if (isDragging) {
      this.drawUtils.moveBoxes(dx, dy)
      this.canvasManager.setOffset({ x, y })
    }

    this.draw()
  }

  private handleMouseMove(event: MouseEvent) {
    const { x: mouseX, y: mouseY } = this.canvasManager.getMousePosition(event)
    this.dragMove(mouseX, mouseY)
  }

  private handleTouchMove(event: TouchEvent) {
    const { x: touchX, y: touchY } = this.canvasManager.getTouchPosition(event)
    this.dragMove(touchX, touchY)
  }

  private dragEnd() {
    this.boxManager.setSelectedBoxId(null)
    this.canvasManager.setDragging(false)
  }
}

export default CanvasUtil
