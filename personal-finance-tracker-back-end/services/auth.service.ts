import {
  ILoginRequest,
  IRegisterRequest,
  IAuthResponse,
  ITokenPayload,
} from "../interfaces/auth.interface";
import { ICreateAccountRequest, Role } from "../interfaces/account.interface";
import { AccountRepository } from "../repositories/account.repository";
import { JWTService } from "../utils/jwt";
import { PasswordService } from "../utils/password";
export class AuthService {
  private accountRepository: AccountRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
  }

  /**
   * Registers a new account.
   * @param {IRegisterRequest} registerData - The data for register.
   * @returns {Promise<IAuthResponse>} - A promise that resolves to an authentication response containing user details and a JWT token.
   * @throws {Error} - Throws an error if the account already exists or if there is an issue with the database.
   */
  async register(registerData: IRegisterRequest): Promise<IAuthResponse> {
    try {
      // Check if email already exists
      const existingAccount = await this.accountRepository.findAccountByEmail(
        registerData.email
      );
      if (existingAccount) {
        throw new Error("Email already registered");
      }

      // Validate password
      const passwordValidation = PasswordService.validate(
        registerData.password
      );
      if (!passwordValidation.isValid) {
        throw new Error(
          `Password validation failed: ${passwordValidation.errors.join(", ")}`
        );
      }

      // Hash password
      const hashedPassword = await PasswordService.hash(registerData.password);

      // Create account data
      const accountData: ICreateAccountRequest = {
        email: registerData.email.toLowerCase().trim(),
        password: hashedPassword,
        firstName: registerData.firstName.trim(),
        lastName: registerData.lastName.trim(),
        dob: new Date(registerData.dob),
        phoneNumber: registerData.phoneNumber,
        role: Role.USER, // Default role for registration
      };

      // Create account
      const newAccount = await this.accountRepository.createAccount(
        accountData
      );

      // Generate token
      const tokenPayload: ITokenPayload = {
        accountId: newAccount.id,
        email: newAccount.email,
        role: newAccount.role || Role.USER, // Provide a default role if undefined
      };

      const token = JWTService.generateToken(tokenPayload);

      return {
        account: {
          id: newAccount.id,
          email: newAccount.email,
          firstName: newAccount.firstName,
          lastName: newAccount.lastName,
          dob: newAccount.dob,
          phoneNumber: newAccount.phoneNumber,
          role: newAccount.role || Role.USER,
          createdAt: newAccount.createdAt || new Date(),
        },
        token,
      };
    } catch (error: any) {
      console.error("Register service error:", error);
      throw new Error(error.message || "Registration failed");
    }
  }
  /**
   * Logs in an account.
   * @param {ILoginRequest} loginData - The data for login.
   * @returns {Promise<IAuthResponse>} - A promise that resolves to an authentication response containing user details and a JWT token.
   * @throws {Error} - Throws an error if the account does not exist or if the password is incorrect.
   */
  async login(loginData: ILoginRequest): Promise<IAuthResponse> {
    try {
      // Find active account by email
      const account = await this.accountRepository.findActiveAccountByEmail(
        loginData.email.toLowerCase().trim()
      );
      if (!account) {
        throw new Error("Invalid email or password");
      }

      // Verify password
      const isPasswordValid = await PasswordService.compare(
        loginData.password,
        account.password
      );
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // Generate token
      const tokenPayload: ITokenPayload = {
        accountId: account.id,
        email: account.email,
        role: account.role || Role.USER,
      };

      const token = JWTService.generateToken(tokenPayload);

      return {
        account: {
          id: account.id,
          email: account.email,
          firstName: account.firstName,
          lastName: account.lastName,
          dob: account.dob,
          phoneNumber: account.phoneNumber,
          role: account.role || Role.USER,
          createdAt: account.createdAt || new Date(),
        },
        token,
      };
    } catch (error: any) {
      console.error("Login service error:", error);
      throw new Error(error.message || "Login failed");
    }
  }

  /**
   * Retrieves the current user's profile.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<any>} - A promise that resolves to the user's profile without the password.
   * @throws {Error} - Throws an error if the user is not found or if there is an issue with the database.
   */
  async getCurrentUser(userId: string) {
    try {
      const account = await this.accountRepository.findAccountById(userId);
      if (!account) {
        throw new Error("User not found");
      }

      // Remove password from response
      const { password, ...userProfile } = account;
      return userProfile;
    } catch (error: any) {
      console.error("Get current user service error:", error);
      throw new Error(error.message || "Failed to get user profile");
    }
  }

  /**
   * Verifies a JWT token.
   * @param {string} token - The JWT token to verify.
   * @returns {Promise<ITokenPayload | null>} - A promise that resolves to the token payload if verification is successful, or null if it fails.
   */
  async verifyToken(token: string): Promise<ITokenPayload | null> {
    try {
      return JWTService.verifyToken(token);
    } catch (error: any) {
      console.error("Token verification service error:", error);
      return null;
    }
  }
}
