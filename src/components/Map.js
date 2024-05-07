import React from "react";
import { MapContainer, TileLayer, Marker, Popup, customIcon } from "react-leaflet";
import '../styles/Map.css';
import L from 'leaflet'

class MapComponent extends React.Component {
  state = {
    lat: 49.817624167087466,
    lng: 24.023855708766366,
    zoom: 45
  };

  render() {
    var center = [this.state.lat, this.state.lng];

const markerIcon = new L.Icon({
    iconUrl: require('./icon2.png'),
    iconSize: [70, 70]
})

    return (
      <MapContainer zoom={this.state.zoom} center={center}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={markerIcon}>
            <Popup>
                Колегіум УКУ
            </Popup>
        </Marker>
      </MapContainer>
    );
  }
}

export { default as MapComponent } from './Map';
export default MapComponent;
