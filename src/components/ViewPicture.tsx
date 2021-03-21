import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Plugins } from "@capacitor/core";
import { IonBackdrop, IonButton, IonHeader, IonIcon, IonModal, IonText, IonToolbar } from "@ionic/react";
import { arrowBack, shareSocial } from "ionicons/icons";

import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Assets } from "../media/images/images";
import "./viewPicture.css"


const ViewPicture:React.FC<{description:string,isOpen:boolean,OndidDismiss:Function,imageRef:string}>=({description,isOpen,OndidDismiss,imageRef})=>{
   let location=useLocation()
    const [defaultImage, setdefaultImage] = useState(``);

    function shareImage(){
        Plugins.Browser.open({url:imageRef})
    }
  useEffect(() => {
      setdefaultImage(imageRef)
     
  }, [isOpen]);
    return(
         <IonModal cssClass={`pic-modal`} mode={`ios`} swipeToClose isOpen={isOpen} onDidDismiss={()=>OndidDismiss()}>
             <IonHeader>
             <div >
                     <IonToolbar color={`none`}>
                        
                         <IonButton fill={`clear`} color={`light`} slot={`start`}>
                             <IonIcon icon={arrowBack}/>
                             <IonBackdrop></IonBackdrop>
                         </IonButton>
                       { location.pathname!==`/tour`&& <IonButton onClick={()=>shareImage()} fill={`clear`} color={`light`} slot={`end`}>
                             <IonIcon icon={shareSocial}/>
                         </IonButton>}
                     </IonToolbar>
                     </div>
                 </IonHeader>
                
               <TransformWrapper  pinch={{disabled:false,step:5000}} >
                         <TransformComponent>
                     <div    >
                    
                         <img  src={defaultImage==``?Assets.loading:defaultImage}/>
                        <IonToolbar className={`desc-text`}>
                        <IonText  >
                       {description}
                    </IonText>
                        </IonToolbar>
                           </div>
                           </TransformComponent>
                     </TransformWrapper>
                
                 
           </IonModal >
     )
}
export default ViewPicture