import { Plugins } from "@capacitor/core";
import { IonAvatar, IonButton, IonButtons, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonModal, IonTitle, IonToolbar, useIonViewDidEnter } from "@ionic/react";
import firebase from "firebase";
import { add, chevronBack, personAdd } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { HideTab } from "../App";
import Pictures from "../media/images/images";
import { infoInterface, getStorage, InfoModal } from "./Info";
import AddModal, { ContentInterface, filesInterface } from "./Teachers/AddModal";
import { AnouncementTeacherCard } from "./Teachers/AnnouncementCard";
import { InfoCard } from "./Teachers/InfoCard";


const TeacherHome:React.FC<{location:any}>=({location})=>{
    
    const [thisInfo, setthisInfo] = useState<any>();
    const [loadText, setloadText] = useState(`loading...`);
    const [authTeacher, setauthTeacher] = useState<firebase.User|null>(null);
    const [addInfo, setaddInfo] = useState(false);
     const [selected, setselected] = useState<infoInterface>();
    const [infoList, setinfoList] = useState<infoInterface[]>([]);
    const [openModal, setopenModal] = useState( false);
 let history=useHistory()
 
    useEffect(() => {
         if(location){
            try{ let state:{teacher:firebase.User}|any=location 
              setauthTeacher(state.teacher)
            }catch(err){
                console.log(err)
                setloadText(`Unexpected error, unauthorized access`)
            }
         }
    }, [location]);
    function openModalForMore(info: infoInterface) {
        setselected(info)
    }
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
            firebase.database().ref(`info/${faculty}/${trashid}`).remove()
        }
    }
    const PostAnnouncement = (info: { Content: ContentInterface, queuedFiles: filesInterface[] }) => {
        if (info) {
            setopenModal(false)
            setaddInfo(false)
            setthisInfo(info)
            console.log(info)
        }
        else {
            alert(`no information to be sent`)
        }

    }
    useEffect(() => {
        setthisInfo(undefined)
    }, [infoList]);
    useEffect(() => {
       if(authTeacher){
           initTeacher()
       }
    }, [authTeacher]);

    function initTeacher(){
        let email=authTeacher?.email
        firebase.firestore().collection(`teachers`).where(`email`, `==`, email).get()
        .then((res) => {
            let teacher: any = null
            res.forEach(doc => {
                teacher = doc.data()
            })
            if (teacher) {
                
                let faculty = teacher.faculty
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
        })
    }
    function logout() {
        if (window.confirm(`Are you sure you want to logout`)) {
             firebase.auth().signOut().then(()=>{
                setauthTeacher(null)
                 history.goBack()
             })
         
        }
    }

    return(
        <> 
        <IonHeader>
        <IonToolbar color={`primary`}>
                    <IonItem lines={`none`} color={`none`}>
                        <IonButtons slot={`start`}>
                            <IonButton onClick={logout}>
                                <IonIcon icon={chevronBack} />
                            </IonButton>
                            <IonAvatar style={{ height: `40px`, width: `40px` }}>
                                <IonImg src={authTeacher?.photoURL?authTeacher?.photoURL:Pictures.dummy} />
                            </IonAvatar>
                        </IonButtons> 
                        <IonButtons slot={`end`}>
                             <IonButton onClick={() => { setaddInfo(true) }} >
                                <IonIcon icon={add}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonItem>
                </IonToolbar>
        </IonHeader>
        <div className={`ion-padding`}>
        <IonLabel>{loadText}</IonLabel>
        {thisInfo != undefined && <InfoCard authTeacher={authTeacher} info={thisInfo}></InfoCard>}
    </div>
        {infoList.map((thisinfo: any, index) => {
            let info = thisinfo
            return (
                <AnouncementTeacherCard Trash={() => TrashInfo(info.key)} trasheable={verifyTrasheable(info.message)} key={index} info={info} openModalForMore={() => { openModalForMore(info) }} />
            )
        })}
         <IonModal isOpen={addInfo} onDidDismiss={() => { setaddInfo(false) }}>
                <AddModal onDidDismiss={()=>setaddInfo(false)} sendConfirmedData={PostAnnouncement} authTeacher={authTeacher} ></AddModal>
            </IonModal>
            <InfoModal currentInfo={selected} onDidDismiss={() => setselected(undefined)}></InfoModal>
          
        
        </>
    )
}


export default TeacherHome