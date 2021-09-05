import React, { useEffect, useState } from "react"
import { IonCard, IonIcon, IonButton, IonNote, IonCardContent, IonCardTitle, IonContent, IonImg, useIonViewDidEnter, useIonViewWillEnter, IonGrid, IonRow, IonCol, IonLabel, IonPage, IonHeader, IonToolbar, IonTitle, IonMenuButton, IonButtons, IonModal, IonProgressBar, IonText } from "@ionic/react";
import { callOutline, logoAppleAppstore, logoGooglePlaystore, mailOutline } from "ionicons/icons";
import { Plugins } from "@capacitor/core";
// import { ImageDownload } from "../components/SocialCard";
import "./Helpful.css"
import { useSelector } from "react-redux";
import { selectUser } from "../state/user-state";
import MoreInfoModal from "../components/recommended/MoreInfoModal";
import { fstore } from "../firebase/Firebase";
import{ FindieImg} from "../components/FindieImg";
;


export interface userInterface {
    email: string,
    faculty: string,
    username: string,
    image: string,
    pass: string,
    number: string

}
export interface queuedFilesInterface {
    url: string,
    fileName: string,
    type: string
}
export interface infoInterface {
    date: string,
    images: string[],
    message: string,
    title: string,
    queuedFiles: queuedFilesInterface[]
}

const Recommended: React.FC = () => {

    const user: userInterface = useSelector(selectUser)
    const [recommendedData, setrecommendedData] = useState<recommendDataInterface[]>([])
    const [loading, setloading] = useState(false)
    const [noData, setnoData] = useState(false)

    useEffect(() => {
        setloading(true)

        fstore.collection(`recommended`).orderBy(`timestamp`).onSnapshot((snapshot => {
            const docs: any = snapshot.docs.map(doc => doc.data())
            setrecommendedData(docs)
            setloading(false)
            if (docs.length <= 0) setnoData(true)
            else setnoData(false)
        }))
        
        
        fstore.collection(`recommended-analytics`).doc(user.faculty).collection(`available`).onSnapshot((snapshot => {
            const docs: any = snapshot.docs.map(doc => doc.data())
            
            setloading(false)
            if (docs.length <= 0){ 
                setnoData(true)
                return
            }
            setnoData(false)
            setrecommendedData([...recommendedData, ...docs])
        }))
    }, [])

    useIonViewDidEnter(() => {
        if (document.body.classList.contains(`dark`)) {
            Plugins.StatusBar.setBackgroundColor({ color: `#152b4d` }).catch(console.log)
        } else {
            Plugins.StatusBar.setBackgroundColor({ color: `#0d2c6d` }).catch(console.log)
        }


    })
    useIonViewWillEnter(() => {
        Plugins.StatusBar.setOverlaysWebView({
            overlay: false
        }).catch(() => { });
    })
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={`primary`}>
                    <IonButtons slot={`start`}>
                        <IonMenuButton  ></IonMenuButton>
                    </IonButtons>
                    <IonTitle>Recommended</IonTitle>
                </IonToolbar>
                {loading && <IonProgressBar type={`indeterminate`} color={`secondary`}></IonProgressBar>}
            </IonHeader>
            <IonContent className={`recommend`}>
                <IonToolbar color={`light`}>
                    {
                        recommendedData.map((data, index) => {
                            return (
                                <RecommendedCard key={index} data={data}></RecommendedCard>
                            )
                        })
                    }
                </IonToolbar>
                {noData && <IonToolbar style={{ padding: `40px`, textALign: `center` }}>
                    <IonText>
                        NO RECOMMENDATIONS YET
                </IonText>
                </IonToolbar>}
            </IonContent>
        </IonPage>

    )
}
export default Recommended;

export interface recommendDataInterface {
    images: string[],
    title: string,
    desc: string,
    contact: {
        phone: string,
        playlink: string,
        applink: string,
        website: string,
        whatsapp: string,
        email: string

    },
    video: string,
    id: string
}

