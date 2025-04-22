import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import RoutingMachine from './RoutingMap';

// Correction pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Points d'intérêt à Kinshasa
const pointsOfInterest = [
    {
        name: "Place de la Gare",
        position: [-4.3276, 15.3136],
        description: "Centre historique de Kinshasa"
    },
    {
        name: "Palais du Peuple",
        position: [-4.3208, 15.3150],
        description: "Siège du Parlement de la RDC"
    },
    {
        name: "Stade des Martyrs",
        position: [-4.3314, 15.3153],
        description: "Plus grand stade de la RDC"
    },
    {
        name: "Marché de la Liberté",
        position: [-4.3289, 15.3123],
        description: "Grand marché central de Kinshasa"
    }
];

const KinshasaMap = ({className}) => {
    // Coordonnées du centre de Kinshasa
    const center = [-4.3276, 15.3136];

    // Création de la route entre les points
    // const route = pointsOfInterest.map(point => point.position);

    return (
        <div className={className}>
            <MapContainer
                center={center}
                zoom={13}
                zoomControl={false}
                attributionControl={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Affichage des points d'intérêt */}
                {pointsOfInterest.map((point, index) => (
                    <Marker key={index} position={point.position}>
                        <Popup>
                            <div className="font-bold">{point.name}</div>
                            <div>{point.description}</div>
                        </Popup>
                    </Marker>
                ))}

                <RoutingMachine from={pointsOfInterest[0].position} to={pointsOfInterest[2].position} color='#9a2fffd3'/>
            </MapContainer>
        </div>
    );
};

export default KinshasaMap; 