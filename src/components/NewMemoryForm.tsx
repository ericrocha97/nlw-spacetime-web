'use client'

import { Image as ImageIcon } from 'lucide-react'
import { MediaPicker } from './MediaPicker'
import { FormEvent, useState } from 'react'
import { api } from '@/lib/api'
import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation'
import { Alert } from './Alert'

export function NewMemoryForm() {
  const router = useRouter()
  const [showAlert, setShowAlert] = useState(false)
  const [textAlert, setTextAlert] = useState('')
  const [typeAlert, setTypeAlert] = useState('')

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const token = Cookie.get('token')

    const formData = new FormData(event.currentTarget)
    const isValid = validateFormData(formData)
    if (!isValid) {
      handleShowAlert(
        'Por favor, preencha o campo de detalhes e anexe um arquivo.',
        'error',
      )
      return
    }

    const fileToUpload = formData.get('coverUrl')

    let coverUrl = ''

    if (fileToUpload) {
      const fileSizeInBytes = (fileToUpload as File).size
      const MAX_FILE_SIZE_BYTES = 5_242_880 // 5mb

      if (fileSizeInBytes > MAX_FILE_SIZE_BYTES) {
        handleShowAlert(
          'O arquivo excede o tamanho máximo permitido de 5mb.',
          'error',
        )
        return
      }
      const uploadFormData = new FormData()
      uploadFormData.set('file', fileToUpload)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      coverUrl = uploadResponse.data.fileUrl
    }

    await api.post(
      '/memories',
      {
        coverUrl,
        content: formData.get('content'),
        isPublic: formData.get('isPublic'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    handleShowAlert('Memória cadastrada com sucesso!', 'success')
  }

  function validateFormData(formData: FormData): boolean {
    const content = formData.get('content')
    const coverUrl = formData.get('coverUrl')

    return !!content && !!coverUrl
  }

  function handleDismissAlert() {
    setShowAlert(false)
  }

  function handleShowAlert(value: string, type: string) {
    setShowAlert(true)
    setTextAlert(value)
    setTypeAlert(type)
    setTimeout(() => {
      setShowAlert(false)
      if (type === 'success') {
        router.push('/')
      }
    }, 5000)
  }

  return (
    <>
      <Alert
        handleDismiss={handleDismissAlert}
        show={showAlert}
        text={textAlert}
        type={typeAlert}
      />
      <form
        onSubmit={handleCreateMemory}
        className="flex flex-1 flex-col gap-2"
      >
        <div className="flex items-center gap-4">
          <label
            htmlFor="media"
            className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
          >
            <ImageIcon className="h-4 w-4" />
            Anexar mídia
          </label>

          <label
            htmlFor="isPublic"
            className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
          >
            <input
              type="checkbox"
              name="isPublic"
              id="isPublic"
              value="false"
              className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
            />
            Tornar memória pública
          </label>
        </div>

        <MediaPicker />

        <textarea
          name="content"
          spellCheck={false}
          className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        />

        <button
          type="submit"
          className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
        >
          Salvar
        </button>
      </form>
    </>
  )
}
