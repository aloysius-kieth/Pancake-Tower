import d from '../utils/debugLog'
import apiCall from '../utils/apiCall'

export default class Base extends Phaser.Scene {
    AUDIO = {
        bgm: 'bgm',
        gameOver: 'gameOver',
        win: 'win',
        scorePoint: 'scorePoint',
        count3: 'count3',
        count2: 'count2',
        count1: 'count1',
        //blop: 'blop',
        buttonclick: 'buttonclick',
    }

    width
    height

    p_scene = null
    g_settings
    constructor(scene) {
        super(scene)
        this.p_scene = scene
    }
    init() {

    }
    preload() {
        this.width = this.sys.game.config.width
        this.height = this.sys.game.config.height

        this.model = this.sys.game.globals.model
        this.model.currentScene = this.p_scene

        this.apicall = new apiCall(this.model.apiSettings(), this.model.ip)
        //console.log(this.sys.game.globals.model.currentScene)
    }
    create() {

    }
    playSound(key) {
        let sfx = this.sound.get(key)
        if (sfx != null) {
            sfx.play()
        } else {
            console.log('no sfx to play from!')
        }
    }
    playSoundOnce(key, config) {
        this.sound.play(key, config)
    }
    playSoundCallback(key, callback = null) {
        var sfx = this.sound.add(key)
        if (sfx != null) {
            sfx.play()
            sfx.once(Phaser.Sound.Events.COMPLETE, () => {
                if (callback != null) {
                    callback()
                }
                //this.sound.remove(temp)
            })
        } else {
            console.log('no sfx to play from!')
        }
    }
    playMusic(key) {
        let music = this.sound.get(key)
        if (music != null) {
            music.play()
        } else {
            console.log('no music to play from!')
        }
    }
    fadeOutMusic(key, time = 1500) {
        let music = this.sound.get(key)
        if (music != null && music.isPlaying) {
            this.tweens.add({
                targets: music,
                volume: 0,
                duration: time,
                ease: 'Linear',
                onComplete: function () {
                    music.stop()
                }
            })
        }
    }
    fadeInMusic(key, time = 1500) {
        let music = this.sound.get(key)
        if (music != null) {
            music.play()
            this.tweens.add({
                targets: music,
                volume: 1,
                duration: time,
                ease: 'Linear',
            })
        }
    }
    stopMusic(key) {
        let music = this.sound.get(key)
        music.stop()
    }
    log(e) {
        d.log(e)
    }
}