const helpfuldata: recommendDataInterface[] = [
    {
        images: [`https://drive.google.com/uc?export=view&id=1IacjujED_3cYXSmqpPq8sEu0gz9GGjvg`],
        contact: {
            phone: `+237678320028`,
            playlink: `ansbnabnasbnas`,
            applink: ``,
            website: ``,
            whatsapp: ``,
            email: ``
        },
        title: `Quesers - Past Questions and Answers`,
        desc: `Quesers is a mobile app that serves as a search Engine for past questions and answers. Our Goal is to assist students perform better in their academics by `,
        video: ``,
        id: `quesers`

    },
    {
        images: [`https://www.crtv.cm/wp-content/uploads/2020/09/IMG-20200831-WA0058.jpg`],
        contact: {
            phone: `+237678320028`,
            playlink: ``,
            applink: ``,
            website: ``,
            whatsapp: ``,
            email: `asdbnabsdnabsdnb`
        },
        desc: `The first pillar of our vision is to convert the ordinary resources around us to extraordinary innovations with a main aim of solving community problems.`,
        title: `Nervtek Community`,
        video: ``,
        id: `nervtek`

    },
    {
        images: [`https://www.businesslist.co.cm/img/cm/a/1611219156-73-digital-renter.png`],
        contact: {
            phone: `+2374989489`,
            playlink: ``,
            applink: `abnabsnbans`,
            website: ``,
            whatsapp: ``,
            email: ``
        },
        desc: `Digital Renter is an online real estate marketplace aimed at reducing the stress involved in vacancy search by connecting property owners/managers with future tenants/buyers. `,
        title: `Digital Rental`,
        video: ``,
        id: `digital-rental`
    },
    {
        images: [`https://image.winudf.com/v2/image1/Y29tLmdvc3R1ZGVudC51Yl9zY3JlZW5fMTZfMTU0NDA2MjUwMV8wMTk/screen-16.jpg?fakeurl=1&type=.jpg`],
        contact: {
            phone: ``,
            playlink: `ansbnabnasbnas`,
            applink: ``,
            website: `nsanbnabsnbsa`,
            whatsapp: `bnbnbnnbb`,
            email: `snbnasb`
        },
        desc: `The Go-Student UB App is the mobile counterpart of the https://ub.go-student.net web application for students only. Go-Student is a student management `,
        title: `Go-Student Platform`,
        video: ``,
        id: `go-student`
    }
]



const RecommendedCard: React.FC<{ data: recommendDataInterface }> = ({ data: { images, title, desc, contact, video, id } }) => {
    const [showMore, setshowMore] = useState(false)
    return (
        <IonCard onClick={() => setshowMore(true)}>
            {images && images?.length > 0 && <FindieImg  style={{}} className={``} src={images[0]} />}
            <IonCardContent>
                <IonCardTitle>{title}</IonCardTitle>

                {desc && <IonNote>
                    {desc.substr(0, 100)}{desc.length > 100 && `...`}
                </IonNote>}
                <IonGrid>
                    <IonRow>
                        {contact && <IonCol size={`auto`}>
                            {contact.playlink ? <IonButton href={contact.playlink} color={`dark`}>
                                <IonIcon slot={`start`} icon={logoGooglePlaystore}></IonIcon>
                                  Download</IonButton> :
                                contact.applink ? <IonButton href={contact.applink} color={`dark`}>
                                    <IonIcon slot={`start`} icon={logoAppleAppstore}></IonIcon>
                                Download</IonButton> :
                                    contact.phone ?
                                        <IonButton href={`tel:${contact.phone}`} color={`dark`}>
                                            <IonIcon slot={`start`} icon={callOutline}></IonIcon>
                                  Contact</IonButton> :
                                        <IonButton href={`mailto:${contact.phone}`} color={`dark`}>
                                            <IonIcon slot={`start`} icon={mailOutline}></IonIcon>
                                 Email</IonButton>
                            }
                        </IonCol>}
                        <IonCol size={`4`}>
                            <IonButton onClick={() => setshowMore(true)} fill={`outline`}>
                                <IonLabel>
                                    more
                                 </IonLabel>
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonCardContent>

            {contact && <MoreInfoModal onDidDismiss={() => setshowMore(false)} isOpen={showMore} data={{ images, title, desc, contact, video, id }} ></MoreInfoModal>}
        </IonCard>
    )
}



