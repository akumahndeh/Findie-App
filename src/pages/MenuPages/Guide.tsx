import React, { useEffect, useState } from "react"
import { IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonNote, IonSearchbar, IonSkeletonText, useIonViewDidEnter, IonContent, IonIcon, IonButton, IonBackdrop, IonSpinner } from "@ionic/react"
import "./Guide.css"
import firebase, { db } from "../../firebase/Firebase";
import { App, Capacitor, Plugins } from "@capacitor/core"
import { getStorage, userInterface } from "../Info"
import { useHistory } from "react-router"
import GuideInfo from "../GuideInfo"
import { arrowBack } from "ionicons/icons"
import { HapticVibrate } from "../../components/MapModal"
import { useSelector } from "react-redux";
import { selectUser } from "../../state/user-state";

export interface GuideInterface {
    title: string,
    describtion: string,
    details: string
}

const Guide: React.FC = () => {
    const [list, setlist] = useState<GuideInterface[]>([]);
    const [GuideList, setGuideList] = useState<GuideInterface[]>([]);
    const [selectedGuide, setselectedGuide] = useState<any>();
    const [refreshing, setrefreshing] = useState(false);
    const [displayContent, setdisplayContent] = useState(false);
    const user: userInterface = useSelector(selectUser)
    const history = useHistory()

    useEffect(() => {
        if (!user) {
            history.push(`/login`)
        }

    }, [user])

    useIonViewDidEnter(() => {
        if (document.body.classList.contains(`dark`)) {
            Plugins.StatusBar.setBackgroundColor({ color: `#152b4d` }).catch(console.log)
        } else {
            Plugins.StatusBar.setBackgroundColor({ color: `#0d2c6d` }).catch(console.log)
        }

    })
    useIonViewDidEnter(() => {
        Plugins.StatusBar.setOverlaysWebView({
            overlay: false
        }).catch(() => { });
        if (list.length <= 0) {
            initializeFromStorage()
            LoadGuideFromDatabase()
        }
    })
    const search = (event: any) => {
        const value = event.target.value + ""
        if (value === "") {
            setlist(GuideList);
            return;
        }
        else setlist(GuideList.filter(item => item?.describtion.toLowerCase().match(value.toLowerCase()) || item?.title.toLowerCase().match(value.toLowerCase())))

    }


    function initializeFromStorage() {
        getStorage(`guide`).then((res) => {
            if (res.value) {
                let value = JSON.parse(res.value)
                setlist(Object.values(value).map((item) => JSON.parse(item + ``)))
                setGuideList(Object.values(value).map((item) => JSON.parse(item + ``)))
            }

        })
    }
    function LoadGuideFromDatabase() {
        setrefreshing(true)

        firebase.database().ref('guide').once("value", (snapshot) => {
            let value = snapshot.val()
            if (value) {

                setlist(Object.values(value).map((item) => JSON.parse(item + ``)))
                setGuideList(Object.values(value).map((item) => JSON.parse(item + ``)))
                Plugins.Storage.set({ key: `guide`, value: JSON.stringify(value) })
            }

            setrefreshing(false)

        }, () => {
            setrefreshing(false)
        })
    }
    useEffect(() => {
        ExitApp()

    }, []);
   
    function ExitApp() {

        if (Capacitor.isNative) {
            document.addEventListener('ionBackButton', async (ev: any) => {
                ev.detail.register(-1, () => {
                    const path = window.location.pathname;
                    if (path === `/` || path == `/guide` || path == `/login` || path == `/signup`) {
                        App.exitApp();
                    }
                });
            });
        }


    }

    async function ExitGesture() {
        // let value = await Plugins.Modals.confirm({ message: `Are you sure you want to Exit App?`, title: `Exit`, })

        Plugins.App.exitApp()

    }


    return (
        <IonContent className={`guide-content`}>
            <IonToolbar color={`light`} className={`ion-padding-bottom`}>
                <IonSearchbar placeholder={`what do you want to learn about?`} onIonChange={search} color="primary" ></IonSearchbar>
                <div className="links">
                    {list.length > 0 ? list.map(((item, index) => {
                        return <AidLinks openGuide={(val: any) => { setselectedGuide(val) }} key={index} info={item} />
                    })) :
                        ['', '', '', '', '', '', ''].map((ele, index) => <InitSkeleton key={index}></InitSkeleton>)
                    }

                    <GuideInfo location={selectedGuide} isOpen={selectedGuide != undefined} onDidDismiss={() => setselectedGuide(undefined)} />

                </div>
                {refreshing && <IonSpinner duration={700} className={`ion-margin`} color={`danger`} style={{ transform: `scale(1.2)` }}></IonSpinner>}
            </IonToolbar>
        </IonContent>
    )
}

export default Guide;

const AidLinks: React.FC<{ info: GuideInterface, openGuide: Function }> = ({ info, openGuide }) => {
    function moreInfo() {
        openGuide({ state: info })
    }
    return (
        <IonItem onClick={moreInfo} button className="">
            <IonLabel position="stacked">{info?.title}</IonLabel>

            <IonNote>{info?.describtion}</IonNote>

        </IonItem>
    )
}


export const MenuLinkHeader: React.FC<{ title: string }> = (props) => {
    return (
        <IonHeader>
            <IonToolbar color="primary">
                <IonGrid>
                    <IonRow>
                        <IonCol size="2">
                            <IonButton fill={`clear`} color={`light`} >
                                <IonIcon icon={arrowBack} />
                                <IonBackdrop></IonBackdrop>
                            </IonButton>
                        </IonCol>
                        <IonCol className="ion-padding-top">
                            <IonTitle>{props.title}</IonTitle>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonToolbar>
        </IonHeader>
    )
}

const InitSkeleton: React.FC = () => {
    return (
        <>
            <IonSkeletonText animated style={{ width: "40%", height: "20px" }} color="dark"></IonSkeletonText>
            <IonSkeletonText style={{ height: "20px", marginBottom: "20px" }} color="dark"></IonSkeletonText>
        </>
    )
}

export async function authUser() {
    let user = JSON.parse((await Plugins.Storage.get({ key: `user` })).value + ``)
    if (!user)
        return false
    return firebase.auth().signInWithEmailAndPassword(user.email, user.pass)
}

export async function authVisitor() {
    return firebase.auth().signInAnonymously()
}

