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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import authApiRequests from "@/apiRequests/auth";
import { getInitials, getLastTwoWords, getRandomColor } from "@/lib/utils";

export default function AvartarComponent() {
  const [infor, setInfor] = useState({
    imgsrc: "",
    name: "",
    department: "",
    abbreviation: "",
  });
  const [fallbackColor, setFallbackColor] = useState<string>("#FFFFFF");
  useEffect(() => {
    const img = localStorage.getItem("imgsrc") || "";
    const name = getLastTwoWords(localStorage.getItem("name") || "");
    const department = localStorage.getItem("department") || "";
    const abbreviation = getInitials(name);
    setFallbackColor(getRandomColor());
    setInfor({
      imgsrc: img,
      name: name,
      department: department,
      abbreviation: abbreviation,
    });
  }, []);

  const router = useRouter();
  const handleLogout = async () => {
    await authApiRequests.logout();
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-center items-center h-full w-[160px] gap-4 cursor-pointer hover:bg-gray-200 rounded-sm">
          <Avatar className="w-9 h-9">
            <AvatarImage
              src={infor.imgsrc}
              alt="avartar"
              className="rounded-full w-9 h-9"
            />
            <AvatarFallback
              style={{
                backgroundColor: fallbackColor,
                borderRadius: "50%", // Bo tròn hoàn toàn
              }}
              className="rounded-full w-9 h-9 flex items-center justify-center text-white font-bold"
            >
              {infor.abbreviation}
            </AvatarFallback>
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
