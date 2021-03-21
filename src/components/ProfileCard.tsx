import React, { useState, useRef, useEffect } from "react"
import { IonCard, IonCardContent, IonCardHeader, IonLabel, IonAvatar, IonImg, IonIcon, IonList, IonListHeader, IonRadioGroup, IonItem, IonRadio, IonInput, IonButton, IonText, useIonViewWillEnter, useIonViewDidEnter, IonProgressBar } from "@ionic/react"
import { person, camera } from "ionicons/icons";
import {Plugins, CameraOptions, CameraResultType, CameraSource} from "@capacitor/core"

const {Camera}=Plugins

const ProfileCard:React.FC<{next:Function,switchCode:Function}>=(props)=>{
    const [proff, setproff] = useState("");
    const [profilePic, setprofilePic] = useState(person);
    const [progress, setprogress] = useState(0.1);
    const radio= useRef<HTMLIonRadioElement>(null)
    const itemRef=useRef<HTMLIonItemElement>(null)
        

    const changeOption=(event:any)=>{
       setproff(event.target.value)
      props.switchCode(event.target.value)
      setprogress(0.2)
      
     }
     useIonViewDidEnter(() => {
            itemRef.current?.click()
             radio.current?.click()
            console.log(`hey`)
     });
     var count=0
     function submit(event:any){
              event.preventDefault()
              if((profilePic==person || profilePic==``) && count<=0)
              {
                  if(window.confirm(`please add an image 🖼📷 ☺`)){
                  getImage()
                  return;
                } 
                count++;
             
             }
             if(proff){
                if(event.target["code"] )
                props.next({proff:proff,image:profilePic,code:event.target["code"].value.toLowerCase()})
                else  props.next({proff:proff,image:profilePic,code:`visitor`})
             }
             else{
                 Plugins.Modals.alert({title:`missing field`,message:`Please select a signin option`,buttonTitle:`ok`})
             }
     }
    
     const CameraOption:CameraOptions={
         resultType:CameraResultType.DataUrl,
         source:CameraSource.Photos,
         saveToGallery:true,
         height:400,
         width:400
     }
     const getImage=async()=>{
          try{ const image= await Camera.getPhoto(CameraOption)
          
            setprofilePic(image.dataUrl+"")
        }catch(err){
            Plugins.Network.getStatus().then(val=>{
                if(val.connected){
                    Plugins.Toast.show({text:`unable to get more Images - network error`})
                }else{
                    Plugins.Toast.show({text:`undable to get more Images`})
                }
            })
        }
        }
    return(
        <IonCard className="pic-card">
            <IonCardHeader color="primary">
                    <IonLabel>Fill Profile</IonLabel>
            </IonCardHeader> <IonCardContent >
              <div className="avatar" onClick={getImage}>
              <IonAvatar>
                  <IonImg alt="" src={profilePic}/>
              </IonAvatar>
                <IonButton fill="clear">
              <IonIcon color={`dark`} icon={camera} size="large"/>

                </IonButton>
              </div>
              
              <IonList>
                  <IonListHeader>
                     sign in as
                  </IonListHeader>
                  <IonRadioGroup allowEmptySelection={false}  onIonChange={changeOption}>
                      <IonItem  ref={itemRef}  color="light">
                          <IonRadio  ref={radio}></IonRadio> <IonText>student</IonText>
                      </IonItem>
                      
                      <IonItem color="light">
                          <IonRadio></IonRadio> <IonText>visitor</IonText>
                      </IonItem>
                  </IonRadioGroup>

                  <form onSubmit={submit}>
                <div className="ion-padding">
                      {proff=="ion-rb-0"?<IonItem>
                      <IonLabel position="floating">Enter Matricule</IonLabel>
                      <IonInput name="code" required ></IonInput>
                   </IonItem>:
                   <div className="ion-padding"></div>
                   }
                   
                   </div>
                   <div className="ion-padding ion-margin-top">
                          <IonButton type="submit"  expand="full">next</IonButton>
                      </div>
                      </form>
              </IonList>
          </IonCardContent>
        </IonCard>
    )
}

export default ProfileCard;