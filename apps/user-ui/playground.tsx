// "use client";

// import { User, LogOut, Package } from "lucide-react";
// import Link from "next/link";
// import { useRouter, usePathname } from "next/navigation";
// import React from "react";
// import { useAtom, useSetAtom } from "jotai";

// import { isLoggedInAtom, userAtom, logoutAtom } from "@/store/userAtom";
// import CartDrawer from "../cart/cart";
// import NotificationPanel from "../global/notification";
// import { Button } from "@repo/ui/components/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@repo/ui/components/dropdown-menu";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@repo/ui/components/avatar";
// import { SidebarTrigger, useSidebar } from "@repo/ui/components/sidebar";
// import { disconnectSocketAtom } from "@/store/socketAtom";
// import { authService } from "@/libs/api-client";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@repo/ui/components/breadcrumb";
// import { Route } from "next";
// import Image from "next/image";
// import { dooriteLogo } from "@repo/ui/assets";

// const Header = () => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isLoggedIn] = useAtom(isLoggedInAtom);
//   const [user] = useAtom(userAtom);
//   const logout = useSetAtom(logoutAtom);
//   const disconect = useSetAtom(disconnectSocketAtom);
//   const { open, isMobile } = useSidebar();

//   const getInitials = (name?: string) => {
//     if (!name) return "U";
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   const handleLogout = async () => {
//     await authService.logout();
//     logout();
//     disconect();
//     router.push("/log-in");
//   };

//   // Generate breadcrumbs from pathname
//   const generateBreadcrumbs = () => {
//     const paths = pathname.split("/").filter(Boolean);
//     const breadcrumbs = [{ name: "Home", path: "/" }];

//     let currentPath = "";
//     paths.forEach((path) => {
//       currentPath += `/${path}`;
//       const name = path.charAt(0).toUpperCase() + path.slice(1);
//       if (name !== "Home") {
//         breadcrumbs.push({ name, path: currentPath });
//       }
//     });

//     return breadcrumbs;
//   };

//   const breadcrumbs = generateBreadcrumbs();

//   return (
//     <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
//       <nav className="flex items-center justify-between h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Left Section */}
//         <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
//           {/* Sidebar Toggle */}
//           {isLoggedIn && (
//             <div className="max-sm:hidden">
//               <SidebarTrigger />
//             </div>
//           )}

//           {(!open || isMobile) && (
//             <Link
//               href={isLoggedIn ? "/home" : "/landing"}
//               className="flex items-center gap-2 sm:gap-3"
//             >
//               <Image
//                 src={dooriteLogo}
//                 alt="Doorrite"
//                 width={32}
//                 height={32}
//                 className="w-8 h-8"
//                 priority
//               />
//               <span className="font-bold text-lg sm:text-xl text-primary md:hidden">
//                 Doorrite
//               </span>
//             </Link>
//           )}

//           {/* Breadcrumbs - Only on large screens when logged in */}
//           {isLoggedIn && (
//             <div className="hidden lg:block">
//               <Breadcrumb>
//                 <BreadcrumbList>
//                   {breadcrumbs.map((crumb, index) => (
//                     <React.Fragment key={crumb.path}>
//                       {index > 0 && <BreadcrumbSeparator />}
//                       <BreadcrumbItem>
//                         {index === breadcrumbs.length - 1 ? (
//                           <BreadcrumbPage className="font-semibold">
//                             {crumb.name}
//                           </BreadcrumbPage>
//                         ) : (
//                           <BreadcrumbLink asChild>
//                             <Link href={crumb.path as Route<string>}>
//                               {crumb.name}
//                             </Link>
//                           </BreadcrumbLink>
//                         )}
//                       </BreadcrumbItem>
//                     </React.Fragment>
//                   ))}
//                 </BreadcrumbList>
//               </Breadcrumb>
//             </div>
//           )}
//         </div>

//         {/*Down*/}

//         {/* Right Section */}
//         <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
//           {isLoggedIn ? (
//             <>
//               <NotificationPanel />
//               <CartDrawer />

//               {/* User Menu - Desktop */}
//               <div className="hidden lg:block">
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <button className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-colors">
//                       <Avatar className="w-9 h-9">
//                         <AvatarImage
//                           src={user?.profileImageUrl}
//                           alt={user?.fullName}
//                         />
//                         <AvatarFallback className="bg-primary text-white text-sm">
//                           {getInitials(user?.fullName)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
//                         {user?.fullName?.split(" ")[0] || "User"}
//                       </span>
//                     </button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-56">
//                     <DropdownMenuLabel>
//                       <div className="flex flex-col">
//                         <span className="font-semibold">
//                           {user?.fullName || "User"}
//                         </span>
//                         <span className="text-xs text-gray-500 truncate">
//                           {user?.email}
//                         </span>
//                       </div>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem asChild>
//                       <Link href="/account" className="cursor-pointer">
//                         <User className="w-4 h-4 mr-2" />
//                         Account
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem asChild>
//                       <Link href="/order" className="cursor-pointer">
//                         <Package className="w-4 h-4 mr-2" />
//                         Orders
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem
//                       onClick={handleLogout}
//                       className="cursor-pointer text-red-600 focus:text-red-600"
//                     >
//                       <LogOut className="w-4 h-4 mr-2" />
//                       Log out
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </>
//           ) : (
//             // Guest User Buttons - Show Login only on mobile, Login + Sign Up on desktop
//             <div className="flex items-center gap-2 sm:gap-3">
//               <Button variant="ghost" size="lg" asChild>
//                 <Link href="/log-in">Log In</Link>
//               </Button>
//               <Button size="lg" asChild>
//                 <Link href="/sign-up">Sign Up</Link>
//               </Button>
//             </div>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;

// // <div className="flex-1 sm:hidden font-bold flex items-center pr-5">
// //   {breadcrumbs[breadcrumbs.length - 1]?.name}
// //   {/*<span className="mr-2">Page</span>*/}
// // </div>
