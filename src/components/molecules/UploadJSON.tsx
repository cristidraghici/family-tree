import { FunctionComponent, ChangeEvent, useState, useRef } from 'react'
import Condition from '@/components/atoms/ConditionalElement'

import usePersonContext from '@/contexts/person/usePersonContext'

const FileUploadAndParse: FunctionComponent = () => {
  const [message, setMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { loadRegistryData, saveAll, error } = usePersonContext()

  const parseFile = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(null)

    const fileInput = event.target

    if (fileInput.files && fileInput.files.length > 0) {
      const uploadedFile = fileInput.files[0]
      const reader = new FileReader()

      reader.onload = (e) => {
        const fileContent = e.target?.result as string
        try {
          loadRegistryData(JSON.parse(fileContent))

          // TODO: Check reactivity of the context to remove this line eventually
          saveAll(JSON.parse(fileContent))

          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }

          setMessage(`Data loaded successfully from ${uploadedFile.name}.`)
        } catch (error) {
          setMessage('Invalid data in the selected file.')
        }
      }

      reader.readAsText(uploadedFile)
    } else {
      setMessage('Please choose a file to upload.')
    }
  }

  return (
    <form>
      <Condition condition={!!error || !!message} as="div" className="HeaderDetails_Message">
        {error || message}
      </Condition>
      <input ref={fileInputRef} type="file" id="fileInput" accept=".json" onChange={parseFile} />
    </form>
  )
}

export default FileUploadAndParse
