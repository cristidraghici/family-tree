import type { BoxId, BoxCoordinates, X, Y } from '../types'

const DEFAULT_SCREEN_WIDTH = 960
const DEFAULT_SCREEN_HEIGHT = 480

class DrawUtils {
  private boxCoordinates: Record<BoxId, BoxCoordinates> = {}

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

  public getBoxCoordinates(
    id: BoxId,
    width: number = 1,
    height: number = 1,
    canvasWidth: number = DEFAULT_SCREEN_WIDTH,
    canvasHeight: number = DEFAULT_SCREEN_HEIGHT,
  ): BoxCoordinates {
    if (!this.boxCoordinates[id]) {
      const [x, y] = this.generateRandomPosition(canvasWidth, canvasHeight)

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

  private optimizeBoxPositions() {
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
        if (this.isOverlap(boxCoordinates[i], boxCoordinates[j])) {
          totalOverlap++
        }
      }
    }

    return totalOverlap
  }
}

export default DrawUtils