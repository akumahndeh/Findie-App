import React, { useEffect, useState } from "react"
import { IonCard, IonText, IonIcon, IonButton, IonTitle, IonNote, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonButtons, IonModal, IonContent, IonToolbar, IonCardSubtitle, IonBackdrop, IonSkeletonText, IonHeader, IonImg, IonAvatar, IonSearchbar, useIonViewDidEnter, useIonViewWillEnter } from "@ionic/react";
import { Assets } from "../media/images/images";
import { arrowBack, arrowForward } from "ionicons/icons";
import { LocalNotification, Plugins } from "@capacitor/core";
import firebase from "firebase";
import { ImageDownload } from "../components/SocialCard";
import  "./Info.css"
import HtmlParser from "react-html-parser";
import { cleanup } from "@testing-library/react";
import { fileImages } from "./Teachers/AddModal"; 

export interface userInterface{
advert: boolean,
code: string,
department:string,
email: string,
faculty: string,
firstName: 
string,
image: string,
lastName: string,
number: string,
pass: string,
proff: string,
id:string

}
export interface queuedFilesInterface{
     url:string,
     fileName:string,
     type:string
}
export interface infoInterface{
    date:string,
    images:string[],
    message:string,
    title:string,
    queuedFiles:queuedFilesInterface[]
}

const Info:React.FC<{user:any|userInterface}>=()=>{
  const [Anouncements, setAnouncements] = useState<infoInterface[]>([]);
    const [currentInfo, setcurrentInfo] = useState<infoInterface|undefined>();
    const [information, setinformation] = useState<infoInterface[]>([]);
  const [noInfo, setnoInfo] = useState(false);
    function openModal(info:infoInterface){
         setcurrentInfo(info)
         
    }
    useEffect(() => {
        let asyncTask;
        getStorage(`info`).then(res=>{
            if(res.value)
            setAnouncements(JSON.parse(res.value))
            else{
                setnoInfo(true)
            }
        })
          getStorage(`user`).then((res)=>{
                        let user:userInterface= JSON.parse(res.value+``)
                       
                        if(user){
                         asyncTask=  firebase.database().ref().child(`info/${user?.faculty}`).on(`value`,(snapshot)=>{
                                let value=snapshot.val()
                            
                                 if(value){
                                    let valueArray:infoInterface[]=Object.values(value).map(str=>JSON.parse(str+``))
                                    console.log(valueArray)
                                    if(valueArray.reverse().length!==Anouncements.length+1){
                                          setAnouncements([])
                                    }
                                    setAnouncements(valueArray.reverse())
                                    Plugins.Storage.set({key:`info`, value:JSON.stringify(valueArray.reverse())})
                                setnoInfo(false)
                                }
                                else{
                                    setnoInfo(true)
                                     Plugins.Storage.remove({key:`info`})
                                     setAnouncements([])
                              
                                }
                                
                            
                         })
                      }
                     })

                     return (()=>{
                         cleanup()
                     })

    }, []);
   useEffect(() => {
         setinformation(Anouncements)
   }, [ Anouncements]);  
  function handleSearch(event: any){
             event.preventDefault()
           let value=  event.target?.value.toLowerCase().replaceAll(` `,``)
         setinformation( Anouncements.filter((info)=>{
             let infomessage:any=info.message
             let infotitle:any=info.title
               let message=infomessage.toLowerCase().replaceAll(` `,``)
                let title=infotitle.toLowerCase().replaceAll(` `,``)
               return (message.match(value.toLowerCase())|| title.match(value.toLowerCase())) 
           }))
  }
  useIonViewDidEnter(() => {
    if( document.body.classList.contains(`dark`)){
        Plugins.StatusBar.setBackgroundColor({ color: `#152b4d` }).catch(console.log)
       }else {
        Plugins.StatusBar.setBackgroundColor({ color: `#0d2c6d` }).catch(console.log)
       }
})
useIonViewWillEnter(() => {
    Plugins.StatusBar.setOverlaysWebView({
        overlay: false
    }).catch(() => { });
})
    return(
         <IonContent>
                  {!noInfo&& <IonSearchbar color={`primary`} onIonChange={ handleSearch} ></IonSearchbar>}
           {information.length<=0 && !noInfo ?<LoadingSkeleton/>:information.map((info,index)=><AnouncementCard openModalForMore={(info)=>openModal(info)} key={index} info={info}></AnouncementCard>)
           }
           {noInfo&&<div style={{paddingTop:"40px",textAlign:"center"}} >
               <img alt="" src={Assets.logo}/>
            <IonNote>no announcents yet from your faculty</IonNote>
           </div>}
           {
               information.length<=0 && !noInfo &&<IonCardTitle className={`ion-padding ion-margin`}>No matching result </IonCardTitle>
           }
           {/* <AnouncementCard openModalForMore={(info)=>openModal(info)} info={{date:``,title:`reopening`,images:[],message:`reopening date Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate rerum a quos inventore, necessitatibus at minima similique quidem temporibus expedita, ab, dolore quas rem accusantium nam totam dicta dolores sapiente `}}/> */}
          <InfoModal currentInfo={currentInfo} onDidDismiss={()=>setcurrentInfo(undefined)}></InfoModal>
         </IonContent>
    )
}
export default Info;




