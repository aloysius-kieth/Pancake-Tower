import SCENES from './scenes'
import BaseScene from './base'
import utils from '../utils/utils'
import Global from '../config/global'

var loadingCircle
var percentText
var width, height

var loadingText

export default class PreloadScene extends BaseScene {
  constructor() {
    super(SCENES.PRELOAD)
  }
  preload() {
    super.preload()

    this.cameras.main.setBackgroundColor(0xffffff)
    this.scene.launch(SCENES.GLOBAL)

    width = this.cameras.main.centerX
    height = this.cameras.main.centerY

    let global = new Global()

    percentText = this.add.text(width, height, '0 %', {
      font: '32px Heebo-Regular',
      fill: '#000000',
    })
    percentText.setOrigin(0.5, 0.45)

    loadingCircle = this.add.graphics()
    loadingCircle.lineStyle(8, 0xffcc00)

    loadingText = this.make.text({
      x: width,
      y: height - 110,
      text: 'Loading...',
      style: {
        font: '28px Heebo-Regular',
        fill: '#000000',
      },
    })
    loadingText.setOrigin(0.5, 0.5)

    this.loadTextTween = this.tweens.add({
      targets: loadingText,
      ease: 'Linear',
      repeat: -1,
      duration: 500,
      alpha: { from: 0, to: 1 },
      yoyo: true,
    })

    // update progress bar
    this.load.on('progress', this.updateProgressBar)

    // update file progress text
    this.load.on('fileprogress', function (file) {
      //assetText.setText('Loading asset: ' + file.key);
    })

    // remove progress bar when complete
    this.load.on('complete', () => {
      // this.model.g_settings = this.cache.json.get('settings')
      global.settings = this.cache.json.get('settings')
      this.initAudio()

      let params = new URLSearchParams(location.search)
      if (params.has('userID')) {
        this.model.userID = params.get('userID')
      }
      this.log('userID ' + this.model.userID)
      if (params.has('audio')) {
        if (params.get('audio') == 'off') {
          this.sound.mute = true
        } else {
          this.sound.mute = false
        }
      }

      if (/*this.model.userID != '' && this.model.userID !== undefined*/ true) {
        if (this.model.gameSettings().debugMode) {
          this.canPlay = true

          this.delay = this.time.delayedCall(
            3000,
            function () {
              loadingText.destroy()
              percentText.destroy()
              loadingCircle.destroy()
              this.ready()
            },
            [],
            this
          )
        } else {
          this.apicall.checkMaxTries(this.model.userID, (result, success) => {
            if (success) {
              if (!result) {
                this.canPlay = false
              } else {
                this.canPlay = true
              }
            } else {
              this.canPlay = false // returns ERROR 400 for exceeded tries
            }

            this.delay = this.time.delayedCall(
              3000,
              function () {
                loadingText.destroy()
                percentText.destroy()
                loadingCircle.destroy()
                this.ready()
              },
              [],
              this
            )
          })
        }
      } else {
        loadingText.text = 'Please login to play!'
      }
    })

    this.ready()

    // load sprites
    this.loadSprites()

    this.loadPNGSeq()

    // load json files
    this.loadJsonFiles()

    // load audio
    this.loadAudio()
  }
  initAudio() {
    let musicProp = {
      volume: this.model.audioSettings().musicVolume,
      loop: true,
    }
    let soundProp = {
      volume: this.model.audioSettings().soundFXVolume,
    }

    this.sound.add(this.AUDIO.bgm, musicProp)
    this.sound.add(this.AUDIO.gameOver, soundProp)
    this.sound.add(this.AUDIO.scorePoint, soundProp)
    this.sound.add(this.AUDIO.count3, soundProp)
    this.sound.add(this.AUDIO.count2, soundProp)
    this.sound.add(this.AUDIO.count1, soundProp)
    this.sound.add(this.AUDIO.buttonclick, soundProp)
  }
  loadJsonFiles() {
    this.load.json('settings', 'assets/json/settings.json')
    this.load.json('shapes', 'assets/json/assisi.json')
    this.load.json('plateShape', 'assets/json/plate.json')
  }
  loadAudio() {
    this.load.audio('buttonclick', 'assets/audio/button.mp3')
    this.load.audio('scorePoint', 'assets/audio/scorePoint.mp3')
    this.load.audio('gameOver', 'assets/audio/gameover.mp3')
    this.load.audio('count1', 'assets/audio/Count1.mp3')
    this.load.audio('count2', 'assets/audio/Count2.mp3')
    this.load.audio('count3', 'assets/audio/Count3.mp3')
    this.load.audio('bgm', 'assets/audio/backgroundMusic.mp3')
    this.load.audio('win', 'assets/audio/Win.mp3')
  }
  loadSprites() {
    this.load.image('back-button', 'assets/img/back-button.png')
    this.load.image('next-button', 'assets/img/next-button.png')
    this.load.image('tryagain-button', 'assets/img/tryagain-button.png')
    this.load.image('shop-button', 'assets/img/shop-button2.png')
    this.load.image('back-large-button', 'assets/img/back-large-button.png')
    this.load.image('vouchercode-box', 'assets/img/vouchercode-box.png')
    this.load.image('plate', 'assets/img/plate.png')
    this.load.image('background-gameplay', 'assets/img/background-gameplay.png')
    this.load.image('overlay', 'assets/img/overlay.png')
    this.load.image('score-tab', 'assets/img/score-tab.png')
    this.load.image('boy', 'assets/img/boy.png')
    this.load.image('girl', 'assets/img/girl.png')
  }
  loadPNGSeq() {
    this.load.spritesheet('pancake-sprites', 'assets/img/pancake-spritesheet.png', {
      frameWidth: 345,
      frameHeight: 332,
    })
    if (utils.GetBrowserPlatform() != 'desktop') {
      // instructions animation (mobile)
      for (var i = 1; i < 34; i++) {
        this.load.image(`instruct${i}`, `assets/img/Instructions/mobile/Instructions(${i}).png`)
      }
    } else {
      // instructions animation (desktop)
      for (var i = 1; i < 34; i++) {
        this.load.image(`instruct${i}`, `assets/img/Instructions/desktop/Instructions(${i}).png`)
      }
    }
    // lose page animation
    for (var i = 1; i < 28; i++) {
      this.load.image(`lose${i}`, `assets/img/losePage/Lose(${i}).png`)
    }
    // win page animation
    for (var i = 1; i < 25; i++) {
      this.load.image(`win${i}`, `assets/img/winPage/Win(${i}).png`)
    }
    // winPage - lucky draw
    for (var i = 1; i < 25; i++) {
      this.load.image(`win_luckydraw_${i}`, `assets/img/winPage_LuckyDraw/LuckyDraw(${i}).png`)
    }
    // Countdown animation
    for (var i = 1; i < 41; i++) {
      this.load.image(`countdown${i}`, `assets/img/countdown/countdown(${i}).png`)
    }
    // max tries page animation
    for (var i = 1; i < 34; i++) {
      this.load.image(`tryagain${i}`, `assets/img/maxtriesPage/TryAgain(${i}).png`)
    }
  }
  init() {
    super.init()
    this.readyCount = 0
  }
  create() {
    super.create()
  }
  ready() {
    this.readyCount++
    if (this.readyCount === 2) {
      var sceneStr = this.canPlay ? (sceneStr = SCENES.MAIN_MENU) : (sceneStr = SCENES.MAXTRIES)
      this.scene.start(sceneStr)
    }
  }
  updateProgressBar(value) {
    percentText.setText(Phaser.Math.RoundTo(value * 100) + ' %')
    loadingCircle.beginPath()
    loadingCircle.arc(
      width,
      height,
      80,
      Phaser.Math.DegToRad(270),
      Phaser.Math.DegToRad(270 + value * 360),
      false,
      0.02
    )
    loadingCircle.strokePath()

    loadingText.text = value < 0.5 ? 'Preparing the pancakes...' : value < 0.99 ? 'Stacking them nicely...' : 'Done!'
  }
}
