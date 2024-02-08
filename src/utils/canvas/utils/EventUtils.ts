import CanvasManager from '../managers/CanvasManager'
import BoxManager from '../managers/BoxManager'
import DrawUtils from './DrawUtils'

import debounce from '../../helpers/debounce'

import type { BoxClickHandler, CanvasChangePositionEndHandler, X, Y } from '../types'

class EventUtils {
  private canvasManager: CanvasManager
  private boxManager: BoxManager
  private drawUtils: DrawUtils
  private onDblClick?: BoxClickHandler
  private onCanvasChangePositionEnd?: CanvasChangePositionEndHandler

  constructor({
    canvasManager,
    boxManager,
    drawUtils,
    onDblClick,
    onCanvasChangePositionEnd,
  }: {
    canvasManager: CanvasManager
    boxManager: BoxManager
    drawUtils: DrawUtils
    onDblClick?: BoxClickHandler
    onCanvasChangePositionEnd?: CanvasChangePositionEndHandler
  }) {
    this.canvasManager = canvasManager
    this.boxManager = boxManager
    this.drawUtils = drawUtils

    this.onDblClick = onDblClick
    this.onCanvasChangePositionEnd = onCanvasChangePositionEnd

    // Bind methods
    this.handleResize = debounce(this.handleResize.bind(this), 5)
    this.handleWheel = debounce(this.handleWheel.bind(this), 5)
    this.handleDoubleClick = debounce(this.handleDoubleClick.bind(this), 5)
    this.handleMouseDown = debounce(this.handleMouseDown.bind(this), 5)
    this.handleMouseMove = debounce(this.handleMouseMove.bind(this), 3)
    this.handleTouchStart = debounce(this.handleTouchStart.bind(this), 5)
    this.handleTouchMove = debounce(this.handleTouchMove.bind(this), 3)
    this.dragEnd = debounce(this.dragEnd.bind(this), 5)

    // Run the handler at render, to apply the action on the initial state
    if (this.onCanvasChangePositionEnd) {
      this.onCanvasChangePositionEnd(this.drawUtils.getAllCoordinates())
    }
  }

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
    this.drawUtils.draw() // Redraw the canvas content after resizing
  }

  private handleWheel(event: WheelEvent) {
    const { clientX, clientY, deltaY } = event
    this.canvasManager.setScaleFactor({ clientX, clientY, deltaY })

    this.drawUtils.draw()
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

    this.drawUtils.draw()

    if (this.onCanvasChangePositionEnd) {
      this.onCanvasChangePositionEnd(this.drawUtils.getAllCoordinates())
    }
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

export default EventUtils
