import { Weather } from "@/types/types";
import dynamic from "next/dynamic";
import { Data } from "plotly.js";
import { useEffect, useState } from "react";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import moment from "moment";

const PlotlyChart = ({ data }: { data: Weather[] }) => {
  const [chartData, setChartData] = useState<
    {
      x: string[];
      y: number[];
      type: string;
      mode: string;
      marker: { color: string };
    }[]
  >([]);
  const [layout, setLayout] = useState({});

  useEffect(() => {
    setChartData([
      {
        x: data.map((point) => moment(point.date).format("DD/MM")),
        y: data.map((point) => point.mean_temp),
        type: "scatter",
        mode: "lines+markers",
        marker: { color: "#FF4136" },
      },
    ]);

    setLayout({
      title: "Average Temperature Trend",
      xaxis: { title: `Dates for ${moment(data[0].date).format("YYYY")}` },
      yaxis: { title: "Temperature (°C)" },
    });
  }, [data]);

  return (
    <div className="w-full h-full bg-gray-700">
      <Plot
        data={chartData as Data[]}
        layout={layout}
        style={{ width: "100%", height: "100%", backgroundColor: "black" }}
        useResizeHandler
      />
    </div>
  );
};

export default PlotlyChart;
