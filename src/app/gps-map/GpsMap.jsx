/*
 * src/app/gps-map/GpsMap.jsx
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
import Leaflet from 'leaflet'
import { Map, Circle, CircleMarker, GeoJSON, LayerGroup, 
         Polyline, Popup, TileLayer } from 'react-leaflet'
import Moment from 'moment-timezone'

import SearchableSelect from 'components/SearchableSelect'
import GpsMapTripsSummaryTable from './GpsMapTripsSummaryTable'
import MapConfig from './gpsMapConfig'
import { styles } from './gpsMap.scss'

Leaflet.Icon.Default.imagePath = '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/'


export default class GpsMap extends React.Component {
    componentDidUpdate(prevProps) {
        // update leaflet bounds to user tracks polyline
        if (this.refs.leaflet && this.refs.polyline && this.props.gpsPoints !== prevProps.gpsPoints) {
            const bounds = this.refs.polyline.leafletElement.getBounds()

            // prevent if transitioning back from trips view to same points view
            if (prevProps.gpsPoints.features && this.props.gpsPoints.features) {
                const prevStart = prevProps.gpsPoints.features[0].properties.startTime,
                      prevEnd = prevProps.gpsPoints.features[0].properties.endTime,
                      thisStart = this.props.gpsPoints.features[0].properties.startTime,
                      thisEnd = this.props.gpsPoints.features[0].properties.endTime
                if (prevStart === thisStart && prevEnd === thisEnd) return
            }
            if (bounds.isValid()) { this.refs.leaflet.leafletElement.fitBounds(bounds) }
        }

        // fit bounds of trips selected in summaries table
        const selectedTripPolyLine = this.refs['polyline-' + this.props.selectedTripIndex]
        if (selectedTripPolyLine) {
            const bounds = selectedTripPolyLine.leafletElement.getBounds()
            if (bounds.isValid()) { this.refs.leaflet.leafletElement.fitBounds(bounds) }
        }
    }

    componentWillUnmount() {
        this.props.setSelectedUser()
        this.props.setSelectedTripIndex()
        this.props.clearMap()
    }

    cancelledPromptsFeatures = () => {
        const createMarker = (feature, latLng) => {
            return Leaflet.circleMarker(latLng, MapConfig.featureStyles.prompts.cancelled)
        }

        const showPromptInfo = (feature, layer) => {
            const cancelledAt = feature.properties.cancelledAt
                              ? Moment(feature.properties.cancelledAt).format('YYYY-MM-DD HH:mm:ssZ')
                              : 'Unconfirmed'
            const template = `<p><b>Displayed:</b> ${Moment(feature.properties.displayedAt).format('YYYY-MM-DD HH:mm:ssZ')}</br>
                              <p><b>Cancelled:</b> ${cancelledAt}</br>`
            layer.bindPopup(template)
        }

        // create unique key so features are refreshed when provided with new data
        const uniqueKey = 'cancelled-prompts-' + Math.random().toString().substring(6)
        return <GeoJSON key={uniqueKey}
                        data={this.props.cancelledPrompts}
                        pointToLayer={createMarker}
                        onEachFeature={showPromptInfo} />
    }

    coordinatesFeatures = () => {
        const coordinates = this.props.gpsPoints
        let polyline, markersGroup
        if (coordinates && coordinates.features) {
            const pointsFeature = coordinates.features[0],
                  pointsCoordinates = pointsFeature.geometry.coordinates
            polyline = <Polyline key={"gps-path"}
                                 positions={pointsCoordinates}
                                 ref={"polyline"}
                                 { ...MapConfig.featureStyles.gpsPoints.polyline } />

            if (pointsFeature.properties.numPoints <= MapConfig.maxMarkers) {
                const markerArray = pointsCoordinates.map((latLng, i) => {
                    return (
                        <CircleMarker key={"gps-point-" + i}
                                      center={latLng}
                                      {...MapConfig.featureStyles.gpsPoints.marker} />
                    )
                })

                const uniqueKey = 'coordinates-' + Math.random().toString().substring(6)
                if (markerArray.length === 1) markersGroup = markerArray[0]
                else markersGroup = <LayerGroup key={uniqueKey}>{markerArray}</LayerGroup>
            }
        }
        return [markersGroup,  polyline]
    }

    promptResponsesFeatures = () => {
        const createMarker = (feature, latLng) => {
            return Leaflet.circleMarker(latLng, MapConfig.featureStyles.prompts.responses)
        }

        const showPromptInfo = (feature, layer) => {
            let template = `<p><b>Displayed:</b> ${Moment(feature.properties.displayedAt).format('YYYY-MM-DD HH:mm:ssZ')}</p</br>
                            <p><b>Recorded:</b> ${Moment(feature.properties.recordedAt).format('YYYY-MM-DD HH:mm:ssZ')}</p</br>
                            <p><b>Responses:</b></p</br>`
            feature.properties.responses.forEach((response, i) => {
                const rowNum = i + 1,
                      responseLine = `<p><b>&emsp;&emsp;${rowNum}.</b> ${response}</p>`
                template = template + responseLine
            })

            layer.bindPopup(template)
        }        

        // create unique key so features are refreshed when provided with new data
        const uniqueKey = 'prompt-responses-' + Math.random().toString().substring(6)
        return <GeoJSON key={uniqueKey}
                        data={this.props.promptResponses}
                        pointToLayer={createMarker}
                        onEachFeature={showPromptInfo} />
    }

    subwayStationsBuffersFeatures = () => {
        const buffers = this.props.subwayStations.features.map(station => {
            const lng = station.geometry.coordinates[0],
                  lat = station.geometry.coordinates[1]
            return <Circle center={[lat, lng]}
                           radius={this.props.subwayStationsBuffer}
                           {...MapConfig.featureStyles.subwayBuffers} />
        })
        return buffers
    }    

    tripFeatures = () => {
        const showPolylineInfo = (e) => {
            // highlight trip when mouseover and store color to return to original state
            e.target.options.originalColor = e.target.options.color
            e.target.setStyle({color: MapConfig.featureStyles.trips.highlight.color})

            // create popup with trip info
            const mouseLatLng = e.latlng,
                  template = `<p><b>Start Time:</b> ${Moment(e.target.options.data.start).format('YYYY-MM-DD HH:mm:ss')}</br>
                              <p><b>End Time:</b> ${Moment(e.target.options.data.end).format('YYYY-MM-DD HH:mm:ss')}</br>
                              <p><b>Trip code:</b> ${e.target.options.data.tripCode}</br>`
            e.target.bindPopup(template, <Popup position={mouseLatLng} />)
        }

        const selectTrip = (e) => {
            this.props.setSelectedTripIndex(e.target.options.data.tripIndex)
            
            const bounds = e.target.getBounds()
            if (bounds.isValid()) { this.refs.leaflet.leafletElement.fitBounds(bounds) }
        }

        const resetPolyline = (e) => {
            e.target.setStyle({color: e.target.options.originalColor})
            e.target.unbindPopup()
        }

        const trips = this.props.tripLines
        let markers = [],
            polylines = [],
            popups = []
        if (trips && trips.features) {
            polylines = trips.features.map((trip, i) => {
                const code = trip.properties.tripCode,
                      tripCodeStyle = MapConfig.featureStyles.trips.tripCodes[code],
                      color = tripCodeStyle.color,
                      dashArray = tripCodeStyle.dashArray,
                      startCoordinates = trip.geometry.coordinates[0],
                      endCoordinates = trip.geometry.coordinates[trip.geometry.coordinates.length - 1],
                      tripStyle = MapConfig.featureStyles

                tripStyle.color = color
                tripStyle.dashArray = dashArray
                trip.properties.tripIndex = i
                markers.push(<CircleMarker center={startCoordinates}
                                           color={color}
                                           { ...MapConfig.featureStyles.trips.startMarker} />)
                markers.push(<CircleMarker center={endCoordinates}
                                           color={color}
                                           { ...MapConfig.featureStyles.trips.endMarker } />)

                // create a popup and fit map bounds if there is a selected trip
                if (i === this.props.selectedTripIndex) {
                    const middleCoordinate = trip.geometry.coordinates[Math.floor(trip.geometry.coordinates.length / 2)]

                    popups.push(<Popup key={'detected-trip-info-' + i}
                                       position={middleCoordinate}>
                                    <div>
                                        <p><b>Start Time:</b> { Moment(trip.properties.start).format('YYYY-MM-DD HH:mm:ss') }</p>
                                        <p><b>End Time:</b> { Moment(trip.properties.end).format('YYYY-MM-DD HH:mm:ss') }</p>
                                        <p><b>Trip code:</b> { trip.properties.tripCode }</p>
                                    </div>
                                </Popup>)
                }

                return <Polyline key={'detected-trip-' + i}
                                 data={trip.properties}
                                 positions={trip.geometry.coordinates}
                                 onClick={selectTrip}
                                 onMouseOver={showPolylineInfo}
                                 onMouseOut={resetPolyline}
                                 ref={'polyline-' + i}
                                 { ...tripStyle } />

            })
        }
        return [polylines, markers, popups]
    }

    generateMapData = () => {
        const mapData = []

        if (this.props.subwayStations.features) {
            mapData.push(this.subwayStationsBuffersFeatures())
        }

        if (this.props.showDetectedTrips) {
            mapData.push(this.tripFeatures())
        } else {
            mapData.push(this.coordinatesFeatures())
        }

        if (this.props.promptResponses.features) {
            mapData.push(this.promptResponsesFeatures())
        }

        if (this.props.cancelledPrompts.features) {
            mapData.push(this.cancelledPromptsFeatures())
        }

        return mapData
    }

    render() {
        const mapData = this.generateMapData()
        const mapTripsSummaryTableJSX = <GpsMapTripsSummaryTable trips={this.props.tripLines}
                                                                 selectedTripIndex={this.props.selectedTripIndex}
                                                                 setSelectedTripIndex={this.props.setSelectedTripIndex} />

        return(
            <section className={classNames(styles)}>
                <div className="map-container">
                    <SearchableSelect className="uuid-select"
                                      isLoading={this.props.loadingData}
                                      onChange={this.props.onChange}
                                      options={this.props.options}
                                      value={this.props.value} />
                    
                    { this.props.showDetectedTrips && !this.props.loadingData ? mapTripsSummaryTableJSX : undefined }
                    
                    <div className="map">
                        <Map center={this.props.mapCenter}
                             className="map-component"
                             onClick={(e) => { this.props.setSelectedTripIndex()}}
                             maxZoom={18}
                             zoom={13}
                             ref={"leaflet"} >
                            <TileLayer url={this.props.mapTileLayerUrl} />
                            { mapData }
                        </Map>
                    </div>
                </div>            
            </section>
        )
    }
}


GpsMap.propTypes = {
    cancelledPrompts: PropTypes.object.isRequired,
    clearMap: PropTypes.func.isRequired,
    mapCenter: PropTypes.array.isRequired,
    mapTileLayerUrl: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    gpsPoints: PropTypes.object,
    loadingData: PropTypes.bool.isRequired,
    promptResponses: PropTypes.object.isRequired,
    showDetectedTrips: PropTypes.bool.isRequired,
    selectedTripIndex: PropTypes.number,
    setSelectedTripIndex: PropTypes.func.isRequired,
    setSelectedUser: PropTypes.func.isRequired,
    subwayStations: PropTypes.object.isRequired,
    subwayStationsBuffer: PropTypes.number.isRequired,
    tripLines: PropTypes.object.isRequired,
    value: PropTypes.string
}
