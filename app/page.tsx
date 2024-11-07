"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Loader from "@/utilities/Loader";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Task {
  title: string;
  status: "Open" | "In Progress" | "Closed";
}

interface TaskStatus {
  status: "Open" | "In Progress" | "Closed";
  count: number;
}

export default function Home() {
  const [taskStatus, setTaskStatus] = useState<TaskStatus[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        const data = await response.json();

        // Count the number of tasks by status
        const statusCounts = ["Open", "In Progress", "Closed"].map((status) => ({
          status,
          count: data.filter((task: Task) => task.status === status).length,
        }));

        setTaskStatus(statusCounts);
        setTasks(data);
        // new
        setLoader(false);
        // end
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const chartData = {
    labels: taskStatus.map((ts) => ts.status),
    datasets: [
      {
        label: "Tasks by Status",
        data: taskStatus.map((ts) => ts.count),
        backgroundColor: ["#16A34A", "#CA8A04", "#9333EA"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-gray-600">
          Overview of tasks and statuses for better management and insights.
        </p>
      </div>

      {loader ? (
        <div className='text-center'>
          <Loader />
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-2">
          {/* Task Status Summary */}
          <div className="grid grid-cols-3 gap-4">
            {taskStatus.map((ts) => (
              <div key={ts.status} className="rounded-lg border border-gray-300 px-4 py-3 grid gap-1">
                <h2 className="text-base font-semibold">{ts.status} Tasks</h2>
                <p className="text-2xl font-semibold">{ts.count}</p>
              </div>
            ))}
          </div>

          {/* Latest Tasks */}
          <div className="row-span-2 rounded-lg border border-gray-300 px-4 py-3">
            <div className="h-fit grid gap-2">
              <h2 className="text-2xl font-semibold text-blue-600">Latest Tasks</h2>
              <div className="overflow-y-auto max-h-72">
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className={`py-2 ${index !== tasks.length - 1 && "border-b border-b-gray-300"}`}
                  >
                    <h3>{task.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart for Task Statuses */}
          <div className="rounded-lg border border-gray-300 px-4 py-3 grid gap-2">
            <h2 className="text-xl font-semibold text-blue-600">Tasks Overview</h2>
            <div className="w-full">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
