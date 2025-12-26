// export enum RiderMapState {
//   SEARCHING = "SEARCHING",
//   INCOMING_ORDER = "INCOMING_ORDER",
//   ACTIVE_ORDER = "ACTIVE_ORDER",
// }

export type MapMode = "SCOUTING" | "PREVIEW" | "NAVIGATION"

export interface Order {
  id: string
  vendor: string
  price: number
  distance: string
  eta: string
}
