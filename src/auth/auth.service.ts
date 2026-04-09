
import { ConflictException, Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterPayloadDto } from './dto/register.dto';
import * as argon2 from 'argon2';

// const dummyUser = [
//     {
//         id: 1,
//         username:'rifqi',
//         password:'password',
//     }
// ]

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService
    ){}
    // async validateUser({ identifier, password }: AuthPayloadDto){
    //     const findUser = await this.prisma.user.findFirst({
    //         where: {
    //           OR: [
    //             { username: identifier },
    //             { email: identifier },
    //           ],
    //         },
    //       });        
    //       // Find Dummy User
    //     // const findUserDummy = dummyUser.find((user)=> user.username === username);
    //     // console.log("finding user ===>>", findUser);
        
    //     if(!findUser) return null;

    //     if (password === findUser.password){
    //         const { password, ...user} = findUser;
    //         const signedToken = this.jwtService.sign(user);
    //         return signedToken
    //     }
    // }
    async validateUser({ identifier, password }: AuthPayloadDto) {
      // 1. Find user by email OR username
      // We use findFirst because 'identifier' could match either field
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { username: identifier },
            { email: identifier },
          ],
        },
      });
  
      // 2. Security: If no user found, return null
      // Passport or your controller will handle the 401 Unauthorized
      if (!user) return null;
  
      // 3. Verify the password using Argon2
      const isMatch = await argon2.verify(user.password, password);
  
      if (!isMatch) return null;
  
      // 4. Create the JWT Payload
      // We include 'email' as requested, along with 'sub' (the ID) and 'username'
      const payload = { 
        sub: user.id, 
        email: user.email,
        username: user.username 
      };
  
      // 5. Return the signed token inside an object
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          email: user.email,
          username: user.username,
          name: user.name,
        }
      };
    }
      async registerUser(data: RegisterPayloadDto) {
      // Check for existing user
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: data.email }, { username: data.username }],
        },
      });
    
      if (existingUser) {
        throw new ConflictException('User with this email or username already exists');
      }
      const hashedPassword = await argon2.hash(data.password);
      // Create and return the user
      return await this.prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          name: data.name,
          password: hashedPassword, // Remember to hash this!
        },
      });
    }    
  }
