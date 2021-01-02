let Harvesters = require('harvester');
let Takers = require('taker');
let H = require('helper');
let Sources = require('source');

var self = module.exports = {
  color: H.WHITE,
  step(creep) {
    if (creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
    }
    if (creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
    }
    if (creep.memory.upgrading) {
      let rv = creep.upgradeController(creep.room.controller);
      if (rv == ERR_NOT_IN_RANGE) {
        H.moveTo(creep, creep.room.controller, self.color);
      } else if (rv == OK) {
        creep.say('upgrade');
      }
    } else {
        if (Takers.take(creep)) {
          Harvesters.harvest(creep);
        }
    }
  },
}
