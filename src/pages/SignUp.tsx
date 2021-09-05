import React, { useRef, useState } from "react"
import { IonHeader, IonPage, IonContent, IonImg, IonSlides, IonSlide, IonAlert, IonLoading, IonFab, IonFabButton, IonLabel, IonIcon, useIonViewDidLeave, useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react"

import "./SignUp.css"
import PersonalInfoCard from "../components/PersonalInfoCard"
import ProfileCard from "../components/ProfileCard"
import { VisitorCard } from "../components/BusinessCard"
import app from "firebase"
import { Plugins } from "@capacitor/core"
import { arrowBack } from "ionicons/icons"
import { HideTab } from "../App"

const  gblock = "https://findieapp.web.app/static/media/class%20(16).ab9b4a21.webp"

let { Storage } = Plugins

interface profilecardInterface {
  proff: string,
  image: string,
  code: string
}


const SignUp: React.FC = () => {
  const slides = useRef<HTMLIonSlidesElement>(null)
  const content = useRef<HTMLIonContentElement>(null)
  const [proffcode, setproffcode] = useState("");
  const [profileInfo, setprofileInfo] = useState<profilecardInterface>();
  const [alert, setalert] = useState({ open: false, message: "", header: "" });
  const link = useRef<HTMLAnchorElement>(null)
  const [loading, setloading] = useState(false);
  const [ImageScale, setImageScale] = useState(1);

  function Slide(profInfo: profilecardInterface) {

    slides.current?.slideTo(1)
    content.current?.scrollToTop(800)
    setprofileInfo(profInfo)


  }
  async function animateImage(event: any) {
    let scrollElement = await content.current?.getScrollElement()
    if (scrollElement) {
      let height = scrollElement?.scrollHeight - scrollElement?.clientHeight
      let ratio = scrollElement?.scrollTop / height * 1 +0.2
      setImageScale(ratio >= 1 ? ratio : 1)
  }
  }
  function convertToEnglish(code: string) {
    return (
      code == "ion-rb-0" ? "student" : code == "ion-rb-2" ? "business" : "staff"
    )
  }
  function getUserInfo(userInfo: any) {

    const user = ({ ...userInfo, ...profileInfo, proff: convertToEnglish(profileInfo?.proff + ""), advert: true })
    setloading(true)
   
  }
  useIonViewDidLeave(() => {
    setloading(false)
    Plugins.StatusBar.setOverlaysWebView({
      overlay: false
    }).catch(() => { });
  })
  const switchCode = (option: string) => {
    setproffcode(option)
  }
  app.auth().languageCode = 'it';
  app.auth().useDeviceLanguage();
  useIonViewDidEnter(() => {
    Plugins.StatusBar.setOverlaysWebView({
      overlay: true
    }).catch(console.log)
  })
  useIonViewDidEnter(() => {
    HideTab(true)
  })
  useIonViewWillLeave(() => {
    HideTab(false)
  })

  return (
    <IonPage>
      <IonFab className={`ion-margin`}>
        <IonFabButton routerDirection={`back`} routerLink={`/Login`}><IonIcon icon={arrowBack} /><IonLabel>Login</IonLabel></IonFabButton>
      </IonFab>
      <IonLoading onDidDismiss={() => setloading(false)} isOpen={loading && !alert.open} message="please wait..." spinner="bubbles" ></IonLoading>
      <IonHeader></IonHeader>
      <IonContent scrollEvents onIonScroll={animateImage} ref={content}>
        <IonImg style={{ transform: `scale(${ImageScale})`, transition: `transform 0.24s` }} className={`back-img`} alt="" src={gblock} />
        <IonSlides className="signup-card" ref={slides} >
          <IonSlide>
            <ProfileCard switchCode={switchCode} next={Slide} />
          </IonSlide>
          <IonSlide className={`input-card`}>
            {proffcode == "ion-rb-1" ? <VisitorCard /> : <PersonalInfoCard getUserInfo={getUserInfo}></PersonalInfoCard>}


          </IonSlide>
          <IonAlert message={alert.message} header={alert.header} isOpen={alert.open} onDidDismiss={() => setalert({ open: false, message: "", header: "" })}></IonAlert>
        </IonSlides>
        <a href="/" ref={link} ></a>
      </IonContent>

    </IonPage>
  )
}

export default SignUp
