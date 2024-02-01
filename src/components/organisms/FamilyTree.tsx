import { FunctionComponent, useEffect, useRef } from 'react'
import CanvasUtil from '@/utils/helpers/canvasUtil'
import type { ExtendedPersonType, PersonIdType, SelectPersonFunction } from '@/utils/PersonRegistry'

interface FamilyTreeProps {
  persons: ExtendedPersonType[]
  onClick: SelectPersonFunction
}

const FamilyTree: FunctionComponent<FamilyTreeProps> = ({ persons, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasUtilRef = useRef<CanvasUtil | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const canvasUtil = canvasUtilRef.current

    if (canvas && !canvasUtil) {
      canvasUtilRef.current = new CanvasUtil({ canvas, dblClick: onClick })
      canvasUtilRef.current.init()
    }
  }, [onClick])

  useEffect(() => {
    const canvasUtil = canvasUtilRef.current

    const drawFamilyTree = () => {
      if (canvasUtil) {
        persons.forEach(({ id, fullName, fatherId, motherId }) => {
          canvasUtil.addBox({ id, text: fullName })

          if (fatherId && motherId) {
            const marriageId = [fatherId, motherId].sort().join('-') as PersonIdType
            canvasUtil.addBox({ id: marriageId, text: '', isMiniBox: true })

            canvasUtil.addConnection(id, marriageId)
            canvasUtil.addConnection(fatherId, marriageId)
            canvasUtil.addConnection(motherId, marriageId)
          }
        })

        canvasUtil.optimizeBoxPositions()

        // Initial draw with a slight delay to fix the bug
        setTimeout(() => {
          canvasUtil.draw()
        }, 100)
      }
    }

    drawFamilyTree()

    return () => {
      canvasUtilRef.current?.destroy()
    }
  }, [onClick, persons])

  return <canvas className="Canvas" ref={canvasRef} />
}

export default FamilyTree
