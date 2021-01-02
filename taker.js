let H = require('helper');
let Sources = require('source');

var self = module.exports = {
  color: H.PURPLE,
  take(creep) {
    if (creep.store[RESOURCE_ENERGY] == 0) {
        var targets = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER ||
            structure.structureType == STRUCTURE_STORAGE) &&
              structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
          }
        });
        if (targets.length > 0) {
          let rv = creep.withdraw(targets[0], RESOURCE_ENERGY);
          if (rv == ERR_NOT_IN_RANGE) {
            H.moveTo(creep, targets[0], self.color);
          } else if (rv != OK) {
            console.log(`Take error ${rv}`);
          } else {
            creep.say('take');
          }
          return false; // don't continue
        } else {
          return true; // continue
        }
    } else {
      return true;
    }
  }
}
