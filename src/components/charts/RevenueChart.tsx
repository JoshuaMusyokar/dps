import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { RevenueData } from "../../types";
import { ChartOptions } from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const RevenueChart = ({ data }: { data: RevenueData[] }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", checkDarkMode);
    };
  }, []);

  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Revenue",
        data: data.map((item) => item.amount),
        borderColor: isDarkMode ? "rgb(156, 110, 255)" : "rgb(139, 92, 246)", // dark-primary-500 : primary-500
        backgroundColor: isDarkMode
          ? "rgba(156, 110, 255, 0.1)"
          : "rgba(139, 92, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: isDarkMode
          ? "rgb(156, 110, 255)"
          : "rgb(139, 92, 246)",
        pointBorderColor: isDarkMode
          ? "rgb(180, 153, 255)"
          : "rgb(124, 58, 237)", // lighter shade for border
        pointHoverBackgroundColor: isDarkMode
          ? "rgb(180, 153, 255)"
          : "rgb(124, 58, 237)",
        pointHoverBorderColor: isDarkMode
          ? "rgb(212, 194, 255)"
          : "rgb(109, 40, 217)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: isDarkMode
          ? "rgba(31, 41, 55, 0.9)"
          : "rgba(255, 255, 255, 0.9)",
        titleColor: isDarkMode ? "rgb(243, 244, 246)" : "rgb(17, 24, 39)",
        bodyColor: isDarkMode ? "rgb(209, 213, 219)" : "rgb(55, 65, 81)",
        borderColor: isDarkMode ? "rgb(75, 85, 99)" : "rgb(209, 213, 219)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode
            ? "rgba(75, 85, 99, 0.3)"
            : "rgba(209, 213, 219, 0.5)",
          // drawBorder: false,
        },
        ticks: {
          color: isDarkMode ? "rgb(156, 163, 175)" : "rgb(107, 114, 128)",
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode
            ? "rgba(75, 85, 99, 0.3)"
            : "rgba(209, 213, 219, 0.5)",
          // drawBorder: false,
        },
        ticks: {
          color: isDarkMode ? "rgb(156, 163, 175)" : "rgb(107, 114, 128)",
          font: {
            size: 12,
          },
          callback: (tickValue: string | number) => {
            return `$${(typeof tickValue === "number"
              ? tickValue
              : parseFloat(tickValue)
            ).toLocaleString()}`;
          },
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
    elements: {
      point: {
        hoverRadius: 8,
      },
    },
  };

  return (
    <div className="h-80 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};
