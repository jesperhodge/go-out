// 'use client';

// import React, { useState, useRef, forwardRef, RefObject, ForwardedRef } from "react";
// import { useGoogleMap } from "@ubilabs/google-maps-react-hooks";

// type Ref = HTMLDivElement;
// interface Props {};

// const Map = forwardRef<Ref, Props>((props, ref) => {
//   const map = useGoogleMap();
//   const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null)

//   return (
//     <div>
//       <h3>Map</h3>
//       <div ref={ref} style={{ height: '80vh', width: '100%' }}></div>
//       <input type="text" id="search-bar" placeholder="Search for places..." />
//       <div id="search-results">
//         {selectedPlace && (
//           <div>
//             <h4>{selectedPlace?.name}</h4>
//             <p>{selectedPlace?.formatted_address}</p>
//             {/* You can add more details here */}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });
// Map.displayName = 'Map';

// export default Map;