import {Context} from "../../index"
import { Post, Prisma } from "@prisma/client"
import { canUserMutatePost } from "../../utils/canUserMutatePost"
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
export  const postResolvers ={
    postCreate:async(parent:any,{post}:PostArgs,{prisma,userInfo}:Context):
    Promise<PostPayloadType>=>{

        if (!userInfo) {
            return {
              userErrors: [
                {
                  message: "Forbidden access (unauthenticated)",
                },
              ],
              post: null,
            };
          }

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
            authorId:userInfo.userId
        }
       })
     }
    },
    postUpdate:async(parent:any,{post,postId}:{postId:String,post:PostArgs["post"]}
    ,{prisma,userInfo}:Context):Promise<PostPayloadType>=>{
   
     if (!userInfo) {
        return {
          userErrors: [
            {
              message: "Forbidden access (unauthenticated)",
            },
          ],
          post: null,
        };
      }
      const error=await canUserMutatePost({
        userId:userInfo.userId,
        postId:Number(postId),
        prisma
      })
      if (error) return error;
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
  },
  postDelete:async(parent:any,{postId}:{postId:String},{prisma,userInfo}:Context):Promise<PostPayloadType>=>{

    if (!userInfo) {
        return {
          userErrors: [
            {
              message: "Forbidden access (unauthenticated)",
            },
          ],
          post: null,
        };
      }
      const error=await canUserMutatePost({
        userId:userInfo.userId,
        postId:Number(postId),
        prisma
      })
      if (error) return error;
    const post=await prisma.post.findUnique({
      where:{
        id:Number(postId)
      }
    })
    if (!post) {
      return {
        userErrors: [
          {
            message: "Post does not exist",
          },
        ],
        post: null,
      };
    }
    await prisma.post.delete({
      where:{
        id:Number(postId)
      }
    })
    return {
      userErrors: [],
      post,
    };
  }
    }