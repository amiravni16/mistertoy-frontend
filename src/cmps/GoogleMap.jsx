import {
    AdvancedMarker,
    APIProvider,
    Map,
    Pin,
    useMap,
} from '@vis.gl/react-google-maps'
import { useEffect, useState } from 'react'

const API_KEY = 'AIzaSyA5YAKbctMWmj2etXv-KY7MSXDMGaWr0qs'

const branches = [
    {
        city: 'New York',
        id: 101,
        position: {
            lat: 40.7128,
            lng: -74.0060,
        },
        address: '123 Broadway, New York, NY 10001',
        phone: '(555) 123-4567',
        hours: 'Mon-Fri: 9AM-8PM, Sat-Sun: 10AM-6PM'
    },
    {
        city: 'Los Angeles',
        id: 102,
        position: {
            lat: 34.0522,
            lng: -118.2437,
        },
        address: '456 Sunset Blvd, Los Angeles, CA 90028',
        phone: '(555) 987-6543',
        hours: 'Mon-Fri: 9AM-8PM, Sat-Sun: 10AM-6PM'
    },
    {
        city: 'Chicago',
        id: 103,
        position: {
            lat: 41.8781,
            lng: -87.6298,
        },
        address: '789 Michigan Ave, Chicago, IL 60611',
        phone: '(555) 456-7890',
        hours: 'Mon-Fri: 9AM-8PM, Sat-Sun: 10AM-6PM'
    },
    {
        city: 'Miami',
        id: 104,
        position: {
            lat: 25.7617,
            lng: -80.1918,
        },
        address: '321 Ocean Dr, Miami, FL 33139',
        phone: '(555) 321-0987',
        hours: 'Mon-Fri: 9AM-8PM, Sat-Sun: 10AM-6PM'
    }
]

export function GoogleMap({ selectedBranch, onBranchSelect }) {
    return (
        <APIProvider apiKey={API_KEY}>
            <MapController selectedBranch={selectedBranch} onBranchSelect={onBranchSelect} />
        </APIProvider>
    )
}

// separate component that uses the map context
function MapController({ selectedBranch, onBranchSelect }) {
    const [coords, setCoords] = useState(null)
    const [selectedBranchState, setSelectedBranchState] = useState(selectedBranch)

    const map = useMap()

    useEffect(() => {
        if (map && selectedBranch) {
            map.panTo(selectedBranch.position)
            map.setZoom(12)
            setSelectedBranchState(selectedBranch)
        }
    }, [map, selectedBranch])

    function handleClick({ map, detail }) {
        map.panTo(detail.latLng)
        setCoords(detail.latLng)
    }

    return (
        <>
            {branches.map(branch => (
                <button
                    className="btn"
                    key={branch.city}
                    onClick={() => onBranchSelect && onBranchSelect(branch)}
                >
                    {branch.city}
                </button>
            ))}

            <div className="toy-map" style={{ height: '55vh', width: '100%' }}>
                <Map
                    defaultCenter={{ lat: 39.8283, lng: -98.5795 }}
                    defaultZoom={4}
                    onClick={handleClick}
                    disableDefaultUI={true}
                    mapId="DEMO_MAP_ID"
                >
                    {branches.map(branch => (
                        <AdvancedMarker
                            position={branch.position}
                            key={branch.id}
                        >
                            <Marker branch={branch} />
                        </AdvancedMarker>
                    ))}
                    {coords && (
                        <AdvancedMarker position={coords}>
                            <Pin
                                background={'dodgerblue'}
                                glyphColor={'hotpink'}
                                borderColor={'black'}
                            />
                        </AdvancedMarker>
                    )}
                </Map>
            </div>
        </>
    )
}

function Marker({ branch }) {
    return (
        <div className="branch-img">
            <div style={{
                background: '#ff6b6b',
                border: '3px solid white',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer'
            }}>
                🏪
            </div>
        </div>
    )
}