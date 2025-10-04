import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

interface MapProps {
  lat: number;
  lng: number;
  ip?: string;
}

// helper to update map center dynamically
const Recenter = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);

  return null;
};

const Map = ({ lat, lng, ip }: MapProps) => {
  const position: [number, number] = [lat, lng];

  const icon = L.icon({
    iconUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} icon={icon}>
        <Popup>{ip ? `IP: ${ip}` : "Selected Location"}</Popup>
      </Marker>
      <Recenter lat={lat} lng={lng} />
    </MapContainer>
  );
};

export default Map;
