let Rooms = require('room');
var self = module.exports = {
  currentTier(room) {
    let numSources = room.find(FIND_SOURCES).length;
    return {
      min: {
        hoarder: numSources*2,
        upgrader: numSources*2,
        archer: numSources*3,
        builder: numSources*1,
        healer: numSources*2,
        foreigner: numSources*1,
      },
      max: {
        hoarder: numSources*4,
        upgrader: numSources*4,
        archer: numSources*5,
        builder: numSources*2,
        healer: numSources*3,
        foreigner: numSources*15,
      },
    }
  },
  minMet(room, role, modifier) {
    if (!modifier) {
      modifier = 0;
    }
    return Rooms.allRole(room, [role]).length + modifier >= self.currentTier(room).min[role];
  },
  maxMet(room, role) {
    return Rooms.allRole(room, [role]).length >= self.currentTier(room).max[role];
  },
  minSize(room, role) {
    let candidates = Rooms.allRole(room, [role]);
    if (filtered.length > 0) {
      return _.minBy(filtered, function(creep) {
        return creep.body.length;
      });
    } else {
      return 0;
    }
  }
}
