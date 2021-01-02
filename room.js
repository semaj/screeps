let Sites = require('site');

const PRIORITY = [
"spawn",
"extension",
"tower",
"road",
"container",
"storage",
];

function doBuildRoad(room, x, y) {
  let rv = room.createConstructionSite(x, y, 'road');
  if (rv == OK) {
    if (!room.memory.structures['road']) {
      room.memory.structures['road'] = 0;
    }
    room.memory.map[x][y] = -1;
    room.memory.structures['road']++;
    return true;
  } else {
    //console.log(`Building road ${x} ${y} error ${rv}`);
  }
  return false;
}

function nextSourceRoad(room) {
  let sources = room.find(FIND_SOURCES);
  let built = false;
  sources.forEach(function(source) {
    if (built) {
      return;
    }
    const p = [-1, 0, 1];
    for (let i = 0; i < p.length; i++) {
      for (let j = 0; j < p.length; j++) {
        let xPlus = p[i];
        let yPlus = p[j];
        if (xPlus == 0 && yPlus == 0) {
          continue;
        }
        let x = source.pos.x + xPlus;
        let y = source.pos.y + yPlus;
        let isWall = false;
        let square = room.lookAt(x, y);
        for (let k = 0; k < square.length; k++) {
          if (square[k].terrain == 'wall') {
            isWall = true;
          }
        }
        if (isWall) {
          if (doBuildRoad(room, x, y)) {
            built = true;
          }
        }
      }
    }
  });
  return built;
  //room.memory.map[29][21] = 0;
  //room.memory.map[29][22] = 0;
  //room.memory.map[29][23] = 0;
  //room.memory.map[28][23] = 0;
  //room.memory.map[30][23] = 0;
  //room.memory.map[31][23] = 0;
  //room.memory.map[34][21] = 0;
  //room.memory.map[35][20] = 0;
  //room.memory.map[35][20] = 0;
  //room.memory.map[36][21] = 0;
  //room.memory.map[35][22] = 0;
  //if (candidate) {
    //let rv = room.createConstructionSite(candidate[0], candidate[1], 'road');
    //console.log(`Trying Building road ${candidate}`);
    //if (rv == OK) {
      //if (!room.memory.structures['road']) {
        //room.memory.structures['road'] = 0;
      //}
      //room.memory.map[candidate[0]][candidate[1]] = -1;
      //room.memory.structures['road']++;
      //return true;
    //} else {
      //console.log(`Building road ${candidate} error ${rv}`);
    //}
  //}
  //return false;
}

function nextSwampRoad(room) {
  let candidates = [];
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      let count = room.memory.map[i][j];
      let swamp = _.includes(_.values(room.lookAt(i, j)), function(obj) {
        return obj.terrain == 'swamp';
      });
      if (count > 10 && swamp) {
        candidates.push({
          pos: [i, j],
          count: count,
        });
      }
    }
  }
  let sorted = _.sortBy(candidates, 'count').reverse();
  if (sorted.length > 0) {
    let x = sorted[0].pos[0];
    let y = sorted[0].pos[1];
    console.log(`Building road ${x} ${y}`);
    let rv = room.createConstructionSite(x, y, 'road');
    if (rv == OK) {
      if (!room.memory.structures['road']) {
        room.memory.structures['road'] = 0;
      }
      room.memory.map[x][y] = -1;
      room.memory.structures['road']++;
      return true;
    } else {
      console.log(`Building road ${x} ${y} error ${rv}`);
    }
  }
  return false;
}

function nextSite(room, type) {
  let terrain = new Room.Terrain(room.name);
  let x = 30;
  let y = 30;
  let rv = room.createConstructionSite(x, y, type);
  let rX = Math.floor(Math.random() * 3);
  let rY = Math.floor(Math.random() * 2);
  let directionX = [-2, 0, 2][rX];
  let directionY = [-2, 0, 2][rY];
  while (directionX == 0 && directionY == 0) {
    rX = Math.floor(Math.random() * 3);
    rY = Math.floor(Math.random() * 2);
    directionX = [-2, 0, 2][rX];
    directionY = [-2, 0, 2][rY];
  }
  while (rv != OK) {
    x += directionX;
    y += directionY;
    rv = room.createConstructionSite(x, y, type);
  }
  if (!room.memory.structures[type]) {
    room.memory.structures[type] = 0;
  }
  room.memory.structures[type]++;
}

// store map of most frequently visited squares, build roads there
function nextBuild(room) {
  if (Sites.sites(room).length < 10) {
    for (let i = 0; i < PRIORITY.length; i++) {
      let structureName = PRIORITY[i];
      if (room.memory.structures[structureName] &&
        room.memory.structures[structureName] >=
        CONTROLLER_STRUCTURES[structureName][room.controller.level]) {
        continue;
      }
      if (structureName == 'road') {
        if (!nextSourceRoad(room)) {
          nextSwampRoad(room);
        }
      } else {
        nextSite(room, structureName);
      }
    }
  }
}

var self = module.exports = {
  step(room) {
    if (!room.memory.bootstrapped) {
      self.bootstrap(room);
    }
    nextBuild(room);
    //if (room.memory.structures.container == 5) {
      //room.memory.structures.container = 0;
    //}
  },
  allRole(room, roles) {
    return _.filter(_.values(Game.creeps),
      function(creep) {
        return creep.room == room && _.includes(roles, creep.memory.role);
      });
  },
  bootstrap(room) {
    console.log(`Bootstrapping room ${room}`);
    room.memory.bootstrapped = true;
    room.memory.structures = {
      spawn: 1,
    }
    room.memory.map = []
    for (let i = 0; i < 50; i++) {
      room.memory.map[i] = [];
      for (let j = 0; j < 50; j++) {
        room.memory.map[i][j] = 0;
      }
    }
  }
}
