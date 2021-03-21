import { GistInterface, commentInterface } from "../pages/Interfaces";
import Pictures, { placePics, PeoplePics } from "../media/images/images";
const text="There is a great rise in the number of afflicted corona patients in the country, which is a good reason to eat good food when there is still time to breath"


export const gistdata:GistInterface[]=[
    {dp:Pictures.dummy,image:placePics[0],time:"8:00 am",message:text,name:"oben desmond", id:'obendesmond8:00am'},
    {dp:PeoplePics[0],image:placePics[1],time:"9:00 am",message:text,name:"Arrey Kings", id:'tabekings9:00am'},
    {dp:PeoplePics[1],image:placePics[2],time:"8:00 am",message:text,name:"Tabe Kingsley", id:'tabekings7788'},
     
  ]
  const comment1:commentInterface={dp:Pictures.dummy,message:"thanks very much for the wonderfull observation",name:"oben desmond",time:"12:00 pm",id:"nncmmc"}
export const gistExpressions= {
  'tabekings7788':{
    likes:200,
    funny:40,
    hates:12,
    comments:[comment1,{...comment1,dp:PeoplePics[4]}]
  },
  "obendesmond8:00am":{
    likes:50,
    funny:120,
    hates:90,
    comments:[comment1,comment1,{...comment1,dp:PeoplePics[4]}] 
  }
}


