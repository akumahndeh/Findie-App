import { Plugins } from "@capacitor/core";
import { IonBackdrop, IonButton, IonButtons, IonChip, IonContent, IonHeader, IonIcon, IonLabel, IonModal, IonProgressBar, IonText, IonTitle, IonToolbar, useIonViewDidLeave } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react"
import { GuideInterface } from "./MenuPages/Guide";
import "./MenuPages/Guide.css"
import ReactHtmlParser from "react-html-parser"
import { arrowBack } from "ionicons/icons";

const GuideInfo:React.FC<{location:{state:any}, isOpen:boolean, onDidDismiss:Function}>=({location, isOpen,onDidDismiss})=>{
    const [guideInfo, setguideInfo] = useState<GuideInterface>();
    const [progress, setprogress] = useState(0.0);
    let content=useRef<HTMLIonContentElement>(null)
   async function updateProgress(){
    let scrollElement= await content.current?.getScrollElement()
   if(scrollElement){
    let actualHeight=scrollElement?.scrollHeight-scrollElement?.clientHeight
    setprogress(scrollElement?.scrollTop/actualHeight )
 } 
}
    useEffect(() => {
        let locationState:any=location?.state
       if(locationState){
           console.log(locationState)
          setguideInfo (locationState)
       }
    }, [location]);
    useIonViewDidLeave(()=>{
        setprogress(0)
    })
 
    function handleChipClick(){
        Plugins.Toast.show({text:`This is a key word of this text`})
    }
    
    return(
        <IonModal cssClass={`guide-info`} isOpen={isOpen} onDidDismiss={()=>onDidDismiss()}>
            <IonHeader >
                <IonToolbar color={`primary`}>
                    <IonButtons slot={`start`}>
                         <IonButton>
                             <IonIcon icon={arrowBack}/>
                             <IonBackdrop></IonBackdrop>
                         </IonButton>
                    </IonButtons>
                    <IonLabel>{guideInfo?.title}</IonLabel>  
                 <IonProgressBar className={`read-progress`} value={progress}  />
        </IonToolbar>
            </IonHeader>

            <IonContent ref={content}  scrollEvents onIonScroll={updateProgress} >
                {/* <p className="ion-padding paragraph">
                    <IonText>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus inventore fugit qui temporibus recusandae quo dolor eos cupiditate? At aperiam sit cum facere dignissimos consectetur error sed ab aliquam voluptatum!
                    </IonText>
                </p> */}
                           { guideInfo?.describtion?.split(`,`).map((ele,index)=>{
                            return <IonChip onClick={handleChipClick} key={index}  >{ele}</IonChip>
                        })} 
                     <IonText>
                   {ReactHtmlParser(`${guideInfo?.details}`)}
                        </IonText>
                  
            
                </IonContent>
        </IonModal>
    )
}
export default GuideInfo