import { CameraResultType, Capacitor, Filesystem, FilesystemDirectory, Plugins, PushNotification, PushNotificationToken } from "@capacitor/core";
import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonLoading, IonModal, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from "@ionic/react"
import firebase from "firebase"
import { add, chevronBack, logoGoogle, personAdd } from "ionicons/icons";
import React, { useEffect, useState } from "react" 
import { HideTab } from "../App";
import { getStorage, infoInterface, InfoModal } from "./Info";
import AddModal, { ContentInterface, filesInterface } from "./Teachers/AddModal";
import { AnouncementTeacherCard } from "./Teachers/AnnouncementCard";
import { InfoCard } from "./Teachers/InfoCard";
import { Modal } from "./Teachers/Modal";


const Teacher: React.FC = () => {
    const [authTeacher, setauthTeacher] = useState<firebase.User | null>();
    const [openModal, setopenModal] = useState(false);
    const [addInfo, setaddInfo] = useState(false);
    const [thisInfo, setthisInfo] = useState<any>();
     const [infoList, setinfoList] = useState<infoInterface[]>([]);
    const [loadText, setloadText] = useState(`loading...`);
    const [selected, setselected] = useState<infoInterface>();
    const [authing, setauthing] = useState(false);
    useIonViewDidEnter(()=>{
        HideTab()
    })
    function signin() {
        let provider = new firebase.auth.GoogleAuthProvider
       setauthing(true)
        firebase.auth().signInWithPopup(provider).then(result => {
            let email = result.user?.email

            firebase.firestore().collection(`teachers`).where(`email`, `==`, email).get()
                .then((res) => {
                    let teacher: any = null
                    res.forEach(doc => {
                        teacher = doc.data()
                    })
                    if (teacher) {
                        setauthTeacher(result.user)
                        let faculty = teacher.faculty
                        if(faculty)
                        Plugins.Storage.set({key:`teacherFaculty`,value:faculty})
                        setauthing(true)
                        firebase.database().ref(`info/${faculty}`).on(`value`, (snapshot) => {
                            let value = snapshot.val()
                            if (value) {
                                let infoarray = Object.keys(value)
                                    .map(key => ({ ...JSON.parse(value[key] + ``), key })).reverse()
                                setinfoList([...infoarray])
                                setloadText(``)
                            }
                            else {
                                setloadText(`none availaible`)
                            }
                        })

                        Plugins.Storage.set({ key: `teacherFaculty`, value: teacher.faculty })
                    }

                }).catch((err) => {
                    Plugins.Toast.show({ text: err.message, duration: `long` }).catch(() => alert(err.message))
                
                }).finally(()=>setauthing(false))
        }).catch(err => alert(err.message)).finally(()=>{setauthing(false)})
    }
    const PostAnnouncement = (info: { Content: ContentInterface, queuedFiles: filesInterface[] }) => {
        if (info) {
            setopenModal(false)
            setaddInfo(false)
            setthisInfo(info)
        }
        else {
            alert(`no information to be sent`)
        }

    }
    useEffect(() => {
        
         if(infoList.length>0 && loadText==``){
             setloadText(``)
         }
    }, [infoList]);
    function verifyTrasheable(trashmessage: string) {
        if (authTeacher?.displayName && authTeacher?.photoURL) {
            if (trashmessage.match(authTeacher?.displayName) && trashmessage.match(authTeacher?.photoURL)) {
                return true
            }
        }
        return false
    }
    async function TrashInfo(trashid: string) {
        let faculty = (await getStorage(`teacherFaculty`)).value
        if (!faculty) {
            faculty = prompt(`an unexpected error happened, please enter your faculty`)
        }
        if (!faculty) { return; }
        if (window.confirm(`Are you very sure you want to delete this ?`)) {
            let key =firebase.database().ref(`info/${faculty}/${trashid}`).key
            firebase.database().ref(`info/${faculty}/${trashid}`).remove().then(res=>{
                firebase.storage().ref().child(`info/${faculty}/${key}`).listAll().then(res=>{
                    res.items.forEach(el=>{
                        el.delete()
                    })
                })
            })
        }
    }
    useEffect(() => {
        setthisInfo(undefined)
       
    }, [infoList]);
    useEffect(() => {
         if(thisInfo){
             setloadText(``)
         }
    }, [thisInfo]);
    function openModalForMore(info: infoInterface) {
        setselected(info)
    }

    function logout() {
        if (window.confirm(`Are you sure you want to logout`)) {
             firebase.auth().signOut().then(()=>{
                setauthTeacher(undefined)
             })
         
        }
    }
  
    
    return (
        <IonPage>
             
            <IonHeader>
                <IonLoading onDidDismiss={()=>setauthing(false)} isOpen={authing} message={`please hold on`} />
                <IonToolbar color={`primary`}>
                    <IonItem lines={`none`} color={`none`}>
                        {authTeacher?.email != undefined ? <IonButtons slot={`start`}>
                            <IonButton onClick={logout}>
                                <IonIcon icon={chevronBack} />
                            </IonButton>
                            <IonAvatar style={{ height: `40px`, width: `40px` }}>
                                <IonImg src={authTeacher?.photoURL + ``} />
                            </IonAvatar>
                        </IonButtons> : <IonTitle>{`Findie For Teachers`}</IonTitle>}
                        <IonButtons slot={`end`}>
                            {authTeacher?.email == undefined ? <IonButton onClick={() => { setopenModal(true) }} >
                                <IonIcon icon={personAdd}></IonIcon>
                            </IonButton> : <IonButton onClick={() => { setaddInfo(true) }} >
                                    <IonIcon icon={add}></IonIcon>
                                    <IonLabel>  Add</IonLabel>
                                </IonButton>}
                        </IonButtons>
                    </IonItem>
                </IonToolbar>
            </IonHeader>
          
            <IonContent>


                {authTeacher?.email == undefined ? <IonCard style={{ maxWidth: `500px`, padding: `0 0 30px 0` }} mode={`ios`}>
                    <IonImg src={`https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`} />
                    <IonCardContent>
                        <IonItem onClick={signin} button>
                            <IonIcon size={`large`} color={`success`} icon={logoGoogle}></IonIcon>
                            <IonLabel className={`ion-padding-start`}>
                                Sign in with Google
                      </IonLabel>
                        </IonItem>
                    </IonCardContent>
                </IonCard>


                    :

                    <> <div className={`ion-padding`}>
                        <IonLabel>{loadText}</IonLabel>
                        {thisInfo != undefined && loadText!=`none availaible` && <InfoCard authTeacher={authTeacher} info={thisInfo}></InfoCard>}
                    </div>
                        {infoList.length > 0 && loadText!=`none availaible` && infoList.map((thisinfo: any, index) => {
                            let info = thisinfo
                            return (
                                <AnouncementTeacherCard Trash={() => TrashInfo(info.key)} trasheable={verifyTrasheable(info.message)} key={index} info={info} openModalForMore={() => { openModalForMore(info) }} />
                            )
                        })}</>
                }
                   
             <IonModal isOpen={openModal} onDidDismiss={() => setopenModal(false)}>
                    <Modal  onDidDismiss={() => setopenModal(false)}></Modal>
                </IonModal>
            </IonContent>
    
            <IonModal isOpen={addInfo} onDidDismiss={() => { setaddInfo(false) }}>
                <AddModal onDidDismiss={()=>setaddInfo(false)} sendConfirmedData={PostAnnouncement} authTeacher={authTeacher} ></AddModal>
            </IonModal>
            <InfoModal currentInfo={selected} onDidDismiss={() => setselected(undefined)}></InfoModal>
             </IonPage>
    )
}
 
export default Teacher;


