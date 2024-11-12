import localFont from "next/font/local";
import { useEffect, useState } from "react";
import axios from "axios";
import { Weather } from "@/types/types";
import PlotlyChart from "../components/PlotlyChart";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [allYears, setAllYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageReload, setPageReload] = useState(false);
  const [weatherData, setWeatherData] = useState<Weather[]>([]);
  const [selectedYear, setSelectedYear] = useState(0);

  const getAllYears = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/getAllYears");
      setAllYears(response.data);
    } catch (error) {
      console.log(error);
      alert(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  const getYearlyWeatherData = async (year: number) => {
    setPageReload(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/weatherData/${year}`
      );
      console.log(response.data);
      setWeatherData(response.data);
    } catch (error) {
      console.log(error);
      alert(JSON.stringify(error));
    } finally {
      setPageReload(false);
    }
  };

  const downloadCSV = async (year: number) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/download/${year}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "weatherData.csv");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
      alert(JSON.stringify(error));
    }
  };

  useEffect(() => {
    getAllYears();
  }, []);

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable}flex flex-col min-h-screen items-center font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col h-full justify-center items-center w-full min-h-screen">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold text-center sm:text-left font-[family-name:var(--font-geist-sans)]">
            Weather App
          </h1>
          <p className="text-lg text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            A simple weather app built with Next.js
          </p>
          <div className="flex items-center mt-8 mb-4">
            <p className="mr-2">Check weather data for</p>
            {!loading && (
              <select
                className="text-black bg-gray-200 rounded-lg w-[80px]"
                onChange={(e) => {
                  setSelectedYear(Number(e.target.value));
                  getYearlyWeatherData(Number(e.target.value));
                }}
              >
                {allYears.map((item) => (
                  <option key={item} className="flex">
                    {item}
                  </option>
                ))}
              </select>
            )}
          </div>
          {pageReload ? (
            <div>
              <p>Loading...</p>
            </div>
          ) : weatherData.length === 0 ? (
            <div>
              <p>No data found.</p>
            </div>
          ) : (
            <div className="w-full h-full px-0 flex flex-col justify-center items-center">
              <PlotlyChart data={weatherData} />
              <button
                className="rounded-lg bg-gray-800 text-white px-4 py-2 mt-4 self-center"
                onClick={() => {
                  if (selectedYear) {
                    downloadCSV(selectedYear);
                  } else {
                    alert("Please select a year to download CSV");
                  }
                }}
              >
                Download CSV
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
