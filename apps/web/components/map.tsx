'use client';
// import React from "react";
// import Script from "next/script";
// import { Loader } from "@googlemaps/js-api-loader"

// async function load() {
//   let map: google.maps.Map;
//   async function initMap(): Promise<void> {
//     const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
//     map = new Map(document.getElementById("map") as HTMLElement, {
//       center: { lat: -34.397, lng: 150.644 },
//       zoom: 8,
//     });
//   }

//   await initMap();
//   const loader = new Loader({
//     apiKey: "AIzaSyDVETOzRN_G8lscB0sgtS62-DNvwT3Z2xo",
//     version: "weekly",
//   });
  
//   loader.load().then(async () => {
//     const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
//     map = new Map(document.getElementById("map") as HTMLElement, {
//       center: { lat: -34.397, lng: 150.644 },
//       zoom: 8,
//     });
//   });
// }

// const Map = () => {
//   React.useEffect(() => {
//     load();
//   }, []);

//   return (
//     <>
//       <div>
//         <h3>
//           Map
//         </h3>
//         <div id="map" className="h-48"></div>
//       </div>
//     </>
//   )
// }
// export default Map

import React from "react";
import { Loader } from "@googlemaps/js-api-loader";

const loadMap = () => {
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    version: "weekly",
  });

  loader.load().then(() => {
    new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  });
};

const Map = () => {
  React.useEffect(() => {
    loadMap();
  }, []);

  return (
    <div>
      <h3>Map</h3>
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default Map;