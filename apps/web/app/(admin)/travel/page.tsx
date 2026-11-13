import type { Metadata } from "next";
import TravelLogisticsView from "./view";

export const metadata: Metadata = {
  title: "Travel & Fleet Logistics | CINEMA OS",
  description: "Cast and crew travel itineraries, hotel blocks, vehicle fleet allocations, and flight manifests.",
};

export default function TravelPage() {
  return <TravelLogisticsView />;
}

