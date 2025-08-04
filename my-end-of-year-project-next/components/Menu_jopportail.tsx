// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { getRoleFromLocalStorage } from "@/jwt";
// import Link from "next/link";
// import {
//   Home,
//   User,
//   Users,
//   Calendar,
//   ClipboardList,
//   FileText,
//   FilePlus,
//   DollarSign,
//   MessageSquare,
//   Bell,
//   Settings,
//   LogOut,
//   Syringe,
// } from "lucide-react";

// const Menu = () => {
//   const [role, setRole] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     setRole(getRoleFromLocalStorage());
//   }, []);

//   const handleDashboardClick = () => {
//     if (!role) return;
//     if (role === "admin") router.push("/Admin");
//     else if (role === "doctor") router.push("/Doctor");
//     else if (role === "nurse") router.push("/Nurse");
//     else if (role === "patient") router.push("/Patient");
//     else router.push("/");
//   };

//   const menuItems = [
//     {
//       title: "MENU",
//       items: [
//         {
//           icon: <Home className="w-5 h-5" />,
//           label: "Dashboard",
//           href: "",
//           visible: ["admin", "doctor", "nurse", "patient"],
//           onClick: handleDashboardClick,
//         },
//         {
//           icon: <Users className="w-5 h-5" />,
//           label: "Patients",
//           href: "Job/list/Patients",
//           visible: ["admin", "doctor", "nurse"],
//         },
//         {
//           icon: <User className="w-5 h-5" />,
//           label: "Nurses",
//           href: "Job/list/Nurses",
//           visible: ["admin"],
//         },
//         // {
//         //   icon: <User className="w-5 h-5" />,
//         //   label: "My Profile",
//         //   href: "/Settings",
//         //   visible: ["doctor", "nurse", "patient"],
//         // },
//         // {
//         //   icon: <Calendar className="w-5 h-5" />,
//         //   label: "Appointments",
//         //   href: "Job/list/Appointment",
//         //   visible: ["admin", "doctor", "nurse"],
//         // },
//         // {
//         //   icon: <Calendar className="w-5 h-5" />,
//         //   label: "Book Appointment",
//         //   href: "Job/list/BookAppointmentForm",
//         //   visible: ["patient"],
//         // },
//         //  {
//         //   icon: <Calendar className="w-5 h-5" />,
//         //   label: "Map",
//         //   href: "Job/list/Map",
//         //    visible: ["admin", "doctor", "nurse"],
//         // },
//         // {
//         //   icon: <Calendar className="w-5 h-5" />,
//         //   label: "Medical Record",
//         //   href: "Job/list/Medical_Record",
//         //   visible: ["admin", "doctor"],
//         // },
//         // {
//         //   icon: <Calendar className="w-5 h-5" />,
//         //   label: "Medical Record",
//         //   href: "Job/list/Medical_Record_Patient",
//         //   visible: ["patient"],
//         // },
//         // {
//         //   icon: <ClipboardList className="w-5 h-5" />,
//         //   label: "Treatment Records",
//         //   href: "/treatments",
//         //   visible: ["doctor"],
//         // },
//         // {
//         //   icon: <Syringe className="w-5 h-5" />,
//         //   label: "Prescriptions",
//         //   href: "/prescriptions",
//         //   visible: ["doctor", "nurse"],
//         // },
//         // {
//         //   icon: <FileText className="w-5 h-5" />,
//         //   label: "Medical Records",
//         //   href: "/medical-records",
//         //   visible: ["doctor"],
//         // },
//         // {
//         //   icon: <DollarSign className="w-5 h-5" />,
//         //   label: "Invoices",
//         //   href: "Job/list/Invoices",
//         //   visible: ["admin", "patient"],
//         // },
//         // {
//         //   icon: <FilePlus className="w-5 h-5" />,
//         //   label: "Services",
//         //   href: "Job/list/Services",
//         //   visible: ["admin", "doctor", "nurse", "patient"],
//         // },
//         // {
//         //   icon: <FilePlus className="w-5 h-5" />,
//         //   label: "Payment",
//         //   href: "Job/list/Payment",
//         //   visible: ["patient"],
//         // },
//         // {
//         //   icon: <Bell className="w-5 h-5" />,
//         //   label: "Announcements",
//         //   href: "Job/list/announcements",
//         //   visible: ["admin", "doctor", "nurse", "patient"],
//         // },
//         // {
//         //   icon: <MessageSquare className="w-5 h-5" />,
//         //   label: "Messages",
//         //   href: "/messages",
//         //   visible: ["admin", "doctor", "nurse", "patient"],
//         // },
//         // {
//         //   icon: <MessageSquare className="w-5 h-5" />,
//         //   label: "Appointment",
//         //   href: "Job/list/PatietntAppointment",
//         //   visible: ["patient"],
//         // },
//       ],
//     },
//     {
//       title: "OTHER",
//       items: [
//         {
//           icon: <Settings className="w-5 h-5" />,
//           label: "Settings",
//           href: "/Settings",
//           visible: ["admin", "doctor", "nurse", "patient"],
//         },
//         {
//           icon: <LogOut className="w-5 h-5" />,
//           label: "Logout",
//           href: "/logout",
//           visible: ["admin", "doctor", "nurse", "patient"],
//         },
//       ],
//     },
//   ];

