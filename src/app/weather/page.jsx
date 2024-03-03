'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherTop from '../components/weather/WeatherTop';
import WeatherBottom from '../components/weather/WeatherBottom';
import WeatherMiddle from '../components/weather/WeatherMiddle';
import EndpointError from '../components/EndpointError';



export default function Weather() {
    const [dataTop, setDataTop] = useState(null)
    const [dataMiddle, setDataMiddle] = useState(null)
    const [dataBottom, setDataBottom] = useState(null)
    const [temp, setTemp] = useState(null)
    const [city, setCity] = useState("pune")
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);

    const fetchWeather = async (param) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${param}`)
            if (response.status === 200) {
                return response.data
            }
        } catch (error) {
            setError(1)
        }
    }

    useEffect(() => {
        // Use the Geolocation API to get the user's initial location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                },
                (error) => {
                    console.error('Error getting user location:', error.message);
                }
            );
        } else {
            console.error('Geolocation is not supported by your browser.');
        }
    }, []);

    useEffect(() => {

        const fetchDataForCity = async () => {
            const param = `/weather/current?city=${city}`;
            const dataTop = await fetchWeather(param);
            setDataTop(dataTop);

            const param1 = `/weather/forecast-today?city=${city}`;
            const dataMiddle = await fetchWeather(param1);
            setDataMiddle(dataMiddle);

            const param2 = `/weather/forecast?city=${city}&days=5`;
            const dataBottom = await fetchWeather(param2);
            setDataBottom(dataBottom);
        };

        const fetchDataForLocation = async () => {
            const param = `/weather/current?lat=${userLocation?.latitude}&lon=${userLocation?.longitude}`;
            const dataTop = await fetchWeather(param);
            setDataTop(dataTop);

            const param1 = `/weather/forecast-today?lat=${userLocation?.latitude}&lon=${userLocation?.longitude}`;
            const dataMiddle = await fetchWeather(param1);
            setDataMiddle(dataMiddle);

            const param2 = `/weather/forecast?lat=${userLocation?.latitude}&lon=${userLocation?.longitude}&days=5`;
            const dataBottom = await fetchWeather(param2);
            setDataBottom(dataBottom);


        };

        if (userLocation) {
            fetchDataForLocation()
        } else {
            fetchDataForCity()
        }

    }, [userLocation]);

    return (
        <>
            {/* <div className="flex mb-20 mt-40 items-center justify-center ">
                <div className="w-1/2 p-8 bg-gray-100 rounded-lg shadow-md">
                    <input
                        type="text"
                        placeholder="Type something..."
                       
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={handleButtonClick}
                        className="mt-4 mx-auto bg-teal-900 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Search
                    </button>
                </div>
            </div> */}


            {error ? (
               

                    <EndpointError />
                
            ) : (
                <>
                    <div className="overflow-x-hidden">

                    <div className="text-base  text-black h-full bg-White bg-fixed bg-no-repeat">
                        <main className="flex flex-wrap w-[90%] lg:w-[60%] mx-auto my-2 text-lg">
                            <WeatherTop data={dataTop} />
                        </main>
                    </div>
                    <div className="flex flex-col justify-center items-center ">

                        <WeatherMiddle data={dataMiddle} />

                        <WeatherBottom data={dataBottom} />

                    </div>
                    </div>
                </>
            )}
        </>
    )
}







