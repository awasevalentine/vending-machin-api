/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";


@Injectable()
export class RoleGuard implements CanActivate {

  public role: string[];

  constructor(role: string[]) {
    this.role = role;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { role } = request.user; // Assuming user information is stored in the request object

    if (this.role.includes(role)) {
      return true;
    }
    return false;
  }
}
