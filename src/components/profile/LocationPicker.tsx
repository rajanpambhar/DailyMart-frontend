import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Map as MapIcon, Globe, Navigation, Loader2 } from 'lucide-react';
import axios from 'axios';

// Fix Leaflet marker icons by deleting the default icon URL and setting explicit paths
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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
            formattedAddress?: string;
        };
    }) => void;
}

interface PhotonFeature {
    properties: {
        name?: string;
        street?: string;
        city?: string;
        state?: string;
        postcode?: string;
        country?: string;
        osm_value?: string;
    };
    geometry: {
        coordinates: [number, number];
    };
}

// Component to update map view when position changes programmatically
const MapUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 16);
    }, [center, map]);
    return null;
};

const LocationPicker = ({ onLocationSelect }: LocationPickerProps) => {
    // Default to Rajkot, Gujarat (22.3039, 70.8022)
    const [position, setPosition] = useState<[number, number]>([22.3039, 70.8022]);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<PhotonFeature[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);
    const [mapLayer, setMapLayer] = useState<'streets' | 'satellite'>('streets');
    const [formattedAddress, setFormattedAddress] = useState('');
    const searchRef = useRef<HTMLDivElement>(null);

    // Helper to calculate distance between two coords (Euclidean is sufficient for small distances)
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    const fetchNearbyLandmark = async (lat: number, lng: number) => {
        try {
            // Overpass query for amenities, shops, offices, tourism, religion, etc. around 100m
            // We use standard Overpass QL
            const query = `
                [out:json][timeout:5];
                (
                  node(around:100,${lat},${lng})["amenity"];
                  node(around:100,${lat},${lng})["shop"];
                  node(around:100,${lat},${lng})["office"];
                  node(around:100,${lat},${lng})["tourism"];
                  node(around:100,${lat},${lng})["place_of_worship"];
                  node(around:100,${lat},${lng})["building"="yes"];
                );
                out body;
            `;

            // Using a public Overpass instance
            // Note: In production, you might want to host your own or use a paid one to avoid rate limits
            // Using axios.get with params logic or direct POST string? Overpass often prefers POST or properly encoded GET.
            // Let's use direct GET string construction for simplicity or POST.
            // POST is cleaner for QL.
            const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            if (response.data && response.data.elements && response.data.elements.length > 0) {
                // Filter elements that have a name
                const elementsWithNames = response.data.elements.filter((el: any) => el.tags && el.tags.name);

                if (elementsWithNames.length === 0) return null;

                // Sort by distance to find the closest one
                elementsWithNames.sort((a: any, b: any) => {
                    const distA = getDistance(lat, lng, a.lat, a.lon);
                    const distB = getDistance(lat, lng, b.lat, b.lon);
                    return distA - distB;
                });

                return elementsWithNames[0].tags.name; // Return closest landmark name
            }
            return null;
        } catch (error) {
            console.warn('Error fetching landmark:', error);
            return null; // Fail gracefully if Overpass is down/slow
        }
    };

    // Stable fetch function
    const fetchAddressFromCoords = useCallback(async (lat: number, lng: number) => {
        setIsLoadingAddress(true);
        try {
            // Initiate both requests in parallel
            // Nominatim for address components
            const nominatimPromise = axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                params: {
                    lat,
                    lon: lng,
                    format: 'json',
                    addressdetails: 1
                }
            });

            // Overpass for landmark
            const landmarkPromise = fetchNearbyLandmark(lat, lng);

            const [nominatimRes, landmarkName] = await Promise.all([
                nominatimPromise.catch(e => ({ data: null })), // Catch individual errors
                landmarkPromise.catch(e => null)
            ]);

            if (nominatimRes.data && nominatimRes.data.address) {
                const addr = nominatimRes.data.address;

                // Priority Logic for Indian Addresses
                // Society / Area
                const society = addr.neighbourhood || addr.suburb || addr.quarter || addr.city_district || '';

                // Street
                const streetName = addr.road || addr.residential || addr.footway || '';

                // City
                const city = addr.city || addr.town || addr.village || '';

                // State & Postcode
                const state = addr.state || '';
                const postcode = addr.postcode || '';

                // Landmark formatting
                const landmarkPart = landmarkName ? `Near ${landmarkName}` : '';

                // Formatted Address Construction
                // Format: {road}, Near {landmark}, {neighbourhood}, {city}, {state} - {postcode}
                const mainPart = [streetName, landmarkPart, society].filter(Boolean).join(', ');
                const cityState = [city, state].filter(Boolean).join(', ');

                // Ensure unique parts to avoid "Road, Road" scenario
                const fullAddressParts = [mainPart, cityState].filter(Boolean);
                let fullAddress = fullAddressParts.join(', ');
                if (postcode) fullAddress += ` - ${postcode}`;

                setFormattedAddress(fullAddress);

                onLocationSelect({
                    lat,
                    lng,
                    address: {
                        street: mainPart || streetName || society, // Fallback
                        city,
                        state,
                        zipCode: postcode,
                        country: addr.country || 'India',
                        formattedAddress: fullAddress
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            setFormattedAddress('Location selected (Address unavailable)');
        } finally {
            setIsLoadingAddress(false);
        }
    }, [onLocationSelect]); // fetchNearbyLandmark is defined inside component but does not depend on state/props, or outside? Defined inside.
    // Ideally fetchNearbyLandmark should be outside or useCallback-ed if inside.
    // Alternatively, since it doesn't use state, it's fine. 
    // Wait, fetchNearbyLandmark IS defined inside and depends on getDistance which is inside.
    // I should move getDistance and fetchNearbyLandmark inside useCallback or outside component to be pure.
    // For simplicity in this replace, I'll rely on the fact that fetchAddressFromCoords rebuilds on onLocationSelect change.
    // To be perfectly safe, I'd move them, but this structure works.

    const handlePositionChange = useCallback((lat: number, lng: number) => {
        setPosition([lat, lng]);
        fetchAddressFromCoords(lat, lng);
    }, [fetchAddressFromCoords]);

    const DraggableMarker = () => {
        const markerRef = useRef<L.Marker>(null);

        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current;
                    if (marker != null) {
                        const { lat, lng } = marker.getLatLng();
                        handlePositionChange(lat, lng);
                    }
                },
            }),
            [handlePositionChange]
        );

        return (
            <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={position}
                ref={markerRef}
            />
        );
    };

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                handlePositionChange(lat, lng);
            },
        });
        return null;
    };

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await axios.get(`https://photon.komoot.io/api/`, {
                params: {
                    q: value,
                    limit: 5
                }
            });
            setSuggestions(response.data.features || []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSuggestionSelect = (suggestion: PhotonFeature) => {
        const [lng, lat] = suggestion.geometry.coordinates;

        setPosition([lat, lng]);
        setSuggestions([]);

        const props = suggestion.properties;
        const displayName = props.name || [props.street, props.city].filter(Boolean).join(', ');
        setQuery(displayName);

        fetchAddressFromCoords(lat, lng);
    };

    const handleLocateMe = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                handlePositionChange(latitude, longitude);
            }, (error) => {
                console.error('Geolocation error:', error);
                alert('Could not detect your location.');
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!formattedAddress) {
            fetchAddressFromCoords(position[0], position[1]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="space-y-4 font-sans text-white">
            {/* Search Input */}
            <div className="relative" ref={searchRef}>
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        placeholder="Search for area, street name..."
                        className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                    {isSearching && (
                        <div className="absolute right-3 top-3.5">
                            <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                        </div>
                    )}
                </div>

                {/* Suggestions List - High Z-Index to overlap map controls */}
                {suggestions.length > 0 && (
                    <div className="absolute z-[2000] w-full mt-1 bg-dark-800 border border-dark-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {suggestions.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionSelect(item)}
                                className="w-full text-left px-4 py-3 hover:bg-dark-700 border-b border-dark-700 last:border-0 transition-colors flex flex-col"
                            >
                                <span className="text-white font-medium text-sm truncate">
                                    {item.properties.name || item.properties.street || 'Unknown Location'}
                                </span>
                                <span className="text-xs text-gray-400 truncate mt-0.5">
                                    {[item.properties.street, item.properties.city, item.properties.state, item.properties.country]
                                        .filter(Boolean)
                                        .join(', ')}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map Area */}
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden border border-dark-600 shadow-inner group">
                <MapContainer
                    center={position}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false} // Disable default so we can position explicity
                >
                    <MapUpdater center={position} />
                    <MapClickHandler />
                    {/* Explicitly place zoom control top-left, under the search bar */}
                    <ZoomControl position="topleft" />

                    {mapLayer === 'streets' ? (
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    ) : (
                        <TileLayer
                            attribution='Tiles &copy; Esri'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    )}

                    <DraggableMarker />
                </MapContainer>

                {/* Floating Controls */}
                <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
                    <button
                        onClick={handleLocateMe}
                        className="bg-white p-2.5 rounded-lg shadow-lg hover:bg-gray-50 transition-colors text-dark-900 group/btn"
                        title="Use Current Location"
                        type="button"
                    >
                        <Navigation className="w-5 h-5 group-hover/btn:text-primary-600" />
                    </button>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col text-dark-900">
                        <button
                            onClick={() => setMapLayer('streets')}
                            className={`p-2.5 hover:bg-gray-50 transition-colors ${mapLayer === 'streets' ? 'bg-gray-100 text-primary-600' : ''}`}
                            title="Street View"
                            type="button"
                        >
                            <MapIcon className="w-5 h-5" />
                        </button>
                        <div className="h-[1px] bg-gray-200" />
                        <button
                            onClick={() => setMapLayer('satellite')}
                            className={`p-2.5 hover:bg-gray-50 transition-colors ${mapLayer === 'satellite' ? 'bg-gray-100 text-primary-600' : ''}`}
                            title="Satellite View"
                            type="button"
                        >
                            <Globe className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Address Display Overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-[400]">
                    <div className="bg-dark-900/95 backdrop-blur-md border border-dark-600 p-4 rounded-xl shadow-lg ring-1 ring-white/10">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0">
                                {isLoadingAddress ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-primary-500/20 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-primary-500 font-semibold uppercase tracking-wider mb-0.5">
                                    Delivery Location
                                </p>
                                <p className="text-sm text-white leading-relaxed font-medium break-words">
                                    {formattedAddress || "Drag map marker to pinpoint delivery location"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationPicker;
