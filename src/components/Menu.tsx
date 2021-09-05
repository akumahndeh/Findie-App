import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonAvatar,
  IonImg,
  IonTitle,
  IonRouterLink,
  IonText,
  IonToggle
} from '@ionic/react';

import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { lockClosed, lockClosedSharp, person, heart, heartSharp, information, informationOutline, exitOutline, exitSharp, imagesSharp, starOutline, starSharp, heartOutline, lockClosedOutline, lockOpenOutline } from 'ionicons/icons';
import './Menu.css';
import { Plugins } from '@capacitor/core';
import firebase, { auth, db, fstore } from "../firebase/Firebase";
import { getStorage, openwithInAppBrowser, userInterface } from '../pages/Info';
import { Assets } from '../media/images/images';
import { viewTerms } from './PersonalInfoCard';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, update_user } from '../state/user-state';
import LetterAvatar from './letterAvatar';
import { IonFindieImg } from './FindieImg';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}
const appPagesVisitors: AppPage[] = [
  {
    title: 'Privacy, terms',
    url: 'https://findieapp.web.app/terms',
    iosIcon: lockClosed,
    mdIcon: lockClosedOutline
  },

  {
    title: 'about, help',
    url: '/about',
    iosIcon: informationOutline,
    mdIcon: informationOutline
  },

  {
    title: `log out`,
    iosIcon: exitOutline,
    mdIcon: exitOutline,
    url: `/login`
  }

]
const appPages: AppPage[] = [

  {
    title: 'Privacy, terms',
    url: 'https://findieapp.web.app/terms',
    iosIcon: lockClosed,
    mdIcon: lockClosedOutline
  },

  {
    title: 'about, help',
    url: '/about',
    iosIcon: informationOutline,
    mdIcon: informationOutline
  },
  {
    title: 'feedback, contact',
    url: '/feedback',
    iosIcon: heart,
    mdIcon: heartOutline
  },

  {
    title: `log out`,
    iosIcon: exitOutline,
    mdIcon: exitOutline,
    url: `/login`
  }
];


const Menu: React.FC = (props: any) => {
  let location = useLocation()
  const [MenuLinks, setMenuLinks] = useState(appPagesVisitors);

  const user: userInterface = useSelector(selectUser)
  const [showCreate, setshowCreate] = useState(false);
  const [darkmode, setdarkmode] = useState(false);
  const dispatch = useDispatch()
  const history= useHistory()

  function Toogle() {
    document.body.classList.toggle(`dark`)
    if (document.body.classList.contains(`dark`)) {
      Plugins.StatusBar.setBackgroundColor({ color: `#152b4d` }).catch(console.log)
      Plugins.Storage.set({ key: `dark`, value: `true` })
      setdarkmode(true)
    } else {
      Plugins.StatusBar.setBackgroundColor({ color: `#0d2c6d` }).catch(console.log)
      Plugins.Storage.set({ key: `dark`, value: `false` })
      setdarkmode(false)
    }


  }
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
         history.push(`/login`)
         auth.signInAnonymously()
      }else{

      }
    })
   
    initializeUser()
  }, []);


  function initializeUser() {
    Plugins.Storage.get({ key: "user" }).then(data => {
      if (data.value) {
        let value: userInterface = JSON.parse(data.value)
        dispatch(update_user(value))
        /** ------------------------- database sync -------------------------------- */
        initializeFromDatabase(value)
        if (value.email) {
          setMenuLinks(appPages)
          setshowCreate(false)

        }
        else {

          setshowCreate(true)
        }

      }

    })
  }

  async function initializeFromDatabase(profile: userInterface) {

    let doc = (await fstore.collection(`users`).doc(profile.email).get())
    if (doc.data() && doc.exists) {
      const userdata: userInterface | any = doc.data()
      dispatch(update_user(userdata))
      Plugins.Storage.set({ key: `user`, value: JSON.stringify(userdata) })
    }
  }


  async function initializeTheme() {
    let darktheme = await getStorage(`dark`)
    if (darktheme.value === `true`) {
      setdarkmode(true)
    }
    else {
      setdarkmode(false)
    }
  }
  initializeTheme()

  return (
    <IonMenu contentId="main" type="overlay" >
      <IonContent >
        <IonMenuToggle autoHide={false}>
          <IonRouterLink routerLink={`Profile`} >
            <div style={{ backgroundImage: ` url(${user.image || Assets.logo})` }} className="list-head">
              <IonList id="inbox-list" color="secondary" >
                <div style={{ width: `30%`, margin: `auto` }}>
                  {(user.username && !user.image) && <LetterAvatar props={{ name: user.username, size: 70 }}></LetterAvatar>
                  }
                </div>
                {(!user.username || user.image) && <IonAvatar style={(!user.image && !user.username) ? { background: `white` } : {}}>
                  <IonFindieImg className={``} style={{}} src={user.image || Assets.logo}></IonFindieImg>
                </IonAvatar>}
                <br />
                <IonListHeader><IonTitle>{user.username}</IonTitle></IonListHeader>
                <IonNote></IonNote>
              </IonList>
            </div></IonRouterLink>
        </IonMenuToggle>
        <IonList>

          <IonItem>
            <IonLabel>Dark Theme </IonLabel>
            <IonToggle checked={darkmode} onIonChange={Toogle}></IonToggle>
          </IonItem>
          <IonMenuToggle autoHide={false}>
            <IonItem href={`https://play.google.com/store/apps/details?id=app.web.findieapp`} target={`__blank`} detail >
              <IonIcon slot="start" icon={starOutline} />
              <IonLabel className="ion-margin-top">Rate us</IonLabel>
            </IonItem>


          </IonMenuToggle>
          {MenuLinks.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                {appPage.url != 'https://findieapp.web.app/terms' ? <IonItem className={"ion-padding-top" + location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="forward" lines="inset" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel className="ion-margin-top">{appPage.title}</IonLabel>
                </IonItem> : <IonItem onClick={viewTerms} className={"ion-padding-top" + location.pathname === appPage.url ? 'selected' : ''} routerLink={`/`} routerDirection="forward" lines="inset" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel className="ion-margin-top">{appPage.title}</IonLabel>
                </IonItem>

                }
              </IonMenuToggle>
            );
          })}

          {showCreate && <IonMenuToggle autoHide={false}>
            <IonItem href={`/signup`}   >
              <IonIcon slot="start" icon={lockOpenOutline} />
              <IonLabel className="ion-margin-top">Create Account</IonLabel>
            </IonItem>
          </IonMenuToggle>}
        </IonList>

      </IonContent>
    </IonMenu>
  );
};

export default Menu;
