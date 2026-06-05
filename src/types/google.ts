export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface AddressComponentType {
  [key: string]: AddressComponent;
}
export interface GoogleLocation {
  lat: number;
  lng: number;
}

export type GoolgePlaceType = {
  formatted_address: string;
  geometry: {
    location: GoogleLocation;
    viewport: {
      northeast: GoogleLocation;
      southwest: GoogleLocation;
    };
  };
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  photos: [
    {
      height: number;
      html_attributions: string[];
      photo_reference: string;
      width: number;
    },
  ];
  place_id: string;
  reference: string;
  types: string[];
  address_components?: AddressComponent[];
  transformedAddress?: AddressComponentType;
};
