import { Plugins } from "@capacitor/core";
import React, { useState, useRef, useEffect } from "react";
import { IonActionSheet, IonAvatar, IonBackdrop, IonButton, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonModal, IonPage, IonRow, IonSpinner, IonText, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import { trash, attach, book, recording, images, play, chevronBack } from "ionicons/icons";
 



export interface filesInterface {
    type:"doc"|"image"|"video"|"audio",
    fileName:string,
    file:Blob
}
export interface ContentInterface{
    title:string, 
    concerns:string, 
    message:string,
    date:string
}
 
export const fileImages = {
    image: `data:image/jpeg;base64,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`
    , video: `data:image/jpeg;base64,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`
    ,   audio: `data:image/jpeg;base64,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`
    , doc: `data:image/png;base64,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`
};

const AddModal: React.FC<{authTeacher:firebase.User|null|undefined ,sendConfirmedData:Function, onDidDismiss:Function}> = ({authTeacher,sendConfirmedData, onDidDismiss}) => {
    const [preview, setpreview] = useState(false);
    const [Content, setContent] = useState<ContentInterface|undefined>(undefined);
    const [fileType, setfileType] = useState(``);
    const [opensheet, setopensheet] = useState(false);
    const [queuedFiles, setqueuedFiles] = useState<filesInterface[]>([] );
    let resetRef=useRef<HTMLInputElement>(null)
    useEffect(() => {
      console.log(authTeacher)
    }, [ authTeacher]);
  
    function submit2findie(){
       
       resetRef.current?.click()
       if(Content){
           sendConfirmedData({Content,queuedFiles})

       }
       else{
           alert(`no information to be sent`)
       }
    }
    
    const types: any = {
        image: "image/*",
        video: `video/*`,
        audio: `audio/*`,
        doc: `application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf `
    }
    let picker = useRef<HTMLInputElement>(null)
    function openAttachment(fType: string) {
        setfileType(types[fType])
      
    }
    useEffect(() => {
        if(fileType!=``){
            picker.current?.click()
        }
    }, [fileType]);
    function getFile(event:any){
        let files:any[]=Object.values(event.target.files)
          setqueuedFiles( [...queuedFiles ,...files.map(file => {
            let ft:any=fileType=="image/*"?`image`:fileType==`audio/*`?`audio`:fileType==`video/*`?`video`:`doc`;
              
            if(fileType!=``)
                    return  {file:file,fileName:file.name,type:ft}  
            return {file:file,fileName:file.name,type:ft}  
             })]);
            
       
     
        setfileType(``)

    }
    function submit(event:any){
            event.preventDefault()
            let target=event.target
            let title = target.title.value;
            let concerns = target.concerns.value;
            let message = target.message.value;
            let date =Date.now().toString()
             setContent({title,concerns,message,date})
            setpreview(true)
           
    }
    function deleteAttachment(fileIndex:number){
        if(! window.confirm(`are you sure you want to remove attachment ?`)){
              return;
        }
           let temp=queuedFiles
           temp.splice(fileIndex,1)
           setqueuedFiles([...temp])
    }
   
    return (
        <>
            <IonHeader>
                <IonToolbar color={`primary`}>
                    <IonButtons slot={`start`}>
                        <IonButton onClick={()=>onDidDismiss()}>
                        <IonIcon icon={chevronBack}></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Add</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <form onSubmit={submit}>
                <IonCard>
                    <IonCardContent>
                        <IonItem>  <IonLabel position={`floating`}>Title</IonLabel>
                            <IonInput name={`title`}/>
                        </IonItem>
                        <IonItem>
                            <IonLabel position={`floating`}>This Concerns</IonLabel>
                            <IonInput name={`concerns`} />
                            
                        </IonItem>
                    </IonCardContent>

                </IonCard>
                <IonCard>
                    <IonCardContent>
                        <IonCardSubtitle>Enter the body of your anouncement</IonCardSubtitle>

                        <IonItem>
                            <IonLabel position={`floating`}>Enter message</IonLabel>
                            <IonTextarea name={`message`} rows={4}></IonTextarea>
                        </IonItem>
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <IonCardContent>
                       <IonGrid>
                       {
                            queuedFiles?.map((file,index)=>{
                           return <IonRow key={index}>
                               <IonItem style={{width:`100%`}} ><img style={{height:`50px`,width:`50px`}} src={fileImages[file.type]}></img> <IonLabel className={`ion-margin-start`}>{file.fileName}</IonLabel>
                               <IonButtons slot={`end`} >
                                   <IonButton onClick={()=>deleteAttachment(index)}><IonIcon  icon={trash}/></IonButton>

                               </IonButtons>
                               </IonItem>
                           </IonRow>
                            })
                        }
                       </IonGrid>
                        <IonCardSubtitle>Attachments</IonCardSubtitle>
                        <IonItem button onClick={() => setopensheet(true)}>
                            <IonIcon icon={attach} /><IonLabel className={`ion-padding-start`}>add file</IonLabel>
                        </IonItem>
                        <div className="ion-padding">
                            <IonButton type={`submit`} expand={`block`} color={`primary`}>
                                Next
                            </IonButton>
                            <input type="reset" hidden ref={resetRef} value=""/>
                            
                        </div>
                    </IonCardContent>
                </IonCard>
                </form>
                <IonActionSheet buttons={[
                { text: `document`, icon: book, handler: () => openAttachment(`doc`) },
                { text: `audio`, icon: recording, handler: () => openAttachment(`audio`) },
                { text: `image`, icon: images, handler: () => openAttachment(`image`) },
                { text: `video`, icon: play, handler: () => openAttachment(`video`) },]} isOpen={opensheet} onDidDismiss={() => setopensheet(false)}>

                </IonActionSheet>
                <input ref={picker} multiple style={{ display: `none` }} onChange={getFile} type="file" accept={fileType} />
                <IonModal isOpen={preview} onDidDismiss={()=>setpreview(false)}>
                    <IonHeader>
                    <IonToolbar color={`primary`}>
                    <IonItem lines={`none`} color={`none`}>
                        <IonButtons>
                            <IonButton>
                            <IonIcon icon={chevronBack} />
                            <IonBackdrop></IonBackdrop>
                            <IonLabel>back</IonLabel>
                            </IonButton>
                        </IonButtons>
                        <IonTitle>Preview</IonTitle>
                    </IonItem>
                </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        {<div className="ion-padding">
                            
                            <h2>{Content?.title}</h2>
                            <p style={{color:`rgb(${(Math.random()*1000)%256},${(Math.random()*1000)%256},${(Math.random()*1000)%256})`}}>
                                This message concerns {Content?.concerns}
                            </p>
                            <p>
                                {Content?.message}
                            </p>
                            <p>
                            {
                            queuedFiles?.map((file,index)=>{
                           return <IonRow key={index}>
                               <IonItem style={{width:`100%`}} ><img style={{height:`50px`,width:`50px`}} src={fileImages[file.type]}></img> <IonLabel className={`ion-margin-start`}>{file.fileName}</IonLabel>
                               </IonItem>
                           </IonRow>
                            })
                        }
                            </p>
                            <p>
                                 {
                               
                                 Content?  (new Date(+Content?.date)).toDateString():``
                                }
                           
                            </p>
                            <IonGrid>
                                <IonRow>
                                    <IonCol></IonCol>
                                    <IonCol>
                                        <IonRow>
                           { authTeacher!=undefined&& <IonAvatar><IonImg src={authTeacher?.photoURL+``}/></IonAvatar>}
                                        </IonRow>
                                        <IonRow>
                                            <IonCol>
                                                <IonText>
                                                    {authTeacher?.displayName}
                                                </IonText>
                                            </IonCol>
                                         </IonRow>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </div>}
                        <div className="ion-padding">
                            <IonButton onClick={submit2findie} color={`danger`}>
                                SUBMIT TO FINDIE
                            </IonButton>
                        </div>
                     </IonContent>
                </IonModal>
            </IonContent>
        </>
    )
}

export default AddModal



// async function submitAnnouncement(){
//     let title=Content?.title
//     let date=Content?.date
//     queuedFiles?.forEach((file)=>{
//          let  randomNumber=Math.random() 
//          let uniqueId:string= randomNumber+``+(Date.now())
//         //  let faculty:string|null = (await getStorage(`teacherFaculty`)).value
        
//         let message=`<div style="padding:7px"> <p> ${Content?.message}   </p>  <p >  ${   queuedFiles?.map((file,index)=>{
//                            return` <ion-row key="${index}">
//                   <ion-item style= "width:100%" ><img style= "height:50px;width:50px" src="${fileImages[file.type]}"></img> <ion-label class="ion-margin-start">${file.fileName}</ion-label>
//            </ion-item>  </ion-row>`
//     })
//     }   </p></div>`
        
//     })
// }