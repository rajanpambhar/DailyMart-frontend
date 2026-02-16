
import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L, { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, Navigation, Search } from 'lucide-react';
import toast from 'react-hot-toast';

// Fix for Leaflet default icon not found
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
    onLocationSelect: (location: {
        lat: number;
        lng: number;
        address?: {
            street?: string;
            city?: string;
            state?: string;
            zipCode?: string;
            country?: string;
        };
    }) => void;
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (latlng: L.LatLng) => void }) {
    const [position, setPosition] = useState<L.LatLng | null>(null);
    const map = useMapEvents({
        click(e: LeafletMouseEvent) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
}

const LocationPicker = ({ onLocationSelect }: LocationPickerProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 20.5937, lng: 78.9629 }); // Default center (India)
    const [zoom, setZoom] = useState(5);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5&countrycodes=in`,
                {
                    headers: {
                        'User-Agent': 'DailyMart/1.0',
                        'Accept-Language': 'en'
                    }
                }
            );
            const data = await response.json();
            setSearchResults(data);
            if (data.length === 0) {
                toast.error("No results found");
            }
        } catch (error) {
            console.error("Search failed:", error);
            toast.error("Search failed");
        } finally {
            setIsSearching(false);
        }
    };

    const selectSearchResult = (result: any) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const latlng = new L.LatLng(lat, lng);

        setMapCenter({ lat, lng });
        setZoom(16);
        setCurrentPos({ lat, lng });
        setSearchResults([]);
        setSearchQuery('');

        // Use the address from the search result directly as it's often better formatted
        // but we still run our formatting logic to keep it consistent

        // ... reuse the formatting logic or call handleLocationSelect
        // simpler to just call handleLocationSelect with the new coordinates to ensure consistent parsing
        handleLocationSelect(latlng);
    };

    const handleGetCurrentLocation = () => {
        setIsLoading(true);
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // ... same as before
                const latlng = { lat: latitude, lng: longitude };
                setCurrentPos(latlng);
                setMapCenter(latlng);
                setZoom(15);
                handleLocationSelect(new L.LatLng(latitude, longitude));
                setIsLoading(false);
            },
            (error) => {
                console.error(error);
                toast.error("Unable to retrieve your location");
                setIsLoading(false);
            }
        );
    };

    const handleLocationSelect = async (latlng: L.LatLng) => {
        setIsLoading(true);
        setCurrentPos(latlng);
        try {
            // Reverse geocoding using Nominatim (OpenStreetMap)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'DailyMart/1.0',
                        'Accept-Language': 'en'
                    }
                }
            );
            const data = await response.json();

            if (data && data.address) {
                const addr = data.address;

                // Construct Street Address by removing City, State, Zip, Country from Display Name
                // This preserves the natural ordering and specific local details provided by OSM
                let streetAddr = data.display_name;
                const removeParts = [
                    addr.city, addr.town, addr.village, addr.municipality,
                    addr.state, addr.distict, addr.province, addr.region,
                    addr.postcode, addr.postal_code,
                    addr.country, addr.country_code
                ].filter(Boolean);

                removeParts.forEach(part => {
                    if (part) {
                        // Case insensitive replace
                        const regex = new RegExp(`,?\\s*${part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi');
                        streetAddr = streetAddr.replace(regex, '');
                    }
                });

                // Clean up trailing/leading commas
                streetAddr = streetAddr.replace(/^,\s*|,\s*$/g, '').trim();

                // Fallback if subtraction left nothing (rare)
                if (!streetAddr || streetAddr.length < 5) {
                    streetAddr = [
                        addr.amenity || addr.shop || addr.building || addr.name,
                        addr.house_number,
                        addr.road || addr.street,
                        addr.suburb || addr.neighbourhood
                    ].filter(Boolean).join(', ');
                }

                onLocationSelect({
                    lat: latlng.lat,
                    lng: latlng.lng,
                    address: {
                        street: streetAddr,
                        city: addr.city || addr.town || addr.village || addr.municipality || addr.district || addr.county || addr.state_district,
                        state: addr.state || addr.region || addr.province,
                        zipCode: addr.postcode || addr.postal_code,
                        country: addr.country
                    }
                });
                toast.success("Location fetched!");
            } else {
                onLocationSelect({ lat: latlng.lat, lng: latlng.lng });
                toast('Location selected. Please fill address details.', { icon: '📍' });
            }

        } catch (error) {
            console.error("Reverse geocoding failed:", error);
            onLocationSelect({ lat: latlng.lat, lng: latlng.lng });
            toast.error("Could not fetch address details. Please enter manually.");
        } finally {
            setIsLoading(false);
        }
    };

    // Use a key to force re-render MapContainer when center changes significantly to avoid "grey map" issues sometimes
    const mapKey = useMemo(() => `${mapCenter.lat}-${mapCenter.lng}-${zoom}`, [mapCenter, zoom]);

    // Gujarat Bounds
    const gujaratBounds = new L.LatLngBounds(
        [20.1, 68.1], // South West
        [24.7, 74.5] // North East
    );

    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 relative z-[1001]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search area in Gujarat..."
                        className="flex-1 bg-dark-700 border border-dark-600 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary-500" />}
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="px-4 py-2 bg-dark-600 hover:bg-dark-500 text-white text-sm rounded-lg transition-colors border border-dark-600"
                    >
                        Search
                    </button>

                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-dark-700 border border-dark-600 rounded-lg shadow-xl max-h-60 overflow-y-auto z-[2000]">
                            {searchResults.map((result: any, i) => (
                                <button
                                    key={i}
                                    onClick={() => selectSearchResult(result)}
                                    className="w-full text-left p-2 hover:bg-dark-600 text-sm border-b border-dark-600 last:border-0"
                                >
                                    <p className="text-white font-medium truncate">{result.display_name.split(',')[0]}</p>
                                    <p className="text-xs text-gray-400 truncate">{result.display_name}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-400">
                        Select Location on Map
                    </label>
                    <button
                        type="button"
                        onClick={handleGetCurrentLocation}
                        disabled={isLoading}
                        className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                    >
                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                        Detect my location
                    </button>
                </div>
            </div>

            <div className="h-[300px] w-full rounded-lg overflow-hidden border border-dark-600 relative z-0">
                <MapContainer
                    key={mapKey}
                    center={[mapCenter.lat, mapCenter.lng]}
                    zoom={zoom}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                    maxBounds={gujaratBounds}
                    minZoom={7}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker onLocationSelect={handleLocationSelect} />
                    {currentPos && <Marker position={currentPos} />}
                </MapContainer>

                {/* Overlay instructions if needed */}
                <div className="absolute bottom-2 left-2 bg-dark-900/80 p-1 px-2 rounded text-[10px] text-gray-300 z-[1000] pointer-events-none">
                    Click on map to pin location
                </div>
            </div>
        </div>
    );
};

export default LocationPicker;
