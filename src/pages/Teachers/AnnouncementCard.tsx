import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonText, IonNote, IonButtons, IonButton, IonIcon, IonAvatar, IonImg } from "@ionic/react"
import { trash, arrowForward } from "ionicons/icons"
import React from "react"
import HtmlParser from "react-html-parser"
import { infoInterface, openwithInAppBrowser, queuedFilesInterface } from "../Info"
import { fileImages } from "./AddModal"


export const AnouncementTeacherCard: React.FC<{ Trash: Function, trasheable: boolean, info: infoInterface, openModalForMore: (info: infoInterface) => void }> = ({ trasheable,Trash,info, openModalForMore }) => {
    function openDoc(doc:queuedFilesInterface|undefined){
        if(!doc){
            return
        }
        openwithInAppBrowser(doc.url)
        //    setchoosenDoc(doc)
    }
    return (
        <IonCard   >
            <IonCardHeader>
                <IonCardTitle style={{ textTransform: `capitalize` }}>{info.title}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent className="">
                <IonItem color={`none`} lines={`none`} style={{ maxHeight: `200px` }}>
                    <IonText>{HtmlParser(info?.message)} </IonText>
                </IonItem>{
                    info.queuedFiles?.map((doc,index )=>{
                            let images:any=fileImages
                        return  <IonItem key={index} button  onClick={()=>{ openDoc(doc)}}>
                                 <IonAvatar>
                                 <IonImg src={images[doc.type]}></IonImg>
                                 </IonAvatar>
                                 <IonText>{doc.fileName}</IonText>
      
                            </IonItem>
                        })
                        }
              
            </IonCardContent>
            <IonItem color={`none`} lines={`none`}>
                <IonNote>{(new Date(+info.date)).toDateString()}</IonNote>
                <IonButtons slot={`end`}>
                  {trasheable&&  <IonButton onClick={()=>Trash()}>
                        <IonIcon icon={trash} />
                    </IonButton>}
                    <IonButton onClick={() => openModalForMore(info)}><IonIcon icon={arrowForward}></IonIcon></IonButton>
                </IonButtons>
            </IonItem>
        </IonCard>
    )
}
