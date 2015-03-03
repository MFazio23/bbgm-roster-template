var config = {
  sheetNames: {
    mappingSheet : "Mappings",
    teamSheet : "Teams",
    resultsSheet: "Output"
  },
  rangeNames: {
    startingSeason: "StartingSeason"
  },
  headers: {
    teamSheet: ["Team ID","Conference","Division","Region","Name","Abbrev.","Population","Team Logo URL"]
  },
  dataLoader: {
    teamMapping: ["tid", "cid", "did", "region", "name", "abbrev", "pop", "imgURL"],
    playerMapping: ["name","pos","hgt","weight","imgURL","born.year", "born.loc","contract.amount","contract.exp","draft.round","draft.pick","draft.tid","draft.originalTid","draft.year","draft.loc","ratings.hgt","ratings.stre","ratings.spd","ratings.jmp","ratings.endu","ratings.ins","ratings.dnk","ratings.ft","ratings.fg","ratings.tp","ratings.blk","ratings.stl","ratings.drb","ratings.pss","ratings.reb","ratings.pot","skills.3","skills.A","skills.B","skills.Di","skills.Dp","skills.Po","skills.Ps","skills.R"],
    confMapping: ["Eastern", "Western"],
    divMapping: ["Atlantic","Central","Southeast","Southwest","Northwest", "Pacific"]
  }
};