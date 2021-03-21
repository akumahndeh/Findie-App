import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonList, IonModal, IonSpinner, IonTitle, IonToolbar } from "@ionic/react";
import React, { useEffect, useState } from "react"; 
import { DisplayReactionItem } from "./MenuPages/MyPost";
import "./FriendsModal.css"
import { getStorage, userInterface } from "./Info";
import firebase from "firebase";
import { Plugins } from "@capacitor/core/dist/esm/global";
import { refresh } from "ionicons/icons";


const FriendsModal:React.FC<{isOpen:boolean, onDidDismiss:Function}>=({isOpen,onDidDismiss})=>{
      
    const [Friends, setFriends] = useState<userInterface[] >([]);
    const [loading, setloading] = useState(false);
    const [lastId, setlastId] = useState<string|undefined>();
    useEffect(() => {
      
        if(isOpen==true && Friends.length<=0){
             getStorage(`friends`).then((res)=>{
                  if(res.value){
                      setFriends([...Friends,...JSON.parse(res.value)])
                  }else{
                      InitFromDatabase()
                  }
             })
            
           }
    }, [isOpen]);



    function InitFromDatabase(){
        getStorage(`user`).then((res)=>{
               
            if(res.value){
                let user:userInterface=JSON.parse(res.value)
                 if(user?.faculty){
                    setloading(true)
     
                    firebase.database().ref(`users/`).orderByChild(`faculty`).equalTo( user.faculty)
                    .once(`value`,snapshot=>{
                        console.log(snapshot.val())
                        if(snapshot.val()){
                            let temp:userInterface[]=Object.keys(snapshot.val()).map(key=>({...snapshot.val()[key],id:key}))
                           console.log(temp)
                            setFriends([...Friends,...temp])
                            setlastId(temp[temp.length-1].id)
                            // Plugins.Storage.set({key:`friends`,value:JSON.stringify(temp.slice(0,6))}).catch(console.log)
                        } 
                            setloading(false)
                        
                    })
                 }
            }
        })
    
    }
   
    return(
        <IonModal cssClass={`friends-modal`} swipeToClose mode={`ios`} isOpen={isOpen} onDidDismiss={()=>onDidDismiss()} >
            <IonHeader color={`none`}>
                <IonToolbar mode={`md`} color={`none`}>
                    
                       <div className="content">
                       <div className="line"></div>
                       <div style={{textAlign:`center`}}>
                       <small >pull down</small>
                       </div>
                      
                       <IonItem color={`none`} lines={`none`}>
                           <IonTitle>Faculty Mates</IonTitle>
                           <IonButtons slot={`end`}>
                               <IonButton disabled={loading} onClick={()=>InitFromDatabase()}>
                                   <IonIcon icon={refresh}/>
                               </IonButton>
                           </IonButtons>
                       </IonItem>
                       
                     {loading&&  <IonSpinner />}
                         </div>
                </IonToolbar>
                <IonContent>
                {
                           Friends.map((friend,index)=>{
                               return(  
                                <DisplayReactionItem person={friend} key={index}></DisplayReactionItem>
                               )
                           })
                       }
                 </IonContent>
               
            </IonHeader>

        </IonModal>
    )
}

export default FriendsModal