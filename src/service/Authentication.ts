import { User } from "../model/User";
import { UserRepo } from "../repository/UserRepo";
import Authentication from "../utils/Authentication";

interface IAuthenticationService {
  login(email: string, password: string): Promise<string>;
  register(
    email: string,
    password: string,
    name: string,
    username: string
  ): Promise<void>;
}

export class AuthenticationService implements IAuthenticationService {
  async login(email: string, password: string): Promise<string> {
    const usr = await new UserRepo().findByEmail(email);

    if (!usr) {
      throw new Error("Bad Request!");
    }

    let compare = await Authentication.passwordCompare(password, usr.password);

    if (compare) {
      return Authentication.generateToken(
        usr.id,
        usr.email,
        usr.name,
        usr.username
      );
    }
    return "";
  }

  async register(
    email: string,
    password: string,
    name: string,
    username: string
  ): Promise<void> {
    try {
      const hashedPassword: string = await Authentication.passwordHash(
        password
      );
      const usr = new User();
      usr.email = email;
      usr.password = hashedPassword;
      usr.username = username;
      usr.name = name;

      await new UserRepo().save(usr);
    } catch (error) {
      throw new Error("Error login!");
    }
  }
}
