import { FunctionComponent, useEffect, useRef, useMemo } from 'react'
import CanvasUtil from '@/utils/canvas/CanvasUtil'

import usePersonContext from '@/hooks/usePersonContext'

import type { PersonIdType, PositionsType } from '@/types'
import { CanvasChangePositionEndHandler, ConnectionType } from '@/utils/canvas/types'

import debounce from '@/utils/debounce'

const GraphPage: FunctionComponent = () => {
  const { filteredPersons, handleSelectPerson, positions, updatePositions } = usePersonContext()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasUtilRef = useRef<CanvasUtil | null>(null)

  const handleUpdatePositions = debounce(
    (data) => updatePositions(data as unknown as PositionsType[]),
    100,
  )

  const getMarriageId = (firstId: PersonIdType, secondId: PersonIdType) => {
    return [firstId, secondId].sort().join('-') as PersonIdType
  }

  // Marriages are represented as smaller boxes on the canvas, so they can be extracted
  // separately for easier drawing and connection management
  const marriages = useMemo(() => {
    const marriages: Record<string, string[]> = {}

    filteredPersons.forEach(({ id, fatherId, motherId, spouses }) => {
      if (fatherId && motherId) {
        marriages[getMarriageId(fatherId, motherId)] = [fatherId, motherId]
      }

      spouses.forEach((spouseId) => {
        marriages[[id, spouseId].sort().join('-')] = [id, spouseId]
      })
    })

    return marriages
  }, [filteredPersons])

  const connections = useMemo(() => {
    const connections: Record<string, [PersonIdType, PersonIdType, ConnectionType]> = {}

    filteredPersons.forEach(({ id, fatherId, motherId, spouses }) => {
      if (fatherId && motherId) {
        const marriageId = getMarriageId(fatherId, motherId)

        connections[getMarriageId(id, marriageId)] = [id, marriageId, 'blood']

        connections[getMarriageId(fatherId, marriageId)] = [fatherId, marriageId, 'spouse']
        connections[getMarriageId(motherId, marriageId)] = [motherId, marriageId, 'spouse']
      }

      spouses.forEach((spouseId) => {
        const marriageId = getMarriageId(id, spouseId)
        connections[getMarriageId(id, marriageId)] = [id, marriageId, 'spouse']
        connections[getMarriageId(spouseId, marriageId)] = [spouseId, marriageId, 'spouse']
      })
    })

    return connections
  }, [filteredPersons])

  useEffect(() => {
    const canvas = canvasRef.current
    const canvasUtil = canvasUtilRef.current

    if (canvas && !canvasUtil) {
      canvasUtilRef.current = new CanvasUtil({ canvas })
    }

    canvasUtilRef.current?.init({
      onDblClick: handleSelectPerson,
      initialPositions: positions,
      onCanvasChangePositionEnd: handleUpdatePositions as CanvasChangePositionEndHandler, // TODO: check this to ensure it's correct
    })

    return () => {
      canvasUtilRef.current?.destroy()
    }
  }, [positions, handleSelectPerson, handleUpdatePositions])

  useEffect(() => {
    const drawFamilyTree = () => {
      const canvasUtil = canvasUtilRef.current

      if (canvasUtil) {
        // canvasUtil.reset()

        filteredPersons.forEach(({ id, fullName, generation }) => {
          canvasUtil.addBox({ id, text: `${fullName} (${generation})` })
        })

        Object.keys(marriages).forEach((marriageId) => {
          canvasUtil.addBox({ id: marriageId, text: '' })
        })

        Object.entries(connections).forEach(([, [firstId, secondId, type]]) => {
          canvasUtil.addConnection(firstId, secondId, type)
        })

        canvasUtil.draw()
      }
    }

    drawFamilyTree()
  }, [filteredPersons, marriages, connections])

  return <canvas className="Canvas" ref={canvasRef} />
}

export default GraphPage
