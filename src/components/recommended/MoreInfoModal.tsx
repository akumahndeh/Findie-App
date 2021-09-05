// @flow strict

import { IonBackdrop, IonButtons, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonModal, IonNote, IonRow, IonSlide, IonSlides, IonText, IonToolbar } from '@ionic/react';
import { callOutline, close, image, linkOutline, logoAppleAppstore, logoGooglePlaystore, logoWhatsapp, mailOutline } from 'ionicons/icons';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { fstore } from '../../firebase/Firebase';
import { recommendDataInterface } from '../../pages/Helpful';
import { userInterface } from '../../pages/Info';
import { selectUser } from '../../state/user-state';


const MoreInfoModal: React.FC<{ isOpen: boolean, onDidDismiss: () => void, data: recommendDataInterface }> = ({ isOpen, onDidDismiss, data: { contact: { applink, email, phone, playlink, website, whatsapp }, images, desc, video, title, id } }) => {
   
   React.useEffect(updateView,[])
   const user : userInterface= useSelector(selectUser)

   function updateView(){
      fstore.collection(`analytics-adverts`).doc(id).collection(`views`).add({timestamp:Date.now(),user:user.email||`anonymous`})
   }
    return (
        <IonModal cssClass={`contact-modal`} isOpen={isOpen} onDidDismiss={onDidDismiss}>
            <IonContent>

                <IonSlides pager style={{paddingBottom:`30px`}}>
                    {images.map((image, index) => {
                        return (<IonSlide key={index}>
                            <img src={image} alt="" />
                        </IonSlide>)
                    })}
                </IonSlides>
                <IonFab horizontal={`end`} vertical={`top`} className={`close-fab`}>
                    <IonBackdrop></IonBackdrop>
                    <IonFabButton color={`light`}>
                        <IonIcon icon={close} />
                    </IonFabButton>
                </IonFab>
                <IonGrid>
                    <IonRow>
                        {playlink && <IonCol>
                            <IonFabButton href={playlink} color={`dark`}>
                                <IonIcon icon={logoGooglePlaystore}></IonIcon>
                            </IonFabButton>
                        </IonCol>}
                        {applink && <IonCol >
                            <IonFabButton href={applink} color={`secondary`}>
                                <IonIcon icon={logoAppleAppstore}></IonIcon>
                            </IonFabButton>
                        </IonCol>}
                        {email && <IonCol>
                            <IonFabButton href={`mailto:${email}`} color={`danger`}>
                                <IonIcon icon={mailOutline}></IonIcon>
                            </IonFabButton>
                        </IonCol>}
                        {phone && <IonCol>
                            <IonFabButton href={`tel:${email}`} color={`primary`}>
                                <IonIcon icon={callOutline}></IonIcon>
                            </IonFabButton>
                        </IonCol>}
                        {whatsapp && <IonCol>
                            <IonFabButton href={`https://wa.me/${whatsapp}`} color={`success`}>
                                <IonIcon icon={logoWhatsapp}></IonIcon>
                            </IonFabButton>
                        </IonCol>}
                        {website && <IonCol>
                            <IonFabButton href={website} color={`tertiary`}>
                                <IonIcon icon={linkOutline}></IonIcon>
                            </IonFabButton>
                        </IonCol>}
                    </IonRow>
                </IonGrid>
                <IonCardHeader>
                    <IonCardTitle>{title}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonNote style={{fontSize:`14px`}}>
                        {desc}
                    </IonNote>
                    {video && <div className="content-video">
                        <iframe allowFullScreen src={video} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                    </div>}
                </IonCardContent>
            </IonContent>
        </IonModal>
    );

}

export default MoreInfoModal;