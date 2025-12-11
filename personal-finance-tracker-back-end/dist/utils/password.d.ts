export declare class PasswordService {
    private static readonly SALT_ROUNDS;
    static hash(password: string): Promise<string>;
    static compare(password: string, hashedPassword: string): Promise<boolean>;
    static validate(password: string): {
        isValid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=password.d.ts.map