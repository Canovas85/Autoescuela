export const authorize =
  (...roles) =>
  (req, res, next) => {
    const rawRole = req.user?.rol;
    const normalizedRole = rawRole === "GESTOR" ? "SOPORTE" : rawRole;

    if (!roles.includes(normalizedRole)) {
      return res.status(403).json({ message: "No tiene permisos" });
    }

    req.user.rol = normalizedRole;

    next();
  };
