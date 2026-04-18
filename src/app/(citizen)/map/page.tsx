"use client";

import { useEffect, useMemo, useState } from "react";
import Map, {
  FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import Pin from "@/components/citizen/map/pin";
import { zoneService } from "@/services/zone.service";
import type { Zone } from "@/types/zone";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

export default function MapPage() {
  const [popupInfo, setPopupInfo] = useState<Zone | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await zoneService.getZones({ limit: 100 });
        setZones(response.data);
      } catch (error) {
        console.error("Failed to fetch zones:", error);
      }
    };

    fetchZones();
  }, []);

  const pins = useMemo(
    () =>
      zones.map((zone) => (
        <Marker
          key={`marker-${zone.id}`}
          longitude={zone.longitude}
          latitude={zone.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(zone);
          }}
        >
          <button
            type="button"
            aria-label={`Ver detalles de la zona: ${zone.name}`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-full"
          >
            <Pin />
          </button>
        </Marker>
      )),
    [zones],
  );

  return (
    <div className="w-full h-[calc(100svh-4rem)] flex flex-col">
      {/* Alternativa textual accesible para tecnologías asistivas (WCAG 1.1.1) */}
      <details className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-2 focus-within:left-2 focus-within:z-[500] focus-within:bg-white focus-within:p-4 focus-within:rounded-lg focus-within:shadow-lg focus-within:max-w-sm">
        <summary className="font-semibold cursor-pointer">
          Ver lista de zonas de recolección
        </summary>
        {zones.length === 0 ? (
          <p className="text-sm text-neutral-600 mt-2">Cargando zonas…</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm text-neutral-700 max-h-64 overflow-y-auto">
            {zones.map((zone) => (
              <li key={zone.id} className="border-b pb-1">
                <strong>{zone.name}</strong>
                {zone.description && <p className="text-xs text-neutral-500">{zone.description}</p>}
                {zone.rainfall && <p className="text-xs">Lluvia: {zone.rainfall} mm/año</p>}
                {zone.city && <p className="text-xs">Ciudad: {zone.city.name}</p>}
              </li>
            ))}
          </ul>
        )}
      </details>

      <div
        role="application"
        aria-label="Mapa interactivo de zonas de recolección de agua en Cali"
        aria-roledescription="mapa"
        className="flex-1 w-full min-h-[400px]"
      >
        <Map
          initialViewState={{
            latitude: 3.4516,
            longitude: -76.532,
            zoom: 11,
            bearing: 0,
            pitch: 0,
          }}
          style={{ width: "100%", height: "100%" }}
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
              <div className="p-2 max-w-xs">
                <h2 className="font-bold text-lg mb-1 !text-neutral-600">
                  {popupInfo.name}
                </h2>
                {popupInfo.description && (
                  <p className="!text-gray-400 text-sm mb-2">
                    {popupInfo.description}
                  </p>
                )}
                <dl className="space-y-1 text-sm !bg-neutral-100 p-2 rounded">
                  {popupInfo.rainfall && (
                    <div className="flex justify-between gap-2">
                      <dt className="font-medium text-blue-600 dark:text-blue-400">
                        Lluvia:
                      </dt>
                      <dd className="!text-neutral-400">
                        {popupInfo.rainfall} mm
                      </dd>
                    </div>
                  )}
                  {popupInfo.altitude && (
                    <div className="flex justify-between gap-2">
                      <dt className="font-medium text-gray-600 dark:text-gray-400">
                        Altitud:
                      </dt>
                      <dd className="!text-neutral-400">
                        {popupInfo.altitude} msnm
                      </dd>
                    </div>
                  )}
                  {popupInfo.avgTemperature && (
                    <div className="flex justify-between gap-2">
                      <dt className="font-medium text-orange-600 dark:text-orange-400">
                        Temp:
                      </dt>
                      <dd className="!text-neutral-400">
                        {popupInfo.avgTemperature}°C
                      </dd>
                    </div>
                  )}
                </dl>
                {popupInfo.recommendations && (
                  <div className="mt-2 text-xs !text-teal-500 italic border-t pt-2">
                    <span aria-hidden="true">💡 </span>
                    {popupInfo.recommendations}
                  </div>
                )}
                {popupInfo.city && (
                  <div className="mt-2 text-xs text-gray-400 text-right">
                    <span aria-hidden="true">📍 </span>
                    {popupInfo.city.name}
                  </div>
                )}
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}
