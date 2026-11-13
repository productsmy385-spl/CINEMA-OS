import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";

export default function App() {
  const [activeTab, setActiveTab] = useState<"schedule" | "meetings" | "location">("schedule");
  const [callSheetAcknowledged, setCallSheetAcknowledged] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#071B2B" />

      {/* Brand Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logoTitle}>
            CINEMA <Text style={{ color: "#167D8D" }}>OS</Text>
          </Text>
          <Text style={styles.subTitle}>Actor & Talent Companion</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>MARCUS STERLING</Text>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "schedule" && styles.tabButtonActive]}
          onPress={() => setActiveTab("schedule")}
        >
          <Text style={[styles.tabButtonText, activeTab === "schedule" && styles.tabButtonTextActive]}>
            Shoot Call Sheet
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "meetings" && styles.tabButtonActive]}
          onPress={() => setActiveTab("meetings")}
        >
          <Text style={[styles.tabButtonText, activeTab === "meetings" && styles.tabButtonTextActive]}>
            Arranged Meetings (2)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "location" && styles.tabButtonActive]}
          onPress={() => setActiveTab("location")}
        >
          <Text style={[styles.tabButtonText, activeTab === "location" && styles.tabButtonTextActive]}>
            GPS Location
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* TAB 1: SHOOT CALL SHEET */}
        {activeTab === "schedule" && (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderTitle}>PRINCIPAL SHOOT (DAY 29 OF 52)</Text>
                <Text style={styles.versionTag}>v2 PUBLISHED</Text>
              </View>
              <Text style={styles.movieTitle}>Chrono Raiders (CR-2026)</Text>
              <Text style={styles.locationText}>Vasquez Rocks Natural Area Park • Ridge Point</Text>

              {/* Coordinated Timers */}
              <View style={styles.timingGrid}>
                <View style={styles.timingBox}>
                  <Text style={styles.timingLabel}>PICKUP</Text>
                  <Text style={styles.timingValue}>05:15 AM</Text>
                </View>
                <View style={styles.timingBox}>
                  <Text style={styles.timingLabel}>H/MU CALL</Text>
                  <Text style={styles.timingValue}>06:00 AM</Text>
                </View>
                <View style={[styles.timingBox, { backgroundColor: "#167D8D20", borderColor: "#167D8D" }]}>
                  <Text style={[styles.timingLabel, { color: "#167D8D" }]}>ON-SET</Text>
                  <Text style={[styles.timingValue, { color: "#167D8D" }]}>07:15 AM</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Assigned Chauffeur:</Text>
                <Text style={styles.infoValue}>Frank Perez • Sprinter Van #4</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Wardrobe Note:</Text>
                <Text style={styles.infoValue}>Prosthetic temporal scar check at 06:15 AM</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  callSheetAcknowledged ? styles.actionButtonSuccess : styles.actionButtonPrimary,
                ]}
                onPress={() => setCallSheetAcknowledged(true)}
              >
                <Text style={styles.actionButtonText}>
                  {callSheetAcknowledged ? "✓ Call Time Acknowledged by Marcus" : "Confirm Call Sheet Receipt"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Scheduled Scenes */}
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>SCHEDULED SCENES TODAY</Text>
              <View style={styles.sceneItem}>
                <Text style={styles.sceneNumber}>Sc. 42A • EXT / DAY</Text>
                <Text style={styles.sceneDesc}>
                  Thorne & Elena activate temporal beacon on ridge summit amid lightning anomalies.
                </Text>
                <Text style={styles.sceneMeta}>07:30 AM - 11:30 AM • Ridge Point West</Text>
              </View>
              <View style={styles.sceneItem}>
                <Text style={styles.sceneNumber}>Sc. 43 • EXT / DAY</Text>
                <Text style={styles.sceneDesc}>
                  Tactical strike team ambushes extraction vehicle. Stunt car rollover.
                </Text>
                <Text style={styles.sceneMeta}>12:30 PM - 04:30 PM • Canyon Gorge</Text>
              </View>
            </View>
          </>
        )}

        {/* TAB 2: ARRANGED MEETINGS */}
        {activeTab === "meetings" && (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderTitle}>DIRECTOR SCRIPT READING</Text>
                <Text style={[styles.versionTag, { backgroundColor: "#10B98120", color: "#10B981" }]}>
                  CONFIRMED
                </Text>
              </View>
              <Text style={styles.movieTitle}>Vanguard 2099</Text>
              <Text style={styles.locationText}>With: Christopher Nolan (Director) & Emma Thomas</Text>
              <Text style={styles.sceneMeta}>Tomorrow at 10:30 AM PST • Paramount Lot Stage 4</Text>

              <View style={styles.prepBox}>
                <Text style={styles.prepLabel}>PREPARATION NOTES FROM MANAGER:</Text>
                <Text style={styles.prepText}>
                  Re-read Scenes 14 through 28 (Col. Vance interrogation sequence). Emphasize psychological fatigue and moral conflict.
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderTitle}>BRAND ENDORSEMENT PITCH</Text>
                <Text style={styles.versionTag}>SCHEDULED</Text>
              </View>
              <Text style={styles.movieTitle}>Omega Luxury Timepiece Campaign</Text>
              <Text style={styles.locationText}>With: Global Marketing Director & Agency Rep</Text>
              <Text style={styles.sceneMeta}>Monday, Nov 18 at 11:00 AM PST • SoHo House West Hollywood</Text>
            </View>
          </>
        )}

        {/* TAB 3: LOCATION UPDATES */}
        {activeTab === "location" && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>ACTIVE SHOOT LOCATION & GPS</Text>
              <Text style={styles.movieTitle}>Vasquez Rocks Natural Area Park</Text>
              <Text style={styles.locationText}>10700 Escondido Canyon Rd, Agua Dulce, CA 91390</Text>

              <View style={styles.gpsContainer}>
                <Text style={styles.gpsLabel}>GPS SATELLITE COORDINATES:</Text>
                <Text style={styles.gpsValue}>34.4883° N, 118.3184° W</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Basecamp Parking:</Text>
                <Text style={styles.infoValue}>Lot B (Private Crew Shuttles every 10 min)</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Gate Access:</Text>
                <Text style={styles.infoValue}>Show Digital Pass &apos;CR-DAY29-CREW&apos; at gate</Text>
              </View>

              <View style={[styles.card, { borderColor: "#ef444450", marginTop: 10 }]}>
                <Text style={[styles.cardHeaderTitle, { color: "#ef4444" }]}>
                  EMERGENCY HOSPITAL FACILITY
                </Text>
                <Text style={[styles.movieTitle, { fontSize: 13 }]}>Henry Mayo Newhall Hospital</Text>
                <Text style={styles.locationText}>23845 McBean Pkwy, Valencia, CA • (661) 253-8000</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071B2B",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#153957",
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 10,
    color: "#B9E4E8",
  },
  badge: {
    backgroundColor: "#167D8D30",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#B9E4E8",
  },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#0B253A",
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#071B2B",
    borderWidth: 1,
    borderColor: "#153957",
  },
  tabButtonActive: {
    backgroundColor: "#167D8D",
    borderColor: "#167D8D",
  },
  tabButtonText: {
    fontSize: 11,
    color: "#8DA1B2",
    fontWeight: "600",
  },
  tabButtonTextActive: {
    color: "#FFFFFF",
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: "#0B253A",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#153957",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardHeaderTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#8DA1B2",
    letterSpacing: 0.8,
  },
  versionTag: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#167D8D",
    backgroundColor: "#167D8D20",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  locationText: {
    fontSize: 11,
    color: "#8DA1B2",
    marginTop: 2,
  },
  timingGrid: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 12,
  },
  timingBox: {
    flex: 1,
    backgroundColor: "#071B2B",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#153957",
  },
  timingLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#8DA1B2",
  },
  timingValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: "#153957",
  },
  infoLabel: {
    fontSize: 11,
    color: "#8DA1B2",
  },
  infoValue: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  actionButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonPrimary: {
    backgroundColor: "#167D8D",
  },
  actionButtonSuccess: {
    backgroundColor: "#10B981",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  sceneItem: {
    borderTopWidth: 1,
    borderTopColor: "#153957",
    paddingTop: 8,
    marginTop: 8,
  },
  sceneNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#B9E4E8",
  },
  sceneDesc: {
    fontSize: 11,
    color: "#CBD5E1",
    marginTop: 2,
  },
  sceneMeta: {
    fontSize: 10,
    color: "#8DA1B2",
    marginTop: 3,
  },
  prepBox: {
    backgroundColor: "#071B2B",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#153957",
  },
  prepLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#B9E4E8",
    marginBottom: 4,
  },
  prepText: {
    fontSize: 11,
    color: "#E2E8F0",
    fontStyle: "italic",
    lineHeight: 16,
  },
  gpsContainer: {
    backgroundColor: "#071B2B",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#167D8D",
  },
  gpsLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#8DA1B2",
  },
  gpsValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#B9E4E8",
    marginTop: 2,
  },
});
