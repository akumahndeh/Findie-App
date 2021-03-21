import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import React from "react"
import { Link } from "react-router-dom";
import { Assets } from "../../media/images/images";

const About:React.FC=()=>{
    return(
        <IonPage>
            <IonHeader>
             <IonToolbar color="primary">
             <IonButtons slot="start">
            <IonBackButton ></IonBackButton>
            </IonButtons>    
            <IonTitle>About</IonTitle>
             </IonToolbar>
           </IonHeader>
           <IonContent>
               <div style={{textAlign:"center"}}>
                   <img alt="" src={Assets.logo}/>
               </div>
               <div className="ion-padding">
                  <div className="ion-margin-start">
                      findie is a mobile application that assists students in the university of buea. it also promotes socialization and
                      adverts. it includes a :
                      <ul>
                         <li><Link to="/">home</Link> section to allow adverts</li>
                         <li><Link to="/">tour</Link> section to aid student navigation on capus</li>
                          <li><Link to="/">info</Link> section for important faculty announcements</li>
                          <li> <Link to="/">Gist</Link> section for socialization between members of the same faculty</li>
                            <li><Link to="/profile">profile</Link> for users personal info</li>
                          <li><Link to="/feedback">feedback</Link> section to allow you to give us feedbacks on how helpful the app is and how it can be inproved</li>
                         
                      </ul>
                  </div>
                 
               </div>
               <div className="ion-padding">
                   <p className="ion-padding">
                       created october 2020
                   </p>
               </div>
               
           </IonContent>
        </IonPage>
    )
}
export default About;