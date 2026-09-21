import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Navigation, Crosshair, MapPin, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { Coordinates } from '../../types';
import { cn } from '../../lib/utils';

export interface MapPickerProps {
  coordinates?: Coordinates;
  onChange?: (coords: Coordinates) => void;
  readOnly?: boolean;
  className?: string;
  showTooltip?: boolean;
}

const DEFAULT_COORDINATES: Coordinates = {
  lat: -6.2841,
  lng: 106.7265,
};

export const MapPicker: React.FC<MapPickerProps> = ({
  coordinates = DEFAULT_COORDINATES,
  onChange,
  readOnly = false,
  className,
  showTooltip = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const geoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hasError, setHasError] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [geoMessage, setGeoMessage] = useState<string>('');

  const currentCoords = coordinates || DEFAULT_COORDINATES;

  // Initialize Leaflet map
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(containerRef.current, {
        center: [currentCoords.lat, currentCoords.lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Custom Leaflet DivIcon with pulse radar and pin
      const radarIcon = L.divIcon({
        className: 'custom-leaflet-marker-wrapper',
        html: `
          <div data-testid="map-radar-marker" class="relative flex items-center justify-center w-9 h-9 -ml-4 -mt-4 cursor-pointer select-none">
            <span class="absolute inline-flex h-8 w-8 rounded-full bg-[#34C759]/40 animate-ping"></span>
            <span class="absolute inline-flex h-6 w-6 rounded-full bg-[#34C759]/20 animate-pulse"></span>
            <div class="relative z-10 w-8 h-8 rounded-full bg-forest border-2 border-white shadow-md flex items-center justify-center text-lime">
              <svg class="w-4 h-4 text-lime fill-current" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        tooltipAnchor: [0, -20],
      });

      const marker = L.marker([currentCoords.lat, currentCoords.lng], {
        icon: radarIcon,
        draggable: !readOnly,
      }).addTo(map);

      if (showTooltip) {
        marker.bindTooltip('Titik Kunjungan Dokter (Akurat ±3m)', {
          permanent: false,
          direction: 'top',
          className: 'bg-forest text-white text-xs font-semibold px-2 py-1 rounded-md shadow',
        });
      }

      // Drag event handler
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        const updated = {
          lat: Number(pos.lat.toFixed(4)),
          lng: Number(pos.lng.toFixed(4)),
        };
        onChange?.(updated);
      });

      // Map click event handler
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (readOnly) return;
        const updated = {
          lat: Number(e.latlng.lat.toFixed(4)),
          lng: Number(e.latlng.lng.toFixed(4)),
        };
        marker.setLatLng([updated.lat, updated.lng]);
        onChange?.(updated);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Force resize calculation after mount
      resizeTimerRef.current = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);
    } catch (err) {
      console.warn('Leaflet map initialization error, falling back to graceful UI:', err);
      setHasError(true);
    }

    return () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
        resizeTimerRef.current = null;
      }
      if (geoTimerRef.current) {
        clearTimeout(geoTimerRef.current);
        geoTimerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Synchronize map & marker if coordinates change from parent
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (
        Math.abs(currentPos.lat - currentCoords.lat) > 0.0001 ||
        Math.abs(currentPos.lng - currentCoords.lng) > 0.0001
      ) {
        markerRef.current.setLatLng([currentCoords.lat, currentCoords.lng]);
        mapInstanceRef.current.setView([currentCoords.lat, currentCoords.lng]);
      }
    }
  }, [currentCoords.lat, currentCoords.lng]);

  // Current location handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      setGeoMessage('Geolocation tidak didukung oleh perangkat ini.');
      setTimeout(() => setGeoStatus('idle'), 4000);
      return;
    }

    setIsLocating(true);
    setGeoStatus('loading');
    setGeoMessage('Mendeteksi GPS...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const newCoords: Coordinates = {
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4)),
        };
        onChange?.(newCoords);

        if (mapInstanceRef.current && markerRef.current) {
          markerRef.current.setLatLng([newCoords.lat, newCoords.lng]);
          mapInstanceRef.current.setView([newCoords.lat, newCoords.lng], 16);
        }

        setGeoStatus('success');
        setGeoMessage('Lokasi berhasil diperbarui!');
        if (geoTimerRef.current) clearTimeout(geoTimerRef.current);
        geoTimerRef.current = setTimeout(() => setGeoStatus('idle'), 3500);
      },
      (_error) => {
        setIsLocating(false);
        setGeoStatus('error');
        // Graceful fallback to Tangsel
        onChange?.(DEFAULT_COORDINATES);
        if (mapInstanceRef.current && markerRef.current) {
          markerRef.current.setLatLng([DEFAULT_COORDINATES.lat, DEFAULT_COORDINATES.lng]);
          mapInstanceRef.current.setView([DEFAULT_COORDINATES.lat, DEFAULT_COORDINATES.lng], 15);
        }
        setGeoMessage('Izin GPS tidak aktif. Menggunakan titik Tangsel.');
        if (geoTimerRef.current) clearTimeout(geoTimerRef.current);
        geoTimerRef.current = setTimeout(() => setGeoStatus('idle'), 4000);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  };

  const handleCenterMarker = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([currentCoords.lat, currentCoords.lng], 16);
    }
  };

  return (
    <div
      data-testid="map-picker-container"
      className={cn(
        'w-full h-[210px] min-h-[210px] rounded-2xl overflow-hidden border border-border-hairline relative bg-[#E9EBE8] select-none flex flex-col justify-between shadow-2xs',
        className
      )}
    >
      {/* Map DOM target container */}
      <div
        ref={containerRef}
        data-testid="map-canvas"
        className="absolute inset-0 w-full h-full z-0"
      />

      {/* Fallback pattern / radar marker placeholder if Leaflet DOM is headless/errored */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#E5EAE3] z-0">
          <div
            data-testid="map-radar-marker"
            className="relative flex items-center justify-center w-10 h-10"
          >
            <span className="absolute inline-flex h-10 w-10 rounded-full bg-[#34C759]/40 animate-ping" />
            <span className="relative z-10 w-8 h-8 rounded-full bg-forest border-2 border-white shadow-md flex items-center justify-center text-lime">
              <MapPin className="w-4 h-4 text-lime" />
            </span>
          </div>
        </div>
      )}

      {/* Top Floating Controls */}
      <div className="relative z-10 p-2.5 flex items-start justify-between gap-2 pointer-events-none">
        {/* Geolocation Button */}
        <button
          type="button"
          data-testid="btn-use-current-location"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="pointer-events-auto min-h-[44px] px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-border-hairline text-xs font-semibold text-forest shadow-sm hover:bg-[#F2FBF5] active:scale-96 transition-all inline-flex items-center gap-1.5 btn-tactile"
        >
          {isLocating ? (
            <Crosshair className="w-4 h-4 text-forest animate-spin" />
          ) : (
            <Navigation className="w-4 h-4 text-forest" />
          )}
          <span>{isLocating ? 'Mendeteksi...' : '⌖ Gunakan Lokasi Saat Ini'}</span>
        </button>

        {/* Status Toast / Badge */}
        {geoStatus !== 'idle' && (
          <div
            className={cn(
              'pointer-events-auto px-2.5 py-1.5 rounded-lg text-[11px] font-medium shadow-sm flex items-center gap-1 animate-fade-in backdrop-blur-md',
              geoStatus === 'loading' && 'bg-surface/90 text-ink-primary border border-border-subtle',
              geoStatus === 'success' && 'bg-[#E8F8EE] text-[#166534] border border-[#A7F3D0]',
              geoStatus === 'error' && 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]'
            )}
          >
            {geoStatus === 'loading' && <Crosshair className="w-3.5 h-3.5 animate-spin text-forest" />}
            {geoStatus === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-[#166534]" />}
            {geoStatus === 'error' && <AlertCircle className="w-3.5 h-3.5 text-[#991B1B]" />}
            <span className="truncate max-w-[180px]">{geoMessage}</span>
          </div>
        )}
      </div>

      {/* Bottom Floating Coordinate Pill */}
      <div className="relative z-10 p-2.5 pointer-events-none">
        <button
          type="button"
          data-testid="map-coordinates-pill"
          onClick={handleCenterMarker}
          className="pointer-events-auto w-full min-h-[44px] px-3 py-2 rounded-xl bg-forest/90 backdrop-blur-md text-white text-xs font-medium shadow-md flex items-center justify-between gap-2 btn-tactile hover:bg-forest transition-colors"
        >
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-lime shrink-0">📍</span>
            <span className="truncate font-semibold tracking-tight text-[11.5px]">
              GPS: {currentCoords.lat}° S, {currentCoords.lng}° E (Tangsel)
            </span>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[11px] text-lime font-bold shrink-0">
            <span>Ubah Titik</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default MapPicker;
