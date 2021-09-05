import { Plugins } from "@capacitor/core";
import { CreateAnimation, IonButton, IonContent, IonFab, IonIcon, IonPage, IonSlide, IonSlides, useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react";
import { book, chatboxEllipses, informationCircle, search } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { HideTab } from "../App";
import { HapticVibrate } from "../components/MapModal";
import { getStorage } from "../pages/Info";
import "./About.css";

const { Storage } = Plugins
const About: React.FC = () => {
  let history = useHistory()
  const slidesRef = useRef<HTMLIonSlidesElement>(null)


  const [endOfSlide, setendOfSlide] = useState(false);

  const slideChanged = async function () {
    let activeIndex = (await slidesRef.current?.getActiveIndex())
    if (activeIndex) {

      setendOfSlide(activeIndex == 4 ? true : false)
    }
  }
  useEffect(() => {
    initUser()
  }, [])

  async function initUser() {
    const user = (await Storage.get({ key: `user` })).value
    if (user) {
      history.push(`/guide`)
    }
  }
  useIonViewDidEnter(() => {
    HideTab(true)
  })
  useIonViewWillLeave(() => {
    HideTab(false)
  })
  return (
    <IonPage>
      <IonContent className={`about-content`}>
        <IonSlides onIonSlideTap={() => slidesRef.current?.slideNext()} onIonSlideDidChange={slideChanged} pager ref={slidesRef} options={{ slidesPerView: 1 }} className={`slides`}>
          <IonSlide >
            <div className="one">
              Findie Helps you know important facts about UB
                          <div className="icon">
                <IonIcon icon={book} />
                <label>Guide</label>
              </div>
            </div>
          </IonSlide>
          <IonSlide>
            <div className="two">
              Findie Helps you find your way about the university of buea
                      <div className="icon">
                <IonIcon icon={search} />
                <label>Tour</label>
              </div>
            </div>
          </IonSlide>
          <IonSlide>
            <div className="three">
              communicate with your faculty members and share your stories
                      <div className="icon">
                <IonIcon icon={chatboxEllipses} />
                <label>Gist</label>
              </div> </div>
          </IonSlide>
          <IonSlide>
            <div className="four">
              Recieve anouncements from your faculty
                      <div className="icon">
                <IonIcon icon={informationCircle} />
                <label>info</label>
              </div></div>
          </IonSlide>
          <IonSlide>
            <div className="four">
              The university of buea in your hands
                      <div className="icon">
                <IonButton routerLink={`/login`}>
                  Go It
                        </IonButton>
              </div>
            </div>
          </IonSlide>


        </IonSlides>
        {!endOfSlide && <IonFab vertical={`bottom`} horizontal={`center`}>
          <IonButton style={{ marginTop: `-25vh` }} onClick={() => { slidesRef.current?.slideNext() }}>Next</IonButton>

        </IonFab>}

      </IonContent>
    </IonPage>
  )
}

export default About



/**
 *
 *  <IonHeader>
                <IonToolbar color={`primary`}>
                    <IonTitle>Findie</IonTitle>
                    <IonButtons slot={`end`}>
                    <IonButton>About</IonButton>
                        <IonButton>Mission</IonButton>
                        <IonButton>Products</IonButton>
                        <IonButton>Contact</IonButton>
                        <IonButton>Donate</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
               <IonToolbar className={`hero`}>
               <IonImg src={Classes[1].mainpic}/>
               <div className="dark-back">
                   <h3>A solution provider for Cameroonian students</h3>
               </div>

               </IonToolbar>
               <IonGrid>
                   <IonRow>
                       <IonCol></IonCol>
                       <IonCol size={`9`} className={`min-col`}>
                           <p >
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ipsam qui pariatur optio sunt sequi asperiores voluptatibus id tempore, beatae ullam corporis tenetur reprehenderit omnis eius ab illum laborum. Dolorum?
                   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur laudantium at, sed et dolorum unde sapiente cumque facere repellat doloremque dolorem? Facilis sunt est quos delectus ipsum consectetur amet doloremque.
                </p>
               <p >
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ipsam qui pariatur optio sunt sequi asperiores voluptatibus id tempore, beatae ullam corporis tenetur reprehenderit omnis eius ab illum laborum. Dolorum?
                   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur laudantium at, sed et dolorum unde sapiente cumque facere repellat doloremque dolorem? Facilis sunt est quos delectus ipsum consectetur amet doloremque.
                </p>
               <p >
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ipsam qui pariatur optio sunt sequi asperiores voluptatibus id tempore, beatae ullam corporis tenetur reprehenderit omnis eius ab illum laborum. Dolorum?
                   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur laudantium at, sed et dolorum unde sapiente cumque facere repellat doloremque dolorem? Facilis sunt est quos delectus ipsum consectetur amet doloremque.
                </p>
                <h2>Mission</h2>
                <p >
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ipsam qui pariatur optio sunt sequi asperiores voluptatibus id tempore, beatae ullam corporis tenetur reprehenderit omnis eius ab illum laborum. Dolorum?
                   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur laudantium at, sed et dolorum unde sapiente cumque facere repellat doloremque dolorem? Facilis sunt est quos delectus ipsum consectetur amet doloremque.
                </p>
               <p >
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ipsam qui pariatur optio sunt sequi asperiores voluptatibus id tempore, beatae ullam corporis tenetur reprehenderit omnis eius ab illum laborum. Dolorum?
                   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur laudantium at, sed et dolorum unde sapiente cumque facere repellat doloremque dolorem? Facilis sunt est quos delectus ipsum consectetur amet doloremque.
                </p>
               <p >
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ipsam qui pariatur optio sunt sequi asperiores voluptatibus id tempore, beatae ullam corporis tenetur reprehenderit omnis eius ab illum laborum. Dolorum?
                   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur laudantium at, sed et dolorum unde sapiente cumque facere repellat doloremque dolorem? Facilis sunt est quos delectus ipsum consectetur amet doloremque.
                </p>
                <h2>Products</h2>
                <p >
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ipsam qui pariatur optio sunt sequi asperiores voluptatibus id tempore, beatae ullam corporis tenetur reprehenderit omnis eius ab illum laborum. Dolorum?
                   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur laudantium at, sed et dolorum unde sapiente cumque facere repellat doloremque dolorem? Facilis sunt est quos delectus ipsum consectetur amet doloremque.
                </p>
               <p >
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ipsam qui pariatur optio sunt sequi asperiores voluptatibus id tempore, beatae ullam corporis tenetur reprehenderit omnis eius ab illum laborum. Dolorum?
                   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur laudantium at, sed et dolorum unde sapiente cumque facere repellat doloremque dolorem? Facilis sunt est quos delectus ipsum consectetur amet doloremque.
                </p>
               <p >
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ipsam qui pariatur optio sunt sequi asperiores voluptatibus id tempore, beatae ullam corporis tenetur reprehenderit omnis eius ab illum laborum. Dolorum?
                   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur laudantium at, sed et dolorum unde sapiente cumque facere repellat doloremque dolorem? Facilis sunt est quos delectus ipsum consectetur amet doloremque.
                </p>

                <h2>Contacts</h2>
                <p >
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ipsam qui pariatur optio sunt sequi asperiores voluptatibus id tempore, beatae ullam corporis tenetur reprehenderit omnis eius ab illum laborum. Dolorum?
                   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur laudantium at, sed et dolorum unde sapiente cumque facere repellat doloremque dolorem? Facilis sunt est quos delectus ipsum consectetur amet doloremque.
                </p>
               <p >
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ipsam qui pariatur optio sunt sequi asperiores voluptatibus id tempore, beatae ullam corporis tenetur reprehenderit omnis eius ab illum laborum. Dolorum?
                   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur laudantium at, sed et dolorum unde sapiente cumque facere repellat doloremque dolorem? Facilis sunt est quos delectus ipsum consectetur amet doloremque.
                </p>
               <p >
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ipsam qui pariatur optio sunt sequi asperiores voluptatibus id tempore, beatae ullam corporis tenetur reprehenderit omnis eius ab illum laborum. Dolorum?
                   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur laudantium at, sed et dolorum unde sapiente cumque facere repellat doloremque dolorem? Facilis sunt est quos delectus ipsum consectetur amet doloremque.
                </p>
               </IonCol>
                       <IonCol></IonCol>
                   </IonRow>
               </IonGrid>

            </IonContent>
 */