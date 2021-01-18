/*
 * src/reducers/downloaderReducer.js
 * Reducer for ./src/utils/downloader.js
 */
import update from 'react/lib/update'

const initialState = {
    downloadPath: null,
    isLoading: false,
    queryParams: {}    
}

export function downloaderReducer(state = initialState, action) {
    switch(action.type) {
        case 'DOWNLOADER-DOWNLOAD_FILE':
            return update(state, {
                $set: {
                    downloadPath: action.downloadPath,
                    isLoading: !!action.downloadPath,
                    queryParams: {
                        token: 'JWT ' + localStorage.getItem('dmdashboard-jwt')
                    }                    
                }
            })

        case 'DOWNLOADER-DOWNLOAD_COMPLETE':
            return update(state, {
                $set: {
                    downloadPath: null,
                    isLoading: false
                }
            })

        default:
            return state
    }
}
