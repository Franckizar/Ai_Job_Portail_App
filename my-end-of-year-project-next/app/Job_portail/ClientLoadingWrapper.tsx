// // app/ClientLoadingWrapper.tsx
// 'use client';
// import { useState, useEffect } from 'react';
// import Loader from "@/components/Loader";

// export default function ClientLoadingWrapper({ children }: { children: React.ReactNode }) {
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-background">
//         <Loader />
//       </div>
//     );
//   }

//   return <>{children}</>;
// }