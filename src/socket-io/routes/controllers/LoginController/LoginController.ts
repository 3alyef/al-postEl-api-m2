import { Login } from "../../../services/Services";
class LoginController {
    postConnect() {
        
        new Login().initialize();
    }
}

const loginController = new LoginController();
export { loginController };