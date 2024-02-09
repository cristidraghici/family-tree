import CanvasManager from './managers/CanvasManager'
import BoxManager from './managers/BoxManager'
import DrawUtils from './utils/DrawUtils'
import EventUtils from './utils/EventUtils'

import type {
  BoxMeta,
  BoxId,
  ConnectionType,
  BoxClickHandler,
  CanvasChangePositionEndHandler,
} from './types'

class CanvasUtil {
  private canvasManager: CanvasManager
  private boxManager: BoxManager
  private drawUtils: DrawUtils
  private eventUtils: EventUtils

  constructor({
    canvas,
    onDblClick,
    onCanvasChangePositionEnd,
  }: {
    canvas: HTMLCanvasElement
    onDblClick?: BoxClickHandler
    onCanvasChangePositionEnd?: CanvasChangePositionEndHandler
  }) {
    this.canvasManager = new CanvasManager({ canvas })
    this.boxManager = new BoxManager()

    this.drawUtils = new DrawUtils({
      canvasManager: this.canvasManager,
      boxManager: this.boxManager,
    })

    this.eventUtils = new EventUtils({
      canvasManager: this.canvasManager,
      boxManager: this.boxManager,
      drawUtils: this.drawUtils,

      onDblClick,
      onCanvasChangePositionEnd,
    })
  }

  public init({ onDblClick }: { onDblClick?: BoxClickHandler }) {
    this.eventUtils.init({ onDblClick })
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

  public reset() {
    this.boxManager.reset()
  }
}

export default CanvasUtil
