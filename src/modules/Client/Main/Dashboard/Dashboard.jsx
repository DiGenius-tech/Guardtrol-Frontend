import { Card, Label, Select } from "flowbite-react";
import React from "react";
import Activities from "./Activities/Activities";
import Patrols from "./Patrols/Patrols";
import "./Dashboard.scss";
import { Link, Outlet } from "react-router-dom";
import MobileDisplay from "./MobileDisplay/MobileDisplay";

const Dashboard = () => {
  return (
    <>
      {/* dashboard-app works! */}
      <div className="md:hidden">
        <MobileDisplay />
      </div>
      <div className="hidden md:grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5">
          <Card>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Timeline of Activities
            </h1>
            <div className="flex items-center gap-2">
              <div className="max-w-md">
                <Select id="dates" required>
                  <option value={""} defaultValue>
                    Today
                  </option>
                  <option value={""}>...</option>
                </Select>
              </div>

              <div className="max-w-md">
                <Select id="statuses" required>
                  <option value={""} defaultValue>
                    All Statuses
                  </option>
                  <option value={""}>...</option>
                </Select>
              </div>
            </div>
            <Activities />
          </Card>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Patrols
              </h2>

              <button className="bg-secondary-500 hover:bg-secondary-600 rounded-full text-white py-2 px-4 text-sm">
                See all
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="max-w-md">
                <Select id="dates" required>
                  <option value={""} defaultValue>
                    Today
                  </option>
                  <option value={""}>...</option>
                </Select>
              </div>

              <div className="max-w-md">
                <Select id="statuses" required>
                  <option value={""} defaultValue>
                    All Statuses
                  </option>
                  <option value={""}>...</option>
                </Select>
              </div>
            </div>

            <div>
              <Patrols />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
