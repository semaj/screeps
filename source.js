var self = module.exports = {
  whichSourceAbundant(room) {
    let abundant = null;
    room.find(FIND_SOURCES_ACTIVE).forEach(function(source) {
      if (!abundant || source.energy > abundant.energy) {
        abundant = source;
      }
    });
    return abundant;
  },
  whichSourceRandom(room) {
    let sources = room.find(FIND_SOURCES);
    let rand = Math.floor(Math.random() * sources.length);
    return sources[rand];
  },
  whichSource(room) {
    let sources = room.find(FIND_SOURCES_ACTIVE);
    if (sources.length == 0) {
      sources = room.find(FIND_SOURCES);
    }
    let candidates = [];
    sources.forEach(function(source) {
      let score = 8;
      [-1, 0, 1].forEach(function(a) {
        [-1, 0, 1].forEach(function(b) {
          if (!(a == 0 && b == 0)) {
            let x = source.pos.x + a;
            let y = source.pos.y + b;
            let decrement = false;
            room.lookAt(x, y).forEach(function(obj) {
              if (obj.terrain == 'wall' || obj.creep) {
                decrement = true;
              }
            });
            if (decrement) {
              score--;
            }
          }
        });
      });
      candidates.push({
        source: source,
        score: score,
      });
    });
    let sum = _.sum(_.map(candidates, 'score'));
    let runningCount = 0;
    let rand = Math.floor(Math.random() * sum);
    let choice = sources[0];
    _.shuffle(candidates).forEach(function(candidate) {
      if (candidate.score != 0) {
        if (rand < candidate.score) {
          choice = candidate.source;
        } else {
          rand -= candidate.score;
        }
      }
    });
    return choice;
  }
}
