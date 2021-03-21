import { CreateAnimation, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonImg, IonItem, IonLabel, IonPage, IonText, IonToggle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from "@ionic/react"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import Pictures from "../media/images/images"
import "./Home.css"

const Home: React.FC = () => {
   
    return (
        <IonContent>
            <HomeContainer></HomeContainer>
        </IonContent>

    )
}

export default Home


export const HomeContainer: React.FC=()=>{
    const [startAnim, setstartAnim] = useState(false);

    useIonViewDidEnter(() => {
        setstartAnim(true)
    })
    useIonViewDidLeave(() => {
        setstartAnim(false)
    })
   
    return(
        <IonToolbar style={{ height: `100%` }} color={`light`} >
        <IonToolbar style={{ textAlign: `center`, paddingTop: `20%`, fontSize: `17px`, }} color={`light`}>
        
            <CreateAnimation stop={!startAnim} play={startAnim} duration={500} delay={500} fromTo={[{ property: `transform`, fromValue:`scale(0.93)`, toValue: `scale(1)` }]}>
                <IonCard>
                    <IonImg src={Pictures.dummy2} />
                    <IonCardHeader>
                        <IonCardTitle>You dont have permission to use this section</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonToolbar>
                            <CreateAnimation stop={!startAnim} play={startAnim} delay={800} duration={1000} fromTo={[{ property: `transform`, fromValue:`translateX(-100px)`, toValue:`translateX(0px)` }]}>

                                <Link to={`/signup`}>
                                    <IonButton>Create an Account</IonButton>
                                </Link>
                            </CreateAnimation>
                            <CreateAnimation stop={!startAnim} play={startAnim} delay={900}  duration={900} 
                                  keyframes={[{
                                      offset:0, transform:`translateX(100px)`,},
                                     { offset:0.5, transform:`translateX(50px)`,},
                                     {offset:0.67, transform:`translateX(0px)`,},
                                     {offset:0.7, transform:`translateX(-10px)`,},
                                      {offset:1, transform:`translateX(0px)`,},
                                    ]}
                           
                           >
                                <IonButton routerLink={`/Login`} color={`danger`}>Login to Existing Account</IonButton>
                            </CreateAnimation>
                        </IonToolbar>
                    </IonCardContent>
                </IonCard>
            </CreateAnimation>
        </IonToolbar>
    </IonToolbar>
    )
}