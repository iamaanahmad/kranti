"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import type { IssueRecord } from "@/lib/content-types";

// Leaflet types
interface LeafletMap {
  setView: (coords: [number, number], zoom: number) => LeafletMap;
  remove: () => void;
}

interface LeafletMarker {
  bindPopup: (content: string) => LeafletMarker;
  addTo: (map: LeafletMap) => LeafletMarker;
}

interface LeafletTileLayer {
  addTo: (map: LeafletMap) => LeafletTileLayer;
}

interface Leaflet {
  map: (id: string) => LeafletMap;
  tileLayer: (url: string, options: Record<string, unknown>) => LeafletTileLayer;
  marker: (coords: [number, number]) => LeafletMarker;
}

interface IssuesMapProps {
  issues: IssueRecord[];
}

export function IssuesMap({ issues }: IssuesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let L: Leaflet | null = null;

    const initMap = async () => {
      try {
        // Dynamically import Leaflet
        const leaflet = await import("leaflet");
        L = leaflet as unknown as Leaflet;

        // Import Leaflet CSS
        await import("leaflet/dist/leaflet.css");

        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize map centered on India
        const map = L.map(mapRef.current.id).setView([20.5937, 78.9629], 5);

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;

        // Add markers for issues with location data
        issues.forEach((issue) => {
          if (issue.location && Array.isArray(issue.location) && issue.location.length === 2) {
            const [lat, lng] = issue.location;
            if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
              const marker = L!.marker([lat, lng]);
              
              const popupContent = `
                <div style="min-width: 200px;">
                  <h3 style="font-weight: 600; margin-bottom: 8px; font-size: 14px;">${issue.title}</h3>
                  <p style="font-size: 12px; color: #64748b; margin-bottom: 8px;">${issue.district}, ${issue.state}</p>
                  <p style="font-size: 12px; margin-bottom: 8px;">${issue.description.substring(0, 100)}...</p>
                  <a href="/issues/${issue.slug}" style="color: #0ea5e9; font-size: 12px; font-weight: 500;">View Issue →</a>
                </div>
              `;
              
              marker.bindPopup(popupContent).addTo(map);
            }
          }
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize map:", err);
        setError("Failed to load map");
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [issues]);

  if (error) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-3xl border border-slate-900/10 bg-white/90 dark:border-white/10 dark:bg-slate-900/40">
        <div className="text-center">
          <MapPin className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-3xl border border-slate-900/10 bg-white/90 shadow-lg dark:border-white/10 dark:bg-slate-900/40">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-slate-900/80">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-600" />
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Loading map...</p>
          </div>
        </div>
      )}
      <div id="issues-map" ref={mapRef} className="h-full w-full" />
    </div>
  );
}
