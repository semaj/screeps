var H = require('helper');

var self = module.exports = {
  color : H.PINK,
  step(creep) {
    let hurt = creep.room.find(FIND_MY_CREEPS, {
      filter: (myCreep) => {
        return myCreep.hits < myCreep.hitsMax;
      }
    });
    let sorted = _.sortBy(hurt, function(myCreep) {
      return myCreep.hits;
    });
    let warriors = _.filter(sorted, function(myCreep) {
      return myCreep.memory.role == "archer";
    });
    if (sorted.length > 0) {
      let toHeal = sorted[0];
      if (warriors.length > 0) {
        toHeal = warriors[0];
      }
      let rv = creep.heal(toHeal);
      if (rv == ERR_NOT_IN_RANGE) {
        H.moveTo(creep, toHeal, self.color);
      } else if (rv != OK) {
        console.log(`Heal failure ${rv}`);
      } else {
        creep.say("heal");
      }

    } else {
      //creep.say("h-patrol");
      let spawn = _.filter(_.values(Game.spawns), function(spawn) {
        return spawn.room == creep.room;
      })[0];
      if (!creep.memory.patrolTarget) {
        creep.memory.patrolTarget = spawn.id;
      }
      if (H.distanceTo(creep, creep.room.controller) < 8) {
        creep.memory.patrolTarget = spawn.id
      }
      if (H.distanceTo(creep, spawn) < 8) {
        creep.memory.patrolTarget = creep.room.controller.id;
      }
      let target = Game.getObjectById(creep.memory.patrolTarget);
      H.moveTo(creep, target, self.color);
    }
  },
}
