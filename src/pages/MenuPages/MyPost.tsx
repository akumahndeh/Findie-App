import { Plugins, StatusBarStyle } from '@capacitor/core';
import { IonActionSheet, IonAvatar, IonBackButton, IonBackdrop, IonButton, IonCard, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonLoading, IonModal, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import firebase from 'firebase';
import { shareSocialSharp, download, trash, heart, arrowBack, chevronDown } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
// import { AnimatePopover, ImageDownload, SocialCard } from '../../components/SocialCard';
import { Appshare, Download, InitSkeleton, PostInterface } from '../Gist';
import { getStorage, userInterface } from '../Info';
import  '../Gist.css'

const MyPost: React.FC = () => {
    const [user, setuser] = useState<userInterface>();
    const [currentImgUrl, setcurrentImgUrl] = useState(``);
    const [Posts, setPosts] = useState<any>();
    const [comments, setcomments] = useState<any>();
    const [currentKey, setcurrentKey] = useState<string>();
    const [loading, setloading] = useState(false);
    const [noPost, setnoPost] = useState(false);
    const stopload = () => { setloading(false) }
    let btnRef=useRef<HTMLIonButtonElement>(null)
    const [userid, setuserid] = useState<string>();
    const [Reactions, setReactions] = useState<PostInterface|undefined>(undefined);
    const [seeLikes, setseeLikes] = useState(false);
    const [currentImages, setcurrentImages] = useState<string[]>([]);


    function viewImages(post: PostInterface) {
        if (post.images)
            setcurrentImages(Object.values(post.images))
    }
    useEffect(() => {
        getStorage(`user`).then(res => {
            if (res.value) {

                let userinfo = JSON.parse(res.value)
                setuser(userinfo)
                getStorage(`userid`).then(res => {
                    let uid = res.value
                    if (uid) {
                    setuserid(uid)
                       firebase.database().ref(`gists/${userinfo?.faculty}`).on(`value`, snapshot => {
                                let value=snapshot.val();
                                if (value) {
                                       setPosts(value)
                                    setnoPost(false)
                                } else {
                                    setnoPost(true)
                                }
                            })
                    } else alert(`error 2`)
                })
            } else alert(`error 3`)

        })

    }, []);
    useIonViewDidEnter(()=>{
          Plugins.StatusBar.setStyle({style:StatusBarStyle.Dark}).catch(()=>{})
    
    })
    useIonViewDidLeave(()=>{
  Plugins.StatusBar.setBackgroundColor({color:`#0d2c6d`}).catch(console.log)

    })
    function verifyObject(object: any) {
        return object ? object : {}
    }
    const openComments = (comms: any) => {
        setcomments(comms)
        setplay(true)
        setstop(false)
    }
    const deletePost = function () {
        Plugins.Modals.confirm({ message: `are you sure you want to Delete this post?`, title: `delete Post`, okButtonTitle: `delete` })
            .then(res => {
                if (res.value) {
                          if (currentKey) {
                            setloading(true)
                          try{
                            JSON.parse(Posts[currentKey]).images.forEach((imgref: string) => {
                                firebase.storage().ref(imgref).delete()
                            })
                           }catch{}
                            firebase.database().ref(`gists/${user?.faculty}`).child(currentKey).remove().then(() => {
                                firebase.database().ref(`gistIndex`).child(currentKey).remove().then(()=>{

                                    Plugins.Toast.show({duration:`short`,text:`deleted`,position:`center`})
                                })
                                setPosts({...Posts,[currentKey]:null})
                            }).finally(stopload)

                        }
                    // })
                } else {
                    return;
                }
            })

    }
    function updatePost(newPost:PostInterface){
        if(user && newPost){
            firebase.database().ref(`gists/${user.faculty}/`).child(newPost.id).set(JSON.stringify(newPost))
        }
      
    }
    function viewReactions(){
        if(Reactions){
            setcurrentImgUrl(``)
            setseeLikes(true)
        }
        
    }

    const [play, setplay] = useState(false);
    const [stop, setstop] = useState(false);
    return (
        <IonPage>
             <IonHeader >
             <IonToolbar >
                    <IonButton fill={`clear`} shape={`round`} slot={`start`}>
                        <IonBackButton color={`dark`} ></IonBackButton>
                    </IonButton>
                    <IonTitle>Your Posts</IonTitle>
                </IonToolbar>
             </IonHeader>
        
            <IonContent >
                <div style={{backgroundColor:`#f4f5f8`,minHeight:`100vh`}}>
                <IonHeader>
               
               {/* <IonToolbar >
                 <IonItem color={`none`} lines={`none`}>
                 <Link to={`/Profile`}>  <IonAvatar style={{width:`40px`,height:`40px`,marginLeft:`8px`}} slot={`start`}>
                       <IonImg src={user?.image} />
                   </IonAvatar></Link>
                   <IonTitle style={{ textTransform: `capitalize` }}>
                       {`${user?.firstName} ${user?.lastName}`}
                   </IonTitle>
                 </IonItem>
               </IonToolbar> */}
           </IonHeader>
                {/* <IonLoading isOpen={loading} onDidDismiss={stopload} message={`deleting`} spinner={`lines`}></IonLoading>
                {!noPost && <>{
                    Object.keys(verifyObject(Posts)).length > 0 ? Object.keys(verifyObject(Posts)).map((key: any, index) => {
                                           if (  verifyObject(JSON.parse(Posts[key])).userid!==userid) return;
                        return (<div key={index}><SocialCard localImg={false} viewImages={()=>{viewImages(JSON.parse(Posts[key])) }}  updatePost={updatePost} sendAuthorInfo={() => { }} Posts={JSON.parse(Posts[key])} popopen={openComments}  /></div>)
                    }) : <InitSkeleton></InitSkeleton>
                }
                </>}{
                    noPost && <p className="ion-padding">
                        <IonCardTitle>No post yet</IonCardTitle>
                    </p>
                } */}
                
                {/* <AnimatePopover play={play} stop={stop} comments={comments} ondidDismiss={() => {
                    setstop(true);
                    setplay(false)
                }}></AnimatePopover> */}
                <IonActionSheet translucent mode={`ios`} isOpen={currentImgUrl != ``} onDidDismiss={() => setcurrentImgUrl(``)}
                    buttons={[{ text: `reactions`, icon: heart, handler: () => viewReactions() },{ text: `share`, icon: shareSocialSharp, handler: () => Appshare(currentImgUrl) },
                    { text: `download`, icon: download, handler: () => Download(btnRef,currentImgUrl) }
                        , { text: `Delete`, icon: trash, handler: deletePost }]} ></IonActionSheet>
                         <IonButton style={{display:`none`}} download={currentImgUrl} ref={btnRef}></IonButton>
          
                </div>

                     <IonModal mode={`ios`} swipeToClose isOpen={currentImages.length > 0} onDidDismiss={() => setcurrentImages([])}>
                        <IonHeader>
                            <IonToolbar color={`primary`}>
                                <IonBackdrop></IonBackdrop>
                                <IonButton color={`light`} fill={`clear`} slot={`start`}>
                                    <IonIcon icon={arrowBack}></IonIcon>
                                </IonButton>
                                <IonTitle>view images</IonTitle>
                            </IonToolbar>
                        </IonHeader>
                        {/* <IonContent>
                    
                            {
                                currentImages.map((img, index) => <ImageDownload key={index} image={img} sendUrl={() => { }} />)
                            }
                        </IonContent> */}
                        
                    </IonModal>
               <IonModal mode={`ios`} swipeToClose isOpen={seeLikes} onDidDismiss={()=>{setseeLikes(false)}}>
                
                  <ModalContent posts={Reactions}></ModalContent>
               </IonModal>
             </IonContent>
        </IonPage>
    )
}

export default MyPost



export const ModalContent:React.FC<{posts:PostInterface|undefined}>=({posts})=>{
    const [likedPeople, setlikedPeople] = useState<userInterface[]>([]);
    const [laughedPeople, setlaughedPeople] = useState<userInterface[]>([]);
   
    useEffect(() => {
        setlikedPeople([])
        setlaughedPeople([])
        if(posts){
           getStorage(`user`).then((res)=>{
               if(res.value){
               let likes=posts.likes
               let laughs=posts.laughs
             if(likes){
                    let  likeKeys=  Object.keys(likes).filter((key)=>likes[key]!=null)
                     let temp:any=[]
              likeKeys.forEach(key=>{
                  firebase.database().ref(`users`).child(key).once(`value`,(snapshot)=>{
                    if(snapshot.val()){
                        temp=[...temp,snapshot.val()]
                        setlikedPeople(temp)
                    } 
                  })
              })
                }
                if(laughs){
                    let  laughsKeys=  Object.keys(laughs).filter((key)=>laughs[key]!=null)
                      let temp:any=[]
              laughsKeys.forEach(key=>{
                  firebase.database().ref(`users`).child(key).once(`value`,(snapshot)=>{
                    if(snapshot.val()){
                        temp=[...temp,snapshot.val()]
                        setlaughedPeople(temp)
                    }
                 
                  })
              })
                }
                
                
            }
        })
        }
    }, [posts]);
    return(
        <>
         <IonHeader>
                       <IonToolbar mode={`md`} >
                       <IonButton slot={`start`} shape={`round`} fill={`clear`}>
                           <IonIcon icon={arrowBack} ></IonIcon>
                           <IonBackdrop></IonBackdrop>
                       </IonButton>
                       <IonTitle>reactions</IonTitle>
                       </IonToolbar>
                   </IonHeader>
                   <IonContent>
                     <IonToolbar mode={`md`}>
                       <IonCard >
                         <IonCardHeader color={`light`}>
                             <IonIcon icon={heart}></IonIcon> <IonLabel>likes</IonLabel>
                         </IonCardHeader>
                         {
                             likedPeople.map((people,index)=>{
                                 return(
                                    <DisplayReactionItem key={index} person={people}></DisplayReactionItem>
                                 )
                             })
                         }
                       </IonCard>   
                       <IonCard >
                         <IonCardHeader color={`light`}>
                         😂 <IonLabel>laughs</IonLabel>
                         </IonCardHeader>
                         {
                             laughedPeople.map((people,index)=>{
                                 return(
                                    <DisplayReactionItem key={index} person={people}></DisplayReactionItem>
                                 )
                             })
                         }
                       </IonCard>   
                       </IonToolbar>
                   </IonContent>
        </>
    )
}

export  const DisplayReactionItem:React.FC<{person:userInterface}>=({person})=>{
   const [more, setmore] = useState(false);
   function showMore(){

       setmore(!more)
   }
    return(
        <div>
        <IonItem >
        <IonAvatar>
            <IonImg src={person?.image}></IonImg>
        </IonAvatar>
        {/* <IonLabel style={{textTransform:`capitalize`,marginLeft:`14px`}}>
            {person?.firstName+` `+person?.lastName}
        </IonLabel> */}
        <IonButton onClick={showMore} fill={`clear`}  slot={`end`}>
        <IonIcon style={{transition:`0.4s`,...more?{transform:`rotate(180deg)`}:{}}} icon={chevronDown}></IonIcon>
        </IonButton>
       
    </IonItem>
    <div style={{transition:`0.4s`,...more?{transform:`translateY(10px)`}:{height:`0.001px`,opacity:0}}}>
        {/* <IonItem>
            {person.faculty}
        </IonItem>
        <IonItem>
            {person.department}
        </IonItem>
        <IonItem>
            {person.email}
        </IonItem>
        <IonItem>
            {person.proff}
        </IonItem>
        <IonItem lines={`none`}>
           
        </IonItem> */}
    </div>
    </div>
    )
}