#!/usr/bin/env node
const fs = require("fs")
const exec = require("child_process").exec
const path = require("path")
const express = require("express")
const bodyParser = require("body-parser")
const jsonParser = bodyParser.json()
const app = express()

function handleExec(error, stdout, stderr) {
  if (error) console.log(error)
  if (stderr) console.log(stderr)
  console.log(stdout)
}

const SETTINGS_DIRECTORY = path.join(process.env.HOME, "/.config/xcalib-gui")
const SETTINGS_FILE = path.join(SETTINGS_DIRECTORY, "/settings.json")

if (!fs.existsSync(SETTINGS_DIRECTORY)) {
  fs.mkdirSync(SETTINGS_DIRECTORY, { recursive: true })
}

app.use(
  "/",
  express.static(path.resolve(__dirname + "/public"), { extensions: ["html"] })
)

app.get("/load", (request, response) => {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"))
      return response.send(settings)
    } else {
      return response.send(null)
    }
  } catch (e) {
    console.log(e)
    return response.send(null)
  }
})

app.post("/update", jsonParser, function (request, response) {
  try {
    const settings = request.body
    let command = ""

    if (settings.shouldSetColorsIndividually) {
      command = `xcalib -c; xcalib ${settings.invert ? "-i" : ""} -red ${
        settings.colors.red.gamma
      } ${settings.colors.red.brightness} ${
        settings.colors.red.contrast
      } -green ${settings.colors.green.gamma} ${
        settings.colors.green.brightness
      } ${settings.colors.green.contrast} -blue ${settings.colors.blue.gamma} ${
        settings.colors.blue.brightness
      } ${settings.colors.blue.contrast} -a`
    } else {
      command = `xcalib -c; xcalib ${settings.invert ? "-i" : ""} -gammacor ${
        settings.gamma
      } -brightness ${settings.brightness} -co ${settings.contrast} -a`
    }

    exec(command, handleExec)
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings), "utf8")
    return response.send(true)
  } catch (e) {
    console.log(e)
    return response.send(false)
  }
})

app.post("/clear", function (request, response) {
  try {
    exec(`xcalib -c`, handleExec)
    fs.writeFileSync(SETTINGS_FILE, "null", "utf8")
    return response.send(true)
  } catch (e) {
    console.log(e)
    return response.send(false)
  }
})

module.exports = app
