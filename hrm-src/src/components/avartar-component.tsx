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
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { clientSessionToken } from "@/lib/http";

export default function AvartarComponent() {
  const [infor, setInfor] = useState({
    imgsrc: "",
    name: "",
    department: "",
  });
  useState(() => {});
  useEffect(() => {
    const decode: any = jwt.decode(clientSessionToken.value);
    setInfor({
      imgsrc: decode.imgsrc,
      name: decode.name,
      department: decode.departmentId,
    });
  }, []);

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
              src={infor.imgsrc}
              alt="avartar"
              className="rounded-full w-9 h-9"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs leading-3 text-blue-600 font-semibold">
              {infor.name}
            </span>
            <span className="text-[10px]  text-blue-600">
              {infor.department}
            </span>
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
