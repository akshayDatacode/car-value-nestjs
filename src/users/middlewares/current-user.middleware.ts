import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../users.service";
import { User } from "../user.entity";

declare global {
  namespace Express {
    interface Request {
      currentUser?: User | null
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {
    console.log('UsersService injected:', !!usersService); // Check if the service is injected
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {}

    if (userId) {
      const user = await this.usersService.findOne(userId)
      console.log("req from middleware", user)
      // @ts-ignore
      req.currentUser = user
    }

    next();
  }
}