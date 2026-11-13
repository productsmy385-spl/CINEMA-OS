import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { CallSheetItem } from "@/data/film-data";

export function generateCallSheetPDF(callSheet: CallSheetItem) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Brand Header Block - Deep Navy
  doc.setFillColor(7, 27, 43); // #071B2B
  doc.rect(0, 0, pageWidth, 28, "F");

  // Title & Project
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("OFFICIAL DAILY CALL SHEET", 14, 12);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(185, 228, 232); // #B9E4E8 Light Cyan
  doc.text(
    `${callSheet.projectTitle.toUpperCase()} (${callSheet.projectCode}) • DAY ${callSheet.dayNumber} OF ${callSheet.totalDays} • ${callSheet.unit.toUpperCase()}`,
    14,
    20
  );

  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`VERSION ${callSheet.version} • ${callSheet.status.toUpperCase()}`, pageWidth - 14, 12, { align: "right" });
  doc.text(`SHOOT DATE: ${callSheet.date}`, pageWidth - 14, 20, { align: "right" });

  // Key Call Times Bar - Teal accent
  doc.setFillColor(22, 125, 141); // #167D8D Teal
  doc.rect(0, 28, pageWidth, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`CREW GENERAL CALL: ${callSheet.generalCallTime}`, 14, 36);
  doc.text(`ESTIMATED WRAP: ${callSheet.estimatedWrapTime}`, pageWidth / 2, 36, { align: "center" });
  doc.text(`WEATHER: ${callSheet.weather.temperature} - ${callSheet.weather.condition}`, pageWidth - 14, 36, { align: "right" });

  let currentY = 46;

  // Location & Emergency Information Box
  doc.setDrawColor(220, 226, 230);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, currentY, pageWidth - 28, 26, 2, 2, "FD");

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(7, 27, 43);
  doc.text("SHOOTING LOCATION & BASECAMP:", 18, currentY + 6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 65, 80);
  doc.text(`${callSheet.location.name} - ${callSheet.location.address}`, 18, currentY + 11);
  doc.text(`Parking: ${callSheet.location.parking}`, 18, currentY + 16);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(185, 28, 28); // Emergency red
  doc.text("NEAREST HOSPITAL & EMERGENCY CONTACTS:", 18, currentY + 21);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(70, 70, 70);
  doc.text(`${callSheet.location.nearestHospital.name} (${callSheet.location.nearestHospital.emergencyPhone})`, 88, currentY + 21);

  currentY += 32;

  // Section 1: Scheduled Scenes Table
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(7, 27, 43);
  doc.text("SCHEDULED SCENES", 14, currentY);
  currentY += 4;

  const sceneRows = callSheet.scenes.map((s) => [
    s.sceneNumber,
    `${s.intExt} / ${s.dayNight}`,
    s.description,
    s.scriptPages,
    s.castNumbers,
    s.location,
    s.timeSlot,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["Scene #", "Set / Light", "Scene Description", "Pages", "Cast #", "Location", "Time Slot"]],
    body: sceneRows,
    theme: "grid",
    headStyles: {
      fillColor: [7, 27, 43],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { cellWidth: 18, fontStyle: "bold" },
      1: { cellWidth: 22 },
      2: { cellWidth: 55 },
      3: { cellWidth: 16 },
      4: { cellWidth: 18 },
      5: { cellWidth: 32 },
      6: { cellWidth: 21 },
    },
    margin: { left: 14, right: 14 },
  });

  // Section 2: Cast & Talent Call Times Table
  // @ts-expect-error autoTable adds lastAutoTable to doc
  currentY = doc.lastAutoTable.finalY + 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(7, 27, 43);
  doc.text("CAST & TALENT CALL TIMES", 14, currentY);
  currentY += 4;

  const castRows = callSheet.castCalls.map((c) => [
    c.castNumber.toString(),
    c.characterName,
    c.actorName,
    c.pickupTime,
    c.hmuTime,
    c.onSetTime,
    c.notes,
    c.status.toUpperCase(),
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["Cast #", "Character", "Actor Name", "Pickup", "H/MU Call", "On-Set Call", "Special Wardrobe / Notes", "Status"]],
    body: castRows,
    theme: "grid",
    headStyles: {
      fillColor: [22, 125, 141], // Teal
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { cellWidth: 14, fontStyle: "bold" },
      1: { cellWidth: 28, fontStyle: "bold" },
      2: { cellWidth: 32 },
      3: { cellWidth: 16 },
      4: { cellWidth: 18 },
      5: { cellWidth: 18, fontStyle: "bold" },
      6: { cellWidth: 40 },
      7: { cellWidth: 16 },
    },
    margin: { left: 14, right: 14 },
  });

  // Section 3: Department Instructions & Meals
  // @ts-expect-error autoTable adds lastAutoTable to doc
  currentY = doc.lastAutoTable.finalY + 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(7, 27, 43);
  doc.text("DEPARTMENT NOTES & INSTRUCTIONS:", 14, currentY);
  currentY += 4;

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 60, 75);
  callSheet.departmentNotes.forEach((dept) => {
    doc.text(`• ${dept.department.toUpperCase()}: ${dept.note}`, 16, currentY);
    currentY += 4;
  });

  currentY += 2;
  doc.setFont("helvetica", "bold");
  doc.text("CATERING & MEAL SCHEDULE:", 14, currentY);
  currentY += 4;
  doc.setFont("helvetica", "normal");
  doc.text(`Breakfast: ${callSheet.cateringSchedule.breakfast} | Lunch: ${callSheet.cateringSchedule.lunch} | Second Meal: ${callSheet.cateringSchedule.secondMeal}`, 16, currentY);

  // Footer Attribution Notice
  const totalPageCount = doc.getNumberOfPages();
  for (let i = 1; i <= totalPageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(140, 155, 170);
    doc.text(
      `CINEMA OS Production Platform • Call Sheet ${callSheet.projectCode}-D${callSheet.dayNumber} v${callSheet.version} • Page ${i} of ${totalPageCount}`,
      14,
      doc.internal.pageSize.getHeight() - 6
    );
    doc.text(
      "CONFIDENTIAL - DO NOT DISTRIBUTE OR POST TO SOCIAL MEDIA",
      doc.internal.pageSize.getWidth() - 14,
      doc.internal.pageSize.getHeight() - 6,
      { align: "right" }
    );
  }

  // Trigger download
  doc.save(`${callSheet.projectCode}_Day${callSheet.dayNumber}_CallSheet_v${callSheet.version}.pdf`);
}

