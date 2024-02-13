import { FunctionComponent, useEffect, useRef } from 'react'
import CanvasUtil from '@/utils/canvas/CanvasUtil'

import usePersonContext from '@/hooks/usePersonContext'

import type { PersonIdType } from '@/types'
import { CanvasChangePositionEndHandler } from '@/utils/canvas/types'

const FamilyTree: FunctionComponent = () => {
  const { filteredPersons, handleSelectPerson, positions, handleUpdatePositions } =
    usePersonContext()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasUtilRef = useRef<CanvasUtil | null>(null)

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
        if (filteredPersons.length === 0) {
          canvasUtil.reset()
          canvasUtil.draw()
          return
        }

        filteredPersons.forEach(({ id, fullName, generation, fatherId, motherId }) => {
          canvasUtil.addBox({ id, text: `${fullName} (${generation})` })

          if (fatherId && motherId) {
            const marriageId = [fatherId, motherId].sort().join('-') as PersonIdType

            canvasUtil.addBox({ id: marriageId, text: '' })

            canvasUtil.addConnection(id, marriageId, 'blood')
            canvasUtil.addConnection(fatherId, marriageId, 'spouse')
            canvasUtil.addConnection(motherId, marriageId, 'spouse')
          }

          if ((fatherId || motherId) && (!fatherId || !motherId)) {
            const parentId = fatherId || motherId
            // the if block should not be necessary, one always has a value
            if (parentId) {
              canvasUtil.addConnection(id, parentId, 'blood')
            }
          }
        })

        canvasUtil.draw()
      }
    }

    drawFamilyTree()
  }, [filteredPersons])

  return <canvas className="Canvas" ref={canvasRef} />
}

export default FamilyTree
