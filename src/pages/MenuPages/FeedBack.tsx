import { FilesystemDirectory, Plugins } from "@capacitor/core";
import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSpinner, IonTextarea, IonTitle, IonToolbar, useIonViewDidEnter } from "@ionic/react";
import firebase from "firebase";
import { fileTray, paperPlaneSharp, reader } from "ionicons/icons";
import React, { useEffect, useState } from "react"
import { HideTab } from "../../App";
import { getStorage } from "../Info";
import { authUser } from "./Guide";

const Feedback: React.FC = () => {
    const [loading, setloading] = useState(false);
    useIonViewDidEnter(() => {
        HideTab()
    })
    function submit(event: any) {
        event.preventDefault()
        let message = event.target.message.value
        getStorage(`userid`).then((res) => {
            if (res.value) {
                let userid = res.value
                setloading(true)
                authUser().then(() => {
                    firebase.database().ref(`feedback`).push({ userid, message, date: Date.now() }).then(() => {
                        alert(`successfully sent your feedback`)
                    }).catch((err) => {
                        alert(err.message)
                    }).finally(() => {
                        setloading(false)
                    })
                }).finally(() => {
                    setloading(false)
                })
            }
        })

    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonBackButton></IonBackButton>
                    </IonButtons>
                    <IonTitle>feedback</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="ion-padding">
                    <p>
                        findie developers are always glad to listen to customer feedback on how the application
                        can be upgraded to suite your experience, reasons why this section is provided.
                  </p>
                    <p>
                        fill the fieled below of any problems you have while using the application. we promise to do
                        what we can to attend to them.
                  </p>
                    <form onSubmit={submit}>
                        <IonItem>
                            <IonTextarea name={`message`} rows={4} placeholder="enter comment or feed back"></IonTextarea>
                        </IonItem>
                        <div className="ion-padding ion-margin-top">
                            <IonButton type={`submit`}>{loading ? <IonSpinner ></IonSpinner> : <><IonIcon slot="start" icon={paperPlaneSharp}></IonIcon> send</>}</IonButton>
                        </div>
                    </form>

                    <p className="ion-margin-top ion-padding">
                        you can also contact us by sending an email to<br /> <a href="mailto:findieapp@gmail.com">findieapp@gmail.com</a>
                    </p>
                </div> 
            </IonContent>
        </IonPage>
    )
}
export default Feedback;




