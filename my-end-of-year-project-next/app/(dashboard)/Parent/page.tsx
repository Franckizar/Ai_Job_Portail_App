// import { Announcements, EventCalendar } from '@/components'
import { Announcements } from '@/components'
import BigCalendar from '@/components/GigCalender'
import React from 'react'

const ParentPage = () => {
  return (
    <div className=" flex-1 flex text-gray-950 p-4 gap-4 flex-col xl:flex-row ">
    {/* LEFT */}
    <div className="w-full xl:w-2/3">
    <div className="h-full bg-white p-4 rounded-md">
      {/* <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <p className="text-gray-600">Here you can find your latest announcements, events, and more.</p> */}
      <h1 className='text-xl font-semibold'>Schedule (Takam Franck)</h1>
      <BigCalendar/>
    </div>
    </div>
    {/* RIGHT */}
    <div className="w-full xl:w-1/3">
       
        <Announcements/> 
      </div>

    </div>
  )
}

export default ParentPage 
