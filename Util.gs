function getTeamList() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var teamSheet = ss.getSheetByName("Teams");
  var teamSheetDR = teamSheet.getDataRange();
  var teamRange = teamSheet.getRange(teamSheetDR.getA1Notation().replace("A1", "A2"));
    
  return teamRange.getValues();
};

function getTeams() {
  var teams = [];
  var teamList = getTeamList();
  
  for (t in teamList) {
    var team = teamList[t];
    
    teams.push({
        teamID: team[0],
        conference: team[1],
        division: team[2],
        name: team[3] + " " + team[4],
        teamShort: team[5],
        population: team[6],
        teamLogoURL : team[7]
    });
  }
  
  return teams;
}

function getBBGMTeams() {
  var bbgmTeams = [];
  var mappings = getMappings();
  var teams = getTeamList();
  
  for(var t in teams) {
    var team = teams[t];
    bbgmTeams.push({
      tid: team[0],
      cid: mappings[team[1]],
      did: mappings[team[2]],
      region: team[3],
      name: team[4],
      abbrev: team[5],
      pop: team[6],
      imgURL: team[7]
    });
  }
  
  return bbgmTeams;
}

function getTeam(name) {
  if(typeof name === 'undefined') name = 'Milwaukee Bucks';
  var teams = getTeamList();
  
  for (t in teams) {
    var team = teams[t];
    var teamName = team[3] + " " + team[4];
    if(teamName === name) {
      return {
        teamID: team[0],
        conference: team[1],
        division: team[2],
        name: teamName,
        teamShort: team[5],
        population: team[6],
        teamLogoURL : team[7]
      }
    }
  }
}

function getMappings() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mappingSheet = ss.getSheetByName(config.sheetNames.mappingSheet);
  var mappingsData = mappingSheet.getDataRange().getValues();
  var mappings = [];
  
  for(var m in mappingsData) {
    var mapping = mappingsData[m];
    mappings[mapping[0]] = mapping[1];
  }
  
  return mappings;
};