//   if (!role) return null;

//   return (
//     <div className="mt-4 text-sm">
//       {menuItems.map((section) => (
//         <div className="flex flex-col gap-2" key={section.title}>
//           <span className="hidden lg:block text-gray-400 font-light my-4 md:px-5">
//             {section.title}
//           </span>
//           {section.items.map((item) => {
//             if (item.visible.includes(role)) {
//               if (item.label === "Dashboard") {
//                 return (
//                   <button
//                     key={item.label}
//                     onClick={item.onClick}
//                     className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-5 rounded-md hover:bg-blue-50 transition-colors w-full text-left"
//                   >
//                     {item.icon}
//                     <span className="hidden lg:block">{item.label}</span>
//                   </button>
//                 );
//               } else {
//                 return (
//                   <Link
//                     href={item.href}
//                     key={item.label}
//                     className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-5 rounded-md hover:bg-blue-50 transition-colors"
//                   >
//                     {item.icon}
//                     <span className="hidden lg:block">{item.label}</span>
//                   </Link>
//                 );
//               }
//             }
//             return null;
//           })}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Menu;
/////////////////////////////////////////////////////////////////////////
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getRoleFromLocalStorage } from "@/jwt";
import Link from "next/link";
import {
  Home,
  User,
  Users,
  Calendar,
  FileText,
  DollarSign,
  FilePlus,
} from "lucide-react";

const ModernMenu = () => {
  const [role, setRole] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setRole(getRoleFromLocalStorage());
    setActiveRoute(pathname);
  }, [pathname]);

  const handleDashboardClick = () => {
    if (!role) return;
    if (role === "admin") router.push("/Admin");
    else if (role === "doctor") router.push("/Doctor");
    else if (role === "nurse") router.push("/Nurse");
    else if (role === "patient") router.push("/Patient");
    else router.push("/");
  };

  const menuItems = [
    {
      icon: <Home className="w-4 h-4" />,
      label: "Dashboard",
      href: "",
      visible: ["admin", "doctor", "nurse", "patient"],
      onClick: handleDashboardClick,
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Patients",
      href: "/Job/list/Patients",
      visible: ["admin", "doctor", "nurse"],
    },
    {
      icon: <User className="w-4 h-4" />,
      label: "Nurses",
      href: "/Job/list/Nurses",
      visible: ["admin"],
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Appointments",
      href: "/Job/list/Appointment",
      visible: ["admin", "doctor", "nurse"],
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: "Records",
      href: "/Job/list/Medical_Record",
      visible: ["admin", "doctor"],
    },
    {
      icon: <DollarSign className="w-4 h-4" />,
      label: "Invoices",
      href: "/Job/list/Invoices",
      visible: ["admin", "patient"],
    },
    {
      icon: <FilePlus className="w-4 h-4" />,
      label: "Services",
      href: "/Job/list/Services",
      visible: ["admin", "doctor", "nurse", "patient"],
    },
  ];

  if (!role) return null;

  const visibleItems = menuItems.filter(item => item.visible.includes(role));

  return (
    <nav className="flex items-center gap-1 bg-gray-100/80 rounded-full p-1 backdrop-blur-sm">
      {visibleItems.map((item) => {
        const isActive = item.href ? activeRoute === item.href : 
                        (item.label === "Dashboard" && 
                         (activeRoute === "/Admin" || activeRoute === "/Doctor" || 
                          activeRoute === "/Nurse" || activeRoute === "/Patient"));

        if (item.label === "Dashboard") {
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`
                relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white/80'
                }
              `}
            >
              {item.icon}
              <span className="hidden sm:block">{item.label}</span>
            </button>
          );
        } else {
          return (
            <Link
              href={item.href}
              key={item.label}
              className={`
                relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white/80'
                }
              `}
            >
              {item.icon}
              <span className="hidden sm:block">{item.label}</span>
            </Link>
          );
        }
      })}
    </nav>
  );
};

export default ModernMenu;