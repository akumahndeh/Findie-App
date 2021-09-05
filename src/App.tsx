import Menu from './components/Menu';
import React, { useEffect, useState } from 'react';
import { IonApp, IonBadge, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
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
import { Header } from './pages/Main';
import { Plugins, StatusBarStyle, PushNotification, PushNotificationToken } from '@capacitor/core';

import Guide, { authUser, authVisitor } from './pages/MenuPages/Guide';
import firebase from 'firebase';
import Tour from './pages/Tour';
import Info, { getStorage, userInterface } from './pages/Info';
import './App.css';


import { book, chatbox, information, peopleCircleOutline, search } from 'ionicons/icons';
import Home from './pages/Home';
import Gist from './pages/Gist';
import Terms from './components/Terms';
import GistEx from './pages/GistEx';
import Login from './pages/Login';
import Feedback from './pages/MenuPages/FeedBack';
import Profile from './pages/MenuPages/Profile';
import SignUp from './pages/SignUp';
import TeacherAdmin from './pages/TeacherAdmin';
import TeacherHome from './pages/TeacherHome';
import Teacher from './pages/Teachers';
import About from './webonly/About';
import { useSelector } from 'react-redux';
import { selectUser } from './state/user-state';
import Recommended from './pages/Helpful';




// Initialize Firebase

const App: React.FC = () => {
  const user: userInterface = useSelector(selectUser)

  useEffect(() => {

    push()
    Plugins.StatusBar.show().catch(console.log)
    Plugins.StatusBar.setStyle({ style: StatusBarStyle.Dark }).catch(console.log)



    initializeTheme()

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


  async function setOnlineStatus() {
    // let onlineUsersRef = firebase.database().ref(`onlineUsers`)
    // let userid = (await getStorage(`userid`)).value
    // if (userid) {
    //   onlineUsersRef.child(userid).set(Date.now())
    //   onlineUsersRef.child(userid).onDisconnect().remove()
    // }
  }



  // useEffect(() => {



  return (
    <IonApp>
      <IonReactRouter>
        {/* <IonSplitPane contentId="main"> */}
        <Menu />
        {/* </IonSplitPane> */}
        
        <IonTabs>
          <IonRouterOutlet mode={`md`} id="main">
            {/* <Route path="/Main" component={Main} exact /> */}

            <Route exact path="/guide" render={() => <IonPage><Header label={``} title={`Guide`} user={{}} /><Guide /></IonPage>} />
            <Route exact path="/tour" component={Tour} />
            {/* <Route exact path="/gist" render={() => <IonPage><Header label={`${getShortName(user?.faculty)}`} title={`Gist`} user={{}} />{isAuth ? <Gist /> : <Home />}</IonPage>} /> */}
            {/* <Route exact path="/info" render={() => <IonPage><Header  label={``} title={`Info`} user={{}} />{user.email ? <Info user={{}} /> : <Home />}</IonPage>} /> */}
            {/* <Route exact path="/info" render={() => <IonPage><Header label={``} title={`Info`} user={{}} /><Info /></IonPage>} /> */}
            <Redirect exact from="/" to={`/about`} />
            <Route path="/Profile" component={Profile} exact />
            <Route path="/recommend" component={Recommended} exact />
            <Route path="/feedback" component={Feedback} exact />
            {/* <Route path="/terms" component={Terms} exact /> */}
            {/* <Route path="/Teachers" component={Teacher} exact />
            <Route path="/TeacherHome" component={TeacherHome} exact />
            <Route path="/Teachers/admin" component={TeacherAdmin} exact /> */}
            {/* <Route path={`/GistEx`} component={GistEx} /> */}
          </IonRouterOutlet>

          <IonTabBar id={`tabbar`} color={`primary`} slot={`bottom`}>
            <IonTabButton href={`/guide`} tab={`guide`}>
              <IonIcon icon={book} />
              <IonLabel>Guide</IonLabel>
            </IonTabButton>
            <IonTabButton href={`/tour`} tab={`tour`}>
              <IonIcon icon={search} />
              <IonLabel>Tour</IonLabel>
            </IonTabButton>
            <IonTabButton href={`/recommend`} tab={`recommend`}>
              <IonIcon icon={peopleCircleOutline} />
              <IonLabel>helpful</IonLabel>
            </IonTabButton>

          </IonTabBar>
        </IonTabs>
        <Route path="/about" component={About} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/signup" component={SignUp} exact />


      </IonReactRouter>


    </IonApp>
  );
};

export default App;

export const HideTab = (value = true) => {
  let tab = document.getElementById(`tabbar`)
  if (tab) {
    if (value) {
      tab.style.setProperty(`visibility`, `hidden`)

    } else {

      tab.style.setProperty(`visibility`, `visible`)
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


function getShortName(text: string | undefined) {

  switch (text) {
    case `A.S.T.I`: return text;
    case `College Of Technology`: return `C.O.T`;
    case `Agriculture and Vertinary medicine`: return `F.A.V.M`;
    case `Arts`: return `Arts`;
    case `engineering and technology`: return `F.E.T`;
    case `Faculty of Education`: return `Education`;
    case `Health Science`: return `F.H.S`;
    case `Social Management Science S.M.S`: return `S.M.S`;
    case `Science`: return `Science`;
    case `H.T.T.T.C`: return `H.T.T.T.C`;
    case `Law and Political Sciences`: return `L.P.S`
    default: return ``
  }
}