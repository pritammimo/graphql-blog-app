import { prisma } from "@prisma/client";
import { Context } from "../index";
interface UserParentType{
    id:number
}
export  const User={
  posts:(parent:UserParentType,{take,skip}:{take:number,skip:number},{userInfo,prisma}:Context)=>{
    const isOwnProfile=parent.id===userInfo?.userId
    if(isOwnProfile){
     return prisma.post.findMany({
      where:{
        authorId:parent.id
      },
      orderBy:[
        {
          createdAt:"desc"
        }
      ],
      skip,
      take
     })
    }
    else {
      return prisma.post.findMany({
        where:{
          authorId:parent.id,
          published:true
        },
        orderBy:[
          {
            createdAt:"desc"
          }
        ]
      })
    }
  }
}