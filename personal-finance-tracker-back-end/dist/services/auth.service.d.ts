import { ILoginRequest, IRegisterRequest, IAuthResponse, ITokenPayload } from "../interfaces/auth.interface";
export declare class AuthService {
    private accountRepository;
    constructor();
    register(registerData: IRegisterRequest): Promise<IAuthResponse>;
    login(loginData: ILoginRequest): Promise<IAuthResponse>;
    getCurrentUser(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        dob: Date;
        phoneNumber: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    verifyToken(token: string): Promise<ITokenPayload | null>;
}
//# sourceMappingURL=auth.service.d.ts.map