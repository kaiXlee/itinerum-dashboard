// production url
let hn = location.hostname.split('.'),
	rootHost = hn[hn.length-2] + '.' + hn[hn.length-1]

if (location.hostname.indexOf('testing') !== -1) {
	rootHost = 'testing.' + rootHost
}

// let url = '//api.' + rootHost + '/dashboard/v1/',
//     sse = '//api.' + rootHost + '/dashboard/v1/stream'
let url = '//' + location.hostname + ':443/dashboard/v1/',
    sse = '//' + location.hostname + ':443/dashboard/v1/stream'


// override if NODE_ENV set to development by webpack
let devHost = window.location.hostname
// devHost = '192.168.99.100'

if (process.env.NODE_ENV == 'development') {
    url = '//' + devHost + ':9000/dashboard/v1/'
    sse = '//' + devHost + ':9000/dashboard/v1/stream'
}

export const baseApiUrl = url
export const sseUri = sse
