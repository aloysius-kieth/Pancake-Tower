import SCENES from './scenes'
import PinholeSceneBase from '../transitions/pinholeSceneBase'

var width, height

export default class MaxTriesScene extends PinholeSceneBase {
    constructor() {
        super(SCENES.MAXTRIES)
    }
    preload() {
        super.preload()
    }
    init() {
        this.cameras.main.setBackgroundColor(0xffffff)
    }
    create() {
        super.create()
        width = this.sys.game.config.width
        height = this.sys.game.config.height

        this.events.on(Phaser.Scenes.Events.TRANSITION_COMPLETE, () => {
            this.fadeInMusic(this.AUDIO.bgm, 1500)
        })
        this.backgroundAnimKeys = []
        for (var i = 1; i < 34; i++) {
            this.backgroundAnimKeys.push({ key: `tryagain${i}` })
        }
        this.anims.create({
            key: 'maxtries-idle',
            frames: this.backgroundAnimKeys,
            frameRate: 25,
            repeat: -1
        })

        this.addBackground()
        this.addGUIButton()
    }
    addBackground() {
        var background = this.add.sprite(0, 0, 'tryagain0').play('maxtries-idle')
        background.displayWidth = width
        background.displayHeight = height
        background.setOrigin(0, 0)
    }
    addGUIButton() {
        this.backButton = this.add.sprite(width / 2, height, 'back-large-button')
        this.backButton.y = height / 2 + this.backButton.displayWidth
        this.backButton.setInteractive()
        this.backButton.on('pointerdown', (event) => {
            this.backButton.disableInteractive()
            this.playSound(this.AUDIO.buttonclick)
            alert('go back to main page')
        })
    }
}