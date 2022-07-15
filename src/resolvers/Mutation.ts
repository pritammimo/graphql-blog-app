import { Post } from "@prisma/client"
import {Context} from "../index"
interface PostCreateArgs{
    title:string
    content:string
}
interface PostPayloadType{
    userErrors:{
        message:string
    }[],
    post:Post | null
}
export  const Mutation={
  postCreate:async(parent:any,{title,content}:PostCreateArgs,{prisma}:Context):
  Promise<PostPayloadType>=>{
    if(!title || !content){
      return {
        userErrors:[{
            message:"You must Provide title and Message"
        }],
        post:null
      }
    }
   const post = await prisma.post.create({
    data:{
        title,
        content,
        authorId:1
    }
   })
   return {
    userErrors:[],
    post
   }
  }
}