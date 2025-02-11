"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginAnimationPage from "./login-animation";
import envConfig from "@/config";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { useAppContext } from "@/app/appProvider";

const FormSchema = z.object({
  username: z.string().min(5, {
    message: "Username must be at least 5 characters.",
  }),
  password: z.string(),
  rememberMe: z.boolean().default(false),
});

export function LoginComponent() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // const { setSessionToken } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []); // Chạy 1 lần khi component được mount

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      personID: "", //localStorage.getItem("savedUsername") ?? "",
      password: "",
      rememberMe: false, //,
    },
  });

  async function onSubmit(values: LoginBodyType) {
    setIsLoading(true);
    try {
      const result = await fetch(
        `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
        {
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      ).then(async (res) => {
        const payload = await res.json();
        const data = {
          status: res.status,
          payload,
        };
        if (!res.ok) {
          throw data;
        }
        return data;
      });
      localStorage.setItem("sesstionToken", result.payload.data.token);
      if (values.rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem(
          "savedUsername",
          result.payload.data.account.personID
        );
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedUsername");
      }
      toast.success(result.payload.message, {
        description: "Chuyển hướng đến trang chính sau 1 giây",
        position: "top-right",
        style: {
          backgroundColor: "#FFFFFF",
          color: "#0066ff",
        },
      });

      const resultFromNextServer = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(result),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const payload = await res.json();
        const data = {
          status: res.status,
          payload,
        };
        if (!res.ok) {
          throw data;
        }
        return data;
      });

      // setSessionToken(resultFromNextServer.payload.data.token);
    } catch (error: any) {
      const errors = error.payload.errors as {
        field: string;
        message: string;
      }[];
      const status = error.status as number;
      if (status === 422) {
        errors.forEach((error) => {
          form.setError((error.field as "personID") || "password", {
            type: "server",
            message: error.message,
          });
        });
      } else {
        toast.error(error.message, {
          description: "Vui lòng kiểm tra lại thông tin đăng nhập",
          position: "top-right",
          style: {
            backgroundColor: "#FFFFFF",
            color: "#ff1a1a",
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      {/* Left side with slide-in animation */}
      <LoginAnimationPage isPageLoaded={isPageLoaded} />
      {/* Right side with fade-in animation */}
      <div
        className={`w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center transform transition-all duration-1000 ease-out
              ${
                isPageLoaded
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
      >
        <div className="w-full max-w-md space-y-8">
          <div
            className={`text-center transition-all duration-700 delay-300 transform
                ${
                  isPageLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng Nhập</h1>
            <p className="text-gray-600">Vui lòng đăng nhập để tiếp tục</p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="personID"
                render={({ field }) => (
                  <FormItem className="transition-all duration-700 delay-400 transform">
                    <FormLabel className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Tài khoản
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 w-full px-4 py-3"
                        placeholder="Nhập tài khoản của bạn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="transition-all duration-700 delay-400 transform">
                    <FormLabel className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Mật khẩu
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="h-12 w-full px-4 py-3"
                        placeholder="Nhập mật khẩu của bạn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Nhớ tài khoản
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg 
                          transition-all duration-700 delay-700 transform hover:-translate-y-0.5 active:translate-y-0
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>
          </Form>
          <div
            className={`text-center text-sm text-gray-600 transition-all duration-700 delay-800 transform
                ${
                  isPageLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
          >
            <p>
              Bạn cần hỗ trợ?{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Liên hệ IT
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
