import bcrypt from "bcryptjs";

const hash = await bcrypt.hash("pandozales123", 10);

console.log(hash);
