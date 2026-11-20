"use client";

import { useMemo, useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import { cities, cityName, searchCities } from "@/data/cities";
import type { Copy, Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  copy: Copy;
  onChoose: (latitude: number, longitude: number) => void;
};

export function LocationSearch({ locale, copy, onChoose }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const results = useMemo(() => searchCities(query), [query]);

  function choose(city: (typeof cities)[number]) {
    setQuery(cityName(city, locale));
    setOpen(false);
    onChoose(city.latitude, city.longitude);
  }

  return (
    <div className="location-search">
      <div className="location-search-field">
        <Search size={15} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
            if (event.key === "Enter" && results[0]) { event.preventDefault(); choose(results[0]); }
          }}
          role="combobox"
          aria-label={copy.locationSearchLabel}
          aria-expanded={open && query.trim().length >= 2}
          aria-controls="location-results"
          aria-autocomplete="list"
          placeholder={copy.locationSearchPlaceholder}
          autoComplete="off"
        />
        {query && (
          <button type="button" className="location-search-clear" onClick={() => { setQuery(""); setOpen(false); }} aria-label={copy.locationSearchClear}>
            <X size={14} />
          </button>
        )}
      </div>
      {open && query.trim().length >= 2 && (
        <div className="location-results" id="location-results" role="listbox">
          {results.length ? results.map((city) => (
            <button key={city.id} type="button" role="option" aria-selected="false" onClick={() => choose(city)}>
              <MapPin size={14} aria-hidden="true" />
              <span>{cityName(city, locale)}</span>
              <small>{city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°</small>
            </button>
          )) : <p>{copy.locationSearchEmpty}</p>}
          <small className="location-search-note">{copy.locationSearchNote}</small>
        </div>
      )}
    </div>
  );
}
