import { prisma } from "@prisma/client";
import { Context } from "../index";
export  const Query={
    posts:(parent:any,{take,skip}:{take:number,skip:number},{prisma}:Context)=>{
        return prisma.post.findMany({
            where: {
              published: true,
            },
            orderBy: [
              {
                createdAt: "desc",
              },
            ],
            skip,
            take
          });
    },
    me:(parent:any,args:any,{prisma,userInfo}:Context)=>{
     if(!userInfo) return null;
     return prisma.user.findUnique({
        where:{
            id:userInfo.userId
        }
     })
    },
    profile:(parent:any,{userId}:{userId:string},{prisma,userInfo}:Context)=>{
      return prisma.profile.findUnique({
        where:{
            userId:Number(userId),
        }
      })
    }
}