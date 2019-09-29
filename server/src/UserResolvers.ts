import { Resolver, Query, Mutation, Arg, ObjectType, Field } from "type-graphql";
import { User } from "./entity/User";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
const jwtSecretKey = "test";
@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;
}
@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return "Hello!";
    }
    @Query(() => [User])
    users() {
        return User.find();
    }

    @Mutation(() => LoginResponse)
    async login(@Arg("email") email: string, @Arg("password") password: string): Promise<LoginResponse> {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error("Invalid login!");
        }
        const valid = await compare(password, user.password);
        if (!valid) {
            throw new Error("Invalid login!");
        }
        const accessToken = sign({ userId: user.id }, jwtSecretKey, { expiresIn: "15m" });
        return { accessToken };
    }
    @Mutation(() => Boolean)
    async register(@Arg("email") email: string, @Arg("password") password: string) {
        try {
            await User.insert({ email, password: await hash(password, 12) });
        } catch (err) {
            return false;
        }
        return true;
    }
}
