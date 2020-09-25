require('./style.scss')

const { Instagram, MediaFactory } = window['instagram-api-js-client']
// const Instagram = window['instagram-api-js-client'].default
// const MediaFactory = window['instagram-api-js-client'].MediaFactory

const customOptions = {
    limit: 2,
    fetchChildren: true,
    allowUnsupportedType: true,
    flatten: false,
}

var instagram = new Instagram('VALID_TOKEN')

/* Set custom options dinamically */

instagram.setOptions(customOptions)

/* Simple fetch methods */

instagram.fetchSelf().then((user) => console.log('user', user))
instagram.refreshToken((token) => console.log('refreshedToken', token))
instagram.fetchMedia().then((media) => {
    var allMedia = []
    for (const key in media.data) {
        try {
            allMedia.push(new MediaFactory(media.data[key]))
        } catch (error) {
            console.log(error)
        }
    }
    console.log('fetchMedia', allMedia)
})

/* Get all media */

instagram.media().then((media) => console.log('media', media))

/* Get children */

instagram.media().then((media) => {
    for (const item of media) {
        if (item.mediaType === 'CAROUSEL_ALBUM') {
            instagram.fetchChildren(item.id).then((children) => {
                item.setChildren(children.data)
            })
        }
    }
})

/* Media iterator usage */

const mediaIterator = instagram.mediaIterator()
async function asyncIterate(iterator) {
    var media = []
    for await (const item of iterator) {
        if (item.mediaType === 'CAROUSEL_ALBUM') {
            const children = await instagram.fetchChildren(item.id)
            item.setChildren(children.data)
        }
        media.push(item)
    }
    console.log('iteratedMedia', media)
}
asyncIterate(mediaIterator)

/* Flatten media */

instagram.media().then((media) => {
    var flattened = instagram.flatMedia(media)
    console.log('flattened', flattened)
})
