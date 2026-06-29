import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email)
    if (users.length) {
      throw new BadRequestException('Email Already Exists ---')
    }

    // hash the users password

    // 1 Hash the salt and the password

    const salt = randomBytes(8).toString('hex')
    const hash = (await scrypt(password, salt, 32)) as Buffer
    // 2. Join the hashed result and salt
    const passwordCypted = salt + "." + hash.toString('hex')
    // 3. create a new user and save it
    const user = await this.usersService.create(email, passwordCypted)
    // return the user
    return user
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const [salt, storedhash] = user.password.split(".")

    const hash = await scrypt(password, salt, 32) as Buffer

    if (storedhash != hash.toString('hex')) {
      throw new BadRequestException('bad password')
    } 

    return user
  }
}