function loadTeams(roster) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var teamSheet = createTeamSheet();
  
  var attrMapping = config.dataLoader.teamMapping;
  for(var t in roster.teams) {
    var text = "";
    var team = roster.teams[t];
    for(var a=0;a<attrMapping.length;a++) {
      var attr = attrMapping[a];
      var value = team[attr];
      if(attr === 'cid') value = config.dataLoader.confMapping[value];
      if(attr === 'did') value = config.dataLoader.divMapping[value];
      
      teamSheet.getRange(team.tid + 2, a + 1).setValue(value);
    }
  }
};

function insertPlayers(roster) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var teams = getTeams();
  teams[-1] = {name: "Free Agents"};
  teams[-2] = {name: "Draft Picks"};
  var playersByTeam = splitPlayersByTeam(roster);
  
  for(var t in teams) {
    var team = teams[t];
    var teamSheet = ss.getSheetByName(team.name);
    
    SpreadsheetApp.setActiveSheet(teamSheet);
    
    for(var p = 0;p<playersByTeam[t].length;p++) {
      var player = playersByTeam[t][p];
      
      writePlayer(player, teamSheet, p);
    }
  }
}

function writePlayer(player, teamSheet, playerIndex) {
  var playerMapping = config.dataLoader.playerMapping;
  
  for(var a = 0;a<playerMapping.length;a++) {
    var highLevel = "",
        mapping = "",
        value = "";
    var baseMapping = playerMapping[a];
    
    if(baseMapping.indexOf(".") >= 0) {
      var split = baseMapping.split(".");
      highLevel = split[0];
      mapping = split[1];
    } else {
      mapping = baseMapping;
    }
    var range = teamSheet.getRange(parseInt(playerIndex) + 3, parseInt(a) + 1);    
    
    if(typeof highLevel === 'undefined' || highLevel.length === 0) {
      value = player[mapping];
    } else if(highLevel.indexOf("skills") >= 0) {
      for(var s in player["ratings"][0].skills) {
        var skill = player.ratings[0].skills[s];
        
        if(skill === mapping) {
          value = "X";
        }
      }
    } else if(highLevel.indexOf("ratings") >= 0) {
      value = player["ratings"][0][mapping];
    } else {
      value = player[highLevel][mapping];
    }
    
    if(typeof value === 'undefined' || value === 'undefined') value = "";
    
    range.setValue(value);
  }
}

function splitPlayersByTeam(roster) {
  var teamPlayerList = [];
  
  for(var p in roster.players) {
    var player = roster.players[p];
    
    if(typeof teamPlayerList[player.tid] === 'undefined') {
      teamPlayerList[player.tid] = [];
    }
    
    teamPlayerList[player.tid].push(player);
  }
  
  return teamPlayerList;
}

function createTeamSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var teamSheet = ss.getSheetByName("Teams");
  var headers = config.headers.teamSheet;
  if(teamSheet === null) {
    teamSheet = ss.insertSheet("Teams");
  }
  var headerRange = teamSheet.getRange(1, 1, 1, headers.length)
  var headerHack = [headers];
  headerRange.setValues(headerHack);
  headerRange.setFontWeight("Bold");
  
  return teamSheet;
};

