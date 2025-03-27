"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const services_module_1 = require("./services/services.module");
const prisma_module_1 = require("./prisma/prisma.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const logging_module_1 = require("./logging/logging.module");
const transactions_module_1 = require("./transactions/transactions.module");
const user_context_middleware_1 = require("./middleware/user-context.middleware");
const jwt_1 = require("@nestjs/jwt");
const config_2 = require("@nestjs/config");
const sessions_module_1 = require("./sessions/sessions.module");
const analytics_module_1 = require("./analytics/analytics.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(user_context_middleware_1.UserContextMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            services_module_1.ServicesModule,
            dashboard_module_1.DashboardModule,
            logging_module_1.LoggingModule,
            transactions_module_1.TransactionsModule,
            jwt_1.JwtModule.registerAsync({
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
                }),
                inject: [config_2.ConfigService],
            }),
            sessions_module_1.SessionsModule,
            analytics_module_1.AnalyticsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map