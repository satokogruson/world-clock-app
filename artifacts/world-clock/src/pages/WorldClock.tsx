import { useState, useEffect, useRef } from "react";
import { MapPin, Globe, X, ChevronDown } from "lucide-react";

const CITIES = [
  { name: "New York", timezone: "America/New_York", country: "United States", code: "us" },
  { name: "Los Angeles", timezone: "America/Los_Angeles", country: "United States", code: "us" },
  { name: "Chicago", timezone: "America/Chicago", country: "United States", code: "us" },
  { name: "London", timezone: "Europe/London", country: "United Kingdom", code: "gb" },
  { name: "Paris", timezone: "Europe/Paris", country: "France", code: "fr" },
  { name: "Berlin", timezone: "Europe/Berlin", country: "Germany", code: "de" },
  { name: "Madrid", timezone: "Europe/Madrid", country: "Spain", code: "es" },
  { name: "Rome", timezone: "Europe/Rome", country: "Italy", code: "it" },
  { name: "Amsterdam", timezone: "Europe/Amsterdam", country: "Netherlands", code: "nl" },
  { name: "Stockholm", timezone: "Europe/Stockholm", country: "Sweden", code: "se" },
  { name: "Moscow", timezone: "Europe/Moscow", country: "Russia", code: "ru" },
  { name: "Dubai", timezone: "Asia/Dubai", country: "United Arab Emirates", code: "ae" },
  { name: "Mumbai", timezone: "Asia/Kolkata", country: "India", code: "in" },
  { name: "Bangkok", timezone: "Asia/Bangkok", country: "Thailand", code: "th" },
  { name: "Singapore", timezone: "Asia/Singapore", country: "Singapore", code: "sg" },
  { name: "Hong Kong", timezone: "Asia/Hong_Kong", country: "Hong Kong", code: "hk" },
  { name: "Beijing", timezone: "Asia/Shanghai", country: "China", code: "cn" },
  { name: "Shanghai", timezone: "Asia/Shanghai", country: "China", code: "cn" },
  { name: "Seoul", timezone: "Asia/Seoul", country: "South Korea", code: "kr" },
  { name: "Tokyo", timezone: "Asia/Tokyo", country: "Japan", code: "jp" },
  { name: "Sydney", timezone: "Australia/Sydney", country: "Australia", code: "au" },
  { name: "Melbourne", timezone: "Australia/Melbourne", country: "Australia", code: "au" },
  { name: "Auckland", timezone: "Pacific/Auckland", country: "New Zealand", code: "nz" },
  { name: "Toronto", timezone: "America/Toronto", country: "Canada", code: "ca" },
  { name: "Vancouver", timezone: "America/Vancouver", country: "Canada", code: "ca" },
  { name: "Mexico City", timezone: "America/Mexico_City", country: "Mexico", code: "mx" },
  { name: "São Paulo", timezone: "America/Sao_Paulo", country: "Brazil", code: "br" },
  { name: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires", country: "Argentina", code: "ar" },
  { name: "Cairo", timezone: "Africa/Cairo", country: "Egypt", code: "eg" },
  { name: "Johannesburg", timezone: "Africa/Johannesburg", country: "South Africa", code: "za" },
  { name: "Lagos", timezone: "Africa/Lagos", country: "Nigeria", code: "ng" },
  { name: "Nairobi", timezone: "Africa/Nairobi", country: "Kenya", code: "ke" },
  { name: "Riyadh", timezone: "Asia/Riyadh", country: "Saudi Arabia", code: "sa" },
  { name: "Istanbul", timezone: "Europe/Istanbul", country: "Turkey", code: "tr" },
  { name: "Tel Aviv", timezone: "Asia/Jerusalem", country: "Israel", code: "il" },
  { name: "Karachi", timezone: "Asia/Karachi", country: "Pakistan", code: "pk" },
  { name: "Dhaka", timezone: "Asia/Dhaka", country: "Bangladesh", code: "bd" },
  { name: "Jakarta", timezone: "Asia/Jakarta", country: "Indonesia", code: "id" },
  { name: "Kuala Lumpur", timezone: "Asia/Kuala_Lumpur", country: "Malaysia", code: "my" },
  { name: "Manila", timezone: "Asia/Manila", country: "Philippines", code: "ph" },
  { name: "Ho Chi Minh City", timezone: "Asia/Ho_Chi_Minh", country: "Vietnam", code: "vn" },
  { name: "Taipei", timezone: "Asia/Taipei", country: "Taiwan", code: "tw" },
  { name: "Colombo", timezone: "Asia/Colombo", country: "Sri Lanka", code: "lk" },
  { name: "Kathmandu", timezone: "Asia/Kathmandu", country: "Nepal", code: "np" },
  { name: "Helsinki", timezone: "Europe/Helsinki", country: "Finland", code: "fi" },
  { name: "Warsaw", timezone: "Europe/Warsaw", country: "Poland", code: "pl" },
  { name: "Prague", timezone: "Europe/Prague", country: "Czech Republic", code: "cz" },
  { name: "Vienna", timezone: "Europe/Vienna", country: "Austria", code: "at" },
  { name: "Zurich", timezone: "Europe/Zurich", country: "Switzerland", code: "ch" },
  { name: "Brussels", timezone: "Europe/Brussels", country: "Belgium", code: "be" },
  { name: "Lisbon", timezone: "Europe/Lisbon", country: "Portugal", code: "pt" },
  { name: "Athens", timezone: "Europe/Athens", country: "Greece", code: "gr" },
  { name: "Oslo", timezone: "Europe/Oslo", country: "Norway", code: "no" },
  { name: "Copenhagen", timezone: "Europe/Copenhagen", country: "Denmark", code: "dk" },
  { name: "Honolulu", timezone: "Pacific/Honolulu", country: "United States", code: "us" },
  { name: "Anchorage", timezone: "America/Anchorage", country: "United States", code: "us" },
  { name: "Denver", timezone: "America/Denver", country: "United States", code: "us" },
  { name: "Miami", timezone: "America/New_York", country: "United States", code: "us" },
];

const DEFAULT_CITIES = ["New York", "Melbourne", "Tokyo", "Paris"];

function formatOrdinalDate(timezone: string) {
  const now = new Date();
  const month = now.toLocaleDateString("en-US", { timeZone: timezone, month: "long" });
  const day = parseInt(now.toLocaleDateString("en-US", { timeZone: timezone, day: "numeric" }));
  const year = now.toLocaleDateString("en-US", { timeZone: timezone, year: "numeric" });
  const suffix =
    day % 10 === 1 && day !== 11 ? "st" :
    day % 10 === 2 && day !== 12 ? "nd" :
    day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${month} ${day}${suffix} ${year}`;
}

function formatTime(timezone: string) {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

interface CityData {
  name: string;
  timezone: string;
  country: string;
  code: string;
}

export default function WorldClock() {
  const [selectedCities, setSelectedCities] = useState<CityData[]>(() =>
    DEFAULT_CITIES.map((name) => CITIES.find((c) => c.name === name)!).filter(Boolean)
  );
  const [times, setTimes] = useState<Record<string, { date: string; time: string }>>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateTimes() {
      const next: Record<string, { date: string; time: string }> = {};
      for (const city of selectedCities) {
        next[city.name] = {
          date: formatOrdinalDate(city.timezone),
          time: formatTime(city.timezone),
        };
      }
      setTimes(next);
    }
    updateTimes();
    const id = setInterval(updateTimes, 1000);
    return () => clearInterval(id);
  }, [selectedCities]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = CITIES.filter(
    (city) =>
      !selectedCities.find((s) => s.name === city.name) &&
      (city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  function addCity(city: CityData) {
    setSelectedCities((prev) => [...prev, city]);
    setDropdownOpen(false);
    setSearchQuery("");
  }

  function removeCity(name: string) {
    setSelectedCities((prev) => prev.filter((c) => c.name !== name));
  }

  return (
    <div className="wc-page">
      <div className="wc-panel" role="main">
        {/* Title */}
        <div className="wc-title-row">
          <h1 className="wc-title">World Clock</h1>
          <div className="wc-title-icons">
            <MapPin size={18} className="icon-pin" />
            <Globe size={20} className="icon-globe" />
          </div>
        </div>

        {/* Selector */}
        <div className="wc-selector" ref={dropdownRef}>
          <button
            data-testid="button-add-city"
            className="wc-select-btn"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span className="wc-select-label">Select a city…</span>
            <ChevronDown size={14} className={`wc-chevron ${dropdownOpen ? "open" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="wc-dropdown" role="listbox">
              <div className="wc-search-wrap">
                <input
                  data-testid="input-city-search"
                  type="search"
                  placeholder="Search cities…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="wc-search"
                  autoFocus
                />
              </div>
              <ul className="wc-city-list">
                {filteredCities.length === 0 ? (
                  <li className="wc-no-results">No cities found</li>
                ) : (
                  filteredCities.map((city) => (
                    <li key={city.name}>
                      <button
                        data-testid={`option-city-${city.name.replace(/\s+/g, "-").toLowerCase()}`}
                        className="wc-city-option"
                        onClick={() => addCity(city)}
                        role="option"
                      >
                        <img
                          src={`https://flagcdn.com/20x15/${city.code}.png`}
                          alt={city.country}
                          className="wc-option-flag"
                        />
                        <span className="wc-option-name">{city.name}</span>
                        <span className="wc-option-country">{city.country}</span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* City rows */}
        <div className="wc-rows" data-testid="list-clocks">
          {selectedCities.length === 0 ? (
            <p className="wc-empty">No cities selected. Use the dropdown to add one.</p>
          ) : (
            selectedCities.map((city) => (
              <div
                key={city.name}
                className="wc-row"
                data-testid={`row-city-${city.name.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div className="wc-row-left">
                  <span data-testid={`text-city-${city.name}`} className="wc-row-city">
                    {city.name}
                  </span>
                  <span data-testid={`text-date-${city.name}`} className="wc-row-date">
                    {times[city.name]?.date ?? ""}
                  </span>
                </div>
                <div className="wc-row-right">
                  <img
                    src={`https://flagcdn.com/28x21/${city.code}.png`}
                    srcSet={`https://flagcdn.com/56x42/${city.code}.png 2x`}
                    alt={city.country}
                    className="wc-row-flag"
                  />
                  <span data-testid={`text-time-${city.name}`} className="wc-row-time">
                    {times[city.name]?.time ?? "--:--:-- --"}
                  </span>
                  <button
                    data-testid={`button-remove-${city.name.replace(/\s+/g, "-").toLowerCase()}`}
                    onClick={() => removeCity(city.name)}
                    className="wc-row-remove"
                    aria-label={`Remove ${city.name}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
