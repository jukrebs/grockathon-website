'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './page.module.css'
import ModelPreview from '@/components/ModelPreview'

type GenerationState = 'idle' | 'generating' | 'success' | 'error'

interface ModelData {
  glbUrl: string
  usdzUrl: string
  name: string
}

const examplePrompts = [
  'A futuristic robot',
  'Crystal vase',
  'Vintage camera',
]

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [state, setState] = useState<GenerationState>('idle')
  const [modelData, setModelData] = useState<ModelData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = useCallback(async (inputPrompt?: string) => {
    const finalPrompt = inputPrompt || prompt
    if (!finalPrompt.trim() || state === 'generating') return

    setState('generating')
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate model')
      }

      setModelData({
        glbUrl: data.glbUrl,
        usdzUrl: data.usdzUrl,
        name: data.name || finalPrompt.trim(),
      })
      setState('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setState('error')
    }
  }, [prompt, state])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  const handleExampleClick = (example: string) => {
    setPrompt(example)
  }

  const handleReset = () => {
    setState('idle')
    setModelData(null)
    setPrompt('')
    setError(null)
  }

  return (
    <main className={styles.main}>
      <AnimatePresence mode="wait">
        {state !== 'success' ? (
          <motion.div 
            key="input"
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Grok Logo */}
            <motion.div 
              className={styles.logoContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <svg className={styles.logo} viewBox="0 0 88 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M76.4462 24.7077V8.41584H79.0216V19.1679L84.4685 12.9109H87.5908L82.6908 18.2731L87.6364 24.7077H84.5596L80.5539 19.1788L79.0216 19.1679V24.7077H76.4462Z" fill="currentColor"></path>
                <path d="M68.6362 24.9815C64.8074 24.9815 62.7335 22.2662 62.7335 18.7979C62.7335 15.3068 64.8074 12.6143 68.6362 12.6143C72.4878 12.6143 74.5389 15.3068 74.5389 18.7979C74.5389 22.2662 72.4878 24.9815 68.6362 24.9815ZM65.4228 18.7979C65.4228 21.4904 66.8813 22.8366 68.6362 22.8366C70.4139 22.8366 71.8497 21.4904 71.8497 18.7979C71.8497 16.1054 70.4139 14.7363 68.6362 14.7363C66.8813 14.7363 65.4228 16.1054 65.4228 18.7979Z" fill="currentColor"></path>
                <path d="M55.5659 24.7077V14.782L57.731 12.9109H62.3347V15.1014H58.1413V24.7077H55.5659Z" fill="currentColor"></path>
                <path d="M45.7187 25.009C40.8101 25.009 37.8834 21.4448 37.8834 16.5846C37.8834 11.6788 40.9146 8.02795 45.8145 8.02795C49.6433 8.02795 52.4466 9.99027 53.1075 13.6411H50.1675C49.7345 11.5647 48.0024 10.401 45.8145 10.401C42.282 10.401 40.7322 13.4586 40.7322 16.5846C40.7322 19.7106 42.282 22.7454 45.8145 22.7454C49.1875 22.7454 50.6689 20.3039 50.7828 18.2731H45.7006V15.9105H53.381L53.3684 17.1457C53.3684 21.7359 51.4978 25.009 45.7187 25.009Z" fill="currentColor"></path>
                <path d="M13.2371 21.0407L24.3186 12.8506C24.8619 12.4491 25.6384 12.6057 25.8973 13.2294C27.2597 16.5185 26.651 20.4712 23.9403 23.1851C21.2297 25.8989 17.4581 26.4941 14.0108 25.1386L10.2449 26.8843C15.6463 30.5806 22.2053 29.6665 26.304 25.5601C29.5551 22.3051 30.562 17.8683 29.6205 13.8673L29.629 13.8758C28.2637 7.99809 29.9647 5.64871 33.449 0.844576C33.5314 0.730667 33.6139 0.616757 33.6964 0.5L29.1113 5.09055V5.07631L13.2343 21.0436" fill="currentColor"></path>
                <path d="M10.9503 23.0313C7.07343 19.3235 7.74185 13.5853 11.0498 10.2763C13.4959 7.82722 17.5036 6.82767 21.0021 8.2971L24.7595 6.55998C24.0826 6.07017 23.215 5.54334 22.2195 5.17313C17.7198 3.31926 12.3326 4.24192 8.67479 7.90126C5.15635 11.4239 4.0499 16.8403 5.94992 21.4622C7.36924 24.9165 5.04257 27.3598 2.69884 29.826C1.86829 30.7002 1.0349 31.5745 0.36364 32.5L10.9474 23.0341" fill="currentColor"></path>
              </svg>
              <span className={styles.arBadge}>AR</span>
            </motion.div>

            {/* Input Bar */}
            <motion.div 
              className={styles.inputSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Describe a 3D object to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={state === 'generating'}
                />
                <button
                  className={styles.submitButton}
                  onClick={() => handleGenerate()}
                  disabled={!prompt.trim() || state === 'generating'}
                  aria-label="Generate"
                >
                  {state === 'generating' ? (
                    <div className={styles.spinner} />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>

              {state === 'error' && error && (
                <motion.p 
                  className={styles.error}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.p>
              )}

              {state === 'generating' && (
                <motion.p 
                  className={styles.status}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Generating your 3D object...
                </motion.p>
              )}
            </motion.div>

            {/* Example Prompts */}
            <motion.div 
              className={styles.examples}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {examplePrompts.map((example) => (
                <button
                  key={example}
                  className={styles.exampleButton}
                  onClick={() => handleExampleClick(example)}
                  disabled={state === 'generating'}
                >
                  {example}
                </button>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="preview"
            className={styles.previewContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {modelData && (
              <ModelPreview
                glbUrl={modelData.glbUrl}
                usdzUrl={modelData.usdzUrl}
                name={modelData.name}
                onReset={handleReset}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
