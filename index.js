const config = require("./config.json")
const mineflayer = require("mineflayer")
const readline = require("readline")

let bot = null
let reconnectAttempts = 0
let reconnectDelay = 5000
const MAX_RECONNECT_ATTEMPTS = config.max_reconnect_attempts || 5

// Create chat interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})
rl.setPrompt(config.prompt || "> ")

// Printing to the console
const RESET = "\x1b[0m"
const YELLOW = "\x1b[93m"
const RED = "\x1b[31m"

// Log message preserving input prompt
function print(msg, isError = false) {
    readline.cursorTo(process.stdout, 0)
    readline.clearLine(process.stdout, 0)
    if (isError) console.error(msg)
    else console.log(msg)

    if (!rl.closed) rl.prompt(true)
}
const log = (msg) => print(YELLOW + `[LOG] ${msg}` + RESET)
const error = (msg, text = "ERROR") => print(RED + `[${text}] ${msg}` + RESET)

// Create and connect bot
function connect() {
    bot = mineflayer.createBot({
        host: config.bot.host || "localhost",
        port: config.bot.port || 25565,
        username: config.bot.username || "bot",
        version: config.bot.version || "1.21.11"
    })

    bot.on("login", () => {
        log("Logged in!")
    })

    // Once spawned
    bot.once("spawn", () => {
        log("Spawned!")

        // Set initial reconnect attempts and delay
        reconnectAttempts = 0
        reconnectDelay = config.base_reconnect_timeout || 5000

        // Start the prompt
        if (!rl.closed) rl.prompt()
    })

    // Log all messages
    bot.on("message", (jsonMsg) => {
        print(jsonMsg.toString())
    })

    // Handle kicks
    bot.on("kicked", (reasonJSON) => {
        if (reasonJSON?.type === "string") {
            error(reasonJSON?.value, "KICKED")
        }

        if (reasonJSON?.type === "compound") {
            if (reasonJSON?.value?.translate?.value === "multiplayer.disconnect.banned") {
                error("You got banned!")
                if (bot) bot.stop()
                process.exit(1)
            }

            if (reasonJSON?.value?.translate?.value === "multiplayer.disconnect.kicked") {
                error("You got kicked with no reason specified!")
            }
        }
    })

    // Log errors
    bot.on("error", (err) => {
        error(`Bot error: ${err}`)
    })

    // Reconnect on logout (for any reason)
    bot.on("end", (reason) => {
        error(reason, "DISCONNECTED")

        // schedule reconnection 1 second later
        setTimeout(() => scheduleReconnect(), 1000)
    })
}

let reconnectTimeout = null  // Reference to the current reconnection timer

// Schedule reconnection with exponential backoff
function scheduleReconnect() {
    if (reconnectTimeout) clearTimeout(reconnectTimeout)
    
    reconnectAttempts++
    
    if (reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
        error("Max reconnection attempts reached. Stopping.")
        return
    }
    
    const delay = reconnectDelay
    reconnectDelay = Math.min(reconnectDelay * 2, 60000)
    
    log(`Reconnecting in ${delay/1000} seconds... (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`)
    
    reconnectTimeout = setTimeout(() => {
        log("Reconnecting...")
        connect()
    }, delay)
}

// Input handling
rl.on("line", (line) => {
    // Remove any whitespace
    const text = line.trim()

    // If it's not a command
    if (!text.startsWith(config.command_prefix)) {
        // Send it in chat and return
        if (bot) bot.chat(text)
        return
    }

    // Commands
    let command = text.slice(config.command_prefix.length)
    switch (command) {

        // Quit
        case "q":
            log("Quitting...")
            rl.close()
            if (bot) bot.quit()
            process.exit(0)
            break

        // Reconnect
        case "r":
            log("Manual reconnect triggered.")
            if (bot) bot.quit()
            break

        // Kick (for debug)
        case "k":
            log("Simulating kick...")
            if (bot) bot.end("Simulated kick")
            break
    }

    // After all, reprompt (if process is not quit)
    if (!rl.closed) rl.prompt()
})

// Start initial connection
connect()

