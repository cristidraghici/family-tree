import CanvasManager from './managers/CanvasManager'
import BoxManager from './managers/BoxManager'
import DrawUtils from './utils/DrawUtils'
import EventUtils from './utils/EventUtils'

import type { BoxMeta, BoxId, ConnectionType } from './types'

import { EventUtilsInitProps } from './utils/EventUtils'
import { DrawUtilsInitProps } from './utils/DrawUtils'

export interface CanvasUtilInitProps extends EventUtilsInitProps, DrawUtilsInitProps {}

interface CanvasUtilProps extends CanvasUtilInitProps {
  canvas: HTMLCanvasElement
}

class CanvasUtil {
  private canvasManager: CanvasManager
  private boxManager: BoxManager
  private drawUtils: DrawUtils
  private eventUtils: EventUtils

  constructor({
    canvas,
    onDblClick,
    onCanvasChangePositionEnd,
    initialPositions,
  }: CanvasUtilProps) {
    this.canvasManager = new CanvasManager({ canvas })
    this.boxManager = new BoxManager()

    this.drawUtils = new DrawUtils({
      canvasManager: this.canvasManager,
      boxManager: this.boxManager,
      initialPositions,
    })

    this.eventUtils = new EventUtils({
      canvasManager: this.canvasManager,
      boxManager: this.boxManager,
      drawUtils: this.drawUtils,

      onDblClick,
      onCanvasChangePositionEnd,
    })
  }

  public init({ onDblClick, onCanvasChangePositionEnd, initialPositions }: CanvasUtilInitProps) {
    this.eventUtils.init({ onDblClick, onCanvasChangePositionEnd })
    this.drawUtils.init({ initialPositions })
  }

  public destroy() {
    this.eventUtils.destroy()
  }

  public addBox(box: BoxMeta) {
    this.boxManager.addBox(box)
  }

  public addConnection(firstBox: BoxId, secondBox: BoxId, type: ConnectionType) {
    this.boxManager.addConnection(firstBox, secondBox, type)
  }

  public draw() {
    this.drawUtils.draw()
  }

  public autoLayout() {
    this.drawUtils.autoLayout()
  }

  public resize() {
    this.canvasManager.updateCanvasSize()
    this.draw()
  }

  public reset() {
    this.boxManager.reset()
  }
}


export default CanvasUtil
