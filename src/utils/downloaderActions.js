/*
 * src/actions/downloaderActions.js
 * Actions for ./src/utils/downloader.js
 */
import { baseApiUrl } from 'utils/config'


export function downloadFile(filetype) {    
    return {
        type: 'DOWNLOADER-DOWNLOAD_FILE',
        downloadPath: baseApiUrl + 'data/download'
    }
}

export function onDownloadComplete() {
    return {
        type: 'DOWNLOADER-DOWNLOAD_COMPLETE'
    }
}