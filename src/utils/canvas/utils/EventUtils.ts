import CanvasManager from '../managers/CanvasManager'
import BoxManager from '../managers/BoxManager'
import DrawUtils from './DrawUtils'

import debounce from '../../debounce'

import type { X, Y } from '@/types'
import type { BoxClickHandler, CanvasChangePositionEndHandler } from '../types'

export interface EventUtilsInitProps {
  onDblClick?: BoxClickHandler
  onCanvasChangePositionEnd?: CanvasChangePositionEndHandler
}

export interface EventUtilsProps extends EventUtilsInitProps {
  canvasManager: CanvasManager
  boxManager: BoxManager
  drawUtils: DrawUtils
}

class EventUtils {
  private canvasManager: CanvasManager
  private boxManager: BoxManager
  private drawUtils: DrawUtils
  private onDblClick?: BoxClickHandler
  private onCanvasChangePositionEnd?: CanvasChangePositionEndHandler

  private dragStartX: X = 0
  private dragStartY: Y = 0
  private boxDragOffset = { x: 0, y: 0 }

  constructor({
    canvasManager,
    boxManager,
    drawUtils,
    onDblClick,
    onCanvasChangePositionEnd,
  }: EventUtilsProps) {
    this.canvasManager = canvasManager
    this.boxManager = boxManager
    this.drawUtils = drawUtils

    // Bind methods
    this.handleResize = debounce(this.handleResize.bind(this), 5)
    this.handleWheel = this.handleWheel.bind(this) // Don't debounce wheel for smoothness
    this.handleDoubleClick = this.handleDoubleClick.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.dragEnd = this.dragEnd.bind(this)

    // Init
    this.init({ onDblClick, onCanvasChangePositionEnd })
  }

  public init({ onDblClick, onCanvasChangePositionEnd }: EventUtilsInitProps) {
    this.onDblClick = onDblClick
    this.onCanvasChangePositionEnd = onCanvasChangePositionEnd

    window.addEventListener('resize', this.handleResize)

    const canvas = this.canvasManager.getCanvas()

    canvas.addEventListener('wheel', this.handleWheel, { passive: false })
    canvas.addEventListener('dblclick', this.handleDoubleClick)

    canvas.addEventListener('mousedown', this.handleMouseDown)
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.dragEnd)

    canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false })
    window.addEventListener('touchmove', this.handleTouchMove, { passive: false })
    window.addEventListener('touchend', this.dragEnd)
  }

  public destroy() {
    window.removeEventListener('resize', this.handleResize)

    const canvas = this.canvasManager.getCanvas()

    canvas.removeEventListener('wheel', this.handleWheel)
    canvas.removeEventListener('dblclick', this.handleDoubleClick)

    canvas.removeEventListener('mousedown', this.handleMouseDown)
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.dragEnd)

    canvas.removeEventListener('touchstart', this.handleTouchStart)
    window.removeEventListener('touchmove', this.handleTouchMove)
    window.removeEventListener('touchend', this.dragEnd)
  }

  private handleResize() {
    this.canvasManager.updateCanvasSize()
    this.drawUtils.draw()
  }

  private handleWheel(event: WheelEvent) {
    event.preventDefault()
    const { clientX, clientY, deltaY } = event
    this.canvasManager.setScaleFactor({ clientX, clientY, deltaY })
    this.drawUtils.draw()
  }

  private handleDoubleClick(event: MouseEvent) {
    if (!this.onDblClick) return

    const { x: mouseX, y: mouseY } = this.canvasManager.getMousePosition(event)
    const clickedBoxId = this.drawUtils.findBoxByPosition(mouseX, mouseY)

    if (clickedBoxId) {
      this.onDblClick(clickedBoxId)
    }
  }

  private dragStart(x: X, y: Y, clientX: number, clientY: number) {
    const selectedBoxId = this.drawUtils.findBoxByPosition(x, y)

    if (selectedBoxId) {
      this.boxManager.setSelectedBoxId(selectedBoxId)
      const coords = this.drawUtils.getBoxCoordinates(selectedBoxId)
      this.boxDragOffset = {
        x: x - coords.x,
        y: y - coords.y,
      }
    } else {
      this.canvasManager.setDragging(true)
      this.dragStartX = clientX
      this.dragStartY = clientY
    }
  }

  private handleMouseDown(event: MouseEvent) {
    const { x: mouseX, y: mouseY } = this.canvasManager.getMousePosition(event)
    this.dragStart(mouseX, mouseY, event.clientX, event.clientY)
  }

  private handleTouchStart(event: TouchEvent) {
    const { x: touchX, y: touchY } = this.canvasManager.getTouchPosition(event)
    const { clientX, clientY } = event.touches[0]
    this.dragStart(touchX, touchY, clientX, clientY)
  }

  private dragMove(x: X, y: Y, clientX: number, clientY: number) {
    const selectedBox = this.boxManager.getSelectedBox()
    const isDragging = this.canvasManager.isDragging()

    if (!selectedBox && !isDragging) return

    if (selectedBox) {
      this.drawUtils.moveBox(selectedBox.id, x - this.boxDragOffset.x, y - this.boxDragOffset.y)
    } else if (isDragging) {
      const dx = clientX - this.dragStartX
      const dy = clientY - this.dragStartY
      this.canvasManager.pan(dx, dy)
      this.dragStartX = clientX
      this.dragStartY = clientY
    }

    this.drawUtils.draw()

    if (this.onCanvasChangePositionEnd && selectedBox) {
      // Only debounced or selective update? For now keep it as is but it might be heavy
      this.onCanvasChangePositionEnd(this.drawUtils.getAllPositions())
    }
  }

  private handleMouseMove(event: MouseEvent) {
    const { x: mouseX, y: mouseY } = this.canvasManager.getMousePosition(event)
    this.dragMove(mouseX, mouseY, event.clientX, event.clientY)
  }

  private handleTouchMove(event: TouchEvent) {
    const { x: touchX, y: touchY } = this.canvasManager.getTouchPosition(event)
    const { clientX, clientY } = event.touches[0]
    this.dragMove(touchX, touchY, clientX, clientY)
  }

  private dragEnd() {
    this.boxManager.setSelectedBoxId(null)
    this.canvasManager.setDragging(false)
    this.drawUtils.draw()
  }
}

export default EventUtils
