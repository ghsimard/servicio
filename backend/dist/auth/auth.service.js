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
        const existingUser = await this.prisma.users.findUnique({
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
        while(await this.prisma.users.findFirst({
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
            const user = await this.prisma.users.create({
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
        const user = await this.prisma.users.findUnique({
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
            throw new _common.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await _bcrypt.compare(password, user.password_hash || '');
        if (!isPasswordValid) {
            throw new _common.UnauthorizedException('Invalid credentials');
        }
        // Check if user's email is verified
        const isVerified = await this.isEmailVerified(user.user_id);
        if (!isVerified) {
            throw new _common.UnauthorizedException('Email not verified. Please verify your email before logging in.');
        }
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
                    token_id: verificationToken.token_id
                }
            });
            throw new _common.BadRequestException('Verification token has expired');
        }
        // Mark token as verified by changing its type
        await this.prisma.verification_tokens.update({
            where: {
                token_id: verificationToken.token_id
            },
            data: {
                type: 'email_verified'
            }
        });
        return {
            message: 'Email verified successfully. You can now log in.',
            userId: verificationToken.user_id
        };
    }
    // Helper method to check if a user's email is verified
    async isEmailVerified(userId) {
        const verifiedToken = await this.prisma.verification_tokens.findFirst({
            where: {
                user_id: userId,
                type: 'email_verified'
            }
        });
        return !!verifiedToken;
    }
    // Method for OAuth authentication
    validateOAuthUser(email, name, provider) {
        // Create a simple username from the email
        const username = email.split('@')[0];
        // Return the user structure without database operations
        // In a real implementation, this would find or create the user
        return {
            accessToken: this.jwtService.sign({
                sub: 'temp-user-id',
                email,
                provider
            }),
            user: {
                id: 'temp-user-id',
                email,
                username
            }
        };
    }
    async requestPasswordReset(email) {
        this.logger.log(`Password reset requested for email: ${email}`);
        const user = await this.prisma.users.findUnique({
            where: {
                email
            },
            select: {
                user_id: true,
                email: true
            }
        });
        if (!user) {
            // For security reasons, we still return success even if the email doesn't exist
            return {
                message: 'If the email exists, a password reset link will be sent.'
            };
        }
        // Generate reset token
        const resetToken = _crypto.randomBytes(32).toString('hex');
        // Set token to expire in 1 hour
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        // Store reset token
        await this.prisma.password_reset_tokens.create({
            data: {
                user_id: user.user_id,
                token: resetToken,
                expires_at: expiresAt
            }
        });
        // In production, send this via email instead of returning it
        return {
            message: 'Password reset instructions have been sent to your email.',
            resetToken
        };
    }
    async resetPassword(token, newPassword) {
        this.logger.log('Processing password reset request');
        const resetToken = await this.prisma.password_reset_tokens.findFirst({
            where: {
                token,
                used: false,
                expires_at: {
                    gt: new Date()
                }
            },
            include: {
                users: true
            }
        });
        if (!resetToken) {
            throw new _common.BadRequestException('Invalid or expired reset token');
        }
        // Hash the new password
        const hashedPassword = await _bcrypt.hash(newPassword, 10);
        // Update the user's password and mark token as used in a transaction
        await this.prisma.$transaction([
            // Update password
            this.prisma.users.update({
                where: {
                    user_id: resetToken.user_id
                },
                data: {
                    password_hash: hashedPassword
                }
            }),
            // Mark token as used
            this.prisma.password_reset_tokens.update({
                where: {
                    token_id: resetToken.token_id
                },
                data: {
                    used: true
                }
            })
        ]);
        return {
            message: 'Password has been reset successfully. You can now log in with your new password.'
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