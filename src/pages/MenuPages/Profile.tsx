import React, { useEffect, useState } from "react"
import { IonPage, IonContent, IonAvatar, IonImg, IonItem, IonLabel, IonPopover, IonButton, IonIcon, IonLoading, IonBackButton, IonCol, IonGrid, IonRow, IonTitle, IonToolbar, IonCard, IonCardHeader, IonFab, IonNote, CreateAnimation, IonInput, IonToggle, IonItemDivider, useIonViewDidEnter, useIonViewWillLeave, IonProgressBar } from "@ionic/react"

import "./Profile.css"
import { Plugins } from "@capacitor/core"
import { arrowBack, book, bookmarks, callOutline, cameraOutline, locate, logoWhatsapp, mail, paperPlane, paperPlaneSharp, person, school } from "ionicons/icons"
import { Assets } from "../../media/images/images"
import { galleryOption } from "../../components/GistModal"
import { getStorage, userInterface } from "../Info"
import firebase, { fstore } from "../../firebase/Firebase";
import { HomeContainer } from "../Home"
import ViewPicture from "../../components/ViewPicture"
import { useHistory } from "react-router"
import { HideTab } from "../../App"
import { useSelector } from "react-redux"
import { selectUser } from "../../state/user-state"
import { storage } from "../../firebase/Firebase"
import LetterAvatar from "../../components/letterAvatar"
import { FindieImg } from "../../components/FindieImg"

const { Modals } = Plugins
const Profile: React.FC = () => {
    const [image, setimage] = useState(Assets.logo);
    const user: userInterface = useSelector(selectUser)
    const [popover, setpopover] = useState(false);
    const [animate, setanimate] = useState(false);
    const [] = useState(false);
    const [imageView, setimageView] = useState<string>();
    const [visible, setvisible] = useState(false);
    const [contactme, setcontactme] = useState(false);
    const history = useHistory()




    useEffect(() => {
        Plugins.StatusBar.setOverlaysWebView({
            overlay: true
        }).catch(() => { });
        initializeSettings()
    }, [])

    async function initializeSettings() {
        let isvisible = await getStorage(`visible`)
        let cancontact = await getStorage(`contactme`)
        if (isvisible.value) {
            setvisible(true)
        }
        if (cancontact.value) {
            setcontactme(true)
        }

    }

    function goBack() {
        history.goBack()
    }

   

    async function updateImg() {
        try {
            const photo = await Plugins.Camera.getPhoto(galleryOption)
            if (!photo?.dataUrl) {
                return;
            }
            setloading(true)
            const blob = await (await fetch(photo.dataUrl)).blob()
            await storage.ref(`users/profile/${user.email}`).put(blob)
            const url = await storage.ref(`users/profile/${user.email}`).getDownloadURL()
            if (!url) return;
            fstore.collection(`users`).doc(user.email).update({ image: url })
            setloading(false)
        }
        catch (err) {
            Modals.alert({ message: err.message || err || `unexpected error occurred`, title: `Upload Error` })
            setloading(false)
        }
    }
    useIonViewDidEnter(() => {
        HideTab(true)
    })
    useIonViewWillLeave(() => {
        HideTab(false)
    })
    const [loading, setloading] = useState(false);
    return (
        <IonPage>
            <IonContent scrollY className={`profile-content`}>

                <MenuLinkHeader title="Profile"></MenuLinkHeader>
                <div className="content">
                    <div className="dp-con" style={{ background: `#333a46` }}>
                       {!user.image&& <div style={{ height: `100px` }}></div>}
                        {user.image && <img className={`dp`} alt="" onClick={() => setimageView(image)} src={user.image} />}
                    </div>
                    <div style={{ textAlign: `center` }}>
                        <IonButton style={{ transform: `translateY(-40px)` }} onClick={() => updateImg()} fill={`clear`} color={`primary`}>
                            <IonIcon size={`large`} icon={cameraOutline} />
                        </IonButton>
                    </div>
                    <IonCard className={`profile-card`}>
                       {loading&& <IonProgressBar type={`indeterminate`} ></IonProgressBar>}
                        <IonCardHeader>
                            <IonTitle color={`primary`}>{user.username}</IonTitle>
                            <IonItem lines={`inset`}>
                                <IonIcon slot={`start`} icon={mail}></IonIcon>
                                <IonLabel>
                                    <IonNote>{user.email}</IonNote>
                                </IonLabel>
                            </IonItem>
                        </IonCardHeader>

                        {user.email ? <UserProfile profile={user}></UserProfile>

                            :
                            <>
                                <IonItem color={"light"} className="ion-padding-start"><IonLabel>visitor</IonLabel></IonItem>
                                <div className="ion-padding">
                                    <IonButton routerLink={`/signup`}>signup for an account</IonButton>
                                    <IonButton routerLink={`/login`} color={`danger`}>login to existing account</IonButton>
                                </div>
                            </>}

                        {/* <IonItemDivider className={`settings`}>
                            <IonTitle color={`primary`}>Settings</IonTitle>
                        </IonItemDivider>
                        <IonItem>
                            <IonIcon color={`primary`} slot={`start`} icon={paperPlaneSharp}></IonIcon>
                            <IonLabel >
                                <IonNote color={`dark`}>Allow others to contact you</IonNote>
                            </IonLabel>
                            <IonToggle onIonChange={(event) => saveChange(`contactme`, event.detail)} checked={contactme}></IonToggle>
                        </IonItem> */}
                    </IonCard>
                    <IonFab style={{margin:`30px`}} horizontal={`end`} vertical={`top`} >
                        <div onClick={() => updateImg()} className={`fab-image`}>
                            {user.image && <IonAvatar>
                                <IonImg src={user?.image} />
                            </IonAvatar>}
                            {user.username && !user.image && <div onClick={() => updateImg()} style={{ width: `70px`, margin: `auto` }}>
                                {(user.username && !user.image) && <LetterAvatar props={{ name: user.username, size: 70 }}></LetterAvatar>
                                }
                            </div>}
                        </div>
                    </IonFab>
                    <IonItem lines={`none`} color={`none`} className={`goback`}>
                        <IonButton onClick={goBack} size={`large`} color={`light`} fill={`clear`}>
                            <IonIcon color={`light`} icon={arrowBack} />
                        </IonButton>
                        <IonTitle color={`light`}>Profile</IonTitle>

                    </IonItem>
                </div>
                {!user.email && <HomeContainer />}
                <ViewPicture isOpen={imageView != undefined} description={`YOUR PROFILE PICTURE`} imageRef={imageView ? imageView : ``} OndidDismiss={() => setimageView(undefined)} />
            </IonContent>
            <IonPopover isOpen={popover} onDidDismiss={() => setpopover(false)} >
                <FindieImg  className={``} style={{}}  src={image} />
            </IonPopover>
        </IonPage>
    )
}

