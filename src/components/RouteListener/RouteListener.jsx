import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function RouteListener() {
    const location = useLocation()
    const [prevLocation, setPrevLocation] = useState(null)

    useEffect(() => {
        if (prevLocation !== null) {
            console.log('newRoute:', location)
            console.log('oldRoute:', prevLocation)
        }
        setPrevLocation(location)
    }, [location])

    return null
}