import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthUsers } from './entities/auth.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => { // se inyecta el servicio como en cualquier constructor o cualquier clases, solo q aca es una funcion 
        // console.log('process.env.JWT_SECRET ', process.env.JWT_SECRET);
        // console.log('configServiceT ', configService.get('JWT_SECRET'));
        return {
          // secret: process.env.JWT_SECRET,
          secret: configService.get('JWT_SECRET') || '',
          signOptions: {
            expiresIn: '4h'
          }
        }
      } // es la funcion que voy a mandar a llamar cuando se intente registrar de manera asincrono el modulo 
    }),
    MongooseModule.forFeature([{
      name: Auth.name, schema: AuthUsers, collection: 'authsUsers'
    }])
  ],
  exports: [MongooseModule, AuthService, ConfigModule, JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
