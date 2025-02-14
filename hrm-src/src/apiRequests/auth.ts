import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const authApiRequests = {
  // login: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  auth: (body: { sessionToken: string }) =>
    http.post("/api/login", body, {
      baseUrl: "",
    }),
  auththentication: (body: LoginBodyType) =>
    http.post("/api/auth", body, {
      baseUrl: "",
    }),
  logout: () =>
    http.get("/api/auth/logout", {
      baseUrl: "",
    }),
};

export default authApiRequests;
