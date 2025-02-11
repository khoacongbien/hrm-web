"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/appProvider";
import jwt from "jsonwebtoken";

export default function AvartarComponent() {
  let imgsrc = null;
  let name = "";
  let department = "";

  const sessionToken = useAppContext();
  if (sessionToken) {
    const decode: any = jwt.decode(sessionToken.sessionToken);
    imgsrc = decode.imgsrc;
    name = decode.name;
    department = decode.departmentId;
  }

  const router = useRouter();
  const handleLogout = useCallback(() => {
    const highestId = window.setTimeout(() => {}, 0);
    for (let i = highestId; i >= 0; i--) {
      window.clearTimeout(i);
    }
    const itemsToClear = ["isPageLoaded", "accessToken", "isLoggedIn"];
    itemsToClear.forEach((item) => localStorage.removeItem(item));

    router.replace("/login");
  }, [router]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-center items-center h-full w-[180px] gap-4 cursor-pointer hover:bg-gray-200 rounded-sm">
          <Avatar className="w-9 h-9">
            <AvatarImage
              src={imgsrc}
              alt="avartar"
              className="rounded-full w-9 h-9"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs leading-3 text-blue-600 font-semibold">
              {name}
            </span>
            <span className="text-[10px]  text-blue-600">{department}</span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
