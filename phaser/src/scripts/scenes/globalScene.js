import SCENES from './scenes'
import utils from '../utils/utils'
import InputKeys from '../utils/inputKeys'

export default class GlobalScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENES.GLOBAL
        })
    }

    create(){
        this.model = this.sys.game.globals.model
        this.inputKeys = new InputKeys(this)
    }

    update() {
        if (utils.isLandscape && !this.scene.isPaused(this.model.currentScene)) {
            this.scene.pause(this.model.currentScene)
        } else if (!utils.isLandscape && this.scene.isPaused(this.model.currentScene)) {
            this.scene.resume(this.model.currentScene)
        }
        // if (Phaser.Input.Keyboard.JustDown(this.inputKeys.KEY_SPACE)) {
        //     this.sound.mute = !this.sound.mute
        // }
    }
}