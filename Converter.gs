function getTeamData() {
  var teams = [];
  var mappings = getMappings();
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var teamSheet = ss.getSheetByName(config.sheetNames.teamSheet);
  
  var teamData = teamSheet.getDataRange().getValues();
  
  var headers = teamData[0];
  
  for(var t = 1;t<teamData.length;t++) {
    var teamRow = teamData[t];
    
    var team = {};
    for(var a=0;a<teamRow.length;a++) {
      var header = mappings[headers[a]];
      var value = teamRow[a];
      var mappedValue = mappings[value];
      team[header] = typeof mappedValue !== 'undefined' ? mappedValue : value;
    }
    
    teams.push(team);
  }
  
  return teams;
};

function getAllPlayers() {
  var players = [];
  var teams = getTeams();
  teams[-1] = {teamID: -1, name: "Free Agents"};
  teams[-2] = {teamID: -2, name: "Draft Picks"};
  
  for(var t in teams) {
    var team = teams[t];
    var teamPlayers = getPlayersForTeam(team);
    
    for(var p in teamPlayers) {
      players.push(teamPlayers[p]);
    }
    
  }
  
  Logger.log("From getAllPlayers = " + JSON.stringify(players));
  
  return players;
}

function getPlayersForTeam(team) {
  var players = [];
 
  var mappings = getMappings();
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var teamSheet = ss.getSheetByName(team.name);
  var teamData = teamSheet.getDataRange().getValues();
  
  var highLevel = teamData[0];
  var headers = teamData[1];
  
  for(var p=2;p<teamData.length;p++) {
    var player = {
      tid: team.teamID
    };
    var playerData = teamData[p];
    var highLevelVal;
    for(var h = 0;h<headers.length;h++) {
      var header = headers[h];
      var attrVal = playerData[h];
      if(typeof mappings[header] === 'undefined') {
        header = header.toLowerCase();
      } else {
        header = mappings[header];
      }
      if(highLevel[h].length > 0) {
        if(typeof mappings[highLevel[h]] === 'undefined') {
          highLevelVal = highLevel[h].toLowerCase();
        } else {
          highLevelVal = mappings[highLevel[h]];
        }
        if(highLevelVal === 'skills' || highLevelVal === 'ratings') {
          player[highLevelVal] = [];
          if(highLevelVal === 'ratings') {
            player[highLevelVal][0] = {};
          }
        } else if(highLevelVal !== 'player info') {
          player[highLevelVal] = {};
        }
      }
      if(highLevelVal === 'player info') {
        player[header] = attrVal;
      } else if(highLevelVal === 'skills') {
        if(typeof player["ratings"][0][highLevelVal] === 'undefined') player["ratings"][0][highLevelVal] = [];
        if(attrVal.length > 0) player["ratings"][0][highLevelVal].push(header);
      } else if(highLevelVal === 'ratings') {
        player[highLevelVal][0][header] = attrVal;
      } else {
        player[highLevelVal][header] = attrVal;
      }
    }
    players.push(player);
  }
  
  return players;
}