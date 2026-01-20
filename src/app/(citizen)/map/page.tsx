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
          <Pin />
        </Marker>
      )),
    [zones],
  );

  return (
    <div className="w-full h-screen">
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
              <h3 className="font-bold text-lg mb-1 !text-neutral-600">
                {popupInfo.name}
              </h3>
              {popupInfo.description && (
                <p className="!text-gray-400 text-sm mb-2">
                  {popupInfo.description}
                </p>
              )}
              <div className="space-y-1 text-sm !bg-neutral-100 p-2 rounded">
                {popupInfo.rainfall && (
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      Lluvia:
                    </span>
                    <span className="!text-neutral-400">
                      {popupInfo.rainfall} mm
                    </span>
                  </div>
                )}
                {popupInfo.altitude && (
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Altitud:
                    </span>
                    <span className="!text-neutral-400">
                      {popupInfo.altitude} msnm
                    </span>
                  </div>
                )}
                {popupInfo.avgTemperature && (
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-orange-600 dark:text-orange-400">
                      Temp:
                    </span>
                    <span className="!text-neutral-400">
                      {popupInfo.avgTemperature}°C
                    </span>
                  </div>
                )}
              </div>
              {popupInfo.recommendations && (
                <div className="mt-2 text-xs !text-teal-500 italic border-t pt-2">
                  💡 {popupInfo.recommendations}
                </div>
              )}
              {popupInfo.city && (
                <div className="mt-2 text-xs text-gray-400 text-right">
                  📍 {popupInfo.city.name}
                </div>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
