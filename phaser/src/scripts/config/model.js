export default class Model {
    constructor() {
        this.userID = ""
        this.ip = ""

        this._currentScene = null

        //this._base_gameWidth = 720
        //this._base_gameHeight = 1280

        this.g_settings = new globalSettings()
    }
    set currentScene(value) {
        this._currentScene = value
    }
    get currentScene() {
        return this._currentScene
    }
    gameSettings() {
        return this.g_settings.game
    }
    audioSettings() {
        return this.g_settings.audio
    }
    apiSettings() {
        return this.g_settings.api
    }
}

class globalSettings {
    constructor() {
        this.settings = {
            game: {
                debugMode: false,
                debugLog: true,
                gameDuration: 10000,
                pancakeSpeed: 800,
                pancakeVelocityY: 5,
                pointsPerPancake: 5,
                pancakeBodySleepThreshold: 40,
                scoreThreshold: 30,
                scoreThresholdMultiplier: 30,
                maxScore: 100,
                speedMultiplier: 1.3,
                velocityMultiplier: 1.1
            },
            audio: {
                muteAudio: false,
                masterVolume: 1.0,
                musicVolume: 1.0,
                soundFXVolume: 1.0
            },
            api: {
                IP: "127.0.0.1",
                frontURL: "",
                backURL: "",
                port: ""
            }
        }
    }
}