import { ApolloServer,gql } from "apollo-server";
import { typeDefs } from "./Schema";
import { Query} from "./resolvers";
const server=new ApolloServer({
    typeDefs,
    resolvers:{
        Query
    }
})
server.listen().then(({url})=>{
    console.log(`server ready on ${url}`)
})