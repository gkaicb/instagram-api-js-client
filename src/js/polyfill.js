console.info('polyfill for IE11')
;(function (arr) {
    arr.forEach(function (item) {
        if (item.hasOwnProperty('remove')) {
            return
        }
        Object.defineProperty(item, 'remove', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
                if (this.parentNode === null) {
                    return
                }
                this.parentNode.removeChild(this)
            },
        })
    })
})([Element.prototype, CharacterData.prototype, DocumentType.prototype])
;(function () {
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function forEach(callback, thisArg) {
            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function')
            }
            var array = this
            thisArg = thisArg || this
            for (var i = 0, l = array.length; i !== l; ++i) {
                callback.call(thisArg, array[i], i, array)
            }
        }
    }
})()
// Forach
if ('NodeList' in window && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this)
        }
    }
}
// Event polyfill
;(function () {
    if (typeof window.CustomEvent === 'function') return false //If not IE

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined }
        var evt = document.createEvent('CustomEvent')
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
        return evt
    }

    CustomEvent.prototype = window.Event.prototype

    window.Event = CustomEvent
})()
if (!Array.prototype.includes) {
    Array.prototype.includes = function (search, start) {
        'use strict'

        if (search instanceof RegExp) {
            throw TypeError('first argument must not be a RegExp')
        }
        if (start === undefined) {
            start = 0
        }
        return this.indexOf(search, start) !== -1
    }
}
