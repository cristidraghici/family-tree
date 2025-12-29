import { X, Y } from '@/types'
import { Box, Line } from '../types'

import {
  CANVAS_BOX_FILL_STYLE,
  CANVAS_FONT,
  CANVAS_LINE_WIDTH,
  CANVAS_BOX_STROKE_STYLE,
  CANVAS_BOX_CORNER_RADIUS,
  CANVAS_TEXT_COLOR,
  CANVAS_LINE_COLOR,
  CANVAS_BOX_PADDING,
  CANVAS_BOX_HIGHLIGHT_FILL_STYLE,
  CANVAS_BOX_HIGHLIGHT_STROKE_STYLE,
} from '@/constants'

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

  private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
    this.context.beginPath()
    this.context.moveTo(x + radius, y)
    this.context.lineTo(x + width - radius, y)
    this.context.quadraticCurveTo(x + width, y, x + width, y + radius)
    this.context.lineTo(x + width, y + height - radius)
    this.context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    this.context.lineTo(x + radius, y + height)
    this.context.quadraticCurveTo(x, y + height, x, y + height - radius)
    this.context.lineTo(x, y + radius)
    this.context.quadraticCurveTo(x, y, x + radius, y)
    this.context.closePath()
  }

  public drawBox({ x, y, width, height, text, highlight }: Box) {
    this.context.save()

    if (!text) {
      // Marriage node - draw as a small circle
      this.context.beginPath()
      this.context.arc(x + width / 2, y + height / 2, 6, 0, Math.PI * 2)
      this.context.fillStyle = CANVAS_BOX_STROKE_STYLE // Use stroke color for fill
      this.context.fill()
      this.context.restore()
      return
    }

    // Shadow
    this.context.shadowColor = 'rgba(0, 0, 0, 0.1)'
    this.context.shadowBlur = 4
    this.context.shadowOffsetY = 2

    // Box
    this.drawRoundedRect(x, y, width, height, CANVAS_BOX_CORNER_RADIUS)
    this.context.fillStyle = highlight ? CANVAS_BOX_HIGHLIGHT_FILL_STYLE : CANVAS_BOX_FILL_STYLE
    this.context.fill()

    this.context.shadowColor = 'transparent' // Reset shadow for stroke
    this.context.strokeStyle = highlight ? CANVAS_BOX_HIGHLIGHT_STROKE_STYLE : CANVAS_BOX_STROKE_STYLE
    this.context.lineWidth = highlight ? CANVAS_LINE_WIDTH * 1.5 : CANVAS_LINE_WIDTH
    this.context.stroke()

    this.context.font = CANVAS_FONT
    this.context.fillStyle = CANVAS_TEXT_COLOR
    this.context.textAlign = 'left'
    this.context.textBaseline = 'middle'
    this.context.fillText(text, x + CANVAS_BOX_PADDING, y + height / 2)

    this.context.restore()
  }

  public drawLine({
    startX,
    startY,
    endX,
    endY,
    lineWidth = CANVAS_LINE_WIDTH,
    lineDash = [],
    color = CANVAS_LINE_COLOR,
  }: Line & { lineWidth?: number; lineDash?: number[]; color?: string }) {
    this.context.save()
    this.context.setLineDash(lineDash)
    this.context.lineWidth = lineWidth
    this.context.strokeStyle = color
    this.context.beginPath()
    this.context.moveTo(startX, startY)
    this.context.lineTo(endX, endY)
    this.context.stroke()
    this.context.restore()
  }

  public drawAngledLine({
    startX,
    startY,
    endX,
    endY,
    midY,
    lineWidth = CANVAS_LINE_WIDTH,
    lineDash = [],
    color = CANVAS_LINE_COLOR,
  }: Line & { midY?: number; lineWidth?: number; lineDash?: number[]; color?: string }) {
    this.context.save()
    this.context.setLineDash(lineDash)
    this.context.lineWidth = lineWidth
    this.context.strokeStyle = color
    this.context.beginPath()
    this.context.moveTo(startX, startY)

    const finalMidY = midY ?? startY + (endY - startY) / 2
    this.context.lineTo(startX, finalMidY)
    this.context.lineTo(endX, finalMidY)
    this.context.lineTo(endX, endY)

    this.context.stroke()
    this.context.restore()
  }

  public initDraw() {
    this.context.setTransform(1, 0, 0, 1, 0, 0)
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.setTransform(this.scaleFactor, 0, 0, this.scaleFactor, this.offsetX, this.offsetY)
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
    const zoomIntensity = 0.1
    const wheel = deltaY < 0 ? 1 : -1
    const zoom = Math.exp(wheel * zoomIntensity)

    const newScale = this.scaleFactor * zoom

    if (newScale < 0.1 || newScale > 10) return

    const { left, top } = this.canvas.getBoundingClientRect()
    const mouseX = clientX - left
    const mouseY = clientY - top

    // Adjust offset to zoom around mouse position
    this.offsetX = mouseX - (mouseX - this.offsetX) * zoom
    this.offsetY = mouseY - (mouseY - this.offsetY) * zoom
    this.scaleFactor = newScale
  }

  public getMousePosition(event: MouseEvent) {
    const { clientX, clientY } = event
    const { left, top } = this.canvas.getBoundingClientRect()

    return {
      x: (clientX - left - this.offsetX) / this.scaleFactor,
      y: (clientY - top - this.offsetY) / this.scaleFactor,
    }
  }

  public getTouchPosition(event: TouchEvent) {
    const { clientX, clientY } = event.touches[0]
    const { left, top } = this.canvas.getBoundingClientRect()

    return {
      x: (clientX - left - this.offsetX) / this.scaleFactor,
      y: (clientY - top - this.offsetY) / this.scaleFactor,
    }
  }

  public pan(dx: number, dy: number) {
    this.offsetX += dx
    this.offsetY += dy
  }

  public setOffset({ x, y }: { x: X; y: Y }) {
    this.offsetX = x
    this.offsetY = y
  }

  public textWidth(text: string): number {
    this.context.font = CANVAS_FONT
    return this.context.measureText(text).width || text.length * 8
  }

  public setDragging(isDragging: boolean) {
    this.isCanvasDragging = isDragging
  }

  public isDragging() {
    return this.isCanvasDragging
  }
}

export default CanvasManager
