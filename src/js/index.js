require('./polyfill')
import Merge from 'deepmerge'
import 'regenerator-runtime/runtime'

const API_URL = 'https://graph.instagram.com/'
const USER_FIELDS = 'id,ig_id,username,account_type,media_count'
const MEDIA_FIELDS = 'username,id,permalink,caption,media_type,media_url,thumbnail_url,timestamp,like_count'
const CHILDREN_FIELDS = 'username,id,permalink,media_type,media_url,thumbnail_url,timestamp,like_count'

const defaultOptions = {
    limit: 99,
    fetchChildren: true,
    allowUnsupportedType: false,
    flatten: false,
}

export class Instagram {
    constructor(token, options = {}) {
        this.settings = Merge(defaultOptions, options)
        this.token = token
    }

    setOptions(options) {
        this.settings = Merge(this.settings, options)
    }

    flatMedia(media) {
        return media.flatMap((item) => {
            if (item.isAlbum) {
                return item.children
            }
            if (item.media_type === 'CAROUSEL_ALBUM') {
                return item.children.data
            }
            return item
        })
    }

    async fetchSelf() {
        if (!this.token) {
            return Promise.reject('No token')
        }

        const data = {
            fields: USER_FIELDS,
            access_token: this.token,
        }

        let response = await this.makeCall(API_URL + 'me', data)

        if (response.error) {
            return Promise.reject(response.error)
        }

        return response
    }

    async fetchMedia(after = '', limit = null) {
        if (!this.token) {
            return Promise.reject('No token')
        }

        const data = {
            fields: this.settings.fetchChildren ? MEDIA_FIELDS + `,children{${CHILDREN_FIELDS}}` : MEDIA_FIELDS,
            access_token: this.token,
            limit: limit ? limit : this.settings.limit,
            after: after,
        }

        let response = await this.makeCall(API_URL + 'me/media', data)

        if (response.error) {
            return Promise.reject(response.error)
        }

        return response
    }

    async fetchChildren(id) {
        if (!this.token) {
            return Promise.reject('No token')
        }

        const data = {
            fields: CHILDREN_FIELDS,
            access_token: this.token,
        }

        let response = await this.makeCall(API_URL + id + '/children', data)

        if (response.error) {
            return Promise.reject(response.error)
        }

        return response
    }

    async media(max = null) {
        var media = []
        var i = 0
        for await (const item of this.mediaIterator()) {
            media.push(item)
            i++
            if (max > 0 && i >= max) {
                break
            }
        }
        return media
    }

    async *mediaIterator() {
        var next = ''

        while (true) {
            var aux = await this.fetchMedia(next)

            if (this.settings.flatten) {
                aux.data = this.flatMedia(aux.data)
            }

            for (const key in aux.data) {
                try {
                    yield new MediaFactory(aux.data[key])
                } catch (error) {
                    if (this.settings.allowUnsupportedType) {
                        yield aux.data[key]
                    }
                }
            }

            if (!aux.paging?.next) {
                break
            }
            next = aux.paging.cursors.after
        }
    }

    async refreshToken() {
        if (!this.token) {
            return Promise.reject('No token')
        }

        const data = {
            grant_type: 'ig_refresh_token',
            access_token: this.token,
        }

        let response = await this.makeCall(API_URL + 'refresh_access_token', data)

        if (response.error) {
            return Promise.reject(response.error)
        }

        return response
    }

    async makeCall(url, data, method = 'GET') {
        if (method === 'GET' && data) {
            var searchParameters = new URLSearchParams()
            for (const key in data) {
                searchParameters.append(key, data[key])
            }
            const params = searchParameters.toString()
            url = url + '?' + params
        }

        const response = await fetch(url, {
            method: method,
            body: method === 'POST' ? JSON.stringify(data) : null,
        })

        return response.json()
    }
}

export class Media {
    constructor(data = {}) {
        this.id = data.id
        this.username = data.username
        this.caption = data.caption
        this.mediaType = data.media_type
        this.mediaUrl = data.media_url
        this.permalink = data.permalink
        this.timestamp = data.timestamp
    }
}

export const AlbumClass = class Album extends Media {
    constructor(data = {}) {
        super(data)

        this.isAlbum = true
        this.children = []
        data.children && this.setChildren(data.children.data)
    }

    setChildren(children) {
        this.children = []
        for (const key in children) {
            try {
                this.children.push(new MediaFactory(children[key]))
            } catch (error) {
                if (this.settings.allowUnsupportedType) {
                    this.children.push(aux.data[key])
                }
            }
        }
    }
}

export const ImageClass = class Image extends Media {
    constructor(data = {}) {
        super(data)
    }
}

export const VideoClass = class Video extends Media {
    constructor(data = {}) {
        super(data)
    }
}

const MediaTypes = {
    IMAGE: ImageClass,
    VIDEO: VideoClass,
    CAROUSEL_ALBUM: AlbumClass,
}

export class MediaFactory {
    constructor(data = {}) {
        if (!MediaTypes[data.media_type]) {
            throw 'Media type not supported'
        }
        return new MediaTypes[data.media_type](data)
    }
}

export default Instagram
