import { FunctionComponent, useEffect, useRef, useMemo } from 'react'
import CanvasUtil from '@/utils/canvas/CanvasUtil'

import usePersonContext from '@/hooks/usePersonContext'

import type { PersonIdType, PositionsType } from '@/types'
import { CanvasChangePositionEndHandler, ConnectionType } from '@/utils/canvas/types'

import debounce from '@/utils/debounce'

const GraphPage: FunctionComponent = () => {
  const { persons, search, handleSelectPerson, positions, updatePositions } = usePersonContext()

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

    persons.forEach(({ id, fatherId, motherId, spouses }) => {
      if (fatherId && motherId) {
        marriages[getMarriageId(fatherId, motherId)] = [fatherId, motherId]
      }

      spouses.forEach((spouseId) => {
        marriages[[id, spouseId].sort().join('-')] = [id, spouseId]
      })
    })

    return marriages
  }, [persons])

  const connections = useMemo(() => {
    const connections: Record<string, [PersonIdType, PersonIdType, ConnectionType]> = {}

    persons.forEach(({ id, fatherId, motherId, spouses }) => {
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
  }, [persons])

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (!canvasUtilRef.current) {
      canvasUtilRef.current = new CanvasUtil({ canvas })
    }

    const canvasUtil = canvasUtilRef.current

    canvasUtil.init({
      onDblClick: handleSelectPerson,
      initialPositions: positions,
      onCanvasChangePositionEnd: handleUpdatePositions as CanvasChangePositionEndHandler,
    })

    const updateDimensions = () => {
      if (containerRef.current) {
        // 1. Update container height to fill viewport
        const rect = containerRef.current.getBoundingClientRect()
        const availableHeight = window.innerHeight - rect.top - 20
        containerRef.current.style.height = `${Math.max(availableHeight, 400)}px`
        
        // 2. Sync canvas internal resolution
        canvasUtil.resize()
      }
    }

    // Single observer for any size changes (browser resize, sidebar toggle, etc)
    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(document.body) // Observe body to capture viewport changes logically
    
    // Initial sync
    updateDimensions()
    document.body.style.overflow = 'hidden'

    return () => {
      canvasUtil.destroy()
      resizeObserver.disconnect()
      document.body.style.overflow = ''
    }
  }, [positions, handleSelectPerson, handleUpdatePositions])

  useEffect(() => {
    const drawFamilyTree = () => {
      const canvasUtil = canvasUtilRef.current

      if (canvasUtil) {
        persons.forEach(({ id, fullName, generation }) => {
          const isHighlighted =
            search.length > 0 && fullName.toLowerCase().includes(search.toLowerCase())
          canvasUtil.addBox({ id, text: `${fullName} (${generation})`, highlight: isHighlighted })
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
  }, [persons, marriages, connections, search])

  const handleAutoLayout = () => {
    if (canvasUtilRef.current) {
      canvasUtilRef.current.autoLayout()
      canvasUtilRef.current.draw()
      handleUpdatePositions(canvasUtilRef.current['drawUtils'].getAllPositions())
    }
  }

  return (
    <div className="GraphPage" ref={containerRef}>
      <div className="GraphPage_Controls">
        <button type="button" onClick={handleAutoLayout} title="Auto Layout">
          Auto Layout
        </button>
      </div>
      <canvas className="Canvas" ref={canvasRef} />
    </div>
  )
}

export default GraphPage

