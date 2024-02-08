import { FunctionComponent, useEffect, useRef } from 'react'
import CanvasUtil from '@/utils/canvas/CanvasUtil'

import type {
  ExtendedPersonType,
  PersonIdType,
  RelationshipType,
  GenerationsType,
  SelectPersonFunction,
} from '@/utils/PersonRegistry'

interface FamilyTreeProps {
  persons: ExtendedPersonType[]
  relationships: RelationshipType[]
  generations: GenerationsType
  onClick: SelectPersonFunction
}

const FamilyTree: FunctionComponent<FamilyTreeProps> = ({ persons, relationships, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasUtilRef = useRef<CanvasUtil | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const canvasUtil = canvasUtilRef.current

    if (canvas && !canvasUtil) {
      canvasUtilRef.current = new CanvasUtil({ canvas, onDblClick: onClick })
    }

    canvasUtilRef.current?.init({
      onDblClick: onClick,
    })

    return () => {
      canvasUtilRef.current?.destroy()
    }
  }, [onClick])

  useEffect(() => {
    const drawFamilyTree = () => {
      const canvasUtil = canvasUtilRef.current

      if (canvasUtil) {
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
  }, [persons, relationships])

  return <canvas className="Canvas" ref={canvasRef} />
}

export default FamilyTree
