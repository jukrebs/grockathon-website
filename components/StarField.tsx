'use client'

import { useEffect, useState } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: 'small' | 'medium' | 'large'
  duration: number
  delay: number
}

interface ShootingStar {
  id: number
  x: number
  y: number
  duration: number
  delay: number
}

export default function StarField() {
  const [stars, setStars] = useState<Star[]>([])
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])

  useEffect(() => {
    // Generate static stars
    const generatedStars: Star[] = []
    const starCount = 150

    for (let i = 0; i < starCount; i++) {
      const sizes: ('small' | 'medium' | 'large')[] = ['small', 'small', 'small', 'medium', 'medium', 'large']
      generatedStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: sizes[Math.floor(Math.random() * sizes.length)],
        duration: 2 + Math.random() * 4,
        delay: Math.random() * 5,
      })
    }
    setStars(generatedStars)

    // Shooting stars interval
    const createShootingStar = () => {
      const newStar: ShootingStar = {
        id: Date.now(),
        x: Math.random() * 70 + 15,
        y: Math.random() * 30,
        duration: 0.8 + Math.random() * 0.4,
        delay: 0,
      }
      setShootingStars(prev => [...prev, newStar])

      // Remove after animation
      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== newStar.id))
      }, 2000)
    }

    // Random shooting stars every 3-8 seconds
    const scheduleNext = () => {
      const delay = 3000 + Math.random() * 5000
      setTimeout(() => {
        createShootingStar()
        scheduleNext()
      }, delay)
    }

    // Initial shooting star after 2 seconds
    setTimeout(createShootingStar, 2000)
    scheduleNext()
  }, [])

  return (
    <div className="stars-container">
      <div className="stars">
        {stars.map(star => (
          <div
            key={star.id}
            className={`star ${star.size}`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
              '--base-opacity': star.size === 'small' ? '0.4' : star.size === 'medium' ? '0.6' : '0.8',
            } as React.CSSProperties}
          />
        ))}
        {shootingStars.map(star => (
          <div
            key={star.id}
            className="shooting-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              '--shoot-duration': `${star.duration}s`,
              '--shoot-delay': `${star.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  )
}
