// pages/api/login.js

import { NextRequest, NextResponse } from "next/server";
import DatabaseService from "@/connection/database-services";
import { comparePassword } from "@/utils/crypto";
import { signSessionToken } from "@/utils/jwt";
import { addMilliseconds } from "date-fns";
import ms from "ms";
import { user } from "@/models/user";

export async function POST(req: NextRequest) {
  const { personID, password } = await req.json();
  const accountResult = await DatabaseService.queryFirst<user>(
    `SELECT 
                  personID, 
                  password, 
                  personName,
                  departmentID, 
                  'http://192.168.60.13/HRIS_PersonPhoto/' + personID + '.JPG' AS imgsrc
               FROM dbo.Data_User_App 
               WHERE personID = @param0`,
    [personID]
  );

  if (!accountResult) {
    return NextResponse.json({
      message: "Lỗi xảy ra khi xác thực dữ liệu...",
      errors: [
        {
          field: "personID",
          message: "Tài khoản không đúng",
        },
      ],
      statusCode: 422,
    });
  }
  const isPasswordMatch = await comparePassword(
    password,
    accountResult.password
  );

  if (!isPasswordMatch) {
    // throw new EntityError([
    //   { field: "password", message: "Mật khẩu không đúng" },
    // ]);
    return NextResponse.json({
      message: "Lỗi xảy ra khi xác thực dữ liệu...",
      errors: [
        {
          field: "password",
          message: "Mật khẩu không đúng",
        },
      ],
      statusCode: 422,
    });
  }

  // Tạo session token
  const sessionToken = signSessionToken({
    userId: accountResult.personID,
    name: accountResult.personName,
    imgsrc: accountResult.imgsrc,
    departmentId: accountResult.departmentID,
  });

  const expiresAt = addMilliseconds(new Date(), ms("4h"));

  return NextResponse.json(
    {
      message: "Đăng nhập thành công",
      data: {
        token: sessionToken,
        expiresAt: expiresAt.toISOString(),
        account: {
          personID: accountResult.personID,
          personName: accountResult.personName,
        },
      },
    },
    {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken = '${sessionToken}'; Path=/; HttpOnly`,
      },
    }
  );
}
