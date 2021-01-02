var self = module.exports = {
  RED: '#ff0000',
  BLUE: '#0628ff',
  WHITE: '#ffffff',
  GREEN: '#08ff00',
  YELLOW: '#fff300',
  PURPLE: '#5500ff',
  ORANGE: '#ff8a06',
  PINK: '#f700ff',
  distanceTo(start, stop) { return start.pos.findPathTo(stop).length; },
  getNearest(start, obj) {
    let closest = null;
    let closestLength = Number.MAX_SAFE_INTEGER;
    for (let name in obj) {
      let o = obj[name];
      let length = self.distanceTo(start, o);
      if (!closest) {
        closest = o;
      } else if (length <= closestLength) {
        closest = o;
        closestLength = length;
      }
    }
    if (!closest) {
      throw "No nearest!";
    }
    return closest;
  },
  getNearestArray(start, a) {
    let sorted = _.sortBy(a, function(x) {
      return self.distanceTo(start, x);
    });
    if (sorted.length > 0) {
      return sorted[0];
    } else {
      throw "No nearest array!";
    }
  },
  adjacentFull(obj) {
    // something wrong here
    const p = [-1, 0, 1];
    for (let i = 0; i < p.length; i++) {
      for (let j = 0; j < p.length; j++) {
        let xPlus = p[i];
        let yPlus = p[j];
        if (xPlus == 0 && yPlus == 0) {
          continue;
        }
        let x = obj.pos.x + xPlus;
        let y = obj.pos.y + yPlus;
        let square = obj.room.lookAt(x, y);
        let isWallOrCreep = false;
        for (let k = 0; k < square.length; k++) {
          if (square[k].terrain == 'wall' || square[k].creep) {
             isWallOrCreep = true;
          }
        }
        if (!isWallOrCreep) {
          return false;
        }
      }
    }
    return true;
  },
  moveTo(creep, dest, color) {
    //if (creep.room.memory.map[creep.pos.x][creep.pos.y] >= 0) {
      //creep.room.memory.map[creep.pos.x][creep.pos.y]++;
    //}
    return creep.moveTo(dest, {visualizePathStyle : {stroke : color, opacity: 0.3}});
  },
  moveToRaw(creep, dest, color) {
    //if (creep.room.memory.map[creep.pos.x][creep.pos.y] >= 0) {
      //creep.room.memory.map[creep.pos.x][creep.pos.y]++;
    //}
    return creep.moveTo(dest.pos.x, dest.pos.y, {visualizePathStyle : {stroke : color, opacity: 0.3}});
  },
}

