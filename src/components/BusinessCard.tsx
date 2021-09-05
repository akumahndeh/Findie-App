import React, { useRef, useState } from "react"
import { IonCard, IonCardHeader, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonCardTitle, IonText, IonCheckbox } from "@ionic/react"
import { Plugins } from "@capacitor/core"
import firebase from "../firebase/Firebase"


const BusinessCard:React.FC=()=>{

    function submit(event:any){
         event.preventDefault()
         let formObject= event.target
         let userInfo:any[]=[]
         for (const key in formObject) {
             if (Object.prototype.hasOwnProperty.call(formObject, key)) {
                  if(userInfo[formObject[key].name])
                  userInfo[formObject[key].name]=formObject[key].value
             }
         }
    }
    return(
        <IonCard >
                  <IonCardHeader color="primary">
                      create account
                  </IonCardHeader>
                  <IonCardContent>
                  <form onSubmit={submit}>
                      <IonItem>
                          <IonLabel position="floating">first name</IonLabel>
                          <IonInput name="firstName" ></IonInput>
                      </IonItem>
                      <IonItem>
                          <IonLabel position="floating">last name</IonLabel>
                          <IonInput name="lastName"></IonInput>
                      </IonItem>
                      <IonItem>
                          <IonLabel position="floating">kind of business</IonLabel>
                          <IonInput name="kind"></IonInput>
                      </IonItem>
                      <IonItem>
                          <IonLabel position="floating">description</IonLabel>
                          <IonInput name="description"></IonInput>
                      </IonItem>
                      <IonItem>
                          <IonLabel position="floating">location</IonLabel>
                          <IonInput name="location"></IonInput>
                      </IonItem>
                      
                      <IonItem>
                          <IonLabel position="floating">phone number</IonLabel>
                          <IonInput name="phone"></IonInput>
                      </IonItem>
                      <IonItem>
                          <IonLabel position="floating">email</IonLabel>
                          <IonInput name="email"></IonInput>
                      </IonItem>
                      <div className="ion-padding ion-margin-top">
                          <IonButton type="submit"  expand="full">create</IonButton>
                      </div>
                      </form>
                  </IonCardContent>
              </IonCard>
    )
}


export default BusinessCard;


export const VisitorCard :React.FC=()=>{
    const [accept, setaccept] = useState(false);
  let link=useRef<HTMLAnchorElement>(null)
   function gotoMain(){
       Plugins.Storage.clear().then(()=>{
           firebase.auth().signOut().then(()=>{
            Plugins.Storage.set({key:`firstTimer`,value:`noMore`}).then(()=>{
                link.current?.click()
            }) 
           
           })
          
        })
       
   
   }
    return(
        <IonCard >
                  <IonCardHeader color="primary">
                       sign in as visitor
                  </IonCardHeader>
                  <IonCardContent>
                     <IonCardTitle>Note</IonCardTitle>
                      <p className="ion-padding-top">
                          <IonText style={{fontSize:`18px`,textAlign:`left`}}>
                              signing up as a visitor means you will have limited access to the app. you will not be able to do things such as
                              chat with friends and recieve announcements.
                             </IonText>
                      </p>
                      <div className="ion-padding-top">
                        <div>
                            <IonCheckbox onIonChange={(e:any)=>{ setaccept(e.detail.checked)}}></IonCheckbox>
                            <IonText style={{fontSize:`18px`,textAlign:`left`}} class={`ion-margin-start`}>by using the app you are agreeing with the <a href={`https://findieapp.web.app/terms`}>terms and conditions</a></IonText>
                        </div>
                      <IonButton disabled={!accept} color={`danger`} onClick={gotoMain} >Next</IonButton>
                      </div>
                      <a href="/" ref={link}></a>
                  </IonCardContent>
              </IonCard>
    )
}