import React, { useEffect, useRef, useState } from "react"
import { IonHeader, IonPage, IonContent, IonImg, IonSlides, IonSlide, IonCard, IonCardHeader, IonCardContent, IonInput, IonItem, IonLabel, IonButton, IonIcon, IonAlert, IonLoading, IonRouterLink, IonPopover, IonAvatar, IonText, IonGrid, IonRow, IonCol, useIonViewWillLeave, useIonViewDidEnter } from "@ionic/react"

import "./SignUp.css"
import { useHistory } from "react-router-dom"
import { mail, logIn, person, eye, eyeOff } from "ionicons/icons"
import app from "firebase"
import { Plugins } from "@capacitor/core"
import firebase, { db, fstore } from "../firebase/Firebase";
import { HapticVibrate } from "../components/MapModal"
import { HideTab } from "../App"
import { useDispatch } from "react-redux"
import { update_user } from "../state/user-state"
import { userInterface } from "./Info"
import { IonFindieImg } from "../components/FindieImg"
const gblock = "https://findieapp.web.app/static/media/class%20(16).ab9b4a21.webp"


const { Storage, Modals } = Plugins




const Login: React.FC = () => {
    const slides = useRef<HTMLIonSlidesElement>(null)
    const content = useRef<HTMLIonContentElement>(null)
    const [offlineUser, setofflineUser] = useState({ name: "", image: person });
    const [offpopover, setoffpopover] = useState(false);
    const [ImageScale, setImageScale] = useState(1);
    const [seePass, setseePass] = useState(false);
    let initAlert = {
        show: false,
        message: "",
        header: "",
        okhandler: () => { }
    }
    const [alert, setalert] = useState(initAlert);
    const link = useRef<HTMLAnchorElement>(null)
    const [loading, setloading] = useState(false);
    const history = useHistory()
    const dispatch = useDispatch()

    async function signIn(email: string, pass: string) {

        try {
            setloading(true)
            const credential = await app.auth().signInWithEmailAndPassword(email, pass);
            const doc = (await fstore.collection(`users`).doc(email).get())

            setloading(false)
            if (!doc.data() || !doc.exists) {
                const uid = credential.user?.uid
                if (uid) {

                    const user: userInterface | undefined | any = await getUserFromDB(uid)
                    if (user) {
                        await fstore.collection(`users`).doc(user.email).set(user)
                        console.log(user)
                        Plugins.Storage.set({ key: `user`, value: JSON.stringify(user) })
                        Storage.set({ key: "userid", value: user.email })
                        history.push(`/guide`)
                        dispatch(update_user(user))
                        setloading(false)
                        return

                    }
                }
                const response = await Modals.confirm({ message: `Your record does not exist, please sign up a new account`, title: `Account not found`, okButtonTitle: `sign in`, cancelButtonTitle: `cancel` })
                if (response.value) {
                    history.push(`/signup`)
                }
                return;
            }
            const user: any = doc.data()
            Plugins.Storage.set({ key: `user`, value: JSON.stringify(user) })
            dispatch(update_user(user))
            history.push(`/guide`)

        } catch (err) {

            loginError(err);
            setloading(false)
        }

    }
    useEffect(() => {
        Plugins.StatusBar.setOverlaysWebView({
            overlay: true
        }).catch(() => { });
    }, [])

    const submit = (event: any) => {
        setloading(true)
        event.preventDefault()
        const email = event.target.email.value.toLowerCase().trim(),
            pass = event.target.pass.value.toLowerCase().trim();
        signIn(email, pass)
    }

    const loginError = async (err: { message: string, code: string }) => {

        setalert({
            show: true,
            header: "login error",
            message: "" + err.message,
            okhandler: () => {
                history.push(`/signup`)
            }
        })

    }
    useIonViewWillLeave(() => {
        setloading(false)
        Plugins.StatusBar.setOverlaysWebView({
            overlay: false
        }).catch(() => { });
    })
    function forgotPass() {
        firebase.auth().sendPasswordResetEmail(prompt("enter your email") + '').then(() => {
            setalert({ header: `reset password`, message: `a password reset link has been sent to your mail`, okhandler: () => { }, show: true })
            firebase.auth().getRedirectResult().then(() => {
                history.push(`/`)

            })
        }).catch((err) => {
            setalert({ header: `password reset failed`, message: err.message, show: true, okhandler: () => { history.push(`/signup`) } })
        })

    }

    function getUserFromDB(uid: string) {
        return (new Promise((resolve, reject) => {
            db.ref(`users`).child(uid).once(`value`, snapshot => {
                const val = snapshot.val();
                if (val) {
                    const user: userInterface = { username: (val.firstName + val.lastName || ``), faculty: val.faculty, email: val.email, image: ``, number: ``, pass: ``, }
                    resolve(user)
                    db.ref(`users`).child(uid).remove()
                    return
                }
                resolve(undefined)
            })
        }))
    }
    async function animateImage(event: any) {
        let scrollElement = await content.current?.getScrollElement()
        if (scrollElement) {
            let height = scrollElement?.scrollHeight - scrollElement?.clientHeight
            let ratio = scrollElement?.scrollTop / height * 1 + 0.5
            setImageScale(ratio >= 1 ? ratio : 1)
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

            <IonPopover isOpen={offpopover} onDidDismiss={() => { setoffpopover(false); HapticVibrate() }}>
                <IonContent>
                    <IonItem>
                        <IonAvatar slot="start">
                            <IonFindieImg className={``}  style={{}} src={offlineUser.image} />
                        </IonAvatar>
                        <IonLabel>{offlineUser.name}</IonLabel>
                    </IonItem>
                    <IonItem className="ion-padding">
                        <IonText>
                            You are currently offline... you will only be able use limited features
                    </IonText>
                        <br />
                    </IonItem>
                    <IonButton routerLink={"/"} onClick={() => { setoffpopover(false); HapticVibrate() }} expand="block">ok, log me in</IonButton>
                </IonContent>
            </IonPopover>
            <IonLoading isOpen={loading} message="verifying" spinner="bubbles" ></IonLoading>
            <IonAlert isOpen={alert.show} buttons={[{ text: "ok", }, { text: "create account", handler: () => alert.okhandler(), role: "ok" },]} message={alert.message} header={alert.header} onDidDismiss={() => { setalert(initAlert) }}></IonAlert>
            <IonHeader></IonHeader>
            <IonContent scrollEvents onIonScroll={animateImage} ref={content}>
                <IonImg style={{ position: `fixed`, transition: `transform 0.25s`, transform: `scale(${ImageScale})` }} src={gblock} />
                <IonSlides ref={slides} className="signup-card">
                    <IonSlide>
                        <IonCard>
                            <IonCardHeader color="primary">
                                Login
                      </IonCardHeader>
                            <IonCardContent>
                                <form onSubmit={submit}>
                                    <IonItem lines="inset" >
                                        <IonIcon slot="start" icon={mail}></IonIcon>
                                        <IonLabel position="floating">Enter email</IonLabel>
                                        <IonInput name="email" />
                                    </IonItem>
                                    {/* <IonItem lines="inset">
                                        <IonIcon slot="start" icon={logIn}></IonIcon>
                                        <IonLabel position="floating">matriculation number</IonLabel>
                                        <IonInput name="code" />
                                    </IonItem> */}
                                    <IonItem lines="inset">
                                        <IonIcon onClick={() => setseePass(!seePass)} slot="start" icon={seePass ? eyeOff : eye}></IonIcon>
                                        <IonLabel position="floating" >password</IonLabel>
                                        <IonInput type={seePass ? `text` : `password`} name="pass" />
                                    </IonItem>
                                    <div className="ion-padding ion-margin-top">
                                        <IonButton type="submit">
                                            <IonLabel>Login</IonLabel>
                                        </IonButton>
                                    </div>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol>
                                                <IonRouterLink routerLink="/signup">
                                                    <IonButton className="ion-padding" style={{ maxWidth: `90%`, fontSize: `11px`, margin: `auto` }} fill={`outline`}>  i dont have an account yet</IonButton>
                                                </IonRouterLink>
                                            </IonCol>
                                            <IonCol>
                                                <p>
                                                    <IonLabel onClick={forgotPass} color="primary" >
                                                        <IonButton className={`ion-margin`} fill={`clear`} style={{ fontSize: `12` }}>forgot password ?</IonButton>
                                                    </IonLabel>
                                                </p>
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </form>
                            </IonCardContent>
                        </IonCard>

                    </IonSlide>

                </IonSlides>
                <a href="/" ref={link}></a>
                <IonButton onClick={() => HapticVibrate()} routerLink={`/teacher`} fill={`clear`} >...</IonButton>
            </IonContent>
        </IonPage>
    )
}

export default Login
