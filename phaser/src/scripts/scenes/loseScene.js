import SCENES from './scenes'
import PineholeSceneBase from '../transitions/pinholeSceneBase'

var width
var height

export default class LoseScene extends PineholeSceneBase {
  constructor() {
    super(SCENES.LOSE)
  }
  preload() {
    super.preload()
  }
  init() {
    this.cameras.main.setBackgroundColor(0xffffff)
  }
  create(resultData) {
    super.create()
    this.log(resultData)
    this.canPlayagain = resultData.canPlayagain

    width = this.sys.game.config.width
    height = this.sys.game.config.height
    this.events.on(Phaser.Scenes.Events.TRANSITION_COMPLETE, () => {
      this.playSoundCallback(this.AUDIO.gameOver, () => {
        this.fadeInMusic(this.AUDIO.bgm, 1500)
      })
    })

    this.backgroundAnimKeys = []
    for (var i = 1; i < 28; i++) {
      this.backgroundAnimKeys.push({ key: `lose${i}` })
    }
    this.anims.create({
      key: 'losePage-idle',
      frames: this.backgroundAnimKeys,
      frameRate: 25,
      repeat: -1,
    })

    this.addBackground()
    this.createGUIButton()
  }
  addBackground() {
    var background = this.add.sprite(0, 0, 'lose1').play('losePage-idle')
    background.displayWidth = width
    background.displayHeight = height
    background.setOrigin(0, 0)
  }
  createGUIButton() {
    this.tryagainButton = this.add.image(width / 2, height, 'shop-button')
    this.tryagainButton.y = height * 0.7
    this.trybtnText = this.add.text(0, 0, 'TRY AGAIN', {
      fontSize: '38px',
      fill: '#ffffff',
      fontFamily: 'RoundPop',
      align: 'center',
    })
    Phaser.Display.Align.In.Center(this.trybtnText, this.tryagainButton)
    this.tryagainButton.setInteractive()
    this.tryagainButton.on('pointerdown', (event) => {
      this.tryagainButton.disableInteractive()
      this.homeButton.disableInteractive()
      this.playSound(this.AUDIO.buttonclick)
      this.fadeOutMusic(this.AUDIO.bgm, 1500)
      var sceneStr = ''

      if (this.model.gameSettings().debugMode) {
        sceneStr = SCENES.GAME
      } else {
        if (this.canPlayagain) {
          sceneStr = SCENES.GAME
        } else {
          sceneStr = SCENES.MAXTRIES
        }
      }

      this.scene.transition({
        duration: 2500,
        target: sceneStr,
      })
    })

    this.homeButton = this.add.image(width / 2, height, 'shop-button')
    this.homeButton.y = height * 0.7 + this.tryagainButton.displayHeight
    this.homebtnText = this.add.text(0, 0, 'HOME', {
      fontSize: '38px',
      fill: '#ffffff',
      fontFamily: 'RoundPop',
      align: 'center',
    })
    Phaser.Display.Align.In.Center(this.homebtnText, this.homeButton)
    this.homeButton.setInteractive()
    this.homeButton.on('pointerdown', (event) => {
      // this.tryagainButton.disableInteractive()
      // this.homeButton.disableInteractive()
      this.playSound(this.AUDIO.buttonclick)
      alert('go to home')
    })
  }
}
