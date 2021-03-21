import { IonBackdrop, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonModal, IonNote, IonRow, IonSearchbar, IonSpinner, IonThumbnail, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from "@ionic/react";
import { render } from "@testing-library/react";
import { arrowBack } from "ionicons/icons";
import React, { useEffect, useState } from "react"; 
import { trackWindowScroll } from "react-lazy-load-image-component";
import { All } from "../media/images/images";
import { transformForSearch } from "../pages/Tour";
import TourInfo from "../pages/TourInfo";
import "./TourSearchModal.css";

const TourSearchModal:React.FC<{isOpen:boolean, onDidDismiss:Function }>=({isOpen, onDidDismiss})=>{
    const [renderPlaces, setrenderPlaces] = useState<any>();
    const [selectedplace, setselectedplace] = useState<any>();
    let timeout:any;
    const [typing, settyping] = useState(false);
     function searchPlace(event:any) { 
         const value = event.target.value.toLowerCase().replace(" ", "");
        setrenderPlaces(All.filter((item) => {
        return transformForSearch(item.describtion).match(transformForSearch(value))
       }))
     }
     function handleInput(){
         settyping(true)
        if(timeout) {
            window.clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            settyping(false)
        }, 3500);
     }
     let k=0
   useEffect(() => {
       if(!isOpen && k){
           setrenderPlaces(All)
        }else{
            k+=1
         }
   }, [isOpen]);
     
     function LimitWords(words:string){
         let sentenceArray= words.split(` `)
         let newsent= sentenceArray.splice(0,23).map((word)=>word+` `)
         return newsent
     }
    return(
       <IonModal cssClass={`tour-search`} isOpen={isOpen} onDidDismiss={()=>onDidDismiss()} >
         <IonHeader>
             <IonToolbar>
                 <IonButtons slot={`start`}>
                     <IonButton>
                         <IonIcon icon={arrowBack}/>
                         <IonBackdrop></IonBackdrop>
                     </IonButton>
                 </IonButtons>
                 <IonSearchbar onIonInput={handleInput}  onIonChange={searchPlace} mode={`ios`}></IonSearchbar>
             </IonToolbar>
         </IonHeader>
         <IonContent>
             <TourInfo isOpen={selectedplace!=undefined} location={{state:selectedplace }} onDidDismiss={()=>setselectedplace(undefined)}/>
             <IonList>
                 {
                    renderPlaces?.map((place: { mainpic: string | undefined;about:any|undefined ,name: React.ReactNode; })=>{
                         return<IonItem button onClick={()=>{setselectedplace(place)}}>
                             <IonGrid>
                                 <IonRow>
                                     <IonCol>
                                         <IonThumbnail>
                                             <IonImg src={place.mainpic}></IonImg>
                                         </IonThumbnail>
                                     </IonCol>
                                     <IonCol size={`9`}>
                                         <IonRow>
                                            <IonLabel className={`place-name`}>{place.name}</IonLabel>
                                         </IonRow>
                                         <IonRow> 
                                             <IonNote>
                                              {place.about?LimitWords(place.about):` 
                                          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis laborum, doloribus consequatur
                                          `}...
                                             </IonNote>
                                         </IonRow>
                                     </IonCol>
                                 </IonRow>
                             </IonGrid>
                         </IonItem>
                     })
                 }
                 {typing&& <div className="center-spinner">
                 <IonSpinner color={`primary`} duration={1000}></IonSpinner>
                 </div> }
           </IonList>
         </IonContent>
       </IonModal>

    )
}

export default TourSearchModal;