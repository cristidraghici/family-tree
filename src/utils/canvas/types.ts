import type { PositionIdType, X, Y } from '@/types'

// Boxes
export type BoxId = PositionIdType
export type BoxMeta = {
  id: BoxId
  text: string
}
export type BoxCoordinates = {
  x: X
  y: Y
  width: number
  height: number
}
export type Box = BoxMeta & BoxCoordinates

// Connections
export type ConnectionType = 'blood' | 'spouse' | 'other'
export type ConnectionId = `${BoxId}-${BoxId}`
export type Connection = {
  id: ConnectionId

  firstBoxId: BoxId
  secondBoxId: BoxId

  type: ConnectionType
}

// Lines
export type Line = {
  startX: X
  startY: Y
  endX: X
  endY: Y
}

// Events
export type BoxClickHandler = (id: BoxId) => void
export type CanvasChangePositionEndHandler = <T>(data: T) => void
