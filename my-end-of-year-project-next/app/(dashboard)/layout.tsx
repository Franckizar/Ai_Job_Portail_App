// import { Menu, Navbar } from "@/components";
// import Image from "next/image";
// import Link from "next/link";

// export default function DashboardLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <div className="h-screen flex">
//       <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-white">
//         <Link href="/" className="flex items-center justify-center lg:justify-start gap-2 lg:gap-4 p-4">
//           <Image src="/wamb.png" alt="logo" width={250} height={250} />
//           {/* <span className="hidden md:hidden lg:block xl:block text-black font-bold" >Wamb's</span> */}
//         </Link>
//         <Menu/>
//       </div>
//       {/* {RIGHT} */}
//       <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col text-black ">
//         <Navbar/>
//         {children}
//       </div>
//     </div>
//   );
// }
