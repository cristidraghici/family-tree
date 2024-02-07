import type { BoxId, BoxMeta, ConnectionId, Connection, ConnectionType } from '../types'

class BoxManager {
  private boxes: Record<BoxId, BoxMeta> = {}
  private connections: Record<ConnectionId, Connection> = {}

  private selectedBoxId: BoxId | null = null

  public getBoxes(): BoxMeta[] {
    return Object.values(this.boxes)
  }

  public getConnections(): Connection[] {
    return Object.values(this.connections)
  }

  public getById(id: BoxId): BoxMeta | undefined {
    return this.getBoxes().find((box) => box.id === id)
  }

  public addBox(box: BoxMeta) {
    if (this.boxes[box.id]) {
      this.boxes[box.id] = { ...this.boxes[box.id], ...box }

      return
    }

    this.boxes[box.id] = { ...box }
  }

  public addConnection(firstBoxId: BoxId, secondBoxId: BoxId, type: ConnectionType = 'blood') {
    const firstBox = this.getById(firstBoxId)
    const secondBox = this.getById(secondBoxId)

    if (!firstBox || !secondBox) {
      return
    }

    const id = [firstBoxId, secondBoxId].sort().join('-') as ConnectionId

    if (this.connections[id]) {
      return
    }

    this.connections[id] = {
      id,
      firstBoxId,
      secondBoxId,
      type,
    }
  }

  public setSelectedBoxId(boxId: BoxId | null) {
    this.selectedBoxId = boxId
  }

  public getSelectedBox(): BoxMeta | null {
    return this.getBoxes().find((box) => box.id === this.selectedBoxId) || null
  }

  public reset() {
    this.boxes = {}
    this.connections = {}

    this.setSelectedBoxId(null)
  }
}

export default BoxManager
