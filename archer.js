var H = require('helper');

var self = module.exports = {
  color : H.RED,
  step(creep) {
    let hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
      //creep.room.activateSafeMode();
      //creep.say("attack");
      //let targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
      //console.log(`${creep.name} Trying to attack`);
      //if (targets.length > 0) {
      let closest = H.getNearestArray(creep, hostiles);
      let rv = creep.rangedAttack(closest);
      if (rv == ERR_NOT_IN_RANGE) {
        H.moveTo(creep, closest, self.color);
      } else if (rv != OK) {
        console.log(`${creep.name} Ranged mass attack failure ${rv}`);
      } else {
        creep.say("attack");
      }
    } else if (creep.hits < creep.hitsMax) {
      creep.say("hurt");
      H.moveTo(creep, creep.room.controller, self.color);
    } else {
      //creep.say("patrol");
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
