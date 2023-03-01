import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './entities/auth.entity';
import { ConfigService } from '@nestjs/config';
import { Model, isValidObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './decorators/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtInterface } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {

  constructor(@InjectModel(Auth.name) private readonly userModel: Model<Auth>,
    private readonly configService: ConfigService, private readonly jwtService: JwtService) { }
  
  
  async login(loginDto: LoginDto) { 
    const { password, email } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException(`El usuario con email ${email} no existe`);
    }
    
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException(`Credenciales no validas`);
    }
    return { user, token: this.getJWT({ id: user._id }) }

  }

  async create(createAuthDto: CreateAuthDto) {

    let { name, email, password, ...restProperties } = createAuthDto;
    name = name.toLowerCase().trim();
    email = email.toLowerCase().trim();
    
    const emailExist = await this.userModel.findOne({ email });
    if (emailExist) {
      throw new BadRequestException(`El email ${emailExist.email} ya existe.`)
    }
    const saltOrRounds = 10;
    password = bcrypt.hashSync(password, saltOrRounds)
    const userCreated = await this.userModel.create({ name, email, password, ...restProperties });
    return userCreated;
  }

  async findAll(desde: string = '0') {
    const users = await this.userModel.find({}, 'created isActive roles img email name password').skip(Number(desde)).limit(5).sort({ created: 1});
    const countsUser = await this.userModel.countDocuments({});
    return { users, countsUser };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id} no es a valid mongo id`);
    }
    const userDb = await this.userModel.findById(id);

    if (!userDb) {
      throw new BadRequestException(`El usuario con el id ${id} no existe`);
    }
    return userDb;
  }

  async update(updateAuthDto: UpdateAuthDto) {
    const { id, ...rest } = updateAuthDto;
    const userUpdate = await this.userModel.findByIdAndUpdate(id, rest, {
      new: true,
    });
    if (!userUpdate) {
      throw new BadRequestException(`El usuario con el id ${id} no existe`);
    }
    return userUpdate;
  }

  async remove(id: string) {
    const userDb = await this.findOne(id)
    userDb.isActive = false;
    const userUpdate = await this.userModel.findByIdAndUpdate(id, userDb, {
      new: true,
    });
    // const userDeleted = await this.userModel.findByIdAndRemove(id);
    // if (!userDeleted) {
    //   throw new BadRequestException(`El usuario con el id ${id} no existe`);
    // }
    return userUpdate;
  }

  private getJWT(payload: JwtInterface): string {
    const token = this.jwtService.sign(payload)
    return token
  }
}
