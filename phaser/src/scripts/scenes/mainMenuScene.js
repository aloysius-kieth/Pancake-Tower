import SCENES from './scenes'
import PineholeSceneBase from '../transitions/pinholeSceneBase'

export default class mainMenuScene extends PineholeSceneBase {
    constructor() {
        super(SCENES.MAIN_MENU)
    }
    preload() {
        super.preload()
    }
    init() {
        this.cameras.main.setBackgroundColor(0x000000)
    }
    create() {
        super.create()

        this.sound.pauseOnBlur = false
        this.sound.volume = this.model.audioSettings().masterVolume
        this.playMusic(this.AUDIO.bgm)

        this.backgroundAnimKeys = []
        for (var i = 1; i < 34; i++) {
            this.backgroundAnimKeys.push({ key: `instruct${i}` })
        }

        this.anims.create({
            key: 'instructions-idle',
            frames: this.backgroundAnimKeys,
            frameRate: 25,
            repeat: -1
        })

        this.addBackground()
        this.createGUIButtons()

        // this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        //     this.time.delayedCall(250, () => {
        //         this.scene.start(SCENES.GAME, { fadeIn: true })
        //     })
        // })
    }
    addBackground() {
        var background = this.add.sprite(0, 0, 'instruct1').play('instructions-idle')
        background.displayWidth = this.width
        background.displayHeight = this.height
        background.setOrigin(0, 0)
    }
    createGUIButtons() {
        var backButton = this.add.image(this.width / 2, this.height, 'back-button')
        backButton.x = this.width / 2 - (backButton.width / 2)
        backButton.y = this.height - backButton.height
        backButton.setOrigin(0.55, 0.5)
        backButton.setInteractive()
        //.setOrigin(1.05, -4.0)
        //.setDisplaySize(width, height)
        backButton.on('pointerdown', (event) => {
            backButton.disableInteractive()
            startGameButton.disableInteractive()
            this.playSound(this.AUDIO.buttonclick)
            alert('go back to game selection')
        })

        var startGameButton = this.add.image(this.width / 2, this.height, 'next-button')
        startGameButton.x = this.width / 2 + (startGameButton.width / 2)
        startGameButton.y = this.height - startGameButton.height
        startGameButton.setOrigin(0.45, 0.5)
        startGameButton.setInteractive()
        // this.startGameButton.setDisplaySize(this.startGameButton.width, this.startGameButton.height)
        startGameButton.on('pointerdown', (event) => {
            startGameButton.disableInteractive()
            backButton.disableInteractive()
            this.playSound(this.AUDIO.buttonclick)
            this.fadeOutMusic(this.AUDIO.bgm, 1500)

            this.scene.transition({
                duration: 2500,
                target: SCENES.GAME,
            })
        })
    }
}