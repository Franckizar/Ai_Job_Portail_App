
import { BigCalendarAdmin } from "@/components";
// import BigCalendar from "@/components/GigCalender"; // Adjust path as needed
import React from "react";

const Appointment = () => {
  return (
    <div className="w-screen h-screen min-h-screen min-w-screen overflow-hidden flex flex-col bg-gray-50">
      <div className="flex-1 min-h-0 min-w-0">
        <BigCalendarAdmin />
      </div>
    </div>
  );
};

export default Appointment;
