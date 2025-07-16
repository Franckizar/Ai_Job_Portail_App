import Image from 'next/image'
import React from 'react'

const Navbar = () => {
  return (
    <div className='flex items-center justify-between p-4 '>
        {/* {search bar} */}
        <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2 ">
            <Image src="/search.png" alt="" width={14} height={14}/>
            <input className='w-[200px] p-2 bg-transparent outline-none' type="text" placeholder='Search...'/>
        </div>

        {/* {icons and user} */}
        <div className='flex items-center gap-6 justify-end w-full'>
            <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer " >
                <Image src="/message.png" alt="" width={20} height={20} />
            </div>
            <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative ">
                <Image src="/announcement.png" alt="" width={20} height={20} />
            <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">8</div>
            </div>
            {/* User info */}
            <div className="flex flex-col items-center cursor-pointer">
              <span className="text-sm leading-3 font-medium text-gray-950">FRANCK</span>
              <span className="text-gray-500 text-[10px]" >ADMIN</span>
            </div>
            <Image src="/avatar.png" alt="" width={36} height={36} className='rounded-full cursor-pointer'/>
        </div>
    </div>
  )
}

export default Navbar
