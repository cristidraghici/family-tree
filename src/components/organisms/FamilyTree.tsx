import { FunctionComponent, useEffect, useRef } from 'react'
import CanvasUtil from '@/utils/canvas/CanvasUtil'

import type { ExtendedPersonType, PersonIdType } from '@/types'
import { CanvasUtilInitProps } from '@/utils/canvas/CanvasUtil'
import { DrawUtilsInitProps } from '@/utils/canvas/utils/DrawUtils'

interface FamilyTreeProps extends CanvasUtilInitProps, DrawUtilsInitProps {
  persons: ExtendedPersonType[]
}

const FamilyTree: FunctionComponent<FamilyTreeProps> = ({ persons, ...canvasUtilInitProps }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasUtilRef = useRef<CanvasUtil | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const canvasUtil = canvasUtilRef.current

    if (canvas && !canvasUtil) {
      canvasUtilRef.current = new CanvasUtil({
        canvas,
        ...canvasUtilInitProps,
      })
    }

    canvasUtilRef.current?.init({
      ...canvasUtilInitProps,
    })

    return () => {
      canvasUtilRef.current?.destroy()
    }
  }, [canvasUtilInitProps])

  useEffect(() => {
    const drawFamilyTree = () => {
      const canvasUtil = canvasUtilRef.current

      if (canvasUtil) {
        if (persons.length === 0) {
          canvasUtil.reset()
          canvasUtil.draw()
          return
        }

        persons.forEach(({ id, fullName, generation, fatherId, motherId }) => {
          canvasUtil.addBox({ id, text: `${fullName} (${generation})` })

          if (fatherId && motherId) {
            const marriageId = [fatherId, motherId].sort().join('-') as PersonIdType

            canvasUtil.addBox({ id: marriageId, text: '' })

            canvasUtil.addConnection(id, marriageId, 'blood')
            canvasUtil.addConnection(fatherId, marriageId, 'spouse')
            canvasUtil.addConnection(motherId, marriageId, 'spouse')
          }
        })

        canvasUtil.draw()
      }
    }

    drawFamilyTree()
  }, [persons])

  return <canvas className="Canvas" ref={canvasRef} />
}

export default FamilyTree
