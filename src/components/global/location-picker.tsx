import React, { useState } from 'react'
import { Input } from '../ui/input'
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api'

interface LocationPickerProps {
  field: {
    onChange: (value: { lat: number; lng: number } | null) => void;
    value: { lat: number; lng: number } | null;
  };
  isLoading: boolean;
}

const LocationPicker = ({ field, isLoading }: LocationPickerProps) => {
  const [searchText, setSearchText] = useState<string>('')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(field.value)
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace()
      if (place.geometry && place.geometry.location) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
        setLocation(newLocation)
        field.onChange(newLocation)
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
                  field.onChange(newLocation)
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
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              disabled={isLoading}
            />
          </Autocomplete>
        </div>
      </LoadScript>
    </div>
  )
}

export default LocationPicker