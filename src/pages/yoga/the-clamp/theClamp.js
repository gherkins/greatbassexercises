const theClamp = {
  bars: [],
}

const fingerPositions = []

const bar = {
  chord: [],
  ticks: [],
}

// up
for (let string = 1; string <= 4; string++) {
  for (let finger = 1; finger <= 4; finger++) {
    const tick = {
      string,
      fret: finger + 4,
      finger,
    }

    fingerPositions[finger - 1] = tick

    if (fingerPositions.length >= 4 && !(string === 1 && finger === 4)) {
      bar.ticks.push([
        tick, ...fingerPositions,
      ])
    }

  }
}

//down
for (let string = 3; string >= 1; string--) {
  for (let finger = 1; finger <= 4; finger++) {

    fingerPositions[finger - 1] = {
      string,
      fret: finger + 4,
      finger,
    }

    bar.ticks.push([
      ...fingerPositions,
    ])
  }
}
theClamp.bars.push(bar)

export default theClamp
