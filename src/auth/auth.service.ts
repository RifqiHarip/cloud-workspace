
import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

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
    async validateUser({ identifier, password }: AuthPayloadDto){
        const findUser = await this.prisma.user.findFirst({
            where: {
              OR: [
                { username: identifier },
                { email: identifier },
              ],
            },
          });        
          // Find Dummy User
        // const findUserDummy = dummyUser.find((user)=> user.username === username);
        // console.log("finding user ===>>", findUser);
        
        if(!findUser) return null;

        if (password === findUser.password){
            const { password, ...user} = findUser;
            const signedToken = this.jwtService.sign(user);
            return signedToken
        }
    }
}
