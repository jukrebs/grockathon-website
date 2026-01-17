'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
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
  const [isIOS, setIsIOS] = useState(false)
  const modelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    import('@google/model-viewer')
    const checkIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(checkIOS)
  }, [])

  useEffect(() => {
    const modelViewer = modelRef.current
    if (modelViewer) {
      const handleLoad = () => setIsLoaded(true)
      modelViewer.addEventListener('load', handleLoad)
      return () => modelViewer.removeEventListener('load', handleLoad)
    }
  }, [])

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
        {isIOS ? (
          <a href={usdzUrl} rel="ar" className={styles.arButton}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
            </svg>
            View in AR
          </a>
        ) : (
          <div className={styles.arNotice}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="18" r="1" fill="currentColor"/>
            </svg>
            <span>Open on iPhone for AR</span>
          </div>
        )}

        <div className={styles.downloadButtons}>
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
      </div>

      <p className={styles.hint}>Drag to rotate • Scroll to zoom</p>
    </div>
  )
}
