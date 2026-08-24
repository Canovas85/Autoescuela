import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token no enviado",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verificar si JWT_SECRET está definido

    console.log("JWT_SECRET LOGIN:", process.env.JWT_SECRET);

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const rutaCambioPassword = "/api/auth/primer-acceso/cambiar-password";
    const requiereCambioPassword = Boolean(payload.requiereCambioPassword);

    if (requiereCambioPassword && req.originalUrl !== rutaCambioPassword) {
      return res.status(403).json({
        message: "Debes cambiar la contraseña en tu primer acceso",
      });
    }

    req.user = payload;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expirado",
      });
    }
    return res.status(401).json({
      message: "Token inválido",
    });
  }
};
