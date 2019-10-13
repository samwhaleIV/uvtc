const {
    app,
    BrowserWindow
} = require("electron");

let window;

app.commandLine.appendSwitch("--disable-background-timer-throttling");
app.commandLine.appendSwitch("--disable-backgrounding-occluded-windows");

function createWindow() {
    window = new BrowserWindow({
        width: 748,
        height: 668,
        nodeIntegration: true,
        backgroundThrottling: false,
        show: false,
        backgroundColor: "#000000"
    });
    window.webContents.openDevTools();
    window.setMenu(null);
    window.loadURL("http://localhost/uvtc/");
    window.on("closed",() => {
        window = null;
    });
    window.once("ready-to-show",() => {
        window.show();
    });
}

app.on("ready",createWindow);

app.on("window-all-closed",() => {
    app.quit();
});

app.on("activate",() => {
    if(window === null) {
        createWindow()
    }
});
