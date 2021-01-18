/*
 * src/app/gps-map/gpsMapConfig.js
 */

export default {
    // max markers to display on leaflet map at once for performance,
    // current hides markers when >maxMarkers
    maxMarkers: 600,

    // polyline and marker drawing styles
    featureStyles: {
        gpsPoints: {
            polyline: {
                color: '#A9CEF3',
                weight: 2,
                opacity: 1,
            },
            marker: {
                radius: 3,
                weight: 0,
                fillColor: '#007AF2',
                fillOpacity: 1
            }        
        },
        prompts: {
            responses: {
                radius: 6,
                weight: 2,
                color: '#75d882',
                fillColor: '#01AA78',
                fillOpacity: 1
            },
            cancelled: {
                radius: 4,
                weight: 2,
                color: '#f7b385',
                fillColor: '#f28d4a',
                fillOpacity: 1                    
            }        
        },
        subwayBuffers: {
            fillColor: '#666666',
            stroke: false
        },
        trips: {
            startMarker: {
                radius: 4,
                weight: 3,
                fillColor: 'white',
                fillOpacity: 1                    
            },
            endMarker: {
                radius: 4,
                weight: 0,
                fillOpacity: 1                    
            },                
            tripCodes: {
                1: {color: '#13C3FF'},
                2: {color: '#13C3FF', dashArray: '5, 5'},
                101: {color: '#AF4A61'},
                102: {color: '#AF4A61', dashArray: '5, 5'},
                103: {color: '#AF4A61'},
                201: {color: 'pink'},
                202: {color: 'pink'},
            },
            polyline: {
                color: 'green',
                weight: 3,
                opacity: 1
            },
            highlight: {
                color: '#93e4ff'
            }
        }
    }
}
