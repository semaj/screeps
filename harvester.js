let H = require('helper');
let Sources = require('source');

var self = module.exports = {
  color: H.YELLOW,
  harvest(creep, resource) {
    if (!resource) {
      resource = RESOURCE_ENERGY;
    }
    if (creep.store.getFreeCapacity() > 0) {
      if (!creep.memory.source) {
        creep.memory.source = Sources.whichSource(creep.room).id;
      }
      let source = Game.getObjectById(creep.memory.source);
      if (source.energy == 0) {
        creep.memory.source = Sources.whichSource(creep.room).id;
        return true;
      }
      let rv = creep.harvest(source);
      if (rv == ERR_NOT_IN_RANGE) {
        if (H.adjacentFull(source)) {
          creep.memory.source = Sources.whichSource(creep.room).id;
        } else {
          H.moveTo(creep, source, self.color);
        }
      }
      return true;
    } else {
      creep.memory.source = null;
      return false;
    }
  }
}
