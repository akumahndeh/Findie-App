import { Plugins } from "@capacitor/core";
import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonNote, IonPage, IonRow, IonSegment, IonSegmentButton, IonSlide, IonSlides, IonSpinner, IonText, IonTitle, IonToolbar, useIonViewDidEnter } from "@ionic/react"
import firebase, { firestore } from "firebase"
import { ellipsisVertical, home, personAdd, refreshSharp, trash } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router";
import { HideTab } from "../App";
import { getStorage } from "./Info";



const TeacherAdmin:React.FC=()=>{
    let slides=useRef<HTMLIonSlidesElement>(null)
    let location = useLocation()
     const [teacherData, setteacherData] = useState<{name:string,email:string,faculty:string,key:string}[]>([]);
    const [segmentvalue, setsegmentvalue] = useState(`add`);
    const [processing, setprocessing] = useState(false);
    const [authed, setauthed] = useState(true);
    const [authTeacher, setauthTeacher] = useState<{email:string,faculty:string}>();
    const [heroImage, setheroImage] = useState<string>();
    useIonViewDidEnter(()=>{
        HideTab()
    })
  useEffect(() => {
auththisUser()
  setHero()
},  []);

function setHero(){

    setheroImage(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFkMP3vbKWlokf-CKldCwCwq9QJ8DxkudRNg&usqp=CAU`)
}

function segmentChange(event:any){
      let value=event.target.value
      setsegmentvalue(value)
       if(value==`add`){
            slides.current?.slideTo(0)
      }else{
        slides.current?.slideTo(1)
      }
}
    
function updateData(){
    setprocessing(true)
    if(authTeacher)
    {
        firebase.firestore().collection(`teachers`).where(`faculty`,`==`,authTeacher.faculty).get().then(result=>{
        let temp:any[]=[]
        result.forEach(res=>{
            temp.push({...res.data(),key:res.id})
            setteacherData([...teacherData,...temp])
        })
        
    }).finally(()=>{setprocessing(false)})
}
}

function auththisUser(){
    let state:any=location.state 
     let currentUser:{faculty:string,email:string}=state
     console.log(currentUser)
     setauthTeacher(currentUser)
}
 
function submit(event:any){
    event.preventDefault()
    let email=event.target.email.value.toLowerCase()
    let name=event.target.name.value
    Plugins.Toast.show({text:`sending email...`})
    event.target.email.value=``
    event.target.name.value=``
    firebase.firestore().collection(`teachers`).where(`email`,`==`,email).get()
    .then(res=>{
        if(!res.empty){
            alert(`A teacher already exists with this email. use another`)
            return;
        }else{
            firebase.firestore().collection(`teachers`).add({name,email,faculty:authTeacher?.faculty}).catch((err)=>{
                Plugins.Toast.show({text:err.message,duration:`long`})
              }).then(()=>{
                  updateData()
              })
        }
    })
}
function deleteTeacher(key:string){
    firebase.firestore().collection(`teachers`).doc(key).delete().then(()=>{
        refresh()
    })    
}
function refresh(){
    setprocessing(true)
    firebase.firestore().collection(`teachers`).get().then(result=>{
        let temp:any[]=[]
        result.forEach(res=>{
            temp.push({...res.data(),key:res.id})
            setteacherData([ ...temp])
        })
        
    }).finally(()=>{setprocessing(false)})
}
async function slideChanged(){
   let index= await slides.current?.getActiveIndex()
    if(index==0 ){
       setsegmentvalue(`add`)
   }else if(index==1 ){
    setsegmentvalue(`all`)
   }
 
}
    return (
    <IonPage>
      { authTeacher!=undefined?<><IonHeader color={`none`}>
                <div style={{ backgroundImage: `url(${`https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`})` }}>

                    <IonToolbar style={{ margin: `0` }} color={`none`}>
                        <IonItem lines={`none`} color={`none`}>
                            <IonTitle>Admin</IonTitle>
                            <IonButtons>
                                <IonButton href={`/teachers`} slot={`end`}>
                                    <IonIcon icon={home}></IonIcon>
                                </IonButton>
                            </IonButtons>
                        </IonItem>
                        <IonSegment onIonChange={segmentChange} value={segmentvalue} mode={`ios`}>
                            <IonSegmentButton value={`add`}>Add Teacher</IonSegmentButton>
                            <IonSegmentButton value={`all`}>All Teachers</IonSegmentButton>
                        </IonSegment>
                    </IonToolbar>
                </div>
            </IonHeader>
                <IonContent>
                    <IonToolbar color={`light`}>
                        <IonItem style={{textTransform:`capitalize`}} color={`none`}>
                            <IonLabel >welcome </IonLabel>
                            <IonText>{authTeacher?.faculty}</IonText>
                         </IonItem>
                    </IonToolbar>
                    <IonToolbar style={{ minHeight: `90vh` }} color={`light`}>
                        <IonSlides onIonSlideDidChange={slideChanged} ref={slides}>
                            <IonSlide>
                                <IonCard style={{width:`98%`,margin:`auto`,maxWidth:`500px`}}>
                                    <IonImg src={ heroImage?heroImage:`data:image/jpeg;base64,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`} />
                                    <IonCardContent>
                                        <form onSubmit={submit}>
                                            <IonItem>
                                                <IonLabel position={`floating`}>Enter Teacher`s Name</IonLabel>
                                                <IonInput name={`name`}></IonInput>
                                            </IonItem>
                                            <IonItem>
                                                <IonLabel position={`floating`}>Enter Teacher`s Email</IonLabel>
                                                <IonInput name={`email`}></IonInput>
                                            </IonItem>
                                            <div className="ion-padding">
                                                <IonButton type={`submit`}> Add Teacher</IonButton>
                                            </div>
                                        </form>
                                    </IonCardContent>
                                </IonCard>
                            </IonSlide>
                            <IonSlide style={{ display: `block` }}>
                                <IonToolbar>
                                    <IonItem lines={`none`}>
                                    <IonNote color={`tertiary`}> Changes may take a while to update</IonNote>
                                        <IonButtons slot={`end`}>
                                            <IonButton onClick={refresh}> <IonIcon icon={refreshSharp}></IonIcon></IonButton>
                                        </IonButtons>
                                    </IonItem>
                                </IonToolbar>
                                {teacherData.map((teacher, index) => <IonItem key={index}>
                                    <IonLabel>{teacher.name}</IonLabel>
                                    <IonLabel className={`ion-padding-start`}>{teacher.email}</IonLabel>
                                    <IonButtons slot={`end`}>
                                        <IonButton onClick={() => deleteTeacher(teacher.key)}>
                                            <IonIcon icon={trash}></IonIcon>
                                        </IonButton>
                                    </IonButtons>
                                </IonItem>)}
                                {processing && <IonSpinner paused={false}></IonSpinner>}
                            </IonSlide>
                        </IonSlides>
                    </IonToolbar>

                </IonContent>
                </> :<IonSpinner></IonSpinner>
}
            
    </IonPage>
    )
}

export default TeacherAdmin;
