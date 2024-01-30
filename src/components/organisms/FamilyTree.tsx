import { FunctionComponent, useEffect, useRef } from 'react'
import { ExtendedPersonType, PersonIdType } from '@/utils/PersonRegistry'
import CanvasUtil from '@/utils/helpers/canvasUtil'

const FamilyTree: FunctionComponent<{
  persons: ExtendedPersonType[]
  onEdit: (person: PersonIdType) => void
}> = ({ persons, onEdit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasUtilRef = useRef<CanvasUtil | null>(null)

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current

      if (canvas) {
        const { x, y } = canvas.getBoundingClientRect()
        canvas.style.height = `${window.innerHeight - y - 10}px`
        canvas.style.width = `${window.innerWidth - x - 10}px`
      }
    }

    handleResize() // Initial resize
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current

    if (canvas && !canvasUtilRef.current) {
      canvasUtilRef.current = new CanvasUtil({ canvas, dblClick: onEdit })
      canvasUtilRef.current.init()
    }

    return () => {
      canvasUtilRef.current?.destroy()
    }
  }, [onEdit])

  useEffect(() => {
    const canvasUtil = canvasUtilRef.current

    if (canvasUtil) {
      canvasUtil.reset()

      for (const { id, fullName, relations } of persons) {
        canvasUtil.addBox({ id, text: fullName })

        for (const relation of relations) {
          canvasUtil.addConnection(id, relation)
        }
      }

      // Initial draw with a slight delay to fix the bug
      setTimeout(() => {
        canvasUtil.draw()
      }, 100)
    }
  }, [persons])

  return <canvas className="Canvas" ref={canvasRef} />
}

export default FamilyTree
