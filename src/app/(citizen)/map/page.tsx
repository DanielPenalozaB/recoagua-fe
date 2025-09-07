'use client';

import { useState, useMemo } from 'react';
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl
} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

import Pin from '@/components/citizen/map/pin';

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '';

const cities = [
  {
    "city": "Centro de Cali",
    "state": "NY",
    "latitude": 3.4516,
    "longitude": -76.5320,
    "image": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Manhattan_skyline.jpg"
  },
  {
    "city": "Parque del Perro",
    "state": "CA",
    "latitude": 3.4402,
    "longitude": -76.5078,
    "image": "https://upload.wikimedia.org/wikipedia/commons/a/af/San_Francisco_from_Treasure_Island.jpg"
  }
];

export default function MapPage() {
  const [popupInfo, setPopupInfo] = useState<any | null>(null);

  const pins = useMemo(
    () =>
      cities.map((city, index) => (
        <Marker
          key={`marker-${index.toString()}`}
          longitude={city.longitude}
          latitude={city.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(city);
          }}
        >
          <Pin />
        </Marker>
      )),
    []
  );

  return (
    <div className="w-full h-screen">
      <Map
        initialViewState={{
          latitude: 3.4516,
          longitude: -76.5320,
          zoom: 13,
          bearing: 0,
          pitch: 0,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/standard"
        mapboxAccessToken={TOKEN}
      >
        {/* Controls */}
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        {/* Markers */}
        {pins}

        {/* Popup */}
        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            onClose={() => setPopupInfo(null)}
          >
            <div className="text-sm">
              <strong>{popupInfo.city}, {popupInfo.state}</strong> |{' '}
              <a
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
                href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${popupInfo.city}, ${popupInfo.state}`}
              >
                Wikipedia
              </a>
            </div>
            <img
              alt={popupInfo.city}
              className="mt-2 rounded"
              width="100%"
              src={popupInfo.image}
            />
          </Popup>
        )}
      </Map>
    </div>
  );
}
