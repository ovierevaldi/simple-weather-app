'use client'
import { FormEventHandler, useState } from "react";
import { CiSearch } from "react-icons/ci";
import WeatherProvider from "./libs/weather-provider";
import { BsArrowUp } from "react-icons/bs";

export type WeatherDataProps = {
  location: {
    country: string,
    name: string
  },
  weather_descriptions: string[],
  temperature: number,
  weather_icons: string[]
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const [currentWeatherData, setCurrentWeatherData] = useState<WeatherDataProps | null>();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setIsError] = useState(false);
  
  const handleSearchInput = (keyword: string) => {
    setSearchQuery(keyword);
  };



  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if(searchQuery){
      findWeatherByCity(searchQuery);
    }
  }

  const findWeatherByCity = async (city: string) => {
    try {
      setIsLoading(true);
      setIsError(false)
      
      const result = await WeatherProvider().getWeatherByCity(city);
      if(typeof result === 'object'){
        setCurrentWeatherData(result);
      }
      else{
        setIsError(true);
      }
    } catch (error) {
      console.log(error)      
    }
    finally{
      setIsLoading(false);
    }
  };

  const ErrorMessage = () => {
    return(
      <div className="text-center text-red-500">
        <p className="text-xl md:text-3xl mb-4">Cannot Fetch Api Data, reason Can be either:</p>
        <ol className="text-lg md:text-xl ">
          <li>1. Wrong City Name</li>
          <li>2. Limit Api Call Per Day</li>
          <li>3. Network Connection</li>
        </ol>
      </div>
    )
  };

  return (
    <div className="grid h-screen place-content-center gap-y-16 md:gap-y-24">
        <div>
          <p className="text-5xl md:text-6xl mb-16 text-center">Weather App</p>
          <div className="flex gap-x-4 justify-center">
            <form onSubmit={handleFormSubmit} className="flex gap-x-4">
              <input placeholder="Search Location..." className="px-4 py-2 bg-primary outline outline-1 focus:outline-white rounded-md text-xl md:text-2xl"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
              />
              <button
                className="bg-primary outline outline-1 rounded-md hover:bg-white hover:text-primary py-3 px-4"
                type="submit">
                  <CiSearch className="text-2xl md:text-3xl"/>
              </button>
            </form>
          </div>
        </div>
      
      {
        isLoading && <p className="text-center text-3xl">Loading...</p>
      }

      {
        error && <ErrorMessage />
      }
      {
        !isLoading && !error && (
          currentWeatherData ?
            <div>
              <p className="text-3xl md:text-4xl mb-6 text-center">{currentWeatherData.location.country}, {currentWeatherData.location.name}</p>
              <div className="md:min-w-[450px] rounded-md border p-8">
                  <div className="flex flex-col gap-y-6">
                    <img src={`${currentWeatherData.weather_icons[0]}`} className="mx-auto" alt="Weather Condition Icon"/>
                    <p className="text-2xl md:text-3xl text-center">{currentWeatherData.weather_descriptions[0]}</p>
                    <p className="text-3xl md:text-5xl text-center">{currentWeatherData.temperature}&#176;C</p>
                  </div>
              </div>  
            </div>
            : 
            <div className="flex gap-x-4 items-center justify-center">
              <p className="text-2xl">Try Seacrhing City</p>
              <BsArrowUp className="text-2xl"/>
            </div>
        )
      }
    </div>
  );
}
