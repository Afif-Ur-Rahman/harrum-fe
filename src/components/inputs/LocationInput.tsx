"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Tooltip } from "@radix-ui/themes";
import { GoolgePlaceType } from "@/types/google";
import { googleAPI } from "@/api/api-call/google-api";
import { MapPin, Loader2, X, LocateFixed } from "lucide-react";

interface LocationInputProps {
  field: string;
  placeholder?: string;
  selectedPlace?: GoolgePlaceType | null;
  className?: string;
  disabled?: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
  field,
  placeholder = "Search for a location…",
  selectedPlace,
  className,
  disabled = false,
}) => {
  const form = useFormContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const suppressSearch = useRef(false);

  const [searchText, setSearchText] = useState(
    selectedPlace?.formatted_address || ""
  );
  const [places, setPlaces] = useState<GoolgePlaceType[]>([]);
  const [debouncedValue, setDebouncedValue] = useState(searchText);
  const [fetching, setFetching] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation || disabled) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lng } = pos.coords;
          const result = await googleAPI.getCoodinatesAddress(lat, lng);
          if (!result) return;
          const address = result.formatted_address || "";
          suppressSearch.current = true;
          setSearchText(address);
          setPlaces([]);
          form.setValue("address", address);
          form.setValue(field, { latitude: lat, longitude: lng });
          if (result.transformedAddress) {
            const t = result.transformedAddress;
            form.setValue("city", t.locality?.long_name);
            form.setValue("state", t.administrative_area_level_1?.long_name);
            form.setValue("country", t.country?.long_name);
            form.setValue("zip", t.postal_code?.long_name);
          }
        } catch {
          // silently ignore reverse-geocode failure
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  useEffect(() => {
    if (disabled) return;
    const handler = setTimeout(() => {
      if (suppressSearch.current) {
        suppressSearch.current = false;
        return;
      }
      setDebouncedValue(searchText);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchText, disabled]);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (disabled || debouncedValue.length < 3) {
        setPlaces([]);
        return;
      }
      setFetching(true);
      try {
        const res = await googleAPI.getPlaces(debouncedValue);
        if (res?.results) setPlaces(res.results);
      } catch {
        // silently ignore
      } finally {
        setFetching(false);
      }
    };
    fetchPlaces();
  }, [debouncedValue, disabled]);

  const handlePlaceSelect = useCallback(
    async (place: GoolgePlaceType) => {
      if (disabled) return;
      suppressSearch.current = true;
      setSearchText(place.formatted_address);
      setPlaces([]);
      form.setValue("address", place.formatted_address);

      const placeInfo = await googleAPI.getPlaceDetails(place.place_id);
      if (!placeInfo) return;

      form.setValue(field, {
        latitude: placeInfo.geometry.location.lat,
        longitude: placeInfo.geometry.location.lng,
      });
      form.setValue("address", placeInfo.formatted_address);
      form.setValue("city", placeInfo.transformedAddress?.locality?.long_name);
      form.setValue("state", placeInfo.transformedAddress?.administrative_area_level_1?.long_name);
      form.setValue("country", placeInfo.transformedAddress?.country?.long_name);
      form.setValue("zip", placeInfo.transformedAddress?.postal_code?.long_name);
    },
    [field, form, disabled]
  );

  const handleClear = () => {
    suppressSearch.current = false;
    setSearchText("");
    setDebouncedValue("");
    form.setValue("address", "");
    form.setValue(field, null);
    setPlaces([]);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPlaces([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addressValue = form?.watch("address") ?? searchText;

  return (
    <div ref={containerRef} className={`relative w-full ${className || ""}`}>
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm transition-all ${
          disabled
            ? "bg-gray-50 border-gray-100 text-gray-500 cursor-default"
            : "bg-white border-gray-200 text-gray-900 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/8 shadow-xs"
        }`}
      >
        {/* Left: address pin */}
        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />

        {/* Text input */}
        <input
          type="text"
          disabled={disabled}
          value={addressValue}
          placeholder={placeholder}
          onChange={(e) => {
            if (disabled) return;
            suppressSearch.current = false;
            setSearchText(e.target.value);
            form.setValue("address", e.target.value);
          }}
          className="flex-1 bg-transparent outline-none placeholder-gray-300 text-sm disabled:cursor-default min-w-0"
        />

        {/* Right: spinner / clear / locate */}
        {!disabled && fetching && (
          <Loader2 className="w-4 h-4 text-gray-400 animate-spin shrink-0" />
        )}
        {!disabled && !fetching && addressValue && (
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-300 hover:text-gray-500 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {!disabled && (
          <Tooltip content="Use current location">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locating}
              className="text-gray-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              {locating
                ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                : <LocateFixed className="w-4 h-4" />
              }
            </button>
          </Tooltip>
        )}
      </div>

      {!disabled && places.length > 0 && (
        <ul className="absolute top-full left-0 z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {places.map((place, idx) => (
            <li
              key={place.place_id}
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors text-sm ${
                idx !== 0 ? "border-t border-gray-100" : ""
              }`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handlePlaceSelect(place)}
            >
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <span className="text-gray-700 leading-snug">{place.formatted_address}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInput;
