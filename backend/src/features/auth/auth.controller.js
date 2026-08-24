export class AuthController {
  constructor(service) {
    this.service = service;
  }

  async login(req, res) {
    try {
      // console.log("AUTH CONTROLLER");

      const { email, password } = req.body;

      // console.log("EMAIL:", email);

      const result = await this.service.login(email, password);

      //console.log("TOKEN GENERADO");

      return res.status(200).json({
        token: result.token,
        requiereCambioPassword: result.requiereCambioPassword,
      });
    } catch (error) {
      // console.error("ERROR LOGIN:", error);

      return res.status(401).json({
        message: error.message,
      });
    }
  }

  async changePasswordFirstLogin(req, res) {
    try {
      const { newPassword, confirmPassword } = req.body;

      const result = await this.service.changePasswordFirstLogin(
        req.user?.id,
        newPassword,
        confirmPassword,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
}
