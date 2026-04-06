import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

const dummyUser = [
    {
        id: 1,
        username:'rifqi',
        password:'password',
    }
]

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService){}
    validateUser({ username, password }: AuthPayloadDto){
        const findUser = dummyUser.find((user)=> user.username === username);
        console.log("finding user ===>>", findUser);
        
        if(!findUser) return null;

        if (password === findUser.password){
            const { password, ...user} = findUser;
            const signedToken = this.jwtService.sign(user);
            return signedToken
        }
    }
}
