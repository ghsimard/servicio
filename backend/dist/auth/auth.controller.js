"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _common = require("@nestjs/common");
const _authservice = require("./auth.service");
const _swagger = require("@nestjs/swagger");
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let RegisterDto = class RegisterDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'John Doe',
        description: 'User full name'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Mr',
        description: 'User title',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "title", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'male',
        description: 'User gender',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "gender", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'John',
        description: 'User first name',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "firstname", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Doe',
        description: 'User last name',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "lastname", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Smith',
        description: 'User second last name',
        required: false
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "lastname2", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '1990-01-01',
        description: 'User date of birth',
        required: false
    }),
    (0, _classvalidator.IsDateString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "dob", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'user@example.com',
        description: 'User email address'
    }),
    (0, _classvalidator.IsEmail)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'password123',
        description: 'User password'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.MinLength)(8),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
let LoginDto = class LoginDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'user@example.com',
        description: 'User email address'
    }),
    (0, _classvalidator.IsEmail)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'password123',
        description: 'User password'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
let AuthController = class AuthController {
    async register(registerDto) {
        this.logger.log(`Registration attempt with email: ${registerDto.email}`);
        try {
            return await this.authService.register(registerDto.email, registerDto.password, registerDto.name, {
                title: registerDto.title,
                gender: registerDto.gender,
                firstname: registerDto.firstname,
                lastname: registerDto.lastname,
                lastname2: registerDto.lastname2,
                dob: registerDto.dob ? new Date(registerDto.dob) : undefined
            });
        } catch (error) {
            this.logger.error(`Registration error: ${error.message}`, error.stack);
            throw new _common.BadRequestException(error.message);
        }
    }
    async login(loginDto) {
        this.logger.log(`Login attempt with email: ${loginDto.email}`);
        if (!loginDto.email || !loginDto.password) {
            throw new _common.BadRequestException('Email and password are required');
        }
        return this.authService.login(loginDto.email, loginDto.password);
    }
    async verifyEmail(token) {
        if (!token) {
            throw new _common.BadRequestException('Verification token is required');
        }
        return this.authService.verifyEmail(token);
    }
    async forgotPassword(email) {
        if (!email) {
            throw new _common.BadRequestException('Email is required');
        }
        return this.authService.requestPasswordReset(email);
    }
    async resetPassword(token, newPassword) {
        if (!token || !newPassword) {
            throw new _common.BadRequestException('Token and new password are required');
        }
        if (newPassword.length < 8) {
            throw new _common.BadRequestException('Password must be at least 8 characters long');
        }
        return this.authService.resetPassword(token, newPassword);
    }
    constructor(authService){
        this.authService = authService;
        this.logger = new _common.Logger(AuthController.name);
    }
};
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Register a new user'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'User successfully registered',
        schema: {
            example: {
                userId: 'e7c8f8f0-d5b9-4dc7-a8b2-f9f0d5b9dc7a',
                message: 'User registered successfully',
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Email already in use'
    }),
    (0, _common.Post)('register'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof RegisterDto === "undefined" ? Object : RegisterDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Login with email and password'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Login successful',
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: 'e7c8f8f0-d5b9-4dc7-a8b2-f9f0d5b9dc7a',
                    email: 'user@example.com',
                    username: 'user123'
                }
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Invalid credentials'
    }),
    (0, _common.Post)('login'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof LoginDto === "undefined" ? Object : LoginDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Verify user email'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Email verified successfully',
        schema: {
            example: {
                message: 'Email verified successfully'
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid verification token'
    }),
    (0, _common.Get)('verify'),
    _ts_param(0, (0, _common.Query)('token')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
_ts_decorate([
    (0, _common.Post)('forgot-password'),
    (0, _swagger.ApiOperation)({
        summary: 'Request password reset'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Password reset instructions sent',
        schema: {
            example: {
                message: 'Password reset instructions have been sent to your email'
            }
        }
    }),
    _ts_param(0, (0, _common.Body)('email')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
_ts_decorate([
    (0, _common.Post)('reset-password'),
    (0, _swagger.ApiOperation)({
        summary: 'Reset password using token'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Password reset successful',
        schema: {
            example: {
                message: 'Password has been reset successfully'
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid or expired reset token'
    }),
    _ts_param(0, (0, _common.Body)('token')),
    _ts_param(1, (0, _common.Body)('newPassword')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
AuthController = _ts_decorate([
    (0, _swagger.ApiTags)('auth'),
    (0, _common.Controller)('auth'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService
    ])
], AuthController);

//# sourceMappingURL=auth.controller.js.map