import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/user.interface';

export const META_ROLES = 'roles';

export const Roles = (...args: ValidRoles[]) => SetMetadata(META_ROLES, args);

