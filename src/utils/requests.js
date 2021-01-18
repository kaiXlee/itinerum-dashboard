import msgpack from 'msgpack-lite'


export function encodeUrlData(data) {
    if (data) {
        let encoded = Object.keys(data).map(function(key) {
            return [key, data[key]].map(encodeURIComponent).join('=')
        }).join('&')
        return '?' + encoded
    }
    return ''
}

export function serialize(obj) {
    let str = [];
    for(let p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
    return str.join("&")
}

export function checkHttpStatus(response) {
    /* Error on any request that returns status code between 200 and 299 */
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        let error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

export function unauthenticatedRequest(params, jsonCallbacks, method) {
    /* Request for token from username and password. Also used with new
        survey registration. */
    jsonCallbacks.begin()
    return fetch(params.url, {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params.body)
        })
        .then(checkHttpStatus)
        .then(response => { return response.json() })
        .then(json => { jsonCallbacks.success(json) })
        .catch(error => { jsonCallbacks.error(error) })
}


export function tokenRequest(params, jsonCallbacks) {
    /* Generic API request using JWT for authentication */

    const token = 'JWT ' + localStorage.getItem('dmdashboard-jwt')
    jsonCallbacks.begin()
    return fetch(params.url, {
            method: params.method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: params.body
        })
        .then(checkHttpStatus)
        .then(response => { return response.json() })
        .then(json => { jsonCallbacks.success(json) })
        .catch(error => { jsonCallbacks.error(error) })
}


export function tokenMsgPackRequest(params, msgpackCallbacks) {
    /* Generic API request using JWT for authentication */

    const token = 'JWT ' + localStorage.getItem('dmdashboard-jwt')
    msgpackCallbacks.begin()
    return fetch(params.url, {
            method: params.method,
            headers: {
                'Accept': 'application/msgpack',
                'Content-Type': 'application/msgpack',
                'Authorization': token
            },
            body: params.body
        })
        .then(checkHttpStatus)
        .then(response => response.arrayBuffer())
        .then(arraybuf => { 
            const data = msgpack.decode(new Buffer(arraybuf))
            msgpackCallbacks.success(data) 
        })
        .catch(error => { msgpackCallbacks.error(error) })
}


export function tokenFileRequest(params, jsonCallbacks) {
    /* File API request using JWT for authentication */

    const token = 'JWT ' + localStorage.getItem('dmdashboard-jwt')
    jsonCallbacks.begin()
    return fetch(params.url, {
            method: params.method,
            headers: {
                'Authorization': token
            },
            body: params.body
        })
        .then(checkHttpStatus)
        .then(response => { return response.json() })
        .then(json => { jsonCallbacks.success(json) })
        .catch(error => { jsonCallbacks.error(error) })
}

export function tokenRefreshRequest(params, jsonCallbacks) {
    /* Retrieves a new token and updates localStorage when current token is still valid */

    const token = localStorage.getItem('dmdashboard-jwt')
    jsonCallbacks.begin()
    return fetch(params.url, {
            method: params.method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authentication': token     
            },
            body: JSON.stringify(params.body)
        })
        .then(checkHttpStatus)
        .then(response => { return response.json() })
        .then(json => { jsonCallbacks.success(json) })
        .catch(error => { jsonCallbacks.error(error) })
}
