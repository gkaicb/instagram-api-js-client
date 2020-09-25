# Simple Instagram Basic Display API Client

[![npm version](https://badge.fury.io/js/instagram-api-js-client.svg)](https://badge.fury.io/js/instagram-api-js-client)

> A simple Javascript client for the Instagram Basic Display API.

## Requirements

- Access token ([Facebook documentation](https://developers.facebook.com/docs/instagram-basic-display-api/overview#instagram-user-access-tokens))

## Get started

```html
<script type="text/javascript" src="path/to/instagram-api-js-client.js"></script>

<script type="text/javascript">
    const Instagram = window['instagram-api-js-client'].default
    var instagram = new Instagram('VALID_TOKEN')
    ...
</script>
```

```js
$ npm install instagram-api-js-client

import { Instagram } from 'instagram-api-js-client'
var instagram = new Instagram('VALID_TOKEN')
...
```

## Basic Usage

### Custom options

- `limit`: Limit api returned media on each call (default: 99)

- `fetchChildren`: Add edge children to media. When false, children will have to be retrieved by another call. (default: true)

- `allowUnsupportedType`: Keep returned objects that cannot be mapped into known classes (Image, Video, Album). (default: false)

- `flatten`: Album media is flattened to its children (default: false)

```js
// Pass custom options to constructor

var instagram = new Instagram(
    'VALID_TOKEN',
    {
        limit: 2,
        fetchChildren: true,
        allowUnsupportedType: true,
        flatten: false,
    }
)

// Or change options dinamically

instagram.setOptions({
    limit: 2,
    fetchChildren: true,
    allowUnsupportedType: true,
    flatten: false,
})
```

### Example

```js
// Fetch user info

const user = await instagram.fetchSelf()
console.log('user', user)

// Refresh token

const token = instagram
    .refreshToken()
    .then((token) => console.log('token', token))
    .catch((error) => {})

// Single call to get media

const fetchMedia = await instagram.fetchMedia()
console.log('fetchMedia', fetchMedia)

// Gell all media

const media = await instagram.media()
console.log('media', media)

// Get all media throught Iterator

var iterateMedia = []
for await (const item of instagram.mediaIterator()) {
    iterateMedia.push(item)
}
console.log('iterateMedia', iterateMedia)

// Flatten media

const media = await instagram.media()
const flattened = instagram.flatMedia(media)
console.log('flattened', flattened)

// Get children (when `fetchChildren` is false)

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
```