import { ApolloServer,gql } from "apollo-server";
import { typeDefs } from "./Schema";
import { Query,Profile,Post,User} from "./resolvers";
import { Mutation } from "./resolvers/Mutation/Mutation";
import { PrismaClient,Prisma } from "@prisma/client";
import { getUserFromToken } from "./utils/getUserFromToken";

const prisma=new PrismaClient();
export interface Context {
    prisma:PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  userInfo: {
    userId: number;
  } | null;
}
const server=new ApolloServer({
    typeDefs,
    resolvers:{
        Query,
        Mutation,
        Profile,
        Post,
        User
    },
    context:async({req}:any):Promise<Context>=>{
        const userInfo=await getUserFromToken(req.headers.authorization)
        return {
            prisma,
            userInfo
        }
    }
})
server.listen().then(({url})=>{
    console.log(`server ready on ${url}`)
})