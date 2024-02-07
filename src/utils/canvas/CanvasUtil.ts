import CanvasManager from './managers/CanvasManager'
import BoxManager from './managers/BoxManager'
import DrawUtils from './utils/DrawUtils'

import debounce from '../helpers/debounce'

import type { BoxMeta, BoxId, ConnectionType, Box, BoxClickHandler } from './types'

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
    this.handleMouseUp = debounce(this.handleMouseUp.bind(this), 5)
    this.touchStart = debounce(this.touchStart.bind(this), 5)
    this.touchMove = debounce(this.touchMove.bind(this), 3)
    this.touchEnd = debounce(this.touchEnd.bind(this), 5)
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
    canvas.addEventListener('mouseup', this.handleMouseUp)

    canvas.addEventListener('touchstart', this.touchStart, { passive: false })
    canvas.addEventListener('touchmove', this.touchMove, { passive: false })
    canvas.addEventListener('touchend', this.touchEnd)
  }

  public destroy() {
    window.removeEventListener('resize', this.handleResize)

    const canvas = this.canvasManager.getCanvas()

    canvas.removeEventListener('wheel', this.handleWheel)
    canvas.removeEventListener('dblclick', this.handleDoubleClick)

    canvas.removeEventListener('mousedown', this.handleMouseDown)
    canvas.removeEventListener('mousemove', this.handleMouseMove)
    canvas.removeEventListener('mouseup', this.handleMouseUp)

    canvas.removeEventListener('touchstart', this.touchStart)
    canvas.removeEventListener('touchmove', this.touchMove)
    canvas.removeEventListener('touchend', this.touchEnd)
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

  private handleMouseDown(event: MouseEvent) {
    const { x: mouseX, y: mouseY } = this.canvasManager.getMousePosition(event)
    const selectedBoxId = this.drawUtils.findBoxByPosition(mouseX, mouseY)

    // box is selected
    if (selectedBoxId) {
      this.boxManager.setSelectedBoxId(selectedBoxId)
      const coords = this.drawUtils.getBoxCoordinates(selectedBoxId)

      this.canvasManager.setOffset({
        x: mouseX - coords.x,
        y: mouseY - coords.y,
      })
    } else {
      // canvas is dragged
      this.canvasManager.setDragging(true)
      this.canvasManager.setOffset({ x: mouseX, y: mouseY })
    }
  }

  private handleMouseMove(event: MouseEvent) {
    const selectedBox = this.boxManager.getSelectedBox()
    const isDragging = this.canvasManager.isDragging()

    if (!selectedBox && !isDragging) {
      return
    }

    const { x: mouseX, y: mouseY } = this.canvasManager.getMousePosition(event)
    const { x: dx, y: dy } = this.canvasManager.getMoveTo(mouseX, mouseY)

    if (selectedBox) {
      this.drawUtils.moveBoxes(dx, dy, selectedBox.id)
    } else if (isDragging) {
      this.drawUtils.moveBoxes(dx, dy)
      this.canvasManager.setOffset({ x: mouseX, y: mouseY })
    }

    this.draw()
  }

  private handleMouseUp() {
    this.boxManager.setSelectedBoxId(null)
    this.canvasManager.setDragging(false)
  }

  private touchStart(event: TouchEvent) {
    const { x: touchX, y: touchY } = this.canvasManager.getTouchPosition(event)
    const selectedBoxId = this.drawUtils.findBoxByPosition(touchX, touchY)

    // box is selected
    if (selectedBoxId) {
      this.boxManager.setSelectedBoxId(selectedBoxId)
      const coords = this.drawUtils.getBoxCoordinates(selectedBoxId)

      this.canvasManager.setOffset({
        x: touchX - coords.x,
        y: touchY - coords.y,
      })
    } else {
      // canvas is dragged
      this.canvasManager.setDragging(true)
      this.canvasManager.setOffset({ x: touchX, y: touchY })
    }
  }

  private touchMove(event: TouchEvent) {
    const selectedBox = this.boxManager.getSelectedBox()
    const isDragging = this.canvasManager.isDragging()

    if (!selectedBox && !isDragging) {
      return
    }

    const { x: touchX, y: touchY } = this.canvasManager.getTouchPosition(event)
    const { x: dx, y: dy } = this.canvasManager.getMoveTo(touchX, touchY)

    if (selectedBox) {
      this.drawUtils.moveBoxes(dx, dy, selectedBox.id)
    } else if (isDragging) {
      this.drawUtils.moveBoxes(dx, dy)
      this.canvasManager.setOffset({ x: touchX, y: touchY })
    }

    this.draw()
  }

  private touchEnd() {
    this.boxManager.setSelectedBoxId(null)
    this.canvasManager.setDragging(false)
  }
}

export default CanvasUtil
