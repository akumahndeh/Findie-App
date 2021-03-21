import { IonChip } from "@ionic/react";
import React, { useEffect, useState } from "react";
import ReactLinkify from "react-linkify";
import { setCommentRange } from "typescript";

const FormatForReading:React.FC<{text:string}>=({text})=>{
    const [more, setmore] = useState(false);
    const [words, setwords] = useState(``);
    useEffect(() => {
       if(text && !more){
           setwords(getMaxWords(text,50))
       }
       if(more){
           setwords(text)
       }
    }, [more]);
     function getMaxWords(text:string,count:number){
          let textArray=text.split(` `)
          let result= textArray.splice(0,count)
          if(count<textArray.length){
              setmore(true)
          }
          else{
              setmore(false)
          }
          let final = ``
          result.forEach((word,index)=>{
                 final+=word+` `
          }) 
        return final;
     }
    return(
       <div>
           <ReactLinkify>
           {words}   
           {more? <IonChip onClick={()=>setmore(false)}>Read More</IonChip>:``}
            </ReactLinkify> 
       </div>
    )
}

export default FormatForReading;