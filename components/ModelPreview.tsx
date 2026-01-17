'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './ModelPreview.module.css'

interface ModelPreviewProps {
  glbUrl: string
  usdzUrl: string
  name: string
  onReset: () => void
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string
          'ios-src'?: string
          alt?: string
          'camera-controls'?: boolean
          'auto-rotate'?: boolean
          'shadow-intensity'?: string
          exposure?: string
          ar?: boolean
          'ar-modes'?: string
          'ar-scale'?: string
        },
        HTMLElement
      >
    }
  }
}

export default function ModelPreview({ glbUrl, usdzUrl, name, onReset }: ModelPreviewProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const modelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    import('@google/model-viewer')
  }, [])

  useEffect(() => {
    const modelViewer = modelRef.current
    if (modelViewer) {
      const handleLoad = () => setIsLoaded(true)
      modelViewer.addEventListener('load', handleLoad)
      return () => modelViewer.removeEventListener('load', handleLoad)
    }
  }, [])

  const handleShopSimilar = () => {
    // Extract meaningful shopping terms from the prompt
    const searchTerms = name
      .toLowerCase()
      .replace(/futuristic|magical|fantasy|3d|realistic|detailed|beautiful|amazing/gi, '')
      .trim()
    const searchQuery = encodeURIComponent(`buy ${searchTerms}`)
    window.open(`https://www.google.com/search?tbm=shop&q=${searchQuery}`, '_blank')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onReset}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          New
        </button>
        <h2 className={styles.modelName}>{name}</h2>
      </div>

      <div className={styles.viewer}>
        {!isLoaded && (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner} />
            <span>Loading model...</span>
          </div>
        )}
        <model-viewer
          ref={modelRef as any}
          src={glbUrl}
          ios-src={usdzUrl}
          alt={`3D model of ${name}`}
          camera-controls
          auto-rotate
          shadow-intensity="1"
          exposure="1"
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.shopButton} onClick={handleShopSimilar}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Shop Similar
        </button>

        <a href={glbUrl} download className={styles.downloadButton}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          GLB
        </a>
        <a href={usdzUrl} download className={styles.downloadButton}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          USDZ
        </a>
      </div>

      <p className={styles.hint}>Drag to rotate • Scroll to zoom</p>
    </div>
  )
}
