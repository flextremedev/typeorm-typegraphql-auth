import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, UseMiddleware } from "type-graphql";
import { User } from "./entity/User";
import { hash, compare } from "bcryptjs";
import { GraphQLContext } from "./GraphQLContext";
import { createRefreshToken, createAccessToken, isAuthorized } from "./auth";
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
    @Query(() => String)
    @UseMiddleware(isAuthorized)
    authenticated() {
        return 'Only seeing this if you\'re authorized!';
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { res }: GraphQLContext
    ): Promise<LoginResponse> {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error("Invalid login!");
        }
        const valid = await compare(password, user.password);
        if (!valid) {
            throw new Error("Invalid login!");
        }
        res.cookie("id", createRefreshToken(user), { httpOnly: true });
        const accessToken = createAccessToken(user);
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
