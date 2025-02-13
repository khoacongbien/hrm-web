import crypto from "crypto";

// Hàm băm mật khẩu bằng MD5
export const hashPassword = (password: string): string => {
  return crypto.createHash("md5").update(password).digest("hex").toUpperCase();
};

// Hàm so sánh mật khẩu với giá trị đã băm
export const comparePassword = (password: string, hash: string): boolean => {
  const hashedPassword = hashPassword(password);
  return hashedPassword == hash;
};
