"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Car,
  Clock,
  Hotel,
  MapPin,
  Plane,
  Plus,
  Truck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface TravelBooking {
  id: string;
  travelerName: string;
  role: string;
  mode: "Flight" | "Hotel" | "Production Van" | "Executive Chauffeur";
  origin: string;
  destination: string;
  details: string;
  dates: string;
  status: "confirmed" | "ticketed" | "en_route";
}

const initialTravel: TravelBooking[] = [
  {
    id: "TRV-101",
    travelerName: "Marcus Sterling (Lead)",
    role: "Cast #1",
    mode: "Executive Chauffeur",
    origin: "Beverly Hills Residence",
    destination: "Vasquez Rocks Basecamp",
    details: "Sprinter Van #4 (Quiet ride, climate control, side curtains)",
    dates: "Nov 14 - Pickup: 05:15 AM",
    status: "confirmed",
  },
  {
    id: "TRV-102",
    travelerName: "Elena Rostova (Lead)",
    role: "Cast #2",
    mode: "Executive Chauffeur",
    origin: "West Hollywood Hotel",
    destination: "Vasquez Rocks Basecamp",
    details: "Executive Sedan #2",
    dates: "Nov 14 - Pickup: 05:30 AM",
    status: "confirmed",
  },
  {
    id: "TRV-103",
    travelerName: "Hoyte van Hoytema & Camera Assistants",
    role: "Camera Dept (3 Pax)",
    mode: "Production Van",
    origin: "Panavision Hollywood HQ",
    destination: "Vasquez Rocks Lot B",
    details: "IMAX Camera Truck & Crew Van",
    dates: "Nov 14 - Departure: 04:45 AM",
    status: "confirmed",
  },
];

export default function TravelLogisticsView() {
  const [travelList, setTravelList] = useState<TravelBooking[]>(initialTravel);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Travel, Accommodation & Fleet Logistics"
        description="Cast and crew flight bookings, hotel reservations, executive car dispatch, and equipment transport fleets."
        actions={
          <Button
            size="sm"
            onClick={() => toast.info("Opening Flight & Travel Requisition...")}
            className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Book Travel / Vehicle
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {travelList.map((trv) => (
          <Card key={trv.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                {trv.mode === "Flight" ? (
                  <Plane className="h-4 w-4" />
                ) : trv.mode === "Hotel" ? (
                  <Hotel className="h-4 w-4" />
                ) : (
                  <Car className="h-4 w-4" />
                )}
                <span>{trv.mode}</span>
              </span>
              <Badge variant="success">CONFIRMED</Badge>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground">{trv.travelerName}</h4>
              <p className="text-2xs text-muted-foreground">{trv.role}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/40 border border-border space-y-1.5 text-2xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup / Origin:</span>
                <span className="font-semibold text-foreground text-right">{trv.origin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dropoff / Destination:</span>
                <span className="font-semibold text-foreground text-right">{trv.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timing:</span>
                <span className="font-mono font-bold text-[#167D8D]">{trv.dates}</span>
              </div>
            </div>

            <p className="text-2xs text-muted-foreground italic">{trv.details}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

