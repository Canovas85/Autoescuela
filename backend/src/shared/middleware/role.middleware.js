export const authorize =
(...roles) =>
(req, res, next) => {
    if (!roles.includes(req.user?.rol)) {
        return res.status(403).json({ message: "No tiene permisos" });
    }
    next();
};