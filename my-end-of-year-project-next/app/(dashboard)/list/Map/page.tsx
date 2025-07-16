'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
  Circle,
  Marker
} from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '500px',
}

const libraries = ['places', 'geometry']
// Note: You should use your own API key and keep it secure
// Get from environment variable
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const MapWithCount = () => {
  const [position, setPosition] = useState(null)
  const [count, setCount] = useState(null)
  const [error, setError] = useState(null)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showInfoWindow, setShowInfoWindow] = useState(false)
  const [accuracy, setAccuracy] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const mapRef = useRef(null)
  const watchIdRef = useRef(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  })

  useEffect(() => setIsClient(true), [])

  const onLoad = useCallback((mapInstance) => {
    mapRef.current = mapInstance
    mapInstance.setOptions({
      zoomControl: true,
      streetViewControl: true,
      mapTypeControl: true,
      fullscreenControl: true,
    })
  }, [])

  const onUnmount = useCallback(() => {
    mapRef.current = null
  }, [])

  const trackMapRequest = useCallback(async (location) => {
    try {
      const response = await fetch('http://localhost:8088/api/v1/auth/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          location,
          userAgent: navigator.userAgent,
        }),
      })
      const data = await response.json()
      setCount(typeof data === 'number' ? data : data.count)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      console.error('Backend error:', err)
      setError('Failed to log map request to backend')
    }
  }, [])

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        console.log('Location found:', newPosition) // Debug log
        setPosition(newPosition)
        setAccuracy(pos.coords.accuracy)
        setError(null)
        setIsLoading(false)
        trackMapRequest(newPosition)
      },
      (err) => {
        console.error('Geolocation error:', err)
        setError(`Location access failed: ${err.message}`)
        setIsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    )
  }, [trackMapRequest])

  const startWatchingPosition = useCallback(() => {
    if (!navigator.geolocation) return

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        setPosition(newPosition)
        setAccuracy(pos.coords.accuracy)
        setLastUpdated(new Date().toLocaleTimeString())
      },
      (err) => {
        console.error('Watch position error:', err)
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 30000 }
    )
  }, [])

  const stopWatchingPosition = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isClient) return
    let isMounted = true
    const initialize = async () => {
      if (isMounted) {
        getCurrentLocation()
        startWatchingPosition()
      }
    }
    initialize()
    return () => { 
      isMounted = false
      stopWatchingPosition()
    }
  }, [isClient, getCurrentLocation, startWatchingPosition, stopWatchingPosition])

  if (!isClient) {
    return <div className="text-center p-4">Loading...</div>
  }

  if (loadError) {
    return <div className="text-red-600 p-4">Failed to load Google Maps: {loadError.message}</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📍 Google Maps Tracker</h1>
      
      <div className="mb-4 space-y-2">
        <button 
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Getting Location...' : 'Get Current Location'}
        </button>
        
        {error && <p className="text-red-600">{error}</p>}
        
        {position && (
          <div className="text-sm text-gray-600">
            <p>Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}</p>
            {accuracy && <p>Accuracy: {Math.round(accuracy)} meters</p>}
            {lastUpdated && <p>Last updated: {lastUpdated}</p>}
          </div>
        )}
        
        {count !== null && (
          <p className="text-green-700">Total Requests: {count}</p>
        )}
      </div>

      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={position || { lat: 0, lng: 0 }}
          zoom={position ? 16 : 2}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {position && (
            <>
              <Marker
                position={position}
                title="Your Current Location"
                onClick={() => setShowInfoWindow(true)}
              />
              
              {showInfoWindow && (
                <InfoWindow
                  position={position}
                  onCloseClick={() => setShowInfoWindow(false)}
                >
                  <div>
                    <h3>Your Location</h3>
                    <p>Lat: {position.lat.toFixed(6)}</p>
                    <p>Lng: {position.lng.toFixed(6)}</p>
                    {accuracy && <p>Accuracy: {Math.round(accuracy)}m</p>}
                  </div>
                </InfoWindow>
              )}
              
              {accuracy && (
                <Circle
                  center={position}
                  radius={accuracy}
                  options={{
                    fillColor: '#3b82f6',
                    fillOpacity: 0.1,
                    strokeColor: '#3b82f6',
                    strokeOpacity: 0.5,
                    strokeWeight: 1,
                  }}
                />
              )}
            </>
          )}
        </GoogleMap>
      ) : (
        <div className="h-96 bg-gray-200 flex items-center justify-center">
          <p>Loading map...</p>
        </div>
      )}
    </div>
  )
}

export default MapWithCount