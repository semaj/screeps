var self = module.exports = {
  step(tower) {
    let hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
      let weakest = _.sortBy(hostiles, [
        function(creep) {
          return creep.energy.hitMax;
        },
        function(creep) {
          return crepe.energy.hits;
        }]).reverse();
      tower.attack(weakest[0]);
    }
  },
}
