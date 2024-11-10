"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Loader from "@/components/ui/Loader";
import { ButtonSolid } from "@/components/ui/Button";
import { IoGlassesOutline } from "react-icons/io5";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Task {
  title: string;
  status: "Open" | "In Progress" | "Closed";
  people?: { name: string }[];  // Adding `people` field to the Task interface
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

        const statusCounts = ["Open", "In Progress", "Closed"].map((status) => ({
          status,
          count: data.filter((task: Task) => task.status === status).length,
        }));

        // Filter tasks to include only those with assigned people
        const tasksWithPeople = data.filter((task: Task) => task.people && task.people.length > 0);

        setTaskStatus(statusCounts);
        setTasks(tasksWithPeople.reverse()); // Show latest first
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoader(false);
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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
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

      <div className="grid gap-6 grid-cols-2 max-md:grid-cols-1">
        {/* Task Status Summary */}
        <div className="grid grid-cols-3 gap-4 max-md:order-1 max-sm:grid-cols-1">
          {taskStatus.length === 0 ? (
            [...Array(3)].map((_, index) => (
              <div key={index} className="grid gap-4">
                <div className="rounded-lg bg-gray-50 border border-gray-300 px-4 py-3 flex flex-col gap-1 max-sm:flex-row max-sm:items-center max-sm:justify-between">
                  <div className="w-full flex justify-center items-center h-16">
                    {loader ? (<Loader />) : (<h2 className='text-gray-600 text-base font-normal'>No data</h2>)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            taskStatus.map((ts) => (
              <div key={ts.status} className="rounded-lg bg-gray-50 border border-gray-300 px-4 py-3 flex flex-col gap-1 max-sm:flex-row max-sm:items-center max-sm:justify-between">
                <h2 className="text-base font-semibold">{ts.status} Tasks</h2>
                <p className="text-2xl font-semibold max-sm:text-xl">{ts.count}</p>
              </div>
            ))
          )}
        </div>

        {/* Latest Tasks */}
        <div className="row-span-2 rounded-lg border border-gray-300 px-4 py-3 max-md:order-3 max-md:row-span-1">
          <div className="grid h-full gap-2 content-between">
            <div className="grid gap-2">
              <h2 className="text-2xl font-semibold text-blue-600">Latest Tasks</h2>
              {tasks.length !== 0 ? (
                <div className="overflow-y-auto max-h-72">
                  {tasks.slice(0, 3).map((task, index) => (
                    <div
                      key={index}
                      className={`grid gap-2 py-3 ${index !== tasks.slice(0, 3).length - 1 && "border-b border-b-gray-300"}`}
                    >
                      <h3 className="text-base">
                        {task.title.length > 56 ? `${task.title.slice(0, 56)}... ` : task.title}
                      </h3>
                      <p className="font-semibold">{task.people?.map((p) => p.name).join(", ")}</p>
                      <div className={`w-fit px-3 py-1 rounded-full font-semibold text-sm ${task.status === "Open" && "bg-green-100 text-green-600"} ${task.status === "In Progress" && "bg-yellow-100 text-yellow-600"} ${task.status === "Closed" && "bg-purple-100 text-purple-600"}`}>
                        <p>{task.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center max-h-72'>
                  {loader ? (<Loader />) : (<h2 className='text-gray-600 text-base font-normal'>No data</h2>)}
                </div>
              )}
            </div>
            <ButtonSolid href="/tasks" icon={<IoGlassesOutline className="size-5" />} title="Manage Tasks" disabled={false} maxMdWidth={false} type="button" />
          </div>
        </div>

        {/* Chart for Task Statuses */}
        <div className="rounded-lg border border-gray-300 px-4 py-3 grid gap-4 max-md:order-2">
          <h2 className="text-xl font-semibold text-blue-600">Tasks Overview</h2>
          {tasks.length === 0 ? (
            <div className='h-64 max-md:h-80 max-sm:h-96 text-center'>
              {loader ? (<Loader />) : (<h2 className='text-gray-600 text-base font-normal'>No data</h2>)}
            </div>
          ) : (
            <div className="w-full h-64 relative max-md:h-80 max-sm:h-96">
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
