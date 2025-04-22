import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

export default function RoutingMachine({ from, to, color = '#ff2f2ff6', weight = 5 }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const control = L.Routing.control({
            waypoints: [
                L.latLng(from[0], from[1]),
                L.latLng(to[0], to[1]),
            ],
            routeWhileDragging: false,
            showAlternatives: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            //      💡 Personnalisation de la ligne
            lineOptions: {
                styles: [{ color: color, weight: weight }],
                addWaypoints: false,
            },

            createMarker: () => null, // pas de marqueurs



            // ❌ Supprime la boîte d’infos (instructions/distance/temps)
            // router: L.Routing.osrmv1({
            //     serviceUrl: 'https://router.project-osrm.org/route/v1',
            // }),
            // routeLine: (route, options) => {
            //     const line = L.Routing.line(route, options);
            //     return line;
            // },
            // plan: L.Routing.plan([], {
            //     createMarker: () => null,
            // }),
        });

        control.on('routesfound', function () {
            const container = document.querySelector('.leaflet-routing-container');
            if (container) container.style.display = 'none'; // cache la boîte manuellement
        });

        control.addTo(map);

        return () => {
            map.removeControl(control);
        };
    }, [map, from, to, color, weight]);

    return null;
}
