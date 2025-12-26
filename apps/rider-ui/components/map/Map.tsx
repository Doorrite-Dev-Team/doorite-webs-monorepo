// "use client";

// import { useState } from "react";
// import { RiderMapState } from "@/types/map";
// import MapContainer from "@/components/map/MapContainer";

// export default function RiderMapPage() {
//   const [mapState, setMapState] = useState<RiderMapState>(
//     RiderMapState.SEARCHING
//   );

//   return (
//     <MapContainer
//       state={mapState}
//       onChangeState={setMapState}
//     />
//   );
// }

"use client"

import { useState } from "react"
import { MapMode, Order } from "@/types/map"
// import MapBackground from "@/components/map/MapBackground"
import OrderPin from "@/components/map/OrderPin"
import OrderPreviewSheet from "@/components/map/OrderPreviewSheet"
import NavigationHUD from "@/components/map/NavigationHUD"

export default function RiderMapPage() {
  const [mode, setMode] = useState<MapMode>("SCOUTING")
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)

  return (
    <div className="relative h-[-webkit-fill-available] w-full overflow-hidden">
      {/* <MapBackground /> */}

      {/* Order Pins (Scouting State) */}
      {mode === "SCOUTING" && (
        <OrderPin
          onClick={() => {
            setActiveOrder({
              id: "4921",
              vendor: "Chicken Republic",
              price: 900,
              distance: "2.4 km",
              eta: "15 min",
            })
            setMode("PREVIEW")
          }}
        />
      )}

      {/* Order Preview */}
      {mode === "PREVIEW" && activeOrder && (
        <OrderPreviewSheet
          order={activeOrder}
          onAccept={() => setMode("NAVIGATION")}
          onDecline={() => {
            setActiveOrder(null)
            setMode("SCOUTING")
          }}
        />
      )}

      {/* Active Navigation */}
      {mode === "NAVIGATION" && activeOrder && (
        <NavigationHUD order={activeOrder} />
      )}
    </div>
  )
}
