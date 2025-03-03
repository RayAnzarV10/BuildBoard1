import React, { useState } from 'react'
import { Input } from '../ui/input'
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api'

interface LocationPickerProps {
  field: {
    onChange: (value: { lat: number; lng: number } | null) => void;
    value: { lat: number; lng: number } | null;
  };
  onAddressChange: (address: string) => void;
  isLoading: boolean;
}

const LocationPicker = ({ field, onAddressChange, isLoading }: LocationPickerProps) => {
  const [searchText, setSearchText] = useState<string>('')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(field.value)
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null)

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace()
      if (place.geometry && place.geometry.location) {
        const newLocation = {
          lat: Number(place.geometry.location.lat()),
          lng: Number(place.geometry.location.lng())
        }
        setLocation(newLocation)
        field.onChange({
          lat: newLocation.lat,
          lng: newLocation.lng
        })
        if (place.formatted_address) {
          setSearchText(place.formatted_address)
          onAddressChange(place.formatted_address)
        }
      }
    }
  }

  const updateAddressFromLatLng = (latLng: google.maps.LatLngLiteral) => {
    if (geocoder) {
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const formattedAddress = results[0].formatted_address
          setSearchText(formattedAddress)
          onAddressChange(formattedAddress)
        }
      })
    }
  }

  const handleMarkerDrag = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLocation = {
        lat: Number(e.latLng.lat()),
        lng: Number(e.latLng.lng())
      }
      setLocation(newLocation)
      field.onChange({
        lat: newLocation.lat,
        lng: newLocation.lng
      })
      updateAddressFromLatLng(newLocation)
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
          onLoad={() => {
            setGeocoder(new google.maps.Geocoder())
          }}
          center={location || defaultCenter}
          zoom={16}
          mapTypeId="satellite"
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
              onDragEnd={handleMarkerDrag}
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