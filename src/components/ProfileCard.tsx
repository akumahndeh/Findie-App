import React, { useState, useRef, useEffect } from "react"
import { IonCard, IonCardContent, IonCardHeader, IonLabel, IonAvatar, IonImg, IonIcon, IonList, IonListHeader, IonRadioGroup, IonItem, IonRadio, IonInput, IonButton, IonText, useIonViewWillEnter, useIonViewDidEnter, IonProgressBar, IonToolbar } from "@ionic/react"
import { person, camera } from "ionicons/icons";
import { Plugins, CameraOptions, CameraResultType, CameraSource } from "@capacitor/core"
import LetterAvatar from "./letterAvatar";

const { Camera } = Plugins

const ProfileCard: React.FC<{ next: Function, switchCode: Function }> = (props) => {
    const [proff, setproff] = useState("");
    const [progress, setprogress] = useState(0.1);
    const radio = useRef<HTMLIonRadioElement>(null)
    const itemRef = useRef<HTMLIonItemElement>(null)
    const [visitor, setvisitor] = useState(false)


    const changeOption = (event: any) => {
        if (event.target.value == `student`) {
            setvisitor(false)
        }
        setproff(event.target.value)
        props.switchCode(event.target.value)
        setprogress(0.2)

    }
    useIonViewDidEnter(() => {
        itemRef.current?.click()
        radio.current?.click()
        console.log(`hey`)
    });
    var count = 0
    function submit() {

        if (proff) {

            if (!visitor)
                props.next({ proff: proff, image: ``, code: `` })
            else
                props.next({ proff: proff, image: ``, code: `visitor` })
        }
        else {
            Plugins.Modals.alert({ title: `missing field`, message: `Please select a signin option`, buttonTitle: `ok` })
        }
    }



    return (
        <IonCard className="pic-card">
            <IonCardHeader color="primary">
                <IonLabel>Fill Profile</IonLabel>
            </IonCardHeader> <IonCardContent >
                {/* <div className="avatar" onClick={getImage}>
              <IonAvatar>
                  <IonImg alt="" src={``}/>
              </IonAvatar>
                <IonButton fill="clear">
              <IonIcon color={`dark`} icon={camera} size="large"/>

                </IonButton>
              </div> */}
              <IonToolbar >
                 <div style={{width:`20%`, margin:`auto`}}>
                 <LetterAvatar props={{name:`Findie`,size:46}} ></LetterAvatar>
                 </div>
              </IonToolbar>

                <IonList>
                    <IonListHeader>
                        sign in as
                  </IonListHeader>
                    <IonRadioGroup allowEmptySelection={false} onIonChange={changeOption}>
                        <IonItem ref={itemRef} color="light">
                            <IonRadio ref={radio}></IonRadio> <IonText>student</IonText>
                        </IonItem>

                        <IonItem color="light">
                            <IonRadio></IonRadio> <IonText>Try App first</IonText>
                        </IonItem>
                    </IonRadioGroup>

                    {/* <form onSubmit={}> */}
                    {/* <div className="ion-padding">
                      {proff=="ion-rb-0"?<IonItem>
                      <IonLabel position="floating">Enter Matricule</IonLabel>
                      <IonInput name="code" required ></IonInput>
                   </IonItem>:
                   <div className="ion-padding"></div>
                   }
                   
                   </div> */}
                    <div className="ion-padding ion-margin-top">
                        <IonButton onClick={submit} type="submit" expand="full">next</IonButton>
                    </div>
                    {/* </form> */}
                </IonList>
            </IonCardContent>
        </IonCard>
    )
}

export default ProfileCard;