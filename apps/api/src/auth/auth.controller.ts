import { Controller, Get, Post, Req, Res, Body, Headers } from '@nestjs/common';
import { Request, Response } from 'express';
import { auth } from './auth.config';

@Controller('auth')
export class AuthController {
  @Post('sign-up')
  async signUp(
    @Body() body: { email: string; password: string; name: string },
    @Headers() headers: Record<string, string>,
  ) {
    const user = await auth.api.signUpEmail({
      body: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
      headers,
    });
    return user;
  }

  @Post('sign-in')
  async signIn(
    @Body() body: { email: string; password: string },
    @Headers() headers: Record<string, string>,
  ) {
    const session = await auth.api.signInEmail({
      body: {
        email: body.email,
        password: body.password,
      },
      headers,
    });
    return session;
  }

  @Post('sign-out')
  async signOut(@Headers() headers: Record<string, string>) {
    await auth.api.signOut({
      headers,
    });
    return { success: true };
  }

  @Get('session')
  async getSession(@Headers() headers: Record<string, string>) {
    const session = await auth.api.getSession({
      headers,
    });
    return session;
  }

  @Get('user')
  async getUser(@Headers() headers: Record<string, string>) {
    const session = await auth.api.getSession({
      headers,
    });
    return session?.user;
  }
}
