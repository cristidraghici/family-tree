import { X, Y } from '@/types'
import { Box, Line } from '../types'

import { CANVAS_FILL_STYLE, CANVAS_FONT, CANVAS_LINE_WIDTH, CANVAS_STROKE_STYLE } from '@/constants'

class CanvasManager {
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private scaleFactor: number = 1
  private offsetX: number = 0
  private offsetY: number = 0
  private isCanvasDragging: boolean = false

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D

    this.initializeCanvas()
    this.updateCanvasSize()
  }

  private initializeCanvas() {
    this.context.font = CANVAS_FONT
  }

  public updateCanvasSize() {
    const { width, height } = this.canvas.getBoundingClientRect()

    this.canvas.width = width
    this.canvas.height = height

    this.context.canvas.width = this.canvas.width
    this.context.canvas.height = this.canvas.height
  }

  public drawBox({ x, y, width, height, text }: Box) {
    this.context.globalAlpha = 0.9
    this.context.fillStyle = CANVAS_FILL_STYLE
    this.context.fillRect(x, y, width, height)
    this.context.strokeStyle = CANVAS_STROKE_STYLE
    this.context.lineWidth = CANVAS_LINE_WIDTH
    this.context.strokeRect(x, y, width, height)
    this.context.font = CANVAS_FONT
    this.context.fillStyle = CANVAS_STROKE_STYLE
    this.context.fillText(text, x + 10, y + 25)
    this.context.globalAlpha = 1
  }

  public drawLine({
    startX,
    startY,
    endX,
    endY,
    lineWidth = CANVAS_LINE_WIDTH,
  }: Line & { lineWidth?: number }) {
    this.context.lineWidth = lineWidth
    this.context.beginPath()
    this.context.moveTo(startX, startY)
    this.context.lineTo(endX, endY)
    this.context.stroke()
  }

  public drawAngledLine({
    startX,
    startY,
    endX,
    endY,
    lineWidth = CANVAS_LINE_WIDTH,
  }: Line & { lineWidth?: number }) {
    if (Math.abs(startX - endX) > Math.abs(startY - endY)) {
      this.drawLine({ startX: startX, startY: startY, endX: endX, endY: startY, lineWidth })
      this.drawLine({ startX: endX, startY: startY, endX: endX, endY: endY, lineWidth })
    } else {
      this.drawLine({ startX: startX, startY: startY, endX: startX, endY: endY, lineWidth })
      this.drawLine({ startX: startX, startY: endY, endX: endX, endY: endY, lineWidth })
    }
  }

  public initDraw() {
    this.context.canvas.width = this.canvas.width
    this.context.canvas.height = this.canvas.height

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.setTransform(this.scaleFactor, 0, 0, this.scaleFactor, 0, 0)
  }

  public getCanvas() {
    return this.canvas
  }

  public getWidth() {
    return this.canvas.width
  }

  public getHeight() {
    return this.canvas.height
  }

  public setScaleFactor({ clientX, clientY, deltaY }: { clientX: X; clientY: Y; deltaY: number }) {
    const newScaleFactor = this.scaleFactor + (deltaY > 0 ? -0.2 : 0.2)

    if (newScaleFactor < 0.2 || newScaleFactor > 5) {
      return
    }

    const scaleFactorChange = newScaleFactor - this.scaleFactor

    this.scaleFactor = newScaleFactor

    const { x: mouseX, y: mouseY } = this.getPosition(clientX, clientY)
    this.offsetX -= mouseX * scaleFactorChange
    this.offsetY -= mouseY * scaleFactorChange
  }

  private getPosition(x: X, y: Y) {
    const { scaleFactor } = this
    const { left, top } = this.canvas.getBoundingClientRect()

    return {
      x: (x - left) / scaleFactor,
      y: (y - top) / scaleFactor,
    }
  }

  public getMousePosition(event: MouseEvent) {
    const { clientX, clientY } = event
    return this.getPosition(clientX, clientY)
  }

  public getTouchPosition(event: TouchEvent) {
    const { clientX, clientY } = event.touches[0]
    return this.getPosition(clientX, clientY)
  }

  public getMoveTo(x: X, y: Y) {
    const { offsetX, offsetY } = this

    return {
      x: x - offsetX,
      y: y - offsetY,
    }
  }

  public setOffset({ x, y }: { x: X; y: Y }) {
    this.offsetX = x
    this.offsetY = y
  }

  public textWidth(text: string): number {
    this.context.font = CANVAS_FONT
    return this.context.measureText(text).width || text.length * 10
  }

  public setDragging(isDragging: boolean) {
    this.isCanvasDragging = isDragging
  }

  public isDragging() {
    return this.isCanvasDragging
  }
}

export default CanvasManager
