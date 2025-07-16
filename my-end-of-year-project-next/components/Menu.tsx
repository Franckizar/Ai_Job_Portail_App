"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRoleFromLocalStorage } from "@/jwt";
import Link from "next/link";
import {
  Home,
  User,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  FilePlus,
  DollarSign,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Syringe,
} from "lucide-react";

const Menu = () => {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setRole(getRoleFromLocalStorage());
  }, []);

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
      title: "MENU",
      items: [
        {
          icon: <Home className="w-5 h-5" />,
          label: "Dashboard",
          href: "",
          visible: ["admin", "doctor", "nurse", "patient"],
          onClick: handleDashboardClick,
        },
        {
          icon: <Users className="w-5 h-5" />,
          label: "Patients",
          href: "/list/Patients",
          visible: ["admin", "doctor", "nurse"],
        },
        {
          icon: <User className="w-5 h-5" />,
          label: "Nurses",
          href: "/list/Nurses",
          visible: ["admin"],
        },
        {
          icon: <User className="w-5 h-5" />,
          label: "My Profile",
          href: "/Settings",
          visible: ["doctor", "nurse", "patient"],
        },
        {
          icon: <Calendar className="w-5 h-5" />,
          label: "Appointments",
          href: "/list/Appointment",
          visible: ["admin", "doctor", "nurse"],
        },
        {
          icon: <Calendar className="w-5 h-5" />,
          label: "Book Appointment",
          href: "/list/BookAppointmentForm",
          visible: ["patient"],
        },
         {
          icon: <Calendar className="w-5 h-5" />,
          label: "Map",
          href: "/list/Map",
           visible: ["admin", "doctor", "nurse"],
        },
        {
          icon: <Calendar className="w-5 h-5" />,
          label: "Medical Record",
          href: "/list/Medical_Record",
          visible: ["admin", "doctor"],
        },
        {
          icon: <Calendar className="w-5 h-5" />,
          label: "Medical Record",
          href: "/list/Medical_Record_Patient",
          visible: ["patient"],
        },
        {
          icon: <ClipboardList className="w-5 h-5" />,
          label: "Treatment Records",
          href: "/treatments",
          visible: ["doctor"],
        },
        {
          icon: <Syringe className="w-5 h-5" />,
          label: "Prescriptions",
          href: "/prescriptions",
          visible: ["doctor", "nurse"],
        },
        {
          icon: <FileText className="w-5 h-5" />,
          label: "Medical Records",
          href: "/medical-records",
          visible: ["doctor"],
        },
        {
          icon: <DollarSign className="w-5 h-5" />,
          label: "Invoices",
          href: "/list/Invoices",
          visible: ["admin", "patient"],
        },
        {
          icon: <FilePlus className="w-5 h-5" />,
          label: "Services",
          href: "/list/Services",
          visible: ["admin", "doctor", "nurse", "patient"],
        },
        {
          icon: <FilePlus className="w-5 h-5" />,
          label: "Payment",
          href: "/list/Payment",
          visible: ["patient"],
        },
        {
          icon: <Bell className="w-5 h-5" />,
          label: "Announcements",
          href: "/list/announcements",
          visible: ["admin", "doctor", "nurse", "patient"],
        },
        {
          icon: <MessageSquare className="w-5 h-5" />,
          label: "Messages",
          href: "/messages",
          visible: ["admin", "doctor", "nurse", "patient"],
        },
        {
          icon: <MessageSquare className="w-5 h-5" />,
          label: "Appointment",
          href: "/list/PatietntAppointment",
          visible: ["patient"],
        },
      ],
    },
    {
      title: "OTHER",
      items: [
        {
          icon: <Settings className="w-5 h-5" />,
          label: "Settings",
          href: "/Settings",
          visible: ["admin", "doctor", "nurse", "patient"],
        },
        {
          icon: <LogOut className="w-5 h-5" />,
          label: "Logout",
          href: "/logout",
          visible: ["admin", "doctor", "nurse", "patient"],
        },
      ],
    },
  ];

  if (!role) return null;

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4 md:px-5">
            {section.title}
          </span>
          {section.items.map((item) => {
            if (item.visible.includes(role)) {
              if (item.label === "Dashboard") {
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-5 rounded-md hover:bg-blue-50 transition-colors w-full text-left"
                  >
                    {item.icon}
                    <span className="hidden lg:block">{item.label}</span>
                  </button>
                );
              } else {
                return (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-5 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    {item.icon}
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                );
              }
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
