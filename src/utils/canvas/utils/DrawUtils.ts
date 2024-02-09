import CanvasManager from '../managers/CanvasManager'
import BoxManager from '../managers/BoxManager'

import type { PositionsType, X, Y } from '@/types'
import type { BoxId, Box, BoxCoordinates } from '../types'

const DEFAULT_SCREEN_WIDTH = 960
const DEFAULT_SCREEN_HEIGHT = 480

export type DrawUtilsInitProps = {
  initialPositions?: PositionsType[]
}

export interface DrawUtilsProps extends DrawUtilsInitProps {
  canvasManager: CanvasManager
  boxManager: BoxManager
}

class DrawUtils {
  private canvasManager: CanvasManager
  private boxManager: BoxManager

  private boxCoordinates: Record<BoxId, BoxCoordinates> = {}
  private initialPositions: PositionsType[] = []

  constructor({ canvasManager, boxManager, initialPositions }: DrawUtilsProps) {
    this.canvasManager = canvasManager
    this.boxManager = boxManager

    this.initialPositions = initialPositions || []
  }

  init({ initialPositions }: DrawUtilsInitProps) {
    this.initialPositions = initialPositions || []
  }

  private isOverlap(
    { x: firstBoxX, y: firstBoxY }: BoxCoordinates,
    { x: secondBoxX, y: secondBoxY }: BoxCoordinates,
  ): boolean {
    const box1Right = firstBoxX + 50
    const box1Bottom = firstBoxY + 50
    const box2Right = secondBoxX + 50
    const box2Bottom = secondBoxY + 50

    return (
      firstBoxX < box2Right &&
      box1Right > secondBoxX &&
      firstBoxY < box2Bottom &&
      box1Bottom > secondBoxY
    )
  }

  private generateRandomPosition(canvasWidth: number, canvasHeight: number): [X, Y] {
    let x: number, y: number
    let tries = 0

    const boxCoordinates = Object.values(this.boxCoordinates)

    do {
      ;[x, y] = [Math.random() * (canvasWidth - 100), Math.random() * (canvasHeight - 50)]

      // ensure we don't get stuck in an infinite loop
      tries++
    } while (
      boxCoordinates.some((coordinates) =>
        this.isOverlap({ x, y, width: 0, height: 0 }, coordinates),
      ) &&
      tries < 1000
    )

    return [x, y]
  }

  public getAllPositions(): PositionsType[] {
    return Object.entries(this.boxCoordinates).map(([id, position]) => ({
      id,
      x: position.x,
      y: position.y,
    }))
  }

  public getBoxCoordinates(
    id: BoxId,
    width: number = 1,
    height: number = 1,
    canvasWidth: number = DEFAULT_SCREEN_WIDTH,
    canvasHeight: number = DEFAULT_SCREEN_HEIGHT,
  ): BoxCoordinates {
    if (!this.boxCoordinates[id]) {
      const initialPosition = this.initialPositions.find((position) => position.id === id)

      const [x, y] = initialPosition
        ? [initialPosition.x, initialPosition.y]
        : this.generateRandomPosition(canvasWidth, canvasHeight)

      this.boxCoordinates[id] = {
        x,
        y,
        width,
        height,
      }

      this.optimizeBoxPositions()
    }

    return this.boxCoordinates[id]
  }

  public findBoxByPosition(x: number, y: number): BoxId | null {
    for (const [id, coordinates] of Object.entries(this.boxCoordinates)) {
      if (
        x >= coordinates.x &&
        x <= coordinates.x + coordinates.width &&
        y >= coordinates.y &&
        y <= coordinates.y + coordinates.height
      ) {
        return id
      }
    }

    return null
  }

  public moveBoxes(dx: number, dy: number, selectedBoxId?: BoxId): void {
    if (selectedBoxId) {
      this.boxCoordinates[selectedBoxId].x = dx
      this.boxCoordinates[selectedBoxId].y = dy

      return
    }

    for (const [id, coordinates] of Object.entries(this.boxCoordinates)) {
      this.boxCoordinates[id] = {
        ...coordinates,
        x: coordinates.x + dx,
        y: coordinates.y + dy,
      }
    }
  }

  public optimizeBoxPositions() {
    const boxIds = Object.keys(this.boxCoordinates)

    for (const id of boxIds) {
      const initialPosition = { ...this.boxCoordinates[id] }
      let minOverlap = this.calculateTotalOverlap()
      let bestPosition = initialPosition

      for (let dx = -10; dx <= 10; dx += 5) {
        for (let dy = -10; dy <= 10; dy += 5) {
          this.boxCoordinates[id] = {
            x: initialPosition.x + dx,
            y: initialPosition.y + dy,
            width: initialPosition.width,
            height: initialPosition.height,
          }

          const currentOverlap = this.calculateTotalOverlap()

          if (currentOverlap < minOverlap) {
            minOverlap = currentOverlap
            bestPosition = { ...this.boxCoordinates[id] }
          }
        }
      }

      this.boxCoordinates[id] = bestPosition
    }
  }

  private calculateTotalOverlap(): number {
    const boxCoordinates = Object.values(this.boxCoordinates)
    let totalOverlap = 0

    for (let i = 0; i < boxCoordinates.length; i++) {
      for (let j = i + 1; j < boxCoordinates.length; j++) {
        const box1 = boxCoordinates[i]
        const box2 = boxCoordinates[j]

        // Calculate the overlapping area
        const overlapX = Math.max(
          0,
          Math.min(box1.x + box1.width, box2.x + box2.width) - Math.max(box1.x, box2.x),
        )
        const overlapY = Math.max(
          0,
          Math.min(box1.y + box1.height, box2.y + box2.height) - Math.max(box1.y, box2.y),
        )

        // Calculate the total overlap area (overlapX * overlapY)
        totalOverlap += overlapX * overlapY
      }
    }

    return totalOverlap
  }

  public draw() {
    this.canvasManager.initDraw()

    // Ensure all the boxes have coordinates (this helps with the optimization of the box positions)
    this.boxManager.getBoxes().forEach((box) => {
      const [width, height] = box.text
        ? [this.canvasManager.textWidth(box.text) + 20, 40]
        : [10, 10]

      if (!this.boxCoordinates[box.id]) {
        this.getBoxCoordinates(
          box.id,
          width,
          height,
          this.canvasManager.getWidth(),
          this.canvasManager.getHeight(),
        )
      }
    })

    // Assign box coordinates
    const boxes: Box[] = this.boxManager.getBoxes().map((box) => {
      const [width, height] = box.text
        ? [this.canvasManager.textWidth(box.text) + 20, 40]
        : [10, 10]

      const coordinates = this.getBoxCoordinates(
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

      this.canvasManager.drawLine({
        startX: firstBox.x + firstBox.width / 2,
        startY: firstBox.y + firstBox.height / 2,
        endX: secondBox.x + secondBox.width / 2,
        endY: secondBox.y + secondBox.height / 2,
        ...{ lineWidth: connection.type === 'spouse' ? 4 : undefined },
      })
    })

    // Draw boxes
    boxes.forEach((box) => this.canvasManager.drawBox(box))
  }
}

export default DrawUtils
