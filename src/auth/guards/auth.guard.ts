import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/roles.decorator';
import { Reflector } from '@nestjs/core';
import { Auth } from '../entities/auth.entity';

@Injectable()
export class AuthActivationGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());
    
    if (!validRoles) return true;
    if (validRoles.length == 0) return true;

    const req = context.switchToHttp().getRequest();

    const user = req.user as Auth;

    if (!user) {
      throw new BadRequestException('User not found')
    }
      
    for (const role in user.roles) { 
      if (validRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(`User ${user.name} needs a valid role: [${validRoles}]`)
  }  
}
