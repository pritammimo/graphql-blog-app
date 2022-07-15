import { Post, Prisma } from "@prisma/client"
import {Context} from "../index"
interface PostArgs{
  post:{
    title?:string
    content?:string
  }
  
}
interface PostPayloadType{
    userErrors:{
        message:string
    }[],
    post:Post | Prisma.Prisma__PostClient<Post> | null
}
export  const Mutation={
  postCreate:async(parent:any,{post}:PostArgs,{prisma}:Context):
  Promise<PostPayloadType>=>{
    const {title,content}=post
    if(!title || !content){
      return {
        userErrors:[{
            message:"You must Provide title and Message"
        }],
        post:null
      }
    }
   return {
    userErrors:[],
    post:prisma.post.create({
      data:{
          title,
          content,
          authorId:1
      }
     })
   }
  },
  postUpdate:async(parent:any,{post,postId}:{postId:String,post:PostArgs["post"]}
  ,{prisma}:Context):Promise<PostPayloadType>=>{
   const {title,content}=post;
   if (!title && !content) {
    return {
      userErrors: [
        {
          message: "Need to have at least on e field to update",
        },
      ],
      post: null,
    };
  }
 const existingPost=await prisma.post.findUnique({
  where:{
    id:Number(postId)
  }
 })
 if (!existingPost) {
  return {
    userErrors: [
      {
        message: "Post does not exist",
      },
    ],
    post: null,
  };
}
let payloadToUpdate = {
  title,
  content,
};
if (!title) delete payloadToUpdate.title;
if (!content) delete payloadToUpdate.content;
return {userErrors:[],
  post: prisma.post.update({
    data: {
      ...payloadToUpdate,
    },
    where: {
      id: Number(postId),
    },
  }),
}
}
  }
