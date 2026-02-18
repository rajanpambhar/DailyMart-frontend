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

const LocationPicker = ({ onLocationSelect }: LocationPickerProps) => {
    return null;
};

export default LocationPicker;
