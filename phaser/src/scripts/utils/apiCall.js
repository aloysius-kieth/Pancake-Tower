import utils from '../utils/utils'
import d from '../utils/debugLog'

const STATUS_OK = 200
const STATUS_ERROR_400 = 400

export default class APICall {
    constructor(config, frontURL) {
        this.config = config
        this.frontURL = frontURL
    }
    checkMaxTries(_userID, callback) {
        d.log("Checking max tries limit...")
        if (!_userID || 0 === _userID.length) return

        if (this.config != null) {
            var url = /*this.config.frontURL*/this.frontURL + '/' + 'Assisihospice_funday/' + this.config.port + this.config.backURL + 'checkPlayValid/' + _userID
            d.log('Loading ' + url)
            utils.POST(url, null, (result, success) => {
                d.log(result)
                if (result.status == STATUS_OK) {
                    d.log('responsejson: ' + result.responseJSON)
                    if (!result.responseJSON) {
                        callback(result.responseJSON, false)
                    } else {
                        callback(result.responseJSON, true)
                    }
                } else {
                    callback(result.responseJSON, false)
                }
            })
        } else {
            d.log("<CheckTries API> FAILED")
            callback(result.responseJSON, false)
        }
    }
    addGameResult(_userID, _score, callback) {
        d.log("Adding game result...")
        if (!_userID || 0 === _userID.length) return

        var data = {
            userID: _userID,
            score: _score
        }
        d.log(`Sending ${data.userID} | ${data.score}`)
        if (this.config != null) {
            var url = /*this.config.frontURL*/this.frontURL + '/' + 'Assisihospice_funday/' + this.config.port + this.config.backURL + 'addGameResult/'
            d.log('Loading ' + url)
            utils.POST(url, data, (result) => {
                d.log(result.responseJSON)
                if (result.status == STATUS_OK) {
                    callback(result.responseJSON, true)
                } else {
                    callback(result.responseJSON, false)
                }
            })
        } else {
            d.log('Could not call API <addGameResult>')
        }
    }
}