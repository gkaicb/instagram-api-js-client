export function getAuthorizationUrl(settings = {}) {
    const { appId, redirectUri } = settings

    const data = {
        client_id: appId,
        redirect_uri: redirectUri,
        scope: this.SCOPES,
        response_type: 'code',
    }

    var searchParameters = new URLSearchParams()
    for (const key in data) {
        searchParameters.append(key, data[key])
    }
    const params = searchParameters.toString()
    const url = this.API_URL + 'oauth/authorize' + '?' + params

    this.info('Autorization url -> ' + url)
}

export async function getToken(settings = {}) {
    const { appId, appSecret, code, redirectUri } = settings

    const data = {
        client_id: appId,
        client_secret: appSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
    }

    let response = await this.makeCall(this.API_URL + 'oauth/access_token', data, 'POST', 'formdata')

    if (!response.access_token) {
        this.error(response)
        return
    }

    this.info('User id -> ' + response.user_id)
    this.info('Token -> ' + response.access_token)

    this.getLongLivedToken({
        appSecret: appSecret,
        token: response.access_token,
    })
}

export async function getLongLivedToken(settings = {}) {
    const { appSecret, token } = settings

    const data = {
        grant_type: 'ig_exchange_token',
        client_secret: appSecret,
        access_token: token,
    }

    let response = await this.makeCall(this.GRAPH_URL + 'access_token', data)

    if (response.error) {
        return Promise.reject(response.error)
    }

    if (!response.access_token) {
        this.error(response)
        return
    }

    this.info('Long lived token -> ' + response.access_token)
}
