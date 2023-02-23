export const typeOfEvent = [
    {
        name: 'Flight',
        start:true,
        end: true,
        flightNumber: true,
        departureAirport: true,
        arrivalAirport: true,
        flightCrew: true
    },
    {
        name: 'Stand-by',
        start:true,
        end: true,
        flightNumber: false,
        departureAirport: false,
        arrivalAirport: false,
        flightCrew: false
    },
    {
        name: 'Sick Leave',
        start:false,
        end: false,
        flightNumber: false,
        departureAirport: false,
        arrivalAirport: false,
        flightCrew: false
    },
    {
        name: 'Holidays',
        start:false,
        end: false,
        flightNumber: false,
        arrivalAirport: false,
        departureAirport: false,
        flightCrew: false
    },
    {
        name: 'Off day',
        start:false,
        end: false,
        flightNumber: false,
        departureAirport: false,
        arrivalAirport: false,
        flightCrew: false
    },
    {
        name: 'Simulator',
        start:true,
        end: true,
        flightNumber: false,
        departureAirport: false,
        arrivalAirport: false,
        flightCrew: true
    },
    {
        name: 'Training',
        start:true,
        end: true,
        flightNumber: false,
        departureAirport: false,
        arrivalAirport: false,
        flightCrew: false
    },
]