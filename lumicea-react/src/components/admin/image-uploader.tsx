import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, UploadCloud, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

// Get Cloudinary config from Vite environment variables
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void
  folder?: string // Optional: specify an upload folder
}

export function ImageUploader({ onUploadSuccess, folder = 'products' }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // This state is just to reset the file input's value
  const [fileInputKey, setFileInputKey] = useState(Date.now())

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      // 1. Prepare parameters and get signature from our Supabase function
      const timestamp = Math.round(new Date().getTime() / 1000)
      const paramsToSign = {
        timestamp: timestamp,
        folder: folder,
        // You could add other params here, like tags
      }

      const { data: signData, error: signError } = await supabase.functions.invoke(
        'generate-cloudinary-signature',
        { body: { paramsToSign } }
      )

      if (signError) {
        throw new Error(`Failed to get upload signature: ${signError.message}`)
      }
      
      const { signature } = signData

      // 2. Build the FormData to send to Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', CLOUDINARY_API_KEY)
      formData.append('timestamp', String(timestamp))
      formData.append('folder', folder)
      formData.append('signature', signature)

      // 3. Make the direct POST request to Cloudinary
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Cloudinary upload failed')
      }

      // 4. Success! Call the callback function with the new secure URL
      const secureUrl = data.secure_url
      onUploadSuccess(secureUrl)
      toast.success('Image uploaded successfully!')

    } catch (err: any) {
      console.error(err)
      setError(err.message)
      toast.error(err.message || 'Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      // Reset the file input so the user can upload the same file again if they need to
      setFileInputKey(Date.now()) 
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2">
        <Input
          id="file-upload"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-lumicea-navy file:text-white hover:file:bg-lumicea-navy/90"
          key={fileInputKey}
        />
        <Button
          onClick={() => document.getElementById('file-upload')?.click()}
          disabled={isUploading}
          variant="outline"
          className="shrink-0"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4" />
          )}
          <span className="sr-only">Upload Image</span>
        </Button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
      <p className="mt-1 text-xs text-gray-500">
        Max file size: 10MB. Allowed types: PNG, JPG, WEBP.
      </p>
    </div>
  )
}
