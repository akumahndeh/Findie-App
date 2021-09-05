import { IonHeader, IonToolbar, IonItem, IonButtons, IonIcon, IonBackdrop, IonTitle, IonContent, IonCard, IonCardContent, IonLabel, IonInput, IonButton, IonLoading } from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import React, { useState } from "react";
import { useHistory } from "react-router"; 
import firebase from "../../firebase/Firebase";

export const Modal: React.FC <{onDidDismiss:Function}>= ({onDidDismiss}) => {
     let history=useHistory()
     const [loadingMessage, setloadingMessage] = useState(`verifying Admin credentials...`);
     const [loading , setloading ] = useState(false);
    function submit(event: any) {
        event.preventDefault()
        let email = event.target.email.value.toLowerCase().trim()
        let password= event.target.password.value
        // setloading(true)
        history.push(`/teachers/admin`)
        firebase.firestore().collection(`admins`).where(`email`, `==`, email)
            .get().then((res) => {
                if (res.empty) {
                    alert(`you are not an admin`)
                } else {
                    let teacher:{email:string,faculty:string};
                    res.forEach((doc)=>{
                        let t:any=doc.data()
                         teacher=t
                         setloadingMessage(`Authenticating user`)
                         if(teacher){
                            firebase.auth().signInWithEmailAndPassword(email,password).then(()=>{
                             onDidDismiss()
                                history.push(`/teachers/admin`,teacher)
                                let link= document.createElement(`a`)
                                link.href=`/teachers/admin`
                                document.body.appendChild(link)
                                link.click()
                                
                            }).finally(()=>setloading(false))
                            .catch((err)=>{
                                alert(err.message)
                            })
                         }
                    })
                   
                    
                }

            }).catch((err)=>console.log(err.message))
            .finally(()=>setloading(false))

    }

    return (
        < >
            <IonHeader>
                <IonToolbar color={`primary`}>
                    <IonItem lines={`none`} color={`none`}>
                        <IonButtons>
                            <IonIcon icon={chevronBack} />
                            <IonBackdrop></IonBackdrop>
                        </IonButtons>
                        <IonTitle>Admin</IonTitle>
                    </IonItem>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading  message={loadingMessage} isOpen={loading} onDidDismiss={()=>setloading(false)}></IonLoading>
                <IonCard style={{ maxWidth: `500px` }}>
                    <img src={`https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`} />
                    <IonCardContent>
                        <form onSubmit={submit} >
                            <IonItem>
                                <IonLabel position={`floating`}>Enter Email</IonLabel>
                                <IonInput name={`email`} />
                            </IonItem>
                            <IonItem>
                                <IonLabel position={`floating`}>Enter password</IonLabel>
                                <IonInput type={`password`} name={`password`} />
                            </IonItem>
                            <IonItem lines={`none`}>
                                <IonButton type={`submit`}>submit</IonButton>
                            </IonItem>
                        </form>
                    </IonCardContent>
                </IonCard>
                  
            </IonContent>
        </ >
    )
}

