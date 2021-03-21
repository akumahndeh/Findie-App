import React, { useEffect, useState } from "react"
import { IonPage, IonContent, IonAvatar, IonImg, IonItem, IonLabel, IonPopover, IonButton, IonIcon, IonLoading, IonBackButton, IonCol, IonGrid, IonRow, IonTitle, IonToolbar, IonCard, IonCardHeader, IonFab, IonNote, CreateAnimation, IonInput, IonToggle, IonItemDivider } from "@ionic/react"

import "./Profile.css"
import { Plugins } from "@capacitor/core"
import { arrowBack, book, bookmarks, callOutline, cameraOutline, locate, logoWhatsapp, mail, paperPlane, paperPlaneSharp, person, school } from "ionicons/icons"
import { Assets } from "../../media/images/images"
import { galleryOption } from "../../components/GistModal"
import { getStorage, userInterface } from "../Info"
import firebase from "firebase"
import { HomeContainer } from "../Home"
import ViewPicture from "../../components/ViewPicture"
import { useHistory } from "react-router"

const Profile: React.FC = () => {
    const [image, setimage] = useState(Assets.logo);
    const [userInfo, setuserInfo] = useState<any[]>([]);
    const [popover, setpopover] = useState(false);
    const [profile, setprofile] = useState<userInterface>();
    const [animate, setanimate] = useState(false);
    const [] = useState(false);
    const [imageView, setimageView] = useState<string>();
    const [visible, setvisible] = useState(false);
    const [contactme, setcontactme] = useState(false);
    const history = useHistory()

    useEffect(() => {
        setanimate(true)
        Plugins.Storage.get({ key: "user" }).then(data => {
            console.log(data)
            let value = JSON.parse(data.value + "")

            if (value) {
                setprofile(value)
                setimage(value.image)
                setuserInfo(Object.keys(value).filter(key => { return (key != `image` && key !== `pass` && key !== `ion-sel-0`) }).map((key) => ({ key, value: value[key] })))

            } else {
                setimage(person)
            }
        })


    }, []);


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

    function saveChange(key: string, detail: any) {
        if (detail.checked) {
            Plugins.Storage.set({ key, value: detail.checked })

        } else {
            Plugins.Storage.remove({ key })
        }
        if (key == `contactme`) {
             
            setcontactme(detail.checked)
        }
        if (key == `visible`) {
            setvisible(detail.checked)
        }
    }


    function updateImg() {
        Plugins.Camera.getPhoto(galleryOption).then((photo) => {
            if (!photo?.dataUrl) {
                return;
            }

            getStorage(`userid`).then((res) => {
                setloading(true)
                firebase.database().ref(`users/${res.value}`).update({ image: photo?.dataUrl })
                    .then(() => {
                        getStorage(`user`).then(res => {
                            if (res.value) {
                                let user: userInterface = JSON.parse(res.value)
                                setprofile(user)
                                user.image = photo?.dataUrl + ``
                                Plugins.Storage.set({ key: `user`, value: JSON.stringify(user) }).then(() => {
                                    setimage(photo?.dataUrl + ``)
                                })
                            }
                        })
                    }).catch((err: { message: string }) => {
                        Plugins.Modals.alert({ message: err.message, title: `image update Error`, buttonTitle: `ok` })
                            .catch(() => alert(err.message))
                    })
                    .finally(() => {
                        setloading(false)
                    })
            })

        }).catch((err) => {
            alert(err)
        })
    }
    const [loading, setloading] = useState(false);
    return (
        <IonPage>
            <IonLoading message={`updating`} onDidDismiss={() => setloading(false)} isOpen={loading} />
            <IonContent scrollY className={`profile-content`}>

                <MenuLinkHeader title="Profile"></MenuLinkHeader>
                {userInfo.length > 0 ? <div className="content">
                    <div className="dp-con">{/* <IonAvatar style={{ textAlign: "center",marginBottom:`30px` }} > */}
                        <img className={`dp`} alt="" onClick={() => setimageView(image)} src={image} />
                        {/* </IonAvatar> */}</div>
                    <div style={{ textAlign: `center` }}>
                        <IonButton style={{ transform: `translateY(-40px)` }} onClick={() => updateImg()} fill={`clear`} color={`primary`}>
                            <IonIcon size={`large`} icon={cameraOutline} />
                        </IonButton>
                    </div>

                    <IonCard className={`profile-card`}>

                        <IonCardHeader>
                            <IonTitle color={`primary`}>{profile?.firstName} {profile?.lastName}</IonTitle>
                            <IonItem lines={`inset`}>
                                <IonIcon slot={`start`} icon={mail}></IonIcon>
                                <IonLabel>
                                    <IonNote>{profile?.email}</IonNote>
                                </IonLabel>
                            </IonItem>
                        </IonCardHeader>

                        {userInfo.length > 0 ?


                            <UserProfile profile={profile}></UserProfile>

                            :
                            <>
                                <IonItem color={"light"} className="ion-padding-start"><IonLabel>visitor</IonLabel></IonItem>
                                <div className="ion-padding">
                                    <IonButton routerLink={`/signup`}>signup for an account</IonButton>
                                    <IonButton routerLink={`/login`} color={`danger`}>login to existing account</IonButton>
                                </div>
                            </>}

                        <IonItemDivider className={`settings`}>
                            <IonTitle color={`primary`}>Settings</IonTitle>
                        </IonItemDivider>
                        {/* <IonItem>
                            <IonIcon color={`primary`} slot={`start`} icon={locate}></IonIcon>
                            <IonLabel >
                                <IonNote color={`dark`}>Visibility</IonNote>
                            </IonLabel>
                            <IonToggle onIonChange={(event) => saveChange(`visible`, event.detail)} checked={visible}></IonToggle>
                        </IonItem> */}
                        <IonItem>
                            <IonIcon color={`primary`} slot={`start`} icon={paperPlaneSharp}></IonIcon>
                            <IonLabel >
                                <IonNote color={`dark`}>Allow others to contact you</IonNote>
                            </IonLabel>
                            <IonToggle onIonChange={(event) => saveChange(`contactme`, event.detail)} checked={contactme}></IonToggle>
                        </IonItem>
                    </IonCard>
                    <CreateAnimation delay={700} stop={!animate} easing={`ease-out`} play={animate} fromTo={[{ fromValue: 0, toValue: 1, property: `opacity` }, { fromValue: `scale(0)`, toValue: `scale(1) translateX(-30px) translateY(-80px)`, property: `transform` }]} duration={400}>
                        <div onClick={() => updateImg()} className={`fab-image`}>
                            <IonAvatar>
                                <IonImg src={profile?.image} />
                            </IonAvatar>
                        </div>
                    </CreateAnimation>
                    <IonItem lines={`none`} color={`none`} className={`goback`}>
                        <IonButton onClick={goBack} size={`large`} color={`light`} fill={`clear`}>
                            <IonIcon color={`light`} icon={arrowBack} />
                        </IonButton>
                        <IonTitle color={`light`}>Profile</IonTitle>

                    </IonItem>
                </div> : <HomeContainer />}
                <ViewPicture isOpen={imageView != undefined} description={`YOUR PROFILE PICTURE`} imageRef={imageView ? imageView : ``} OndidDismiss={() => setimageView(undefined)} />
            </IonContent>
            <IonPopover isOpen={popover} onDidDismiss={() => setpopover(false)} >
                <img alt="" src={image} />
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
                <IonItem lines={edit ? `full` : `inset`}>
                    <IonIcon color={`primary`} slot={`start`} icon={callOutline} />
                    {!edit ?
                        <IonLabel>
                            {profile?.number}
                        </IonLabel> :
                        <IonInput value={profile?.number} />
                    }
                </IonItem>
                <IonItem lines={edit ? `full` : `inset`}>
                    <IonIcon color={`primary`} slot={`start`} icon={school} />
                    {!edit ? <IonLabel className={`upper`}>
                        {profile?.code}
                    </IonLabel> :
                        <IonInput value={profile?.code} />
                    }
                </IonItem>
                <IonItem disabled={!edit}>
                    <IonIcon color={`primary`} slot={`start`} icon={book} />
                    <IonLabel className={`caps`}>
                        {profile?.faculty}
                    </IonLabel>
                </IonItem>
                <IonItem lines={edit ? `full` : `inset`}>
                    <IonIcon color={`primary`} slot={`start`} icon={bookmarks} />
                    {!edit ? <IonLabel className={`caps`}>
                        {profile?.department}
                    </IonLabel> : <IonInput value={profile?.department} />}
                </IonItem>
                {/* <IonToolbar className={`edit`}>
                    <IonButton onClick={() => setedit(!edit)} expand={`block`}>
                        <IonLabel>{!edit ? `Edit` : `save`}</IonLabel>
                    </IonButton>
                </IonToolbar> */}
            </CreateAnimation>
        </>
    )
}