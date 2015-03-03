function showPicker(text) {
  if(typeof text === 'undefined' || text.length <= 0) {
    text = "Select a file."
  }
  var html = HtmlService.createHtmlOutputFromFile('Picker.html')
      .setWidth(600).setHeight(425);
  SpreadsheetApp.getUi().showModalDialog(html, text);
}

function getOAuthToken() {
  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
}

function filePickerCallback(id, name) {  
  var file = DocsList.getFileById(id);
  var ui = SpreadsheetApp.getUi();
  
  ui.alert("Loading file: " + name + "\nPlease leave your spreadsheet active and do not switch tabs while the script is running.");
  
  var roster = JSON.parse(file.getContentAsString());
  
  Logger.log("Loading teams...");
  loadTeams(roster);
  Logger.log("Teams loaded.");
  
  Logger.log("Creating team sheets...");
  createTeamSheets();
  Logger.log("Team sheets created");
  
  Logger.log("Inserting players...");
  insertPlayers(roster);
  Logger.log("Players inserted.");
  
  ui.alert("File loaded: " + name);
  
}