export default Profile;

const MenuLinkHeader: React.FC<{ title: string }> = (props) => {
    return (

        <div className={`pro`}>
            <IonToolbar color="primary">
                <IonGrid>
                    <IonRow>
                        <IonCol size="2">
                            <IonBackButton defaultHref={`/`}></IonBackButton>

                        </IonCol>
                        <IonCol className="ion-padding-top">
                            <IonTitle>{props.title}</IonTitle>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonToolbar>
        </div>
    )
}


const UserProfile: React.FC<{ profile: userInterface | undefined }> = ({ profile }) => {
    const [animate, setanimate] = useState(false);
    const [edit] = useState(false);
    useEffect(() => {

        if (profile) {
            setanimate(true)
        }
    }, []);

    return (
        <>
            <CreateAnimation delay={1000} stop={!animate} easing={`ease-out`} play={animate} fromTo={[{ fromValue: `translateX(-100px)`, toValue: `translateX(0)`, property: `transform` }, { fromValue: `0`, toValue: `1`, property: `opacity` }]} duration={600}>
                {<IonItem lines={edit ? `full` : `inset`}>
                    <IonIcon color={`primary`} slot={`start`} icon={callOutline} />
                    {!edit ?
                        <IonLabel>
                            {profile?.number || `not set`}
                        </IonLabel> :
                        <IonInput value={profile?.number} />
                    }
                </IonItem>}
                <IonItem disabled={!edit}>
                    <IonIcon color={`primary`} slot={`start`} icon={book} />
                    <IonLabel className={`caps`}>
                        {profile?.faculty}
                    </IonLabel>
                </IonItem>

            </CreateAnimation>
        </>
    )
}