var self = module.exports = {
  cost(site) {
    return CONSTRUCTION_COST[site.structureType];
  },
  sites(room) {
    let candidates = [];
    for (let name in Game.constructionSites) {
      let site = Game.constructionSites[name];
      if (site.room == room) {
        candidates.push(site);
      }
    }
    return candidates;
  },
  whatToBuild(creep) {
    let candidates = [];
    for (let name in Game.constructionSites) {
      let site = Game.constructionSites[name];
      if (creep.room == site.room) {
        candidates.push(site);
      }
    }
    candidates = _.sortBy(candidates, 'progress').reverse();
    if (candidates.length > 0) {
      return candidates[0];
    } else {
      return -1;
    }
  },
}
