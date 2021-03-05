import SCENES from './scenes'
import BaseScene from './base'

export default class BootScene extends BaseScene {
    constructor(){
        super(SCENES.BOOT)
    }
    preload() {
        super.preload() 

        this.load.json('settings', 'assets/json/settings.json')
    }
    create(){
        this.model.g_settings = this.cache.json.get('settings')

        let params = new URLSearchParams(location.search)
        if (params.has('ip')) {
            console.log('URL: ' +params.get('ip'))
            this.model.ip = params.get('ip')
        }

        this.scene.start(SCENES.PRELOAD)
    }
}