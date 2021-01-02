let Harvesters = require('harvester');
let H = require('helper');

var self = module.exports = {
  color: H.BLUE,
  hoard(creep, containersFirst) {
    let resource = creep.memory.resource;
    if (!resource) {
      resource = RESOURCE_ENERGY;
    }
    if (creep.store[resource] == 0) {
      creep.memory.hoardTarget = null;
    } else if (creep.store.getFreeCapacity() == 0) {
      let targets = [];
      if (!containersFirst) {
        targets = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN ||
              structure.structureType == STRUCTURE_TOWER) &&
              structure.store.getFreeCapacity(resource) > 0;
          }
        });
      }
      if (targets.length == 0) {
        targets = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER ||
              structure.structureType == STRUCTURE_STORAGE) &&
              structure.store.getFreeCapacity(resource) > 0;
          }
        });
      }
      if (targets.length > 0) {
        let closest = H.getNearestArray(creep, targets);
        creep.memory.hoardTarget = closest.id;
      }
    }
    if (creep.memory.hoardTarget) {
      let target = Game.getObjectById(creep.memory.hoardTarget);
      let rv = creep.transfer(target, resource);
      if (rv == ERR_NOT_IN_RANGE) {
        H.moveTo(creep, target, self.color);
      } else if (rv == ERR_FULL) {
        creep.say("hoarded");
        creep.memory.hoardTarget = null;
      }
      return true;
    } else {
      return false;
    }
  },
  step(creep) {
    if (!self.hoard(creep)) {
      Harvesters.harvest(creep);
    }
  }
}
