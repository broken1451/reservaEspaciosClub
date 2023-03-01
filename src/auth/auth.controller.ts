import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from './decorators/auth.decorator';
import { ValidRoles } from './interfaces/user.interface';
import { LoginDto } from './decorators/login.dto';

@Controller('auth')
@ApiTags('Usuarios')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  

  @Post('/login')
  login(@Body() loginAuthDto: LoginDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post()
  // @Auth(ValidRoles.admin)
  @Auth()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  @Auth(ValidRoles.admin,ValidRoles.adminClub)
  findAll(@Query('desde') desde: string) {
    return this.authService.findAll(desde);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch()
  update(@Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(updateAuthDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
