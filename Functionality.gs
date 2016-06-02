/**
 * Adds a custom menu to the active spreadsheet, containing a single menu item
 * for invoking the readRows() function specified above.
 * The onOpen() function, when defined, is automatically invoked whenever the
 * spreadsheet is opened.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Utilities")
  .addItem("Create Team Sheets", "createTeamSheets")
  .addItem("Delete Team Sheets", "removeTeamSheets")
  .addItem("Load Roster from Drive", "loadRosterFromDrive")
  .addItem("Create JSON File", "createJSON")
  .addToUi();
  
  var test = false;
  
  if(test) {
    setupTestMenu();
  }
};

function createTeamSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var teamList = getTeamList();
  
  Logger.log("Creating sheets");
  
  for(var t=0;t<teamList.length;t++) {
    var team = teamList[t];
    var teamName = team[3] + " " + team[4];
    addTeamSheet(teamName);
  }
  
  addTeamSheet("Free Agents");
  addTeamSheet("Draft Picks");
  
  ss.setActiveSheet(ss.getSheetByName("Teams"));
};

function addTeamSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if(ss.getSheetByName(name) === null) {
    ss.setActiveSheet(ss.getSheetByName("Team Template"));
    ss.duplicateActiveSheet();
    ss.renameActiveSheet(name)
    ss.moveActiveSheet(ss.getNumSheets() - 2);
  }
};

function removeTeamSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var teamList = getTeamList();
  
  Logger.log("Removing sheets");
  
  for(var t=0;t<teamList.length;t++) {
    var team = teamList[t];
    var teamName = team[3] + " " + team[4];
    var sheet = ss.getSheetByName(teamName);
    Logger.log("Sheet = " + sheet);
    if(sheet !== null ){
      ss.deleteSheet(sheet);
    }
  }
  
  ss.deleteSheet(ss.getSheetByName("Free Agents"));
  ss.deleteSheet(ss.getSheetByName("Draft Picks"));
};

function createJSON() {
  var json = {};
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  json.startingSeason = parseInt(ui.prompt("What should be the starting season?").getResponseText());
  json.players = getAllPlayers();
  json.teams = getBBGMTeams();
  
  var fileName = ui.prompt("Enter a file name").getResponseText();
  
  while(typeof fileName === 'undefined' || fileName.length < 1) {
    fileName = ui.prompt("Enter a file name").getResponseText();
  }
  
  if(fileName.indexOf(".json") < 0) {
    fileName += ".json";
  }
  
  DriveApp.createFile(fileName, JSON.stringify(json));
  
  ui.alert("File saved to drive: " + fileName);
  
};

function loadRosterFromDrive() {
  showPicker('Select a roster file');
}