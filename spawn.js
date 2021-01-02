let Tier = require('tier');
let Creeps = require('creep');

const ORDER = ["hoarder", "upgrader", "archer", "builder", "healer", "foreigner"];

function doSpawn(spawn, parts, role) {
  let rand = Math.floor(Math.random() * 10000);
  let level = Math.round(parts.length / MY_PARTS[role].length);
  let name = role + "-" + level + "-" + rand;
  let rv = spawn.spawnCreep(parts, name)
  if (rv != OK) {
    console.log(`Spawn ${role} ${name} failure ${rv}`);
  } else {
    console.log(`Spawning ${name}`);
    Game.creeps[name].memory.role = role;
    Creeps.retireOldest(spawn, role, parts.length);
  }
}

const MY_PARTS = {
  archer: [RANGED_ATTACK, MOVE],
  builder: [WORK, CARRY, MOVE, MOVE],
  hoarder: [WORK, CARRY, MOVE, MOVE],
  upgrader: [WORK, CARRY, MOVE, MOVE],
  healer: [HEAL, MOVE],
  foreigner: [WORK, CARRY, MOVE, MOVE],
}

function nextSpawn(spawn, role) {
  let available = spawn.room.energyCapacityAvailable;
  let parts = [];
  let cost = 0;
  let setCost = _.sum(_.map(MY_PARTS[role], function(part) {
    return BODYPART_COST[part];
  }));
  let moveCost = MY_PARTS[role].length;
  while (true) {
    let attempt = available - setCost;
    if (attempt < moveCost) {
      break;
    } else {
      parts = parts.concat(MY_PARTS[role]);
      cost += setCost;
      available = attempt;
    }
  }
  let room = spawn.room;
  let energy = room.energyAvailable;
  if (energy >= cost) {
    doSpawn(spawn, parts, role);
  } else if (energy >= setCost && !Tier.minMet(room, role)) {
    doSpawn(spawn, MY_PARTS[role], role);
  }
}

var self = module.exports = {
  step(spawn) {
    let room = spawn.room;
    if (spawn.spawning) {
    } else {
      let spawned = false;
      ORDER.forEach(function(role) {
        if (spawned) {
          return;
        }
        if (!Tier.minMet(room, role)) {
          nextSpawn(spawn, role);
          spawned = true;
        }
      });
      ORDER.forEach(function(role) {
        if (spawned) {
          return;
        }
        if (!Tier.maxMet(room, role)) {
          nextSpawn(spawn, role);
          spawned = true;
        }
      });
    }
  }
};
