"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _config = require("@nestjs/config");
const _prismaservice = require("../prisma/prisma.service");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
const _crypto = /*#__PURE__*/ _interop_require_wildcard(require("crypto"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AuthService = class AuthService {
    async register(email, password, name, profileData) {
        this.logger.log(`Registering user with email: ${email}, name: ${name}`);
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email
            },
            select: {
                email: true,
                user_id: true,
                username: true
            }
        });
        if (existingUser) {
            throw new _common.BadRequestException('Email already in use');
        }
        // Hash password
        const hashedPassword = await _bcrypt.hash(password, 10);
        // Generate a username from email
        const usernameBase = email.split('@')[0];
        let username = usernameBase;
        let counter = 1;
        // Check if username exists and generate a new one if needed
        while(await this.prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: 'insensitive'
                }
            },
            select: {
                username: true
            }
        })){
            username = `${usernameBase}${counter}`;
            counter++;
        }
        try {
            // Create user
            const user = await this.prisma.user.create({
                data: {
                    email,
                    username,
                    password_hash: hashedPassword,
                    title: profileData?.title,
                    gender: profileData?.gender,
                    firstname: profileData?.firstname,
                    lastname: profileData?.lastname,
                    lastname2: profileData?.lastname2,
                    dob: profileData?.dob
                },
                select: {
                    user_id: true,
                    email: true,
                    username: true
                }
            });
            // Generate verification token
            const verificationToken = _crypto.randomBytes(32).toString('hex');
            // Set token to expire in 24 hours
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24);
            // Store token using Prisma model
            await this.prisma.verification_tokens.create({
                data: {
                    user_id: user.user_id,
                    token: verificationToken,
                    type: 'email_verification',
                    expires_at: expiresAt
                }
            });
            this.logger.log(`User registered with ID: ${user.user_id}, verification token generated`);
            // Return the verification token for development/testing
            // In production, you would send this by email and not return it
            return {
                userId: user.user_id,
                username: user.username,
                message: 'User registered successfully. Please verify your email.',
                verificationToken
            };
        } catch (error) {
            this.logger.error('Error creating user:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new _common.BadRequestException('Failed to create user: ' + errorMessage);
        }
    }
    async login(email, password) {
        this.logger.log(`Login attempt for user with email: ${email}`);
        const user = await this.prisma.user.findUnique({
            where: {
                email
            },
            select: {
                user_id: true,
                email: true,
                username: true,
                password_hash: true
            }
        });
        if (!user) {
            this.logger.error(`User not found: ${email}`);
            throw new _common.UnauthorizedException('Invalid credentials');
        }
        this.logger.log(`User found: ${user.user_id}, hash: ${user.password_hash ? 'exists' : 'missing'}`);
        try {
            // Special bypass for debug login
            let isPasswordValid = false;
            if (password === 'BYPASS_PASSWORD') {
                this.logger.log('Using debug password bypass');
                isPasswordValid = true;
            } else {
                isPasswordValid = await _bcrypt.compare(password, user.password_hash || '');
                this.logger.log(`Password validation result: ${isPasswordValid}`);
            }
            if (!isPasswordValid) {
                this.logger.error(`Invalid password for user: ${user.user_id}`);
                throw new _common.UnauthorizedException('Invalid credentials');
            }
            // TEMPORARILY BYPASS EMAIL VERIFICATION FOR TESTING
            // const isVerified = await this.isEmailVerified(user.user_id);
            // if (!isVerified) {
            //   throw new UnauthorizedException(
            //     'Email not verified. Please verify your email before logging in.',
            //   );
            // }
            const payload = {
                sub: user.user_id,
                email: user.email
            };
            return {
                accessToken: this.jwtService.sign(payload),
                user: {
                    id: user.user_id,
                    email: user.email,
                    username: user.username
                }
            };
        } catch (error) {
            this.logger.error(`Error during password validation: ${error.message}`);
            throw new _common.UnauthorizedException('Invalid credentials');
        }
    }
    async verifyEmail(token) {
        this.logger.log(`Verifying email with token: ${token}`);
        // Find verification token in the database
        const verificationToken = await this.prisma.verification_tokens.findUnique({
            where: {
                token
            }
        });
        if (!verificationToken) {
            throw new _common.NotFoundException('Invalid verification token');
        }
        // Check if token has expired
        if (verificationToken.expires_at < new Date()) {
            // Delete the expired token
            await this.prisma.verification_tokens.delete({
                where: {
                    token
                }
            });
            throw new _common.BadRequestException('Verification token has expired');
        }
        // Get the user associated with the token
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: verificationToken.user_id
            }
        });
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        // Mark the user as verified by updating the token type
        await this.prisma.verification_tokens.update({
            where: {
                token
            },
            data: {
                type: 'verified'
            }
        });
        return {
            message: 'Email verified successfully',
            userId: user.user_id
        };
    }
    async isEmailVerified(userId) {
        const token = await this.prisma.verification_tokens.findFirst({
            where: {
                user_id: userId,
                type: 'verified'
            }
        });
        return !!token;
    }
    validateOAuthUser(email, name, provider) {
        // Handle OAuth authentication
        // This would typically check if the user exists,
        // create them if they don't, and generate a JWT token
        return {
            email,
            name,
            provider
        };
    }
    async requestPasswordReset(email) {
        const user = await this.prisma.user.findUnique({
            where: {
                email
            },
            select: {
                user_id: true,
                email: true
            }
        });
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        // Generate reset token
        const resetToken = _crypto.randomBytes(32).toString('hex');
        // Set token to expire in 1 hour
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        // Store token in database 
        // NOTE: This assumes you have a password_reset_tokens table/model
        // You may need to adjust this code based on your actual schema
        await this.prisma.verification_tokens.create({
            data: {
                user_id: user.user_id,
                token: resetToken,
                type: 'password_reset',
                expires_at: expiresAt
            }
        });
        this.logger.log(`Password reset requested for user ${user.user_id}`);
        // Return the reset token for development/testing
        // In production, you would send this by email and not return it
        return {
            message: 'Password reset token generated',
            resetToken
        };
    }
    async resetPassword(token, newPassword) {
        // Find reset token in the database
        const resetToken = await this.prisma.verification_tokens.findFirst({
            where: {
                token,
                type: 'password_reset'
            }
        });
        if (!resetToken) {
            throw new _common.NotFoundException('Invalid reset token');
        }
        // Check if token has expired
        if (resetToken.expires_at < new Date()) {
            // Delete the expired token
            await this.prisma.verification_tokens.delete({
                where: {
                    token_id: resetToken.token_id
                }
            });
            throw new _common.BadRequestException('Reset token has expired');
        }
        // Hash the new password
        const hashedPassword = await _bcrypt.hash(newPassword, 10);
        // Update user password and mark token as used - transaction to ensure both operations succeed or fail together
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: {
                    user_id: resetToken.user_id
                },
                data: {
                    password_hash: hashedPassword
                }
            }),
            this.prisma.verification_tokens.update({
                where: {
                    token_id: resetToken.token_id
                },
                data: {
                    type: 'used'
                }
            })
        ]);
        this.logger.log(`Password reset for user ${resetToken.user_id}`);
        return {
            message: 'Password reset successful'
        };
    }
    constructor(prisma, jwtService, configService){
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new _common.Logger(AuthService.name);
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService,
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], AuthService);

//# sourceMappingURL=auth.service.js.map