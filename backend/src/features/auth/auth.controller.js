export class AuthController {
  constructor(service) {
    this.service = service;
  }

  async login(req, res) {
    try {
      // console.log("AUTH CONTROLLER");

      const { email, password } = req.body;

      // console.log("EMAIL:", email);

      const token = await this.service.login(email, password);

      //console.log("TOKEN GENERADO");

      return res.status(200).json({
        token,
      });
    } catch (error) {
      // console.error("ERROR LOGIN:", error);

      return res.status(401).json({
        message: error.message,
      });
    }
  }
}
