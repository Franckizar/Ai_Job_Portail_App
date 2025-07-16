'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
  Circle
} from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '500px',
}

const libraries = ['places', 'geometry']
// Note: You should use your own API key and keep it secure
const GOOGLE_MAPS_API_KEY = 'AIzaSyDCQUDD0UIpiWxl_KUm5FRRv71IJ2fY3jo';

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
  const markerRef = useRef(null)

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
    setError(null)
    
    // Try with high accuracy first
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        console.log('High accuracy location found:', newPosition, 'Accuracy:', pos.coords.accuracy)
        setPosition(newPosition)
        setAccuracy(pos.coords.accuracy)
        setError(null)
        setIsLoading(false)
        trackMapRequest(newPosition)
      },
      (err) => {
        console.error('High accuracy geolocation error:', err)
        // Fallback to lower accuracy
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const newPosition = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }
            console.log('Standard accuracy location found:', newPosition, 'Accuracy:', pos.coords.accuracy)
            setPosition(newPosition)
            setAccuracy(pos.coords.accuracy)
            setError(`Location found with lower accuracy: ${err.message}`)
            setIsLoading(false)
            trackMapRequest(newPosition)
          },
          (fallbackErr) => {
            console.error('All geolocation attempts failed:', fallbackErr)
            setError(`Location access failed: ${fallbackErr.message}. Please check your GPS/location settings.`)
            setIsLoading(false)
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
        )
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
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

  // Create Advanced Marker when position changes
  useEffect(() => {
    if (isLoaded && position && mapRef.current && window.google?.maps?.marker?.AdvancedMarkerElement) {
      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.map = null
      }
      
      // Create new advanced marker
      markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position,
        title: 'Your Current Location',
      })
      
      // Add click listener for info window
      markerRef.current.addListener('click', () => {
        setShowInfoWindow(true)
      })
    }
  }, [isLoaded, position])

  // Cleanup marker on unmount
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.map = null
      }
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
        <div className="flex space-x-2">
          <button 
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? 'Getting Location...' : 'Get Current Location'}
          </button>
          
          <button 
            onClick={() => {
              setPosition(null)
              setAccuracy(null)
              setError(null)
              setCount(null)
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
        
        <div className="bg-yellow-100 p-3 rounded text-sm">
          <p><strong>Tips for better accuracy:</strong></p>
          <ul className="list-disc list-inside mt-1">
            <li>Enable GPS/Location Services in your device settings</li>
            <li>Move to an open area (away from buildings)</li>
            <li>Make sure you're using HTTPS (not HTTP)</li>
            <li>Allow location permission when prompted</li>
            <li>Try refreshing the page if accuracy is poor</li>
          </ul>
        </div>
        
        {error && <p className="text-red-600">{error}</p>}
        
        {position && (
          <div className="text-sm text-gray-600">
            <p>Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}</p>
            {accuracy && (
              <p className={`${accuracy > 100 ? 'text-red-600' : accuracy > 50 ? 'text-yellow-600' : 'text-green-600'}`}>
                Accuracy: {Math.round(accuracy)} meters 
                {accuracy > 100 && ' (Poor - try moving to open area)'}
                {accuracy <= 50 && ' (Good)'}
                {accuracy > 50 && accuracy <= 100 && ' (Fair)'}
              </p>
            )}
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