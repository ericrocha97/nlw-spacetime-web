'use client'

import { ChangeEvent, useState } from 'react'

export function MediaPicker() {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<string | null>(null)

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files || files.length === 0) {
      return
    }

    const file = files[0]
    const mimeType = file.type

    setFileType(mimeType.includes('video') ? 'video' : 'image')

    const previewURL = URL.createObjectURL(file)
    setPreview(previewURL)
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        type="file"
        name="coverUrl"
        id="media"
        accept="image/*, video/*"
        className="hidden"
      />

      {preview && (
        <>
          {fileType === 'image' ? (
            // eslint-disable-next-line
            <img
              src={preview}
              alt=""
              className="aspect-video w-full rounded-lg object-cover"
            />
          ) : (
            <video
              src={preview}
              controls
              className="aspect-video w-full rounded-lg object-cover"
            />
          )}
        </>
      )}
    </>
  )
}
