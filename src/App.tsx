import Menu from './components/Menu';
import React, { useEffect, useState } from 'react';
import { IonApp, IonBadge, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonSplitPane, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Main, { Header } from './pages/Main';
import { Plugins, StatusBarStyle, Capacitor, PushNotification, PushNotificationToken } from '@capacitor/core';
import Profile from './pages/MenuPages/Profile';
import SignUp from './pages/SignUp';

import Login from './pages/Login';
import TourInfo from './pages/TourInfo';
import Feedback from './pages/MenuPages/FeedBack';
import GuideInfo from './pages/GuideInfo';
import MyPost from './pages/MenuPages/MyPost';
import Terms from './components/Terms';
import GistEx from './pages/GistEx';
import Guide, { authUser, authVisitor } from './pages/MenuPages/Guide';
import TeacherAdmin from './pages/TeacherAdmin';
import Teacher from './pages/Teachers';
import TeacherHome from './pages/TeacherHome';
import firebase from 'firebase';
import About from './webonly/About';
import Tour from './pages/Tour';
import Gist from './pages/Gist';
import Info, { getStorage, notifyUser, userInterface } from './pages/Info';
import './App.css';


import { book, bookOutline, chatbox, chatboxOutline, information, informationOutline, search, searchOutline } from 'ionicons/icons';
import { HapticVibrate } from './components/MapModal';
import Home from './pages/Home';



var firebaseConfig = {
  apiKey: "AIzaSyAjUdWh1UVBBVtUf9GVtBVb6CZT6c9epw4",
  authDomain: "findieapp.firebaseapp.com",
  databaseURL: "https://findieapp.firebaseio.com",
  projectId: "findieapp",
  storageBucket: "findieapp.appspot.com",
  messagingSenderId: "932527026886",
  appId: "1:932527026886:web:be0900678804038cdaddc7",
  measurementId: "G-X6DYVWTFB5"
};
// Initialize Firebase

const App: React.FC = () => {

  if (firebase.apps.length <= 0) {
    firebase.initializeApp(firebaseConfig)
    firebase.analytics()
  }
  const [isAuth, setisAuth] = useState(true);
  const [newgist, setnewgist] = useState(false);

  useEffect(() => {
 
    push()
    Plugins.StatusBar.show().catch(console.log)
    Plugins.StatusBar.setStyle({ style: StatusBarStyle.Dark }).catch(console.log)
    // Plugins.SplashScreen.show({fadeInDuration:600,fadeOutDuration:700,showDuration:2000}).catch(console.log)
    // if (Capacitor.isNative) {
    //   Plugins.App.addListener(`backButton`, async () => {
    //     if (window.location.pathname == `/tour`) {
    //       let value = await Plugins.Modals.confirm({ message: `Are you sure you want to Exit App?`, title: `Exit`, })
    //       if (value.value) {
    //         Plugins.App.exitApp()
    //       }
    //     }

    //   })

    // }
    authUser().catch(() => authVisitor().catch(err => {
      Plugins.Toast.show({ text: err.message })

    }))


    initializeTheme()
    setOnlineStatus()
    async function push() {

      try {
        await Plugins.PushNotifications.register()
        Plugins.PushNotifications.addListener(`registration`, (token: PushNotificationToken) => {
          console.log(`token`, token)
        })
        Plugins.PushNotifications.addListener(`registrationError`, (error: any) => {
          console.log(`error`, error)
          Plugins.Toast.show({ text: error })
        })
        Plugins.PushNotifications.addListener(`pushNotificationReceived`, (notif: PushNotification) => {
          console.log(`notif recieved`, notif)
        })
        Plugins.PushNotifications.addListener(`pushNotificationActionPerformed`, (notif) => {
          console.log(`notif performed`, notif)
        })
        Plugins.Toast.show({ text: `UB in your hands`, duration: `long` })

      } catch (err) {
        Plugins.Toast.show({ text: err })

      }
    }



  }, []);


  async function setOnlineStatus(){
    let onlineUsersRef= firebase.database().ref(`onlineUsers`)
    let userid=(await getStorage(`userid`)).value
    if(userid){
    onlineUsersRef.child(userid).set(Date.now())
    onlineUsersRef.child(userid).onDisconnect().remove()
    }
   }

  useEffect(() => {
    Plugins.Storage.get({ key: "user" }).then((user) => {
      if (user.value) {
        setisAuth(true)
      } else {
        setisAuth(false)
        firebase.auth().signInAnonymously()

      }


    })

  }, []);

  useEffect(() => {
   
    

    getStorage(`lastgist`).then(async (res) => {
      let value = res.value
      let userval = ((await getStorage(`user`)).value)
     
      if (userval) {
        let user: userInterface = JSON.parse(userval)
        

        firebase.database().ref(`/gistIndex`).child(user?.faculty).limitToLast(1).once(`value`, async(snapshot) => {
          let val = snapshot.val()

          if (val) {
            let key = Object.keys(val)[0]
            let senderInfoString=(await getStorage(val[key])).value
            let message=`New photo on Findie📸 `+val[key], title=`New Gist`
            let url=``
            if(senderInfoString){
              let senderInfo:userInterface=JSON.parse(senderInfoString)
              url=senderInfo.image
              title=senderInfo.firstName+` `+senderInfo.lastName
                message=`📸 Posted a new Gist on Findie, check it out`
            }
            if (value) {
              console.log(key,value,`key-value`)
              if (key != value) {
                notifyUser(title, message + ``,url)
                setnewgist(true)
              }
            } else {
              notifyUser(title, message + ``,url)
              setnewgist(true)
            }
            console.log(key)
            Plugins.Storage.set({ key: `lastgist`, value: JSON.stringify(key) }) 
            
          }


          // firebase.database().ref(`/gistIndex`).child(user?.faculty).on(`child_added`, snapshot => {
          //   let snapval = snapshot.val()
          //   if (snapval) {
          //     let key = Object.keys(snapval)[0]
          //     let message = snapval[key]
          //     notifyUser(`New Gist`, message + ``)
          //     setnewgist(true)
          //     Plugins.Storage.set({ key: `lastgist`, value: key })
          //   }



          // })
        })
      }
    })
  }, []);
  return (
    <IonApp>
      <IonReactRouter>
        {/* <IonSplitPane contentId="main"> */}
        <Menu  />
        {/* </IonSplitPane> */}
        <IonTabs>
          <IonRouterOutlet  mode={`md`} id="main">
            {/* <Route path="/Main" component={Main} exact /> */}

            <Route exact path="/guide" render={() => <IonPage><Header title={`Guide`} user={{}} /><Guide /></IonPage>} />
            <Route exact path="/tour" render={() => <Tour />} />
            <Route exact path="/gist" render={() => <IonPage><Header title={`Gist`} user={{}} />{isAuth ? <Gist /> : <Home />}</IonPage>} />
            <Route exact path="/info" render={() => <IonPage><Header title={`Info`} user={{}} />{isAuth ? <Info user={{}} /> : <Home />}</IonPage>} />
            <Route exact path="/" render={() => <IonPage><Header title={`Guide`} user={{}} /><Guide /></IonPage>} />

          </IonRouterOutlet>

          <IonTabBar id={`tabbar`} selectedTab={`tour`} onClick={() => HapticVibrate()} color={`primary`} slot={`bottom`}>
            {/* <IonTabButton style={{display:`none`}} href={`/tour`} tab={`tour`}>
              <IonIcon icon={search} />
              <IonLabel>Tour</IonLabel>
            </IonTabButton> */}
            <IonTabButton href={`/guide`} tab={`guide`}>
              <IonIcon icon={book} />
              <IonLabel>Guide</IonLabel>
            </IonTabButton>
            <IonTabButton href={`/tour`} tab={`tour`}>
              <IonIcon icon={search} />
              <IonLabel>Tour</IonLabel>
            </IonTabButton>
            <IonTabButton href={`/gist`} tab={`gist`}>
              <IonIcon onClick={() => { if (newgist) setnewgist(false) }} icon={chatbox} />
              <IonLabel onClick={() => { if (newgist) setnewgist(false) }}>Gist</IonLabel>
              {newgist && <IonBadge color={`danger`}></IonBadge>}
            </IonTabButton>
            <IonTabButton href={`/info`} tab={`info`}>
              <IonIcon icon={information} />
              <IonLabel>Info</IonLabel>
            </IonTabButton>

          </IonTabBar>
        </IonTabs>

        <Route path="/Profile" component={Profile} exact />
        <Route path="/signup" component={SignUp} exact />
        <Route path="/feedback" component={Feedback} exact />
        <Route path="/about" component={About} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/terms" component={Terms} exact />
        <Route path="/Teachers" component={Teacher} exact />
        <Route path="/TeacherHome" component={TeacherHome} exact />
        <Route path="/Teachers/admin" component={TeacherAdmin} exact />
        <Route path={`/GistEx`} component={GistEx} />

      </IonReactRouter>


    </IonApp>
  );
};

export default App;

export const HideTab = (value = true) => {
  let tab = document.getElementById(`tabbar`)
  if (tab) {
    if (value)
      tab.style.setProperty(`display`, `none`)
    else {
      tab.style.setProperty(`display`, `flex`)

    }
  }
}

export async function initializeTheme() {
  let theme = await getStorage(`dark`)
  if (theme.value === `true`) {
    Plugins.StatusBar.setBackgroundColor({ color: `#152b4d` }).catch(console.log)
    document.body.classList.add(`dark`)
  }
  else {
    Plugins.StatusBar.setBackgroundColor({ color: `#0d2c6d` }).catch(console.log)
    document.body.classList.remove(`dark`)

  }



}

//<Linkify>See examples at tasti.github.io/react-linkify/.</Linkify>

// if (val) {
        //   let key = Object.keys(val)[0]
        //   let message = val[key]
        //   if (value) {

        //     if (key != value) {
        //       notifyUser(`New Gist`, message + ``)
        //       setnewgist(true)
        //     }
        //   } else {
        //     notifyUser(`New Gist`, message + ``)
        //     setnewgist(true)
        //   }
        //   Plugins.Storage.set({key:`lastgist`,value:key})
        // }
