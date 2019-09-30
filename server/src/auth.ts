import { User } from "./entity/User";
import { sign, verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { GraphQLContext } from "./GraphQLContext";

export const createAccessToken = (user: User) => {
    return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
};
export const createRefreshToken = (user: User) => {
    return sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });
};
export const isAuthorized: MiddlewareFn<GraphQLContext> = ({ context }, next) => {
    const authorization = context.req.headers["authorization"];
    if (!authorization) {
        throw new Error("Not authorized");
    }
    try {
        const token = authorization.split(" ")[1];
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        context.payload = payload as GraphQLContext["payload"];
    } catch {
        throw new Error("Not authorized");
    }
    return next();
};
