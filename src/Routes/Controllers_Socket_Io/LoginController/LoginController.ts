import { Login } from "../../../Services/Services";
class LoginController {
    postConnect() {
        
        new Login().initialize();
    }
}

const loginController = new LoginController();
export { loginController };