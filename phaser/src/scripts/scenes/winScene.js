import SCENES from './scenes'
import PineholeSceneBase from '../transitions/pinholeSceneBase'

var width
var height
var pageAnimationStr = ''
var pageSpriteStr = ''

export default class WinScene extends PineholeSceneBase {
    constructor() {
        super(SCENES.WIN)
    }
    preload() {
        super.preload()
    }
    init() {
        this.cameras.main.setBackgroundColor(0xffffff)
    }
    create(resultData) {
        super.create()

        this.resultData = resultData

        width = this.sys.game.config.width
        height = this.sys.game.config.height

        this.events.on(Phaser.Scenes.Events.TRANSITION_COMPLETE, () => {
            this.playSoundCallback(this.AUDIO.win, () => {
                this.fadeInMusic(this.AUDIO.bgm, 1500)
            })
        })

        this.addBackground()
        this.createGUIButton()

        if (this.resultData != null) {
            if (this.resultData.voucherCode != "" && this.resultData.voucherCode != null) {
                this.addVoucherbox()
                this.vouchercodeText.text = this.resultData.voucherCode
            }
        }
    }
    addBackground() {
        this.backgroundAnimKeys = []

        if (this.resultData != null) {
            if (this.resultData.win == "luckydraw" || this.resultData.win == "goldern ticket") {
                for (var i = 1; i < 25; i++) {
                    this.backgroundAnimKeys.push({ key: `win_luckydraw_${i}` })
                }
                this.anims.create({
                    key: 'winPageLuckyDraw',
                    frames: this.backgroundAnimKeys,
                    frameRate: 25,
                    repeat: -1
                })
                pageSpriteStr = 'win_luckydraw_0'
                pageAnimationStr = 'winPageLuckyDraw'
            } else {
                for (var i = 1; i < 25; i++) {
                    this.backgroundAnimKeys.push({ key: `win${i}` })
                }
                this.anims.create({
                    key: 'winPage-idle',
                    frames: this.backgroundAnimKeys,
                    frameRate: 25,
                    repeat: -1
                })
                pageSpriteStr = "win0"
                pageAnimationStr = 'winPage-idle'
            }
        }

        var background = this.add.sprite(0, 0, pageSpriteStr).play(pageAnimationStr)
        background.displayWidth = width
        background.displayHeight = height
        background.setOrigin(0, 0)
    }
    addVoucherbox() {
        var box = this.add.sprite(width / 2, height / 2, 'vouchercode-box')
        box.y = (height / 2) + box.displayHeight
        this.vouchercodeText = this.add.text(0, 0, '', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Heebo-Bold',
            align: 'center'
        })
        this.vouchercodeText.setOrigin(0.5)
        Phaser.Display.Align.In.Center(this.vouchercodeText, box)
    }
    createGUIButton() {
        var shopButton = this.add.image(width / 2, height, 'shop-button')
        shopButton.y = (height / 2) + shopButton.height * 3
        var btnText = this.add.text(0, 0, '', {
            fontSize: '38px',
            fill: '#ffffff',
            fontFamily: 'RoundPop',
            align: 'center'
        })
        var params = new URLSearchParams(location.search)
        if (params.has('type')) {
            if (params.get('type') == 'P2') {
                btnText.text = "HOME"
            } else if (params.get('type') == 'P3') {
                btnText.text = "LET'S SHOP"
            } else {
                btnText.text = "LET'S SHOP"
            }
        } else {
            btnText.text = "LET'S SHOP"
        }
        Phaser.Display.Align.In.Center(btnText, shopButton)
        shopButton.setInteractive()
        shopButton.on('pointerdown', (event) => {
            this.playSound(this.AUDIO.buttonclick)
            shopButton.disableInteractive()
            if (params.has('type')) {
                if (params.get('type') == 'P2') {
                    alert('go to home')
                } else if (params.get('type') == 'P3') {
                    alert('go to shop')
                }
            }
            alert('go to shop')
        })
    }
}