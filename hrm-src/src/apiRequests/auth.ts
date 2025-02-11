import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const authApiRequests = {
  login: (body: LoginBodyType) => http.post<LoginResType>("/login/login", body),
};

export default authApiRequests;
