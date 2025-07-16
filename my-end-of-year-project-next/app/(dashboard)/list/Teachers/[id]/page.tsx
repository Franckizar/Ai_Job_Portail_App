import { Announcements,Performance } from '@/components'
import BigCalendar from '@/components/GigCalender'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const SingleTeacherPage = () => {
  return (
    <div className='flex-1 flex flex-col gap-4 p-4 xl:flex-row'>
      {/* Left  */}
      <div className="w-full xl:w-2/3">
      {/* TOP */}
      <div className="flex flex-col lg:flex-row gap-4">

      {/* User INFO CARD */}
      <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
        <div className="w-1/3">
             <Image src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200" alt='' width={144} height={144} className='w-36 h-36 rounded-full object-cover'/>
        </div>
        <div className="w-2/3 flex flex-col justify-between gap-4">
        <h1 className='text-xl font-semibold'>Takam Franck</h1>
        <p className='text-sm text-gray-500'>Lorem ovident quaerat ab
             similique alias quasi, 
             numquam aperiam, hic 
             accusamus rerum.</p>
             <div className="flex items-center justify-between gap-2 flex-wrap text-sm font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2 ">

                    <Image src="/blood.png" alt='' width={14} height={14}/>
                    <span className="full md:w-1/3 flex items-center gap-2 ">A+</span>
                </div>
                <div className="w-full md:w-1/3 flex items-center gap-2 ">

                    <Image src="/date.png" alt='' width={14} height={14}/>
                    <span className="">January 2025</span>
                </div>
                <div className="w-full md:w-1/3 flex items-center gap-2 ">
{/* comeback */}
                    <Image src="/mail.png" alt='' width={14} height={14}/> 
                    <span className="">user@gmail.com</span>
                </div>
                <div className="w-full md:w-1/3 flex items-center gap-2 ">

                    <Image src="/phone.png" alt='' width={14} height={14}/>
                    <span className="">+237 652-97-26-51</span>
                </div>
             </div>
             
        </div>
 
      </div>
      {/* SMALL INFO CARD */}
      <div className="flex-1 flex gap-4 justify-between flex-wrap">
        {/* CARD */}
        <div className="bg-white p--4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
          <Image src="/singleAttendance.png" alt='' width={24} height={24} className='w-6 h-6'/>
          <div className="">
            <h1 className="text-xl font-semibold">90%</h1>
            <span className="text-sm text-gray-400">Attendance</span>
          </div>
        </div>
        {/* CARD */}
        <div className="bg-white p--4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
          <Image src="/singleBranch.png" alt='' width={24} height={24} className='w-6 h-6'/>
          <div className="">
            <h1 className="text-xl font-semibold">2</h1>
            <span className="text-sm text-gray-400">Branches</span>
          </div>
        </div>
        {/* CARD */}
        <div className="bg-white p--4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
          <Image src="/singleLesson.png" alt='' width={24} height={24} className='w-6 h-6'/>
          <div className="">
            <h1 className="text-xl font-semibold">6</h1>
            <span className="text-sm text-gray-400">Lesson</span>
          </div>
        </div>
        {/* CARD */}
        <div className="bg-white p--4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
          <Image src="/singleClass.png" alt='' width={24} height={24} className='w-6 h-6'/>
          <div className="">
            <h1 className="text-xl font-semibold">5</h1>
            <span className="text-sm text-gray-400">Class</span>
          </div>
        </div>
      </div>
      </div>

      {/* Booton */}
      <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
        <h1 className="">Teacher&apos;s Schedule</h1>
        <BigCalendar/>
      </div>
      </div>
      {/* right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
      <div className="bg-white p-4 rounded-md">
        <h1 className="text-xl font-semibold">shortcut</h1>
        <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
          <Link href="/" className="p-3 rounded-md bg-lamaSkyLight">Teacher&apos;s Classes</Link>
          <Link href="/" className="p-3 rounded-md bg-lamaPurpleLight">Teacher&apos;s Student</Link>
          <Link href="/" className="p-3 rounded-md bg-lamaYellowLight">Teacher&apos;s Lesson</Link>
          <Link href="/" className="p-3 rounded-md bg-pink-50">Teacher&apos;s Exams</Link>
          <Link href="/" className="p-3 rounded-md bg-lamaSkyLight">Teacher&apos;s Assignments</Link>
        </div>
        
      </div>
      <Performance/>
      <Announcements/>
      </div>
      
    </div>
  )
}

export default SingleTeacherPage
