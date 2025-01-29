import React, { useState } from 'react'
import { Input } from '../ui/input'
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api'

const LocationPicker = ({field, isLoading} : {field:any, isLoading:boolean}) => {
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null)
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace()
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        setLocation({ lat, lng })
      }
    }
  }

  const defaultCenter = {
    lat: 19.4326,
    lng: -99.1332
  }

  return (
    <div className='space-y-2'>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
        libraries={['places']}
      >
        <GoogleMap
          center={location || defaultCenter}
          zoom={16}
          mapContainerStyle={{
            width: '100%',
            height: '250px',
            borderRadius: '0.375rem',
            position: 'relative',
            zIndex: 5
          }}
        >
          {location && (
            <Marker 
              position={location} 
              draggable={true}
              onDragEnd={(e) => {
                if (e.latLng) {
                  const newLocation = {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                  }
                  setLocation(newLocation)
                }
              }}
            />
          )}
        </GoogleMap>
        <div className="relative z-20">
          <Autocomplete
            onLoad={(autocomplete) => setAutocomplete(autocomplete)}
            onPlaceChanged={handlePlaceSelect}
            >
            <Input 
              placeholder="Buscar dirección" 
              value={field.value || ''}
              onChange={field.onChange}
              disabled={isLoading}
              />
          </Autocomplete>
        </div>
      </LoadScript>
    </div>
  )
}

export default LocationPicker