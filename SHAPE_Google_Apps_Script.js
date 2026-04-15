function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp", "Type", "Name", "Phone", "Email", 
      "Weight", "Height", "Age", "Gender", "City",
      "Neck", "Shoulder", "Chest", "Waist", "Belly Button", "Hip", "Thigh", "Arm",
      "Goal", "Target Weight", "Diet Type", "Activity",
      "Allergies", "Injuries", "Medications", "Medical History", "Surgeries",
      "Sleep Hrs", "Water L/day", "Stress", "Wake Up",
      "Exercise Type", "Smoking/Alcohol",
      "Fav Foods", "Disliked Foods", "Diet History", "Eating Out", "Supplements",
      "Motivation", "Previous Attempts", "Program Weeks", "Start Date",
      "Diet Days Followed", "Plan % Followed", "Gym Days", "Sleep Quality",
      "Water Intake", "Food Change Request", "Challenges", "Feeling",
      "Notes", "Code"
    ]);
  }
  
  // AUTO-BACKUP: Email full backup to yourself
  if (data.type === "auto_backup") {
    try {
      var emailTo = Session.getActiveUser().getEmail();
      if (emailTo) {
        var jsonContent = "";
        try { jsonContent = Utilities.newBlob(Utilities.base64Decode(data.code)).getDataAsString(); } catch(x) { jsonContent = data.code || "{}"; }
        MailApp.sendEmail({
          to: emailTo,
          subject: "🔒 SHAPE Auto-Backup — " + (data.clientCount || 0) + " clients — " + new Date().toLocaleDateString(),
          body: "SHAPE CRM Auto-Backup\n\nTimestamp: " + (data.timestamp || "") + "\nClients: " + (data.clientCount || 0) + "\n\nHOW TO RESTORE:\n1. Open SHAPE CRM\n2. Roster → Sync/Backup → Import Backup\n3. Select the attached JSON file\n\nOr copy the code from this email.",
          attachments: [Utilities.newBlob(jsonContent, "application/json", "SHAPE_Backup_" + new Date().toISOString().split("T")[0] + ".json")]
        });
      }
    } catch(err) {}
    sheet.appendRow([data.timestamp || new Date().toISOString(), "AUTO-BACKUP", (data.clientCount || 0) + " clients", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
    return ContentService.createTextOutput("OK");
  }
  
  // NORMAL SUBMISSION
  sheet.appendRow([
    data.timestamp || new Date().toISOString(), data.type || "",
    data.name || data.clientName || "", data.phone || "", data.email || "",
    data.weight || "", data.height || "", data.age || "", data.gender || "", data.city || "",
    data.neck || "", data.shoulder || "", data.chest || "", data.waist || "", data.bellyBtn || "", data.hip || "", data.thigh || "", data.arm || "",
    data.goal || "", data.targetWeight || "", data.dietType || "", data.activity || "",
    data.allergies || "", data.injuries || "", data.medications || "", data.medicalHistory || "", data.surgeries || "",
    data.sleepHours || "", data.waterIntake || "", data.stressLevel || "", data.wakeUpTime || "",
    data.exerciseType || "", data.habits || "",
    data.favFoods || "", data.dislikedFoods || "", data.dietHistory || "", data.eatingOut || "", data.supplements || "",
    data.motivation || "", data.previousAttempts || "", data.timeline || "", data.startDate || "",
    data.dietDays || "", data.planPercent || "", data.gymDays || "", data.sleepQuality || "",
    data.waterIntake || "", data.foodChange || "", data.challenges || "", data.feeling || "",
    data.notes || "", data.code || ""
  ]);
  
  // EMAIL NOTIFICATIONS
  try {
    var emailTo = Session.getActiveUser().getEmail();
    if (emailTo && data.type === "prementorship") {
      MailApp.sendEmail({ to: emailTo, subject: "🏋️ SHAPE — New Client: " + (data.name || ""),
        body: "New client!\n\nName: " + (data.name||"") + "\nPhone: " + (data.phone||"") + "\nWeight: " + (data.weight||"") + "kg\nGoal: " + (data.goal||"") + "\n\nCODE:\n" + (data.code||"") + "\n\nPaste in SHAPE CRM → Import Client Code" });
    }
    if (emailTo && data.type === "checkin") {
      MailApp.sendEmail({ to: emailTo, subject: "📏 SHAPE Check-In: " + (data.clientName || ""),
        body: "Check-in!\n\nClient: " + (data.clientName||"") + "\nWeight: " + (data.weight||"") + "kg\nWaist: " + (data.waist||"") + "cm\nBelly: " + (data.bellyBtn||"") + "cm\nDiet: " + (data.dietDays||"") + "/7\nFeeling: " + (data.feeling||"") + "\n\nCODE:\n" + (data.code||"") + "\n\nPaste in SHAPE CRM → Import Check-In" });
    }
  } catch(err) {}
  
  return ContentService.createTextOutput("OK");
}
