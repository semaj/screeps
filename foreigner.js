let H = require('helper');
let Harvesters = require('harvester');
let Hoarders = require('hoarder');

var self = module.exports = {
  color: H.BLUE,
  step(creep) {
    if (!creep.memory.homeRoom) {
      creep.memory.homeRoom = creep.room.name;
    }
    if (creep.room.name != creep.memory.homeRoom) {
      creep.memory.foreignTarget = null;
      if (creep.room.find(FIND_HOSTILE_CREEPS).length > 0 ||
        !Harvesters.harvest(creep)) {
        let home = Game.getObjectById(creep.memory.homeRoom);
        H.moveTo(creep, Game.rooms[creep.memory.homeRoom].controller, self.color);
        // return home
      }
    } else {
      if (!Hoarders.hoard(creep, true)) {
        if (creep.memory.foreignTarget) {
          H.moveToRaw(creep, creep.memory.foreignTarget, self.color);
        } else {
          let exit = null;
          let exits = _.shuffle([FIND_EXIT_RIGHT, FIND_EXIT_TOP, FIND_EXIT_LEFT, FIND_EXIT_BOTTOM])
          let index = 0;
          while (!exit) {
            exit = creep.room.find(exits[index])[0];
            index++;
          }
          creep.memory.foreignTarget = {
            pos: {
              x: exit.x,
              y: exit.y,
            }
          };
        }
      }
    }
  }
}
