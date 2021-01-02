let Tier = require('tier');
let H = require('helper');

const color = H.GREEN;
const MY_PARTS = {
  archer: [RANGED_ATTACK, MOVE],
  builder: [WORK, CARRY, MOVE, MOVE],
  hoarder: [WORK, CARRY, MOVE, MOVE],
  upgrader: [WORK, CARRY, MOVE, MOVE],
  healer: [HEAL, MOVE],
  foreigner: [WORK, CARRY, MOVE, MOVE],
}

function needsRenewing(creep) {
  if (creep.memory.needsRenewing != undefined) {
    return creep.memory.needsRenewing;
  } else {
    let shouldRenew = creep.ticksToLive <= H.distanceTo(creep, H.getNearest(creep, Game.spawns)) + 15;
    if (shouldRenew) {
      creep.memory.needsRenewing = true;
      return true;
    }
  }
  return false;
}

function renew(creep) {
  let spawn = H.getNearest(creep, Game.spawns);
  let rv = spawn.renewCreep(creep);
  if (rv == ERR_FULL) {
    creep.say("renewed");
    creep.memory.needsRenewing = undefined;
    console.log(`${creep.name} fully renewed.`);
  } else if (rv == ERR_NOT_IN_RANGE) {
    H.moveTo(creep, spawn, color);
  }
}
function level(creep) {
  return Math.round(creep.body.length / MY_PARTS[creep.memory.role].length);
}

var self = module.exports = {
  retireOldest(spawn, role, newLength) {
    let matches = _.filter(_.values(Game.creeps), function(creep) {
      return creep.memory.role == role && creep.body.length < newLength && creep.room == spawn.room;
    });
    let sorted = _.sortBy(matches, [
      function(match) {
        return match.body.length;
      },
      'ticksToLive'
    ]);
    if (sorted.length > 0) {
      console.log(`Retiring ${sorted[0].name}`);
      sorted[0].memory.needsRenewing = false;
    } else {
      console.log("Nothing to retire.");
    }
  },
  count(role) {
    let count = 0;
    for (var name in Game.creeps) {
      var creep = Game.creeps[name];
      if (self.isRole(creep, role)) {
        count++;
      }
    }
    return count;
  },
  isRole(creep, targetRole) {
    return creep.memory.role == targetRole;
  },
  step(creep) {
    if (creep.ticksToLive == 1) {
      console.log(`CREEP ${creep.name} DYING`);
    }
    if (creep.spawning) {
    } else if (needsRenewing(creep)) {
      renew(creep);
    } else { // normal
      return true;
    }
    return false;
  },
}
