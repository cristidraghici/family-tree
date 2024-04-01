import { FunctionComponent, useEffect, useRef } from 'react'
import CanvasUtil from '@/utils/canvas/CanvasUtil'

import usePersonContext from '@/hooks/usePersonContext'

import type { PersonIdType, PositionsType } from '@/types'
import { CanvasChangePositionEndHandler } from '@/utils/canvas/types'

import debounce from '@/utils/debounce'

const FamilyTree: FunctionComponent = () => {
  const { filteredPersons, handleSelectPerson, positions, updatePositions } = usePersonContext()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasUtilRef = useRef<CanvasUtil | null>(null)

  const handleUpdatePositions = debounce(
    (data) => updatePositions(data as unknown as PositionsType[]),
    100,
  )

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
        // if (filteredPersons.length === 0) {
        //   canvasUtil.reset()
        //   canvasUtil.draw()
        //   return
        // }

        // canvasUtil.reset()

        filteredPersons.forEach(({ id, fullName, generation, fatherId, motherId, spouses }) => {
          canvasUtil.addBox({ id, text: `${fullName} (${generation})` })

          // add both parents if they exist
          if (fatherId && motherId) {
            const marriageId = [fatherId, motherId].sort().join('-') as PersonIdType

            canvasUtil.addBox({ id: marriageId, text: '' })

            canvasUtil.addConnection(id, marriageId, 'blood')
            canvasUtil.addConnection(fatherId, marriageId, 'spouse')
            canvasUtil.addConnection(motherId, marriageId, 'spouse')
          }

          // add parent if only one exists
          if ((fatherId || motherId) && (!fatherId || !motherId)) {
            const parentId = fatherId || motherId
            // the if block should not be necessary, one always has a value
            if (parentId) {
              canvasUtil.addConnection(id, parentId, 'blood')
            }
          }

          // add spouse if they exist
          spouses.forEach((spouseId) => {
            canvasUtil.addConnection(id, spouseId, 'spouse')
          })
        })

        canvasUtil.draw()
      }
    }

    drawFamilyTree()
  }, [filteredPersons])

  return <canvas className="Canvas" ref={canvasRef} />
}

export default FamilyTree
