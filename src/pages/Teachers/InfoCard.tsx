import { Plugins } from "@capacitor/core";
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonText, IonNote, IonButtons, IonButton, IonIcon, IonRow, IonLabel, IonProgressBar } from "@ionic/react";
import firebase from "firebase";
import { arrowForward } from "ionicons/icons";
import React, { useState, useEffect } from "react"; 
import HtmlParser from "react-html-parser";
import { getStorage } from "../Info";
import { ContentInterface, filesInterface, fileImages } from "./AddModal";

export const InfoCard: React.FC<{ info: { Content: ContentInterface, queuedFiles: filesInterface[] }, authTeacher: firebase.User | null }> = ({ authTeacher, info }) => {
    const [progress, setprogress] = useState<number[]>([]);

    const successFullUpload = () => {
        Plugins.Toast.show({ text: `uploaded...` }).catch(() => alert(`uploaded`))
    }

    async function submitAnnouncement() {
        if (!info) {
            return;
        }
        const { Content, queuedFiles } = info
        let title = Content?.title
        let date = Content?.date
        let randomNumber = Math.ceil(Math.random() * 10000)
        let uniqueId: string = randomNumber + `` + Math.ceil(Date.now() * 1000)
        let R = (Math.random() * 1000) % 256, G = (Math.random() * 1000) % 256, B = (Math.random() * 1000) % 256;
        let faculty: string | null = (await getStorage(`teacherFaculty`)).value
        let queuedFilesUrl:{url:string,fileName:string,type:string}[]=[]
        let DocUrls: string[] = []
        if(queuedFiles?.length==0){
            let message = `<div  > 
            <h4 style='color:rgb(${R},${G},${B})'>${Content.concerns}</h4>
            <ion-toolbar color="none">
            ${authTeacher != undefined && `<ion-avatar><img src="${authTeacher?.photoURL}"/></ion-avatar>`}
                   
            <ion-text class="ion-padding">
                ${authTeacher?.displayName}
            </ion-text>
            </ion-toolbar><br/>
           <p> ${Content?.message}   </p>
           
           </div>`
            firebase.database().ref().child(`info/${faculty}/${uniqueId}`).set(JSON.stringify({ title, message, date :[]}))
            .then(() => {
                successFullUpload()
            }).catch((err) => {
                alert(err.message)
            })
        }
        else
        queuedFiles?.forEach(async (file, index) => {
            let ref = firebase.storage().ref().child(`info/${faculty}/${uniqueId}/${file.fileName}`)
            let uploadTask = ref.put(file.file)
            uploadTask.on('state_changed', function (snapshot) {
                var uploadprogress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                let temp: number[] = progress
                temp[index] = uploadprogress
                setprogress([...temp])
                 

            }, function (error) {
                alert(error.message)
            }, function () {

              
                 ref.getDownloadURL().then(function (downloadURL) {
                    DocUrls[index] = downloadURL
                    console.log('File available at', downloadURL);
                    let message = `<div  > 
                         <h4 style='color:rgb(${R},${G},${B})'>${Content.concerns}</h4>
                         <ion-toolbar color="none">
                         ${authTeacher != undefined && `<ion-avatar><img src="${authTeacher?.photoURL}"/></ion-avatar>`}
                                
                         <ion-text class="ion-padding">
                             ${authTeacher?.displayName}
                         </ion-text>
                         </ion-toolbar><br/>
                        <p> ${Content?.message} 
                          </p> <p>
                          <ion-item mode="md" button style="width:100%" >
                           <ion-text class="ion-margin-start">${queuedFiles?.length} files </ion-item></ion-item>
                       </p>
                         
                            </div>`
                             
                        queuedFilesUrl[index]={url:downloadURL ,fileName: queuedFiles[index].fileName,type:queuedFiles[index].type}
                    if (index == queuedFiles?.length - 1) {
                        firebase.database().ref().child(`info/${faculty}/${uniqueId}`).set(JSON.stringify({ title, message, date,queuedFiles:queuedFilesUrl }))
                            .then(() => {
                                successFullUpload()
                            }).catch((err) => {
                                alert(err.message)
                            })
                    }
                })

            });

        })



    }
    useEffect(() => {
        if (info?.queuedFiles) {
            if (progress.length <= 0) {
                setprogress([...info.queuedFiles?.map(() => 0)])
            }
            if (info?.Content) {
                submitAnnouncement()
            }
        }

    }, [info?.queuedFiles]);

    const toFileString = function(file:Blob){
        let fr=new FileReader()  
         fr.onload= ()=>{
                return fr.result+``
         }
         fr.readAsDataURL(file)
        return ``
    }
    return (
        <IonCard mode={`ios`} >
            <IonCardHeader>
                <IonCardTitle>{info?.Content.title}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent className="ion-margin-top">
                <IonItem color={`none`} lines={`none`} style={{ maxHeight: `150px` }}>
                    <IonText>{HtmlParser(info?.Content.message)} </IonText>
                </IonItem>
            </IonCardContent>
            <IonItem color={`none`} lines={`none`}>
                <IonNote>{(new Date(+info?.Content.date)).toDateString()}</IonNote>
                <IonButtons slot={`end`}>
                    <IonButton onClick={() => { }}><IonIcon icon={arrowForward}></IonIcon></IonButton>
                </IonButtons>
            </IonItem>
            { info?.queuedFiles?.map((file, index) => {
                return <IonRow key={index}>
                    <IonItem lines={`none`} style={{ width: `100%` }} >

                        <img style={{ height: `50px`, width: `50px` }} src={fileImages[file.type]}></img>
                        <IonLabel className={`ion-margin-start`}>{file.fileName}</IonLabel>
                        <IonProgressBar value={1} type={progress[index] < 100 ? `indeterminate` : `determinate`}></IonProgressBar>
                        <IonNote>{Math.ceil(progress[index])}%</IonNote>
                        
                    </IonItem>
                    
                </IonRow>
            })}

        </IonCard>
    )
} 