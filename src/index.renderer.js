'use strict'

const moment = require('moment')
const shutdown = require('electron-shutdown-command')

const initialDelay = 2 * 60
const sessionLength = 20 * 60

const kill = () => {
  try {
    shutdown.logoff()
  } catch (err) {
    console.warn('Failed to sleep', err)
    window.alert('Failed to sleep')
  }
}

document.getElementById('testSleep').addEventListener('click', async () => {
  window.alert('Here we go sleepy')
  kill()
  window.alert('made it here?')
})

const withPadding = duration => {
  if (duration.asDays() > 0) {
    return 'at least one day'
  } else {
    return [
      ('0' + duration.hours()).slice(-2),
      ('0' + duration.minutes()).slice(-2),
      ('0' + duration.seconds()).slice(-2)
    ].join(':')
  }
}

let timeleft = initialDelay
let intervalId

const setLabel = html => {
  document.getElementById('timeLeft').innerHTML = html
}

const setTimeleft = seconds => {
  try {
    timeleft = parseInt(seconds)
  } catch (err) {
    console.warn('Failed to set time for seconds=' + seconds, err)
    alert('Failed. Please check logs')
  }
}

const submitCode = e => {
  const passcode = document.getElementById('passcode')
  const { value } = passcode

  if (value && value.toLowerCase() === 'abc123') {
    setLabel('Success')
    setTimeleft(sessionLength)
    if (!intervalId) {
      intervalId = setInterval(tick, 1000)
    }
  } else {
    setLabel('Invalid password')
  }
  passcode.value = ''
  // setTimeleft(e.target.value)
}
document.getElementById('enterCode').addEventListener('click', submitCode)

var audio = new Audio(__dirname + '/siren.wav')
const tick = () => {
  timeleft--

  const minutes = Math.floor(timeleft / 60)
  const seconds = Math.floor(timeleft % 60)

  if (timeleft < 0) {
    clearInterval(intervalId)
    intervalId = null
    setLabel('Logging off...')
    kill()
  } else {
    if (timeleft <= 20 && timeleft % 5 === 0 && timeleft > 0) {
      audio.currentTime = 0
      audio.play()
    }
    setLabel(`${minutes} minutes ${seconds} seconds`)
  }
}
intervalId = setInterval(tick, 1000)
