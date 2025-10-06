'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, ImageIcon, Loader2 } from 'lucide-react'
import { Button } from './button'

interface ImagePreviewProps {
  readonly imageUrl: string
  readonly altText?: string
  readonly className?: string
  readonly width?: number
  readonly height?: number
}

export function ImagePreview({
  imageUrl,
  altText = "Image preview",
  className,
  width = 200,
  height = 200
}: ImagePreviewProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    setImageState('loading')

    const img = new Image()
    img.src = imageUrl

    const handleLoad = () => {
      setImageState('loaded')
    }

    const handleError = () => {
      setImageState('error')
    }

    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)

    return () => {
      img.removeEventListener('load', handleLoad)
      img.removeEventListener('error', handleError)
    }
  }, [imageUrl, retryCount])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
  }

  return (
    <div className={cn('border rounded-lg p-3 bg-muted/30', className)}>
      <div className='flex items-center gap-2 mb-2'>
        <ImageIcon className='w-4 h-4 text-muted-foreground' />
        <span className='text-sm font-medium text-muted-foreground'>Vista previa</span>
      </div>
      <div
        className='flex items-center justify-center border-2 border-dashed rounded-md bg-background overflow-hidden'
        style={{ width, height }}
      >
        {imageState === 'loading' && (
          <div className='flex flex-col items-center gap-2 text-muted-foreground'>
            <Loader2 className='w-6 h-6 animate-spin' />
            <span className='text-xs'>Cargando imagen...</span>
          </div>
        )}
        {imageState === 'loaded' && (
          <img
            src={imageUrl}
            alt={altText}
            className='w-full h-full object-contain'
            onError={() => setImageState('error')}
          />
        )}
        {imageState === 'error' && (
          <div className='flex flex-col items-center gap-2 text-destructive p-4 text-center'>
            <AlertCircle className='w-6 h-6' />
            <span className='text-xs font-medium'>Error al cargar la imagen</span>
            <span className='text-xs text-muted-foreground'>
              Verifica que la URL sea correcta y la imagen sea accesible
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={handleRetry}
              className='mt-2'
            >
              Reintentar
            </Button>
          </div>
        )}
      </div>
      {imageState === 'loaded' && (
        <div className='mt-2 text-xs text-muted-foreground text-center'>
          {width} x {height} px
        </div>
      )}
    </div>
  )
}