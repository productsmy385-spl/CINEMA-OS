"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCinema, type LocationUpdateItem } from "@/lib/cinema-context";
import {
  Car,
  FileCheck,
  Hospital,
  MapPin,
  Navigation,
  Phone,
  Plus,
  Send,
  ShieldCheck,
  Sun,
  Truck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export default function LocationManagementView() {
  const { locations, updateLocation, dispatchLocationToActor, actors, selectedActor } = useCinema();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [selectedLocId, setSelectedLocId] = useState(locations[0]?.id || "");
  const [selectedActorId, setSelectedActorId] = useState(selectedActor.id);
  const [dispatchNote, setDispatchNote] = useState("");

  const [newLoc, setNewLoc] = useState({
    project: "Chrono Raiders",
    name: "",
    address: "",
    gpsCoordinates: "",
    basecampLot: "",
    securityPassInstructions: "",
    assignedChauffeur: "",
    chauffeurPhone: "",
    nearestHospital: "",
    weatherAdvisory: "Clear skies",
  });

  const handleCopyGPS = (gps: string, name: string) => {
    navigator.clipboard.writeText(gps);
    toast.success(`GPS coordinates for "${name}" copied to clipboard: ${gps}`);
  };

  const handleOpenDispatch = (locId: string) => {
    setSelectedLocId(locId);
    setShowDispatchModal(true);
  };

  const handleSendDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatchLocationToActor(selectedLocId, selectedActorId, dispatchNote);
    setShowDispatchModal(false);
    setDispatchNote("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shooting Locations, GPS Pins & Fleet Logistics"
        description="Location scouting, tech recce assessments, basecamp parking passes, executive chauffeur assignments, and emergency medical centers."
        actions={
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Shoot Location
          </Button>
        }
      />

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {locations.map((loc) => (
          <Card key={loc.id} className="p-4 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-2xs font-bold text-primary">{loc.project}</span>
                <span className="text-[10px] text-muted-foreground font-mono">Updated: {loc.lastUpdated}</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground">{loc.name}</h4>
                <p className="text-2xs text-muted-foreground mt-0.5">{loc.address}</p>
              </div>

              {/* GPS & Basecamp Box */}
              <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2 text-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">GPS Satellite Pin:</span>
                  <button
                    onClick={() => handleCopyGPS(loc.gpsCoordinates, loc.name)}
                    className="font-mono font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Navigation className="h-3 w-3" />
                    {loc.gpsCoordinates}
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Basecamp Lot:</span>
                  <span className="font-semibold text-foreground text-right max-w-[170px] truncate">
                    {loc.basecampLot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driver / Fleet:</span>
                  <span className="font-semibold text-foreground text-right">{loc.assignedChauffeur}</span>
                </div>
              </div>

              {/* Gate Pass Instructions */}
              <div className="p-2.5 rounded-lg bg-background border border-border/70 space-y-1 text-2xs">
                <span className="font-bold text-foreground block uppercase text-[10px] text-muted-foreground">
                  Security Pass / Access Protocol
                </span>
                <p className="text-foreground">{loc.securityPassInstructions}</p>
              </div>

              {/* Medical Emergency Center */}
              <div className="flex items-start gap-1.5 text-2xs text-destructive font-medium">
                <Hospital className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>{loc.nearestHospital}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenDispatch(loc.id)}
                className="w-full text-2xs text-primary border-primary/40 hover:bg-primary/10"
              >
                <Send className="h-3 w-3 mr-1" />
                Dispatch Location Update to Talent
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Dispatch Location Update Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-modal space-y-4">
            <h3 className="text-base font-bold text-foreground">Dispatch Location Bulletin to Talent</h3>
            <p className="text-xs text-muted-foreground">
              Immediately transmits satellite GPS coordinates, basecamp shuttle information, and security gate instructions directly to the actor&apos;s mobile app and SMS.
            </p>
            <form onSubmit={handleSendDispatch} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Select Recipient Talent</label>
                <select
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs"
                  value={selectedActorId}
                  onChange={(e) => setSelectedActorId(e.target.value)}
                >
                  {actors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.stageName} ({a.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Custom Location Alert / Parking Note (Optional)
                </label>
                <Input
                  placeholder="e.g. Use Escondido gate entrance, driver waiting at Lot B"
                  value={dispatchNote}
                  onChange={(e) => setDispatchNote(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowDispatchModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="bg-[#167D8D] text-white">
                  Broadcast Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Shoot Location Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-modal space-y-4">
            <h3 className="text-base font-bold text-foreground">Add Shooting Location</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowAddModal(false);
                toast.success(`Location "${newLoc.name}" registered to project.`);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Location Name"
                  placeholder="e.g. Warner Bros Ranch Lot"
                  value={newLoc.name}
                  onChange={(e) => setNewLoc({ ...newLoc, name: e.target.value })}
                  required
                />
                <Input
                  label="Project"
                  value={newLoc.project}
                  onChange={(e) => setNewLoc({ ...newLoc, project: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Physical Address"
                placeholder="Street address, city, state, zip"
                value={newLoc.address}
                onChange={(e) => setNewLoc({ ...newLoc, address: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="GPS Coordinates"
                  placeholder="e.g. 34.1522° N, 118.3372° W"
                  value={newLoc.gpsCoordinates}
                  onChange={(e) => setNewLoc({ ...newLoc, gpsCoordinates: e.target.value })}
                  required
                />
                <Input
                  label="Basecamp Parking"
                  placeholder="e.g. Lot 4 Structure"
                  value={newLoc.basecampLot}
                  onChange={(e) => setNewLoc({ ...newLoc, basecampLot: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Assigned Chauffeur / Driver"
                  placeholder="e.g. Frank Perez (Van #4)"
                  value={newLoc.assignedChauffeur}
                  onChange={(e) => setNewLoc({ ...newLoc, assignedChauffeur: e.target.value })}
                  required
                />
                <Input
                  label="Nearest Emergency Hospital"
                  placeholder="e.g. Providence Saint Joseph"
                  value={newLoc.nearestHospital}
                  onChange={(e) => setNewLoc({ ...newLoc, nearestHospital: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="bg-[#167D8D] text-white">
                  Save Location
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
