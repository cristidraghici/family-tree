const downloadTextAsFile = (data: string, fileName: string): void => {
  const isIE = ~navigator.userAgent.indexOf('MSIE') || ~navigator.appVersion.indexOf('Trident/')
  const isEdge = ~navigator.userAgent.indexOf('Edge')

  if (isIE || isEdge) {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
    // @ts-expect-error - Property 'msSaveBlob' does not exist on type 'Navigator'
    navigator.msSaveBlob(blob, fileName)
  } else {
    // Other modern browsers
    const link = document.createElement('a')
    link.setAttribute('target', '_blank')

    const blob = new Blob([data], { type: 'text/plain' })
    link.setAttribute(
      'href',
      Blob !== undefined
        ? URL.createObjectURL(blob)
        : 'data:text/plain,' + encodeURIComponent(data),
    )

    if (isEdge) {
      fileName = fileName.replace(/[&/\\#,+$~%.'':*?<>{}]/g, '_') // Edge
    }

    link.setAttribute('download', fileName)

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export default downloadTextAsFile
