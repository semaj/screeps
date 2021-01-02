let Harvesters = require('harvester');
let Takers = require('taker');
let Sites = require('site');
let H = require('helper');

// look at construction sites to see if any are taken

var self = module.exports = {
  color: H.ORANGE,
  step(creep) {
    let toBuild = Sites.whatToBuild(creep);
    if (toBuild == -1) {
      // nothing to build
      creep.say("done");
      creep.memory.builder = {};
      H.moveTo(creep, creep.room.controller, self.color);
    } else {
      creep.memory.builder = {
        remainingCost: Sites.cost(toBuild),
        targetSite: toBuild.id,
      }
    }
    if (creep.memory.builder.targetSite) {
      let target = Game.getObjectById(creep.memory.builder.targetSite);
      let remainingCost = creep.memory.builder.remainingCost;
      if (creep.store.getFreeCapacity() == 0) {
        creep.memory.building = true;
      } else if (creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.building = false;
      }
      if (creep.memory.building) {
        let rv = creep.build(target);
        if (rv == ERR_NOT_IN_RANGE) {
          H.moveTo(creep, target, self.color);
        } else if (rv != OK) {
          console.log(`Building error ${rv}`);
        } else {
          creep.say("build");
        }
      } else {
        if (Takers.take(creep)) {
          Harvesters.harvest(creep);
        }
      }
    }
  },
}