export const AnouncementCard:React.FC<{info:infoInterface,openModalForMore:(info:infoInterface)=>void}>=({info,openModalForMore})=>{
    
    return(
        <IonCard mode={`ios`}  className={`info-card`} >
            <IonCardHeader>
    <IonCardTitle style={{textTransform:`capitalize`}}>{info.title}</IonCardTitle>
            </IonCardHeader>
           
          <IonCardContent className="">
              <IonItem color={`none`} lines={`none`} style={{maxHeight:`200px`}}>
    <IonText>{HtmlParser(info?.message)} </IonText>
              </IonItem>
          </IonCardContent>
          <IonItem color={`none`} lines={`none`}>
             <IonNote>{(new Date(+info.date)).toDateString()}</IonNote>
           <IonButtons slot={`end`}>
               <IonButton onClick={()=>openModalForMore(info)}><IonIcon icon={arrowForward}></IonIcon></IonButton>
           </IonButtons>
          </IonItem>
      </IonCard>
    )
}

export function getStorage(key:string){
    return  Plugins.Storage.get({key})
}

const LoadingSkeleton: React.FC=()=>{
    return(
        <div className={`info-skeleton`}>
        <IonSkeletonText animated ></IonSkeletonText>
        <IonSkeletonText animated ></IonSkeletonText>
        <IonSkeletonText ></IonSkeletonText>
        <IonSkeletonText animated></IonSkeletonText>
        </div>
    )
}

export async function notifyUser(title:string, body:string,url=``){
    
    let newNotification:LocalNotification={body,smallIcon:`ic_stat_logo`,
    iconColor:`#0000ff`,
    id:Math.random(),
    title,
   actionTypeId:`gist`,
   attachments:[{id:Date.now()+``,url,options:{} }]
   
    }
       let storedNotifs= (await getStorage(`notifs`)).value
       let oldNotifications:LocalNotification[]=[]
       if(storedNotifs){
        oldNotifications=JSON.parse(storedNotifs)
        if(oldNotifications.length>4){
        oldNotifications= [oldNotifications[4]]
        }
     }
     let Notifications= [...oldNotifications, newNotification ]
    Plugins.LocalNotifications.requestPermission().then(()=>{
        Plugins.LocalNotifications.schedule({notifications:Notifications})

    }).then(()=>{
        Plugins.Storage.set({key:`notifs`,value:JSON.stringify(Notifications)})
    })

    Plugins.LocalNotifications.addListener(`localNotificationReceived`,console.log)

   
   
    let taskId= Plugins.BackgroundTask.beforeExit(()=>{
          Plugins.Storage.remove({key:`notifs`})
     })
    
     Plugins.BackgroundTask.finish({taskId})
}

export const InfoModal:React.FC<{currentInfo:infoInterface|undefined,onDidDismiss:Function|undefined}>=({currentInfo,onDidDismiss})=>{
//   const [choosenDoc, setchoosenDoc] = useState<queuedFilesInterface|undefined>(undefined);
    function openDoc(doc:queuedFilesInterface|undefined){
        if(!doc){
            return
        }
        openwithInAppBrowser(doc.url)
        //    setchoosenDoc(doc)
    }
    return(
        <>
        <IonModal   isOpen={currentInfo!=undefined} onDidDismiss={()=>{ if(onDidDismiss){ onDidDismiss()}}}>
            <IonHeader>
            <IonToolbar mode={`md`} color={`primary`}>
          <IonButtons slot={`start`}>
              <IonButton>
              <IonBackdrop></IonBackdrop>
                    <IonIcon  icon={arrowBack} size={`large`} ></IonIcon>
              </IonButton>
          </IonButtons>
                     <IonTitle>Faculty Info</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
             
               <IonToolbar mode={`md`}>
               <h2 style={{margin:`3px 10px`}}>{currentInfo?.title}</h2> 
              <p style={{padding:`3px 15px`}}>
                 <IonText> {HtmlParser(currentInfo?.message+``)}</IonText>
              </p>
              <p>
                  {currentInfo?.images?.map((img)=>{
                      return <ImageDownload image={img} sendUrl={()=>{}}></ImageDownload>
                  })}
              </p>
              <p>
                  {currentInfo?.queuedFiles?.map((doc,index)=>{
                     let images:any=fileImages
                  return  <IonItem key={index} button  onClick={()=>{ openDoc(doc)}}>
                           <IonAvatar>
                           <IonImg src={images[doc.type]}></IonImg>
                           </IonAvatar>
                           <IonText>{doc.fileName}</IonText>

                      </IonItem>
                  })}
              </p>
              <div className="ion-padding">
              <IonCardSubtitle>{(new Date(+(currentInfo?.date+``)).toDateString())}</IonCardSubtitle>
              </div>
               
                </IonToolbar>
            </IonContent>

        </IonModal>
        {/* <IonModal isOpen={choosenDoc!=undefined} onDidDismiss={()=>setchoosenDoc(undefined)}>
             <IonHeader>
                 <IonBackdrop></IonBackdrop>
                 <IonToolbar>
                     <IonButtons  slot={`start`}>
                           <IonButton>
                               <IonIcon icon={chevronBack}/>
                           </IonButton>
                     </IonButtons>
                     <IonTitle>
                         {choosenDoc?.fileName}
                     </IonTitle>
                 </IonToolbar>
             </IonHeader>
             <IonContent>
             <DocViewer style={{width:`100%`}}  pluginRenderers={[PDFRenderer, PDFRenderer]}  documents={[{fileType:`application/pdf`, uri:choosenDoc?.url?choosenDoc.url:``}]} />
              
             </IonContent>
        </IonModal> */}
        </>
    )
}

export const openwithInAppBrowser=(url:string)=>{

     Plugins.Browser.open({url,toolbarColor:`#0d2c6d`}).catch(alert)
}