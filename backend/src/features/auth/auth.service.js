import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor(repository) {
    this.repository = repository;
  }

  async login(email, password) {
    // console.log("BUSCANDO USUARIO");

    const user = await this.repository.findUserByEmail(email);

    // console.log("USER:", user);

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    // console.log("PASSWORD VALIDA:", validPassword);

    if (!validPassword) {
      throw new Error("Credenciales inválidas");
    }

    //console.log("GENERANDO JWT");

    // Verificar si JWT_SECRET está definido

    // console.log("JWT_SECRET LOGIN:", process.env.JWT_SECRET);

    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      },
    );
  }
}
