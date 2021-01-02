let Creeps = require('creep');
let Spawns = require('spawn');
let Upgraders = require('upgrader');
let Hoarders = require('hoarder');
let Builders = require('builder');
let Archers = require('archer');
let Towers = require('tower');
let Rooms = require('room');
let Healers = require('healer');
let Foreigners = require('foreigner');

module.exports.loop = function() {
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    if (Creeps.step(creep)) {
      if (Creeps.isRole(creep, "upgrader")) {
        Upgraders.step(creep);
      }
      if (Creeps.isRole(creep, "hoarder")) {
        Hoarders.step(creep);
      }
      if (Creeps.isRole(creep, "builder")) {
        Builders.step(creep);
      }
      if (Creeps.isRole(creep, "archer")) {
        Archers.step(creep);
      }
      if (Creeps.isRole(creep, "healer")) {
        Healers.step(creep);
      }
      if (Creeps.isRole(creep, "foreigner")) {
        Foreigners.step(creep);
      }
    }
  }

  for (let name in Game.spawns) {
    let spawn = Game.spawns[name];
    Spawns.step(spawn);
  }

  for (let name in Game.rooms) {
    let room = Game.rooms[name];
    if (room.controller && room.controller.my) {
      Rooms.step(room);
      let towers = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
          return structure.structureType == STRUCTURE_TOWER;
        }
      });
      towers.forEach(function(tower) {
        Towers.step(tower);
      });
    }
  }
}
