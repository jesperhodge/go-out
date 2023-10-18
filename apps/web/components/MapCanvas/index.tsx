import React, { forwardRef } from 'react'

import './index.css'

const MapCanvas = forwardRef<HTMLDivElement, Record<string, unknown>>((_, ref) => (
  <div ref={ref} className="map" />
))
MapCanvas.displayName = 'MapCanvas'

export default MapCanvas
