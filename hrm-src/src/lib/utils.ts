import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UseFormSetError } from "react-hook-form";
import { EntityError } from "./http";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, { type: "server", message: item.message });
    });
  } else {
    toast.error("Lỗi", {
      description: error?.payload?.message ?? "Lỗi không xác định",
      position: "top-right",
      style: {
        backgroundColor: "#FFFFFF",
        color: "#ff1a1a",
      },
      duration: duration ?? 1000,
    });
  }
};

/**
 * Lấy ký tự đầu của chuỗi
 */
export function getInitials(name: string): string {
  if (!name || name.trim() === "") {
    return "";
  }
  return name
    .trim() // Loại bỏ khoảng trắng ở đầu và cuối
    .split(/\s+/) // Tách chuỗi dựa trên một hoặc nhiều khoảng trắng
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

/**
 * Xoá đi ký tự / đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

/**
 * Lấy 2 chữ cuối trong chuỗi
 */
export function getLastTwoWords(input: string): string {
  if (!input || input.trim() === "") {
    return "";
  }
  const words = input.trim().split(/\s+/);
  const lastTwoWords = words.slice(-2).join(" ");
  return lastTwoWords;
}

/**
 * Random màu
 */
export function getRandomColor(): string {
  const colors = [
    "#FF5733", // Đỏ cam
    "#33FF57", // Xanh lá
    "#3357FF", // Xanh dương
    "#F3FF33", // Vàng
    "#FF33F3", // Hồng
    "#33FFF6", // Cyan
    "#FF8C33", // Cam đậm
    "#9C33FF", // Tím
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
