import { prisma } from "@prisma/client";
import { Context } from "../index";
interface ProfileParentTypes{
    id:number;
    bio:string;
    userId:number;
}
export  const Profile={
  user:(parent:ProfileParentTypes,args:any,{userInfo,prisma}:Context)=>{
    return prisma.user.findUnique({
        where:{
            id:parent.userId
        }
    })
  }
}