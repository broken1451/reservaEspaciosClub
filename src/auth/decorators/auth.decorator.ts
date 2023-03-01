import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './roles.decorator';
import { ValidRoles } from '../interfaces/user.interface';
import { AuthActivationGuard } from '../guards/auth.guard';


export function Auth(...roles: ValidRoles[]) {
    return applyDecorators(
        Roles(...roles),
        UseGuards(AuthGuard('jwt'), AuthActivationGuard)
    );
}