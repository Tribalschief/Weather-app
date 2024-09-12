'use client'
import React, { FormEvent, useState } from 'react'
import styles from './Weather.module.css'


interface WeatherData {
  name: string
  main: {
    temp: number
  }
  weather: Array<{ description: string }>
}

function Weather() {
  const [city, setCity] = useState<string>('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedLocation = city.trim()
    if (trimmedLocation === "") {
      setError('Please enter a valid location')
      setWeather(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`)
      if (!response.ok) {
        throw new Error('Network response was not ok or City is Not Found')
      }
      const data = await response.json()
      const wData: WeatherData = {
        name: data.location.name,
        main: {
          temp: data.current.temp_c
        },
        weather: [{ description: data.current.condition.text }]
      }
      setWeather(wData)
    } catch (err) {
      setError('Error fetching weather data')
      console.error('Error Fetching Weather', err)
    } finally {
      setLoading(false)
    }
  }

  
    return (
      <div className={styles['weather-app']}>
        <div className={styles.content}>
          <h1 className={styles.title}>Weather App</h1>
          <form onSubmit={handleSearch} className={styles['search-form']}>
            <input
              type='text'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder='Enter City'
              className={styles['search-input']}
            />
            <button type='submit' disabled={loading} className={styles['search-button']}>
              {loading ? 'Loading...' : 'Get Weather'}
            </button>
          </form>
          {error && <p className={styles.error}>{error}</p>}
          {weather && (
            <div className={styles['weather-info']}>
              <h2 className={styles['city-name']}>{weather.name}</h2>
              <p className={styles.temperature}>{weather.main.temp}°C</p>
              <p className={styles.description}>{weather.weather[0].description}</p>
            </div>
          )}
        </div>
      </div>
    )
  
}

export default Weather