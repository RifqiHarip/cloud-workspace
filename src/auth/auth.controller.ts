import { Body, Controller, Get, HttpException, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import * as express from 'express';
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('login')
    @UseGuards(LocalGuard)
    // login(@Body() authPayload: AuthPayloadDto){
    //     const user = this.authService.validateUser(authPayload);
    //     console.log("user payload :",user);
        
    //     if(!user) throw new HttpException('Invalid Credentials', 401);
    //     return user;
    // }
    login(@Req() req: express.Request){
        return req.user;
    }

    @Get('status')
    @UseGuards(JwtAuthGuard)
    status(@Req() req: express.Request) {
        // Use a type cast if TypeScript complains about req.user
        const user = req.user; 
        console.log('Successfully check status', user);
        return user; // Usually good to return the user info or a 200 OK
    }
}
