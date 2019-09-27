import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { User } from "./entity/User";
import { hash } from "bcryptjs";
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
