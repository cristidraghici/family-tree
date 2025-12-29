import CanvasManager from '../managers/CanvasManager'
import BoxManager from '../managers/BoxManager'

import type { PositionsType, X, Y } from '@/types'
import type { BoxId, Box, BoxCoordinates } from '../types'

import {
  CANVAS_DEFAULT_SCREEN_WIDTH,
  CANVAS_DEFAULT_SCREEN_HEIGHT,
  CANVAS_LINE_COLOR,
  CANVAS_GRID_SIZE,
} from '@/constants'

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

    this.init({ initialPositions })
  }

  init({ initialPositions }: DrawUtilsInitProps) {
    this.initialPositions = initialPositions || []
  }

  private isOverlap(
    { x: firstBoxX, y: firstBoxY, width: w1, height: h1 }: BoxCoordinates,
    { x: secondBoxX, y: secondBoxY, width: w2, height: h2 }: BoxCoordinates,
  ): boolean {
    const padding = 20
    return (
      firstBoxX < secondBoxX + w2 + padding &&
      firstBoxX + w1 + padding > secondBoxX &&
      firstBoxY < secondBoxY + h2 + padding &&
      firstBoxY + h1 + padding > secondBoxY
    )
  }

  private generateRandomPosition(canvasWidth: number, canvasHeight: number): [X, Y] {
    let x: number, y: number
    let tries = 0

    const boxCoordinates = Object.values(this.boxCoordinates)

    do {
      ;[x, y] = [Math.random() * (canvasWidth - 100), Math.random() * (canvasHeight - 50)]
      tries++
    } while (
      boxCoordinates.some((coordinates) =>
        this.isOverlap({ x, y, width: 100, height: 40 }, coordinates),
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

  public autoLayout() {
    const allBoxes = this.boxManager.getBoxes()
    const personBoxes = allBoxes.filter((b) => b.text !== '')
    const marriageBoxes = allBoxes.filter((b) => b.text === '')
    const connections = this.boxManager.getConnections()

    const generations: Record<number, BoxId[]> = {}

    personBoxes.forEach((box) => {
      const match = box.text.match(/\((-?\d+)\)$/)
      const gen = match ? parseInt(match[1], 10) : 0
      if (!generations[gen]) generations[gen] = []
      generations[gen].push(box.id)
    })

    const genHeight = 180
    const horizontalGap = 60

    const sortedGens = Object.keys(generations)
      .map(Number)
      .sort((a, b) => a - b)

    // Maps to help with ordering
    const parentsOf = (personId: BoxId) => {
      const bloodConn = connections.find(
        (c) => (c.firstBoxId === personId || c.secondBoxId === personId) && c.type === 'blood',
      )
      if (!bloodConn) return []
      const marriageId =
        bloodConn.firstBoxId === personId ? bloodConn.secondBoxId : bloodConn.firstBoxId
      return connections
        .filter(
          (c) =>
            (c.firstBoxId === marriageId || c.secondBoxId === marriageId) && c.type === 'spouse',
        )
        .map((c) => (c.firstBoxId === marriageId ? c.secondBoxId : c.firstBoxId))
    }

    const spousesOf = (personId: BoxId) => {
      const spouseConns = connections.filter(
        (c) => (c.firstBoxId === personId || c.secondBoxId === personId) && c.type === 'spouse',
      )
      const marriageIds = spouseConns.map((c) =>
        c.firstBoxId === personId ? c.secondBoxId : c.firstBoxId,
      )
      const spouses: BoxId[] = []
      marriageIds.forEach((mId) => {
        connections
          .filter((c) => (c.firstBoxId === mId || c.secondBoxId === mId) && c.type === 'spouse')
          .forEach((c) => {
            const sid = c.firstBoxId === mId ? c.secondBoxId : c.firstBoxId
            if (sid !== personId && !spouses.includes(sid)) spouses.push(sid)
          })
      })
      return spouses
    }

    // Process each generation
    sortedGens.forEach((gen, rowIndex) => {
      const idsInGen = generations[gen]
      const processed = new Set<BoxId>()
      const orderedIds: BoxId[] = []

      // Sort current generation based on parents' X positions (if already placed)
      const sortedIdsInGen = [...idsInGen].sort((a, b) => {
        const parentsA = parentsOf(a)
        const parentsB = parentsOf(b)
        if (parentsA.length === 0 && parentsB.length === 0) return 0
        if (parentsA.length === 0) return 1
        if (parentsB.length === 0) return -1

        const avgXA =
          parentsA.reduce((sum, pId) => sum + (this.boxCoordinates[pId]?.x || 0), 0) /
          parentsA.length
        const avgXB =
          parentsB.reduce((sum, pId) => sum + (this.boxCoordinates[pId]?.x || 0), 0) /
          parentsB.length
        return avgXA - avgXB
      })

      sortedIdsInGen.forEach((id) => {
        if (!processed.has(id)) {
          orderedIds.push(id)
          processed.add(id)
          // Add spouses immediately after
          spousesOf(id).forEach((sId) => {
            if (idsInGen.includes(sId) && !processed.has(sId)) {
              orderedIds.push(sId)
              processed.add(sId)
            }
          })
        }
      })

      let currentX = 0
      const boxWidths: Record<BoxId, number> = {}

      orderedIds.forEach((id, index) => {
        const box = personBoxes.find((b) => b.id === id)!
        // Snap width to 2x grid size to ensure center also aligns to grid
        const minWidth = this.canvasManager.textWidth(box.text) + 30
        const width = Math.ceil(minWidth / (CANVAS_GRID_SIZE * 2)) * (CANVAS_GRID_SIZE * 2)

        boxWidths[id] = width
        this.boxCoordinates[id] = {
          x: currentX,
          y: Math.round((rowIndex * genHeight + 100) / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE,
          width,
          height: 40,
        }

        // Use a smaller gap if the next person is a spouse
        const nextId = orderedIds[index + 1]
        const isSpouseNext = nextId && spousesOf(id).includes(nextId)
        currentX +=
          width +
          (isSpouseNext
            ? CANVAS_GRID_SIZE * 2
            : Math.round(horizontalGap / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE)
      })

      // Center the whole generation row and snap to grid
      const totalWidth =
        currentX -
        (orderedIds.length > 0
          ? spousesOf(orderedIds[orderedIds.length - 1]).includes(orderedIds[orderedIds.length - 2])
            ? CANVAS_GRID_SIZE * 2
            : Math.round(horizontalGap / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE
          : 0)
      const canvasWidth = this.canvasManager.getWidth() || CANVAS_DEFAULT_SCREEN_WIDTH
      const offset =
        Math.round((canvasWidth - totalWidth) / 2 / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE

      orderedIds.forEach((id) => {
        const coords = this.boxCoordinates[id]
        // Snap center to grid
        const centerX =
          Math.round((coords.x + offset + coords.width / 2) / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE
        this.boxCoordinates[id].x = centerX - coords.width / 2
      })
    })

    // Center marriage nodes between spouses
    marriageBoxes.forEach((mBox) => {
      const spouseConns = connections.filter(
        (c) => (c.firstBoxId === mBox.id || c.secondBoxId === mBox.id) && c.type === 'spouse',
      )

      if (spouseConns.length >= 2) {
        const p1Id =
          spouseConns[0].firstBoxId === mBox.id
            ? spouseConns[0].secondBoxId
            : spouseConns[0].firstBoxId
        const p2Id =
          spouseConns[1].firstBoxId === mBox.id
            ? spouseConns[1].secondBoxId
            : spouseConns[1].firstBoxId
        const p1 = this.boxCoordinates[p1Id]
        const p2 = this.boxCoordinates[p2Id]
        if (p1 && p2) {
          const avgX = (p1.x + p1.width / 2 + p2.x + p2.width / 2) / 2
          const targetY = p1.y + p1.height + 40
          const width = 10
          const height = 10

          this.boxCoordinates[mBox.id] = {
            x: Math.round(avgX / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE - width / 2,
            y: Math.round(targetY / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE - height / 2,
            width,
            height,
          }
        }
      } else if (spouseConns.length === 1) {
        // Single parent marriage node
        const pId =
          spouseConns[0].firstBoxId === mBox.id
            ? spouseConns[0].secondBoxId
            : spouseConns[0].firstBoxId
        const p = this.boxCoordinates[pId]
        if (p) {
          const targetX = p.x + p.width / 2
          const targetY = p.y + p.height + 40
          const width = 10
          const height = 10

          this.boxCoordinates[mBox.id] = {
            x: Math.round(targetX / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE - width / 2,
            y: Math.round(targetY / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE - height / 2,
            width,
            height,
          }
        }
      }
    })
  }

  public getBoxCoordinates(
    id: BoxId,
    width: number = 100,
    height: number = 40,
    canvasWidth: number = CANVAS_DEFAULT_SCREEN_WIDTH,
    canvasHeight: number = CANVAS_DEFAULT_SCREEN_HEIGHT,
  ): BoxCoordinates {
    if (!this.boxCoordinates[id]) {
      const initialPosition = this.initialPositions.find((position) => position.id === id)

      const [x, y] = initialPosition
        ? [initialPosition.x, initialPosition.y]
        : this.generateRandomPosition(canvasWidth, canvasHeight)

      this.boxCoordinates[id] = {
        x: Math.round((x + width / 2) / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE - width / 2,
        y: Math.round((y + height / 2) / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE - height / 2,
        width,
        height,
      }
    }

    return this.boxCoordinates[id]
  }

  public findBoxByPosition(x: number, y: number): BoxId | null {
    // Reverse order to pick the top-most box
    const entries = Object.entries(this.boxCoordinates).reverse()
    for (const [id, coordinates] of entries) {
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

  public moveBox(id: BoxId, x: number, y: number): void {
    const coords = this.boxCoordinates[id]
    if (coords) {
      // Snap node center to grid
      this.boxCoordinates[id].x =
        Math.round((x + coords.width / 2) / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE - coords.width / 2
      this.boxCoordinates[id].y =
        Math.round((y + coords.height / 2) / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE -
        coords.height / 2
    }
  }

  public draw() {
    this.canvasManager.initDraw()

    if (this.boxManager.getSelectedBox()) {
      this.canvasManager.drawGrid()
    }

    const boxes: Box[] = this.boxManager.getBoxes().map((box) => {
      const isMarriage = box.text === ''
      const [width, height] = isMarriage
        ? [10, 10]
        : [
            Math.ceil((this.canvasManager.textWidth(box.text) + 30) / (CANVAS_GRID_SIZE * 2)) *
              (CANVAS_GRID_SIZE * 2),
            40,
          ]

      const coordinates = this.getBoxCoordinates(
        box.id,
        width,
        height,
        this.canvasManager.getWidth(),
        this.canvasManager.getHeight(),
      )

      return { ...box, ...coordinates }
    })

    // Draw connections
    this.boxManager.getConnections().forEach((connection) => {
      const firstBox = boxes.find(({ id }) => id === connection.firstBoxId)
      const secondBox = boxes.find(({ id }) => id === connection.secondBoxId)

      if (!firstBox || !secondBox) return

      const startX = firstBox.x + firstBox.width / 2
      const startY = firstBox.y + firstBox.height / 2
      const endX = secondBox.x + secondBox.width / 2
      const endY = secondBox.y + secondBox.height / 2

      // For spouses, we want the node to be at the elbow of the relationship line
      // so we use the target's Y as the midpoint.
      const isSpouse = connection.type === 'spouse'

      this.canvasManager.drawAngledLine({
        startX,
        startY,
        endX,
        endY,
        midY: isSpouse
          ? endY
          : Math.round((startY + (endY - startY) / 2) / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE, // Snap horizontal line to grid
        color: CANVAS_LINE_COLOR,
        lineWidth: isSpouse ? 4 : undefined,
        lineDash: isSpouse ? [] : [2, 2],
      })
    })

    // Draw boxes
    boxes.forEach((box) => {
      if (box.text === '') {
        // Draw marriage node as a small circle or diamond
        this.canvasManager.drawBox({ ...box, text: '' })
      } else {
        this.canvasManager.drawBox(box)
      }
    })
  }
}

export default DrawUtils
