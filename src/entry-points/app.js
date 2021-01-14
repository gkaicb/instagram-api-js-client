require('./style.scss')

const { Instagram, MediaFactory } = window['instagram-api-js-client']
// const Instagram = window['instagram-api-js-client'].default
// const MediaFactory = window['instagram-api-js-client'].MediaFactory

// Static methods to retrieve token. Must be called manually from the console

Instagram.getAuthorizationUrl({
    appId: 'appId',
    redirectUri: 'redirectUri',
})

Instagram.getToken({
    appId: 'appId',
    appSecret: 'appSecret',
    redirectUri: 'redirectUri',
    code: 'code',
})

// Usage with token

const customOptions = {
    limit: 99,
    fetchChildren: false,
    allowUnsupportedType: true,
    flatten: false,
}

var instagram = new Instagram('VALID_TOKEN')

instagram.setOptions(customOptions)

async function executeAsyncCode() {
    const user = await instagram.fetchSelf()
    console.log('user', user)

    const token = instagram
        .refreshToken()
        .then((token) => console.log('token', token))
        .catch((error) => {})

    const fetchMedia = await instagram.fetchMedia()
    console.log('fetchMedia', fetchMedia)

    const media = await instagram.media()
    console.log('media', media)

    const flattened = instagram.flatMedia(media)
    console.log('flattened', flattened)

    var iterateMedia = []
    for await (const item of instagram.mediaIterator()) {
        iterateMedia.push(item)
    }
    console.log('iterateMedia', iterateMedia)

    const withoutChildren = await instagram.media()
    const withChildren = await instagram.media()
    for (const item of withChildren) {
        if (item.mediaType === 'CAROUSEL_ALBUM') {
            const children = await instagram.fetchChildren(item.id)
            item.setChildren(children.data)
        }
    }
    console.log('withoutChildren', withoutChildren)
    console.log('withChildren', withChildren)
}

executeAsyncCode()
