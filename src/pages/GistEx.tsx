import React, {  } from "react"
import { IonCard, IonCardContent, IonItem, IonTextarea, IonButton, IonInput } from "@ionic/react"
import { Plugins } from "@capacitor/core"
import "../components/GistModal.css"
import firebase from "../firebase/Firebase";;

const GistEx: React.FC = () => {
     function submitGuide(event:any ){
          event.preventDefault()
          let title=(event.target.title.value+``).toLowerCase()
          let message=event.target.message.value
        //   let date=event.target.detail.value
        let date=Date.now()
          firebase.database().ref(`info/engineering and technology`).push(JSON.stringify({date,message,title})).then(()=>alert(`successfull`))
           
        }
    return(
        <IonCard>
            <IonCardContent>
                <form onSubmit={submitGuide}>
                <IonItem>
                    <IonInput name={`title`} placeholder={`Enter title`}></IonInput>
                </IonItem>
                {/* <IonItem>
                    <IonInput name={`date`} placeholder={`Enter date`}></IonInput>
                </IonItem> */}
                <IonItem>
                    <IonTextarea name={`message`} placeholder={`enter html detail `}/>
                </IonItem>
                <IonButton type={`submit`}>
                    Send Guide
                </IonButton>
                <IonButton color={`danger`} type={`reset`}>
                    clear
                </IonButton>
                </form>
            </IonCardContent>
        </IonCard>
    )
    
    
}
export default GistEx 