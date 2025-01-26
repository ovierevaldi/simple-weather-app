import axios from "axios";
import { WeatherDataProps } from "../page";

const WeatherProvider = () => {

    const getWeatherByCity= async (city: string): Promise<WeatherDataProps | string> => {
        const url = `http://api.weatherstack.com/current?access_key=${process.env.NEXT_PUBLIC_WEATHER_KEY}&query=${city}`;

        try {
            const response = await axios.get(url);
            console.log(response)
            const newWeatherData : WeatherDataProps = {
                location: {
                    country: response.data.location.country || '',
                    name: response.data.location.name || ''
                },
                temperature: response.data.current.temperature || '',
                weather_descriptions: response.data.current.weather_descriptions || [''],
                weather_icons: response.data.current.weather_icons || ['']
            }
            return newWeatherData;
        } catch (error) {
            console.log(error)
           if(axios.isAxiosError(error)){
                console.error(error.response?.data || error.message);
                return 'Failed To Fetch Weather Data, It maybe because the API calls over the limit, Or The Internet Connection Problem'
           }
           else{
            console.log(error)
                return 'An Unexpected Error'
           }
        }
    };

    return { getWeatherByCity }
};

export default WeatherProvider