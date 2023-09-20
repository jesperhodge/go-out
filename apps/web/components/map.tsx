'use client';

import React, { useState, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

var map: any;
var service;
var infowindow: any;


function createMarker(place: google.maps.places.PlaceResult) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, 'click', () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map, marker);
  });
}

const loadMap = async () => {
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
    version: "weekly",
  });

  await loader.load()

  var sydney = new google.maps.LatLng(-33.867, 151.195);

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(
      document.getElementById('map') as HTMLElement, {center: sydney, zoom: 15}
    );

  var request = {
    query: 'Museum of Contemporary Art Australia',
    fields: ['name', 'geometry'],
  };

  var service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      if (!results) return;
      for (var i = 0; i < results.length; i++) {
        createMarker(results?.[i]);
      }
      map.setCenter(results[0]?.geometry?.location);
    }
  });

  return map;
};

const Map = () => {
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[] | null | undefined>([]);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const markersRef = useRef<google.maps.Marker[] | null>([]);
  const infowindowRef = useRef<google.maps.InfoWindow | null>(null);

  const onPlacesChanged = () => {
    const selectedPlaces = searchBoxRef.current!.getPlaces();
    setPlaces(selectedPlaces);
  
    // Clear out old markers
    markersRef.current?.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  
    const bounds = new google.maps.LatLngBounds();
  
    selectedPlaces?.forEach(place => {
      if (!place?.geometry?.location) return;
  
      const marker = new google.maps.Marker({
        map: mapRef.current,
        title: place.name,
        position: place.geometry.location
      });
      markersRef.current?.push(marker);
  
      google.maps.event.addListener(marker, 'click', () => {
        setSelectedPlace(place);
        infowindowRef.current!.setContent(place.name || "");
        infowindowRef.current!.open(mapRef.current, marker);
      });
  
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
  
    mapRef.current?.fitBounds(bounds);
  };
  
  React.useEffect(() => {
    async function mapEffect() {
      // Load map...
      const map = await loadMap();
      
      const initMapRefs = () => {
        mapRef.current = map;
        searchBoxRef.current = new google.maps.places.SearchBox(document.getElementById('search-bar') as HTMLInputElement);
        infowindowRef.current = new google.maps.InfoWindow();
      }
      initMapRefs();

      if (mapRef.current) {
        mapRef.current.addListener('click', (event: any) => {
          // Get latLng of the clicked location
          const latLng = event.latLng;
          // Do something with the clicked location if needed
        });
      }
    
      if (mapRef.current && searchBoxRef.current) {
        const onPlacesChanged = () => {
          const places = searchBoxRef.current!.getPlaces() || [];
          setPlaces(places);
          // ... handle selection
        }
    
        searchBoxRef.current.addListener('places_changed', onPlacesChanged);
    
        return () => { // Cleanup
          google.maps.event.clearListeners(searchBoxRef.current!, 'places_changed');
        };
      }
    }

    mapEffect()
  }, []);

  return (
    <div>
      <h3>Map</h3>
      <input type="text" id="search-bar" placeholder="Search for places..." />
      <div id="search-results">
      {selectedPlace && (
        <div>
          <h4>{selectedPlace.name}</h4>
          <p>{selectedPlace.formatted_address}</p>
          {/* You can add more details here */}
        </div>
      )}
    </div>
      <div id="map" style={{ height: '80vh', width: '100%' }}></div>
    </div>
  );
};

export default Map;