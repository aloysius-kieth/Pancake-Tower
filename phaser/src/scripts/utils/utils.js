import d from '../utils/debugLog'

const Bowser = require("bowser"); // CommonJS

const API_KEY = 'ACe680ae2b480ffa78b7d2bc756db0fc33'
const API_SECRET = 'S5483dacf6a2e6b00eba2c64074dfb14'

class utils {
    isLandscape = false
    constructor() {

    }
    CheckLandscape() {
        return this.isLandscape
    }
    GetBrowserPlatform() {
        var result = Bowser.getParser(window.navigator.userAgent);
        return result.parsedResult.platform.type;
    }
    WebglAvailable() {
        try {
            var canvas = document.createElement("canvas");
            return !!
                window.WebGLRenderingContext &&
                (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
        } catch (e) {
            return false;
        }
    }
    CheckDesktopBrowser() {
        // Check if browser is running from mobile and tablet devices
        var result = Bowser.getParser(window.navigator.userAgent);
        var isDesktop = true;
        if (result.parsedResult.platform.type != "desktop") {
            isDesktop = false;
        }
        return isDesktop;
    }
    WindowResizeDetect(callback) {
        $(window).resize(function () {
            callback()
        });
    }
    ReadJsonFetch(url, callback) {
        fetch(url)
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                d.log('parsed json', json)
                callback(json)
            }).catch(function (ex) {
                d.log('parsing failed', ex)
            })
    }
    WriteJsonFetch() { url, data }
    ReadJsonXMLHttpRequest(url, callback) {
        var request = new XMLHttpRequest()
        request.open('GET', url, true)

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                d.log('SUCCESS loaded: ' + url)
                var data = JSON.parse(request.response)
                callback(data)
            } else {
                d.log('FAILED loaded: ' + url + ' | ' + '<' + request.status + '>')
            }
        }

        request.onerror = function () {
            d.log('FAILED loaded: ' + url + ' | ' + '<' + request.status + '>')
        }
        request.send()
    }
    WriteJsonXMLHttpRequest(url, data) { }
    GET(url, callback) {
        $.ajax({
            dataType: "json",
            type: 'GET',
            url: url,
            success: function (result) { callback(result); },
            error: function (e) {
                d.log("Error GetJson ", e)
                callback(e)
            },
        })
    }
    POST(url, data, callback) {
        var jsonStr = JSON.stringify(data)

        $.ajax({
            headers: {
                'api-key': API_KEY,
                'api-secret': API_SECRET,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            dataType: "json",
            type: 'POST',
            url: url,
            data: jsonStr,
            // success: function (data) {
            //     callback(data);
            // },
            // error: function (e) {
            //     d.log("Error: " + e.status + " | " + e.statusText)
            //     callback(e)
            // },
            complete: function (result) {
                callback(result);
            }
        })
    }
}
export default (new utils)