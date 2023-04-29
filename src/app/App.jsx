import React, { useEffect, useState } from 'react'
import * as Tone from 'tone'

import exercises from './Exercises'
import Fretboard from './Fretboard'

import './App.scss'

import PianoURLs from './PianoURLs.js'

let scheduleEvent

let bar = 0
let tick = 0

let firstTick = true
let countIn = 4

let piano, metro
let currentExercise

function App (props) {

  currentExercise = props.exercise

  const [instrumentsLoaded, setInstrumentsLoaded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [activeBars, setActiveBars] = useState([])
  const [, updateState] = useState()

  const setExcercise = async exercise => {
    bar = 0
    tick = 0
    currentExercise = exercise
    if (playing) {
      await startStop()
    }
    setActiveBars(currentExercise.bars.map((bar, index) => index))
    updateState({})
  }

  const isActiveBar = (index) => {
    return activeBars.includes(index)
  }

  const toggleActiveBar = (index) => {
    if (isActiveBar(index)) {
      if (activeBars.length === 1) {
        return false
      }
      activeBars.splice(activeBars.indexOf(index), 1)
    } else {
      activeBars.push(index)
    }
    setTimeout(() => {
      updateState({})
    })

  }

  const exercisesByCategories = () => {
    const categories = {}
    Object.keys(exercises).forEach(exerciseKey => {
      if (!categories[exercises[exerciseKey].category]) {
        categories[exercises[exerciseKey].category] = {}
      }
      categories[exercises[exerciseKey].category][exerciseKey] = exercises[exerciseKey]
    })
    return categories
  }

  const [currentTick, setCurrentTick] = useState()

  const advance = () => {
    const currentBar = currentExercise.bars[bar]
    let nextTick = tick + 1
    if (!currentBar.ticks[nextTick]) {
      nextTick = 0
      let nextBar = bar + 1

      if (nextBar >= currentExercise.bars.length) {
        nextBar = 0
      }

      while (!isActiveBar(nextBar)) {
        nextBar = nextBar + 1
        if (!currentExercise.bars[nextBar]) {
          nextBar = 0
        }
      }
      bar = nextBar
    }
    tick = nextTick
  }

  const showTick = () => {
    setCurrentTick(currentExercise.bars[bar].ticks[tick])
  }

  const startStop = async () => {
    await Tone.start()
    const isPlaying = !playing
    Tone.Transport[isPlaying ? 'start' : 'stop']()
    setPlaying(isPlaying)
    tick = 0
    if (isPlaying) {
      scheduleTicks()
      firstTick = true
      countIn = 4
    }
    showTick()
  }

  const setTempo = bpm => {
    bpm = parseInt(bpm)
    setBpm(bpm)
    Tone.Transport.bpm.value = bpm
  }

  const playChord = time => {
    piano.releaseAll()
    currentExercise.bars[bar].chord.forEach((tick, index) => {
      piano.triggerAttack(tick, time)
    })
  }

  const scheduleTicks = () => {
    Tone.Transport.clear(scheduleEvent)
    scheduleEvent = Tone.Transport.scheduleRepeat((time) => {
      if (!firstTick) {
        advance()
      }
      metro.start(time)

      if (countIn > 0) {
        countIn--
        return
      }

      firstTick = false
      showTick()
      updateState({})
      if (tick === 0) {
        playChord(time)
      }
    }, '4n')
  }

  const initInstruments = () => {

    const initPiano = new Promise((resolve) => {
      piano = new Tone.Sampler({
        urls: PianoURLs,
        onload: () => {
          resolve()
        },
      }).toDestination()
    })

    const initMetro = new Promise((resolve) => {
      metro = new Tone.Player('/audio/metronome.wav', () => {
        resolve()
      }).toDestination()
    })

    return new Promise((resolveMain) => {
      Promise.all([initPiano, initMetro]).then(() => {
        resolveMain()
      })
    })
  }

  useEffect(() => {
    initInstruments().then(() => {
      setInstrumentsLoaded(true)
    })
    setExcercise(props.exercise)
  }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <React.Fragment>
      <div className="row mb-3 mt-4">
        <div className="col col-md-2">

          <button onClick={startStop}
                  className={`btn btn-${!instrumentsLoaded ? 'btn-outline-primary' : 'primary'}`}
                  disabled={!instrumentsLoaded}>
            {!instrumentsLoaded ? 'BUSY' : playing ? 'STOP' : 'PLAY'}
          </button>

        </div>
        <div className="col col-md-7 pt-2">
          <input className="form-range"
                 type="range"
                 min={40}
                 max={280}
                 value={bpm}
                 onChange={e => {setTempo(e.target.value)}}
          />
        </div>
        <div className="col col-md-3 pt-2">
          <label className="form-label">{bpm} BPM</label>
        </div>

      </div>

      <div className="row mb-3">
        <div className="col">
          <Fretboard
            currentExercise={currentExercise}
            currentTick={currentTick}
            playing={playing && countIn === 0}
            bar={bar}
            tick={tick}
          />
        </div>
      </div>

      <div className="row mb-5">
        <div className="col text-center">
          {currentExercise.bars.map((dot, index) =>
            <div className="indicator-container" key={`indicator-${index}`}>
              <span className={`indicator ${bar === index ? 'active' : ''}`}
                    key={index}
                    onClick={() => {
                      if (playing) {
                        return
                      }
                      bar = index
                      tick = 0
                      updateState({})
                    }}
              >
              </span>
              <br />
              <span className={`d-inline-block ms-2 me-2`} style={{ width: 15 }}>
              <input type="checkbox"
                     disabled={isActiveBar(index) && activeBars.length === 1}
                     checked={isActiveBar(index)}
                     onChange={() => {toggleActiveBar(index)}}
              />
            </span>
            </div>,
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

export default App
