import utils from '../utils/utils'
import SCENES from './scenes'
import PineholeSceneBase from '../transitions/pinholeSceneBase'
import inputkeys from '../utils/inputKeys'

var shapes, plateShape
var isGameOver = true
var canDrop = false
var bodiesSleeping = 0

var pancakeHeight

var gameSettings = {
    pancakeSpeed: 800,
    pancakeVelocityY: 5,
    pointsPerPancake: 20,
    pancakeBodySleepThreshold: 40,
    scoreThreshold: 40,
    scoreThresholdMultiplier: 30,
    maxScore: 100,
    speedMultiplier: 1.3,
    velocityMultiplier: 1.1
}

const DIFFICULTY = {
    EASY: 0,
    NORMAL: 1,
    HARD: 2,
    IMPOSSIBLE: 3
}
var difficultyMode = DIFFICULTY.EASY

export default class GameScene extends PineholeSceneBase {
    fpsText

    constructor() {
        super(SCENES.GAME)
    }
    preload() {
        super.preload()
        this.setDefaults()
    }
    init() {
        this.cameras.main.setBackgroundColor(0x000000)
        shapes = this.cache.json.get('shapes')
        plateShape = this.cache.json.get('plateShape')
    }
    create() {
        super.create()

        this.addCountdownAnimation()

        this.matter.world.update30Hz()
        //this.matter.world.on('collisionstart', this.checkCollision, this)

        this.pancakeGrp = this.add.group()
        this.addBackground()

        this.events.on(Phaser.Scenes.Events.TRANSITION_COMPLETE, () => {
            this.time.delayedCall(this.delayDuration / 2, () => {
                this.addBackgroundOverlay()
                this.addCountdown()
                this.addPlate()
                this.addMovingPancake()
                this.addScoretab()
                this.addCheer()
                this.setCameras()
                this.createMovingPancakeTween()
                this.hideGameElements()
            })
        })

        this.initEventCallbacks()
    }
    setDefaults() {
        this.score = 0
        canDrop = false
        isGameOver = true
        difficultyMode = DIFFICULTY.EASY
        bodiesSleeping = 0
        gameSettings.pancakeSpeed = this.model.gameSettings().pancakeSpeed
        gameSettings.pancakeVelocityY = this.model.gameSettings().pancakeVelocityY
        gameSettings.pointsPerPancake = this.model.gameSettings().pointsPerPancake
        gameSettings.pancakeBodySleepThreshold = this.model.gameSettings().pancakeBodySleepThreshold
        gameSettings.scoreThreshold = this.model.gameSettings().scoreThreshold
        gameSettings.scoreThresholdMultiplier = this.model.gameSettings().scoreThresholdMultiplier
        gameSettings.maxScore = this.model.gameSettings().maxScore
    }
    initEventCallbacks() {
        if (utils.GetBrowserPlatform() != 'desktop') {
            // mobile controls
            this.input.on('pointerdown', (pointer) => {
                if (isGameOver || !canDrop) return
                this.dropPancake()
            })
        } else {
            this.inputkeys = new inputkeys(this)
        }

        this.matter.world.on('sleepstart', (event, body) => {
            if (isGameOver) return

            bodiesSleeping++
            //this.log('bodies sleeping: ' + bodiesSleeping)
            if (this.pancakeGrp.getLength() == bodiesSleeping) {
                this.zoomCamera()
                this.showMovingPancake()
            }
            if (body.label == 'pancake') {
                if (!body.hit) {
                    body.hit = true
                    this.playSound(this.AUDIO.scorePoint)
                    this.score += gameSettings.pointsPerPancake
                    this.updateScore()
                    this.animateCheer()
                    //this.log('current score: ' + score)
                }
            }
            if (this.model.gameSettings().debugMode) {
                //event.source.gameObject.setTint(0xff0000);
            }
        });

        this.matter.world.on('sleepend', (event) => {
            if (isGameOver) return

            bodiesSleeping--
            //this.log('bodies awake: ' + bodiesSleeping)
            if (this.model.gameSettings().debugMode) {
                //event.source.gameObject.setTint(0xffffff);
            }
        });
    }
    addCountdownAnimation() {
        this.countdownAnimKeys = []
        for (var i = 1; i < 41; i++) {
            this.countdownAnimKeys.push({ key: `countdown${i}` })
        }
        this.anims.create({
            key: 'pancake-drop',
            frames: this.anims.generateFrameNumbers('pancake-sprites', { start: 0, end: 11 }),
            frameRate: 25
        })
        this.anims.create({
            key: 'countdown-play',
            frames: this.countdownAnimKeys,
            frameRate: 15,
        })
    }
    setDifficulty() {
        if (this.score % gameSettings.scoreThreshold == 0 && this.score > 0 && difficultyMode < DIFFICULTY.IMPOSSIBLE) {
            difficultyMode += 1
            gameSettings.scoreThreshold += gameSettings.scoreThresholdMultiplier
            this.log('increasing difficulty...')
            this.log('difficulty mode: ' + difficultyMode)
            gameSettings.pancakeSpeed = gameSettings.pancakeSpeed / gameSettings.speedMultiplier
            //gameSettings.pancakeVelocityY = gameSettings.pancakeVelocityY * gameSettings.velocityMultiplier
            this.movingPancakeTween.data[0].duration = gameSettings.pancakeSpeed

            this.log('speed: ' + gameSettings.pancakeSpeed)
            //this.log('velocity: ' + gameSettings.pancakeVelocityY)
        }
    }
    hideGameElements() {
        this.plate.visible = false
        this.movingPancake.visible = false
        this.scoreUIGrp.setVisible(false)
        this.cheerGrp.setVisible(false)
    }
    showGameElements() {
        this.plate.visible = true
        this.movingPancake.visible = true
        this.scoreUIGrp.setVisible(true)
        this.cheerGrp.setVisible(true)
    }
    addCountdown() {
        const startPropertyConfig = {
            ease: 'Expo.easeInOut',
            from: 0,
            start: 0,
            to: 1,
        };
        const endPropertyConfig = {
            ease: 'Expo.easeInOut',
            from: 1,
            start: 1,
            to: 0,
        };
        const overlayPropertyConfig = {
            ease: 'Expo.easeInOut',
            from: 1,
            start: 1,
            to: 0,
        };
        this.countdown = this.add.sprite(this.width / 2, this.height / 2, 'countdown1')
        this.countdown.scale = 0
        this.tweens.add({
            targets: this.backgroundOverlay,
            duration: 1500,
            alpha: {
                ease: 'Expo.easeInOut',
                from: 0,
                start: 0,
                to: 1,
            },
            onComplete: () => {
                this.tweens.add({
                    targets: this.countdown,
                    duration: 1500,
                    scaleX: startPropertyConfig,
                    scaleY: startPropertyConfig,
                    onComplete: () => {
                        this.countdown.anims.delayedPlay(1200, 'countdown-play')
                            .on('animationcomplete', () => {
                                this.tweens.add({
                                    targets: this.countdown,
                                    duration: 1500,
                                    scaleX: endPropertyConfig,
                                    scaleY: endPropertyConfig,
                                    onComplete: () => {
                                        this.tweens.add({
                                            targets: this.backgroundOverlay,
                                            duration: 1500,
                                            alpha: overlayPropertyConfig,
                                            onComplete: () => {
                                                isGameOver = false
                                                this.fadeInMusic(this.AUDIO.bgm, true)
                                                this.showGameElements()
                                                this.startMovingPancake()
                                                canDrop = true
                                            }
                                        })
                                    }
                                })
                            })
                            .on('animationupdate', (animation, frame, gameObject) => {
                                if (frame.frame.texture.key == 'countdown2') {
                                    this.playSound(this.AUDIO.count3)
                                } else if (frame.frame.texture.key == 'countdown15') {
                                    this.playSound(this.AUDIO.count2)
                                } else if (frame.frame.texture.key == 'countdown28') {
                                    this.playSound(this.AUDIO.count1)
                                }
                            })
                    }
                })
            }
        })
    }
    addBackgroundOverlay() {
        this.backgroundOverlay = this.add.image(0, 0, 'overlay')
        this.backgroundOverlay.displayWidth = this.width
        this.backgroundOverlay.displayHeight = this.height
        this.backgroundOverlay.setOrigin(0, 0)
        this.backgroundOverlay.alpha = 0
    }
    addBackground() {
        this.background = this.add.image(0, 0, 'background-gameplay')
        this.background.displayWidth = this.width
        this.background.displayHeight = this.height
        this.background.setOrigin(0, 0)
    }
    addScoretab() {
        this.scoretab = this.add.image(this.width / 2, 0, 'score-tab')
        this.scoretab.y = this.scoretab.height
        this.scoreText = this.add.text(0, 0, this.score.toString(), {
            fontSize: '40px',
            fill: '#ffffff',
            fontFamily: 'Heebo-Bold',
            align: 'center'
        })
        this.scoreText.setOrigin(0.5)
        this.scoreUIGrp = this.add.group([this.scoretab, this.scoreText])

        Phaser.Display.Align.In.Center(this.scoreText, this.scoretab)
    }
    updateScore() {
        this.scoreText.text = this.score.toString()
    }
    addPlate() {
        this.plate = this.matter.add.sprite(this.width / 2, 0, 'plate', null, { shape: plateShape.plate })
        this.plate.setScale(0.75, 0.75)
        this.plate.y = this.height - this.plate.getBounds().bottom * 2
        this.plate.setName('plate')
        this.plate.setStatic(true)
    }
    addMovingPancake() {
        this.movingPancake = this.add.sprite(100, 0, 'pancake-sprites', 0)
        this.movingPancake.setScale(0.5, 0.5)
        this.movingPancake.x = this.movingPancake.displayWidth / 2
        pancakeHeight = (this.height / 2) + (this.movingPancake.height / 2)
        this.movingPancake.y = this.plate.getBounds().top - 0 * this.movingPancake.displayWidth - pancakeHeight
    }
    createMovingPancakeTween() {
        this.movingPancakeTween = this.tweens.add({
            targets: this.movingPancake,
            x: this.actionCam.displayWidth - (this.movingPancake.displayWidth / 2),
            duration: gameSettings.pancakeSpeed,
            yoyo: true,
            repeat: -1,
            paused: true,
        })
    }
    startMovingPancake() {
        this.movingPancakeTween.play(true)
    }
    addFallingPancake(x, y) {
        let pancake = this.matter.add.sprite(x, y, 'pancake-sprites', 0, { shape: shapes.pancake })
        pancake.setScale(0.5, 0.5)
        pancake.anims.delayedPlay(100, 'pancake-drop', 5)
        pancake.setVelocityY(gameSettings.pancakeVelocityY)
        pancake.setName('pancake')
        pancake.setSleepThreshold(gameSettings.pancakeBodySleepThreshold)
        pancake.setSleepEvents(true, true)
        pancake.body.isPancake = true
        pancake.body.hit = false
        this.pancakeGrp.add(pancake)
        this.cameras.main.ignore(pancake)
    }
    dropPancake() {
        canDrop = false
        this.movingPancake.visible = false
        this.addFallingPancake(this.movingPancake.x, this.movingPancake.y)
    }
    showMovingPancake() {
        this.showMovingPancakeCall = this.time.delayedCall(1000, () => {
            canDrop = true
            this.movingPancake.visible = true
        })
    }
    setCameras() {
        this.actionCam = this.cameras.add(0, 0, this.width, this.height)
        this.foregroundCam = this.cameras.add(0, 0, this.width, this.height)
        this.actionCam.ignore([this.background, this.mask, this.maskGfx, this.scoretab, this.scoreText, this.cheerboy, this.cheergirl])
        this.cameras.main.ignore([this.plate, this.movingPancake])
        this.foregroundCam.ignore([this.background, this.mask, this.maskGfx, this.scoretab, this.scoreText])
    }
    zoomCamera() {
        let maxHeight = 0;
        this.pancakeGrp.getChildren().forEach(function (i) {
            if (i.body.hit) {
                //this.log('maxHeight: ' + maxHeight)
                maxHeight = Math.max(maxHeight, Math.round((this.plate.getBounds().top - i.getBounds().top) / i.displayWidth));
            }
        }, this);
        var temp = this.pancakeGrp.getChildren([this.pancakeGrp.getLength() - 1])
        //console.log(temp[0].body.position.y)
        if (temp[0].body.position.y < this.height / 2) {
            this.movingPancake.y = this.plate.getBounds().top - maxHeight * this.movingPancake.displayWidth - pancakeHeight
            let zoomFactor = pancakeHeight / (this.plate.getBounds().top - this.movingPancake.y);
            this.actionCam.zoomTo(zoomFactor, 250);
            let newHeight = this.height / zoomFactor;
            //this.log('newheight: ' + newHeight)
            this.actionCam.pan(this.width / 2, this.height / 2 - (newHeight - this.height) / 2, 250)
        }
    }
    addCheer() {
        this.cheerboy = this.add.sprite(this.width * 2, this.height, 'boy')
        this.cheerboy.y = this.height - (this.cheerboy.displayHeight / 2)
        this.cheergirl = this.add.sprite(-this.width, this.height, 'girl')
        this.cheergirl.y = this.height - (this.cheergirl.displayHeight / 2)
        this.cheerGrp = this.add.group([this.cheerboy, this.cheergirl])
        this.cheerboy.depth = 50
        this.cheergirl.depth = 50
    }
    animateCheer() {
        var rand = Math.random()
        if (rand > 0.5) {
            this.tweens.add({
                targets: this.cheerboy,
                ease: 'Expo.easeInOut',
                duration: 500,
                x: this.width - (this.cheerboy.displayWidth / 2),
                onComplete: () => {
                    this.tweens.add({
                        delay: 1000,
                        targets: this.cheerboy,
                        ease: 'Expo.easeInOut',
                        duration: 500,
                        x: this.width * 2,
                    })
                }
            })
        } else {
            this.tweens.add({
                targets: this.cheergirl,
                ease: 'Expo.easeInOut',
                duration: 500,
                x: this.cheergirl.displayWidth / 2,
                onComplete: () => {
                    this.tweens.add({
                        delay: 1000,
                        targets: this.cheergirl,
                        ease: 'Expo.easeInOut',
                        duration: 500,
                        x: -this.width,
                    })
                }
            })
        }
    }
    transitToNextScene() {
        var sceneStr = ""
        var resultData = {
            win: "",
            canPlayagain: null,
            voucherCode: "",
            gameID: null,
            userID: "",
            score: ""
        }
        if (this.model.gameSettings().debugMode) {
            sceneStr = this.score >= gameSettings.maxScore ? SCENES.WIN : SCENES.LOSE
            resultData.win = 'grandchance'
            resultData.canPlayagain = true
        } else {
            this.apicall.addGameResult(this.model.userID, this.score, (result, success) => {
                if (success) {
                    resultData = result
                    if (resultData.win == "noPrize" || resultData.win == "No Prize") {
                        if (resultData.canPlayagain) {
                            sceneStr = SCENES.LOSE
                        } else {
                            sceneStr = SCENES.MAXTRIES
                        }
                    } else {
                        sceneStr = SCENES.WIN
                    }
                } else {
                    this.log("<addGameResult API> FAILED")
                    //sceneStr = SCENES.LOSE
                    return
                }
            })
        }

        this.fadeOutMusic(this.AUDIO.bgm, 1500)

        const pause = ms => {
            return new Promise(resolve => {
                window.setTimeout(() => {
                    resolve()
                }, ms)
            })
        }

        const asyncFunction = async () => {
            await pause(2000)
            this.pancakeGrp.setVisible(false)
            this.plate.setVisible(false)
            this.scene.transition({
                duration: 2500,
                target: sceneStr,
                data: resultData
            })
        }
        asyncFunction()
    }
    update(time, delta) {
        //this.fpsText.update()
        if (!isGameOver) {
            if (this.inputkeys != null) {
                if (Phaser.Input.Keyboard.JustDown(this.inputkeys.KEY_SPACE)) {
                    if (isGameOver || !canDrop) return
                    this.dropPancake()
                }
            }
            if (this.pancakeGrp.getLength() > 0 && this.pancakeGrp != null) {
                this.pancakeGrp.getChildren().forEach((pancake) => {
                    if (pancake.y >= this.height) {
                        isGameOver = true
                        this.movingPancake.setVisible(false)
                        this.transitToNextScene()
                        return
                    }
                })
            }
            this.setDifficulty()
        }
    }
}