const electron = require("electron")
const app = require("./app/index.js")

electron.app.on("ready", function () {
  app.listen(13531)

  const win = new electron.BrowserWindow({
    width: 400,
    height: 600,
    autoHideMenuBar: true,
    icon: "logo.png",
  })

  win.loadURL("http://localhost:13531/")

  win.webContents.on("new-window", function (event, url) {
    event.preventDefault()
    electron.shell.openExternal(url)
  })
})

electron.app.commandLine.appendSwitch("disable-smooth-scrolling")
