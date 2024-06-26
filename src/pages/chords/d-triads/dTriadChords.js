const dTriadChords = {
  bars: [],
}

const triads = [
  //major
  [
    ['D3', 'F#4', 'A4', 'D4'],
    [5, 4, 2],
    [9, 7, 7],
    [12, 12, 11],
  ],
  //augmented
  [
    ['D3', 'F#4', 'A#4', 'D4'],
    [5, 4, 3],
    [9, 8, 7],
    [13, 12, 11],
  ],
  //minor
  [
    ['D3', 'F4', 'A4', 'D4'],
    [5, 3, 2],
    [8, 7, 7],
    [12, 12, 10],
  ],
  //diminished
  [
    ['D3', 'F4', 'Ab4', 'D4'],
    [5, 3, 1],
    [8, 6, 7],
    [11, 12, 10],
  ],
]

for (let i = 1; i <= 3; i++) {
  triads.forEach(triad => {
    const bar = {
      chord: triad[0],
    }
    const tick = []
    triad[i].forEach((fret, index) => {
      tick.push({
        string: index + 2,
        fret,
      })
    })

    bar.ticks = [tick, tick, tick, tick]
    dTriadChords.bars.push(bar)
  })
}

export default dTriadChords