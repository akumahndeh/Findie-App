import React, { useEffect, useRef, useState } from "react"
import { IonFab, IonFabButton, IonIcon, IonGrid, IonCol, IonRow, IonSkeletonText, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonActionSheet, IonPopover, IonImg, IonList, IonItem, IonLabel, IonButton, IonModal, IonToolbar, IonTitle, IonHeader, IonBackdrop, IonRefresher, IonRefresherContent, useIonViewDidEnter, useIonViewWillEnter, IonToast, IonAvatar, IonBadge, IonTabButton, IonInput, IonCard, IonCardContent, IonSpinner, IonCardHeader, IonButtons, IonLoading, useIonViewWillLeave, useIonViewDidLeave } from "@ionic/react"
import { add, arrowBack, close, download, heart, shareSocialSharp, trashBin } from "ionicons/icons";
import "./Gist.css"
// import { AnimatePopover, ImageDownload, SocialCard } from "../components/SocialCard";
import firebase, { storage } from "firebase";
import { FilesystemDirectory, NetworkStatus, Plugins } from "@capacitor/core";
import { getStorage, userInterface } from "./Info";
import CreateGist from "../components/GistModal";
import FriendsModal from "./FriendsModal";

export interface PostInterface {
    date: string,
    date2: number,
    laughs: any,
    likes: any
    message: string,
    userid: string,
    id: string,
    commentText: any,
    viewedPeople: any,
    images: any,
    contact: string,
    email: string,
    urls: any
}

const Gist: React.FC = () => {
    const database = firebase.database()
    const [comments, setcomments] = useState<any>();
    const [user, setuser] = useState<userInterface>();
    const [userid] = useState<string>();
    const [Posts, setPosts] = useState<PostInterface[]>([]);
    const [disableInfinite, setdisableInfinite] = useState(true);
      const [currentUser, setcurrentUser] = useState<userInterface>();
    const [currentImages, setcurrentImages] = useState<{ local: boolean, images: any[] }>({ local: false, images: [] });
     const [NoPost, setNoPost] = useState(false);
    const [viewImage, setviewImage] = useState(false);
    const [createAgist, setcreateAgist] = useState(false);
    const [seefriends, setseefriends] = useState(false);
    /**loading data sequencially to database */
    const [MyPost, setMyPost] = useState<PostInterface[]>([]);
    const [networkToast, setnetworkToast] = useState({ message: ``, connected: true, color: `success` });
    const [postsReady, setPostsReady] = useState(false)
    const [changePage, setchangePage] = useState(false)
    const [displayContent, setdisplayContent] = useState(!true)
    
  
    async function initRequest() {

        let userval = ((await getStorage(`user`)).value)
       
        if (userval) {

            let user: userInterface = JSON.parse(userval)
            setuser(user)
            const offset = 6
            firebase.database().ref(`/FindieGists`).child(user?.faculty).orderByKey().limitToLast(offset).on(`value`, async (snapshot) => {
                let val = snapshot.val()
                if (val) {
                    let poststemp: PostInterface[] = Object.keys(val).map(key => ({ id: key, ...JSON.parse(val[key]) })).reverse()
                    if (Posts.length > 0 && poststemp.length > 0) {
                        if (poststemp[0].id !== Posts[0].id) {
                            setPosts([])
                        }
                    }
                      
                    setPosts([...poststemp])
                   Plugins.Storage.set({ key: `Posts`, value: JSON.stringify(poststemp) })

                    if (offset > poststemp.length) {
                        setdisableInfinite(true)
                    }

                } else {
                    setPosts([])
                    setNoPost(true)
                }
                setPostsReady(true)

            })
        }
    }

    function IndicateNetChange(status: NetworkStatus) {
        let message, color, connected;
        if (status.connected) {

            message = `Back online`
            color = `dark`
            connected = true
            if (userid)
                database.ref(`onlineUsers`).child(userid).set(Date.now())
        }
        else {
            message = `Not connected`
            color = `danger`
            connected = false

        }

        setnetworkToast({ message, color, connected })
    }





    function onInfinite() {
        // getPosts(PostKeys, PostObj)
        const offset = 10
        if (user && Posts) {
            firebase.database().ref(`/FindieGists`).child(user?.faculty).orderByKey().endAt(Posts[Posts.length - 1].id).limitToLast(offset).on(`value`, async (snapshot) => {
                let val = snapshot.val()
                if (val) {
                    let poststemp: PostInterface[] = Object.keys(val).filter(key => key != Posts[Posts.length - 1].id).map(key => ({ id: key, ...JSON.parse(val[key]) })).reverse()
                    setPosts([...Posts, ...poststemp])
                    setPostsReady(true)
                    if (offset > poststemp.length) {
                        setdisableInfinite(true)
                    }

                }

            })
        } else {
            setdisableInfinite(true)
        }
    }
    // 


useIonViewDidEnter(()=>{
       async function init(){
            let localpost = (await getStorage(`Posts`)).value
            if (localpost && Posts.length<=0) {
               setPosts([...JSON.parse(localpost)])
               window.setTimeout(()=>{
                initRequest()
            },1000)
            Plugins.Network.getStatus().then(res => {
                if (!res.connected)
                    IndicateNetChange(res)
            })
            Plugins.Network.addListener(`networkStatusChange`, status => {
                console.log(`status changed`)
                IndicateNetChange(status)
    
            })
           }
        }
        init()
})
    function viewAuthor(author: userInterface) {
        setcurrentUser(author)
    }
    // 
    const openComments = (comms: any) => {
        setcomments(comms)
        setplay(true)
        setstop(false)
    }
    function updatePost(newPost: PostInterface, localpost = false) {

        if (localpost) {
            setMyPost(MyPost.map((p) => {
                if (p.id == newPost.id) {
                    return newPost
                }
                return p
            }))
            return
        }
        if (user && newPost) {

            setPosts(Posts.map((p) => {
                if (p.id == newPost.id) {
                    return newPost
                }
                return p
            }))
        }

    }

    let Infopost: PostInterface | undefined;
    function viewImages(post: PostInterface, local: boolean) {
        if (post.images)
            setcurrentImages({ local, images: Object.values(post.images) })
    }
    useIonViewDidEnter(() => {
        // if (document.body.classList.contains(`dark`)) {
        //     Plugins.StatusBar.setBackgroundColor({ color: `#152b4d` }).catch(console.log)
        // } else {
        //     Plugins.StatusBar.setBackgroundColor({ color: `#0d2c6d` }).catch(console.log)
        // }
    })
    useIonViewDidLeave(()=>{
        setchangePage(true)
        // setdisplayContent(false)
    })
    useIonViewDidLeave(()=>{
        setchangePage(false)
    })

    useIonViewWillEnter(() => {
        // Plugins.StatusBar.setOverlaysWebView({
        //     overlay: false
        // }).catch(() => { });
    })
    useIonViewDidEnter(()=>{
        setdisplayContent(true)
    })
    function jobDone(value: { id: string, done: boolean }) {
        // console.log(value)
        // let postss: any = MyPost.map((post, index) => {

        //     if (value.id == post.id) {
        //         let posts = MyPost
        //         posts[index] = { ...MyPost[index], email: `true` }
        //         return posts[index]
        //     }
        //     return post
        // })
        // setMyPost([...postss])
        // setMyPost(postss)
    }
    useEffect(() => {
        console.log(MyPost)
    }, [MyPost]);
    useEffect(() => {
        if (postsReady) {
            setdisableInfinite(false)
        }
    }, [postsReady]);
   
    useEffect(() => {
        if (Posts?.length>0) {
            // Plugins.Storage.set({ key: `Posts`, value: JSON.stringify(Posts) })
          }
        
    }, [Posts]);

    const [play, setplay] = useState(false);
    const [stop, setstop] = useState(false);
    return (
        <>
            {!postsReady && <IonFab style={{ transform: `scale(0.8) translateY(30px)` }} vertical={`top`} horizontal={`center`}>
                <IonFabButton color={`light`}>
                    <div className="ion-padding-horizontal">
                        <IonSpinner color={`danger`}></IonSpinner>
                    </div>
                </IonFabButton>
            </IonFab>
            }
            {/* <IonContent className={`gist`}>
            <IonLoading isOpen={changePage} onDidDismiss={()=>setchangePage(false)} ></IonLoading>


                <IonList >
                    <IonToolbar color={`light`}>
                        <IonModal cssClass={`mates-profile`} isOpen={currentUser ? true : false} onDidDismiss={() => { setcurrentUser(undefined) }}>
                            <IonContent>
                                <IonToolbar>
                                    <IonTitle color={`light`}>User Info</IonTitle>
                                    <IonButtons slot={`end`}>
                                        <IonButton color={`light`}>
                                            <IonBackdrop></IonBackdrop>
                                            <IonIcon icon={close} />
                                        </IonButton>
                                    </IonButtons>

                                </IonToolbar>
                                <div className="header-img-con">
                                    <IonImg onClick={() => { setviewImage(true) }} className={`popover-img`} src={currentUser?.image} />
                                </div>
                                <IonList>
                                    <IonItem><IonLabel>{`${currentUser?.firstName} ${currentUser?.lastName}`}</IonLabel></IonItem>
                                    <IonItem><IonLabel>{currentUser?.faculty}</IonLabel></IonItem>
                                    <IonItem><IonLabel>{currentUser?.department}</IonLabel></IonItem>
                                    <IonItem><IonLabel>{currentUser?.email}</IonLabel></IonItem>
                                    <IonItem><IonLabel>{currentUser?.proff}</IonLabel></IonItem>
                                </IonList>
                            </IonContent>
                        </IonModal >
                        <div className="imageless-text">
                        </div>

                        <AnimatePopover play={play} stop={stop} comments={comments} ondidDismiss={() => {
                            setstop(true);
                            setplay(false)
                        }}></AnimatePopover>
                     {
                            MyPost.length > 0 && MyPost.map((post, index) => {
                                return <SocialCard localImg={true} viewImages={() => { viewImages(post, true) }} updatePost={(post) => updatePost(post, true)} sendAuthorInfo={viewAuthor} popopen={openComments} Posts={post} key={index} ></SocialCard>
                            })
                        }

                        {!NoPost ? <>{
                            Posts.length > 0 ? Posts.map((post, index) => {
                                

                                return <SocialCard localImg={false} viewImages={() => { viewImages(post, false) }} updatePost={updatePost} sendAuthorInfo={viewAuthor} popopen={openComments} Posts={post} key={index} ></SocialCard>
                            }) : <><InitSkeleton></InitSkeleton><InitSkeleton></InitSkeleton><InitSkeleton></InitSkeleton></>
                        }</> : <>
                            <div className="no-post-con">
                                <img alt={``} className={`no-post two`} style={{ width: `100%` }} src={`https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MzV8fGZhc2hpb258ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`} />

                                <img alt={``} className={`no-post one`} style={{ width: `100%` }} src={`https://images.unsplash.com/photo-1557531365-e8b22d93dbd0?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8d2F0Y2hlc3xlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`} />
                                <img alt={``} className={`no-post two`} style={{ width: `100%` }} src={`https://images.unsplash.com/photo-1597106776019-b4ecc878c202?ixid=MXwxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZHVjdHN8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`} />
                                <img alt={``} className={`no-post two`} style={{ width: `100%` }} src={`https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MzR8fGJsYWNrJTIwYW1lcmljYW5zfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`} />
                            </div>
                            <IonButton className={`nopost-btn`} color={`danger`} onClick={() => { setcreateAgist(true) }}>Share something </IonButton>

                        </>}


                      
                        <CreateGist jobDone={jobDone} openModal={createAgist} closeModal={(gist: PostInterface) => { if (gist) { setMyPost([...MyPost, gist]) }; setcreateAgist(false) }}></CreateGist>

                        {Posts.length > 0 && !disableInfinite && <IonInfiniteScroll color={`danger`} onIonInfinite={onInfinite} disabled={disableInfinite}>
                            <IonInfiniteScrollContent></IonInfiniteScrollContent>
                        </IonInfiniteScroll>}

                        <IonModal isOpen={currentImages.images.length > 0} onDidDismiss={() => setcurrentImages({ local: false, images: [] })}>
                            <IonHeader>
                                <IonToolbar color={`primary`}>
                                    <IonBackdrop></IonBackdrop>
                                    <IonButton color={`light`} fill={`clear`} slot={`start`}>
                                        <IonIcon icon={arrowBack}></IonIcon>
                                    </IonButton>
                                    <IonTitle>view images</IonTitle>
                                </IonToolbar>
                            </IonHeader>
                            <IonContent>
                                {
                                    currentImages.images.map((img, index) => (!currentImages.local) ? <ImageDownload key={index} image={img} sendUrl={() => { }} /> : <IonImg src={img} />)
                                }
                                <IonList>

                                    <p className={`ion-padding`}>{Infopost?.message}</p>
                                    <p> {Infopost?.contact && <IonButton fill={`outline`} color={`dark`}>
                                        contact
                                         </IonButton>}</p>
                                    <p> {Infopost?.email && <IonButton fill={`outline`} color={`dark`}>
                                        email us
                                         </IonButton>}</p>
                                         
                            </IonList>
                        </IonContent>

                    </IonModal>

                    <FriendsModal isOpen={seefriends} onDidDismiss={() => { setseefriends(false) }}></FriendsModal>
                    
                    </IonToolbar>
                </IonList>
                <IonToast buttons={[{ side: `start` }]} cssClass={`network-toast`} position={`top`} mode={`ios`} onDidDismiss={() => setnetworkToast({ ...networkToast, message: `` })} duration={2600} isOpen={networkToast.message != ``} color={networkToast.color} message={networkToast.message} ></IonToast>
            </IonContent> */}
            {  <IonFab className={`option-fab`} horizontal="end" vertical="bottom">
                <IonFabButton onClick={() => { setcreateAgist(true) }} color={`tertiary`} >
                    <IonIcon icon={add} />
                </IonFabButton>

            </IonFab>}
       </> 
    )
}
export default Gist;

export const InitSkeleton: React.FC = () => {

    return (
        <React.Fragment >
            <IonGrid className={`skeleton`}>
                <IonRow>
                    <IonCol><IonSkeletonText animated className={`profile`}></IonSkeletonText></IonCol>
                    <IonCol style={{ textAlign: `center` }} size={`8`}> <IonSkeletonText className={`text`}></IonSkeletonText></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol> <IonSkeletonText className={`img`}></IonSkeletonText></IonCol>
                </IonRow>
                <IonRow><IonSkeletonText animated className={`text1`}></IonSkeletonText></IonRow>
                <IonRow>  <IonSkeletonText className={`text2`}></IonSkeletonText></IonRow>
            </IonGrid>
            <IonGrid className={`skeleton`}>
                <IonRow>
                    <IonCol><IonSkeletonText className={`profile`}></IonSkeletonText></IonCol>
                    <IonCol size={`8`}> <IonSkeletonText animated className={`text`}></IonSkeletonText></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol> <IonSkeletonText className={`img`}></IonSkeletonText></IonCol>
                </IonRow>
                <IonRow><IonSkeletonText className={`text1`}></IonSkeletonText></IonRow>
                <IonRow>  <IonSkeletonText className={`text2`}></IonSkeletonText></IonRow>
            </IonGrid>
        </React.Fragment>
    )
}


export const Appshare = (currentImgUrl: string) => {
    console.log(currentImgUrl)
    if (currentImgUrl != ``)
        Plugins.Share.share({ title: `findie post`, dialogTitle: `share this post`, url: currentImgUrl })
}
export const Download = (btnRef: React.RefObject<HTMLIonButtonElement>, currentImgUrl: string) => {
    Plugins.Clipboard.write({ url: currentImgUrl })
    const link = document.createElement('a');
    link.href = currentImgUrl;
    link.download = `post.jpg`;
    link.target = `__blank`
    link.click();


}
export const ReportPost = (post: PostInterface | undefined, userid: string | undefined) => {
    const database = firebase.database()
    let uid = userid
    if (!userid) {
        uid = Date.now() + ``
    }
    if (post)

        database.ref(`reported`).child(post.userid).set({ [uid + ``]: Date.now() }).then(() => {
            Plugins.Modals.alert({ message: `this post has been reported`, title: `Reported`, buttonTitle: `ok` })
                .catch(() => alert(`this post has been reported`))
        })


}


export function DeletePost(user: userInterface | any, database: any, currentPost: PostInterface) {
    if (user) {
        Plugins.Toast.show({ text: `Deleting Post...` })
        let images: string[] = Object.values(currentPost?.images)

        database.ref(`FindieGists/${user?.faculty}`).child(`${currentPost?.id}`).remove().then(() => {
            if (images.length <= 0) {
                Plugins.Toast.show({ text: `Deleting Post ${Math.ceil(Math.random() * 10)}%` }).then(() => {
                    Plugins.Toast.show({ text: `Post Deleted` })
                })
            }
        })


        for (let i = 0; i < images.length; i++) {

            storage().refFromURL(images[i]).delete().then(() => {
                if (i === images.length - 1) {
                    Plugins.Toast.show({ text: `Post has been Deleted` })
                }
            })
        }

    }

}























/** useEffect(() => {

     initializeFromDatabase()
        getStorage(`userid`).then((res)=>setuserid(res.value+``))


    }, [])
    function initializeFromDatabase(){
        Plugins.Storage.get({ key: `user` }).then((res) => {
            let user:userInterface = JSON.parse(res.value + ``)
           setuser(user)
           if (user){
              database.ref().child(`gists/${user?.faculty}`).limitToLast(numbGist).on(`value`, snap => {
                       let value = snap.val()

                       if (value) {
                        initPosts(value, true)
                        if(snap.key)
                        setkey(snap.key)
                        initAdverts(value,true)
                        setdisableInfinite(false)
                        if (Object.keys(value).length < numbGist) {
                            setdisableInfinite(true)
                        }
                    }
          })
        }
     })
    } */

    // function initPosts(value: any, firstTime = false,advertkey=false) {
        //     notifyUser(`Gists are now available 😍😍🤣💖`,`find out what your friends in your faculty are talking about `)

        //     if (value) {
        //         let arrayOfKeys = Object.keys(value)
        //        if(!advertkey)
        //       {  setkey(arrayOfKeys[0])
        //        }
        //     else{
        //         setadvertkey(arrayOfKeys[0])
        //     }
        //         if (!firstTime && arrayOfKeys.length > 1) {
        //             arrayOfKeys.pop()
        //         }
        //         arrayOfKeys = arrayOfKeys.reverse()
        //      try{  
        //         if(!firstTime)
        //          {    
        //         setPosts([...Posts, ...arrayOfKeys
        //             .map((key) => {
        //                 return { id: key, ...JSON.parse(value[key]) }
        //             })])
        //         }
        //         else{
        //             let temp=[...arrayOfKeys
        //                 .map((key) => {
        //                     return { id: key, ...JSON.parse(value[key]) }
        //                 })]
        //             if(temp.length==InitLength || InitLength==-1){
        //                 console.log(temp.length,InitLength)

        //                 InitLength=(temp.length)
        //                 setPosts(temp)
        //             }else{
        //                 setnotifyState(notifyState+1)
        //             }


        //         }
        //   }catch(e){
        //       console.log(e)
        //   }



        //     }
        //     else {
        //         Plugins.Toast.show({ text: `no information`, duration: `long`, position: `center` })
        //     }
        // }
        // function initAdverts(user:userInterface,firstTime=false){
            //    if(!firstTime)
            //    { database.ref(`adverts`).endAt(advertkey).limitToLast(3).on(`value`, snap => {
            //      if(snap.val()){
            //          initPosts(snap.val(),false,true)
            //          setadvertkey(snap.key+``)
            //          console.log(`adverts1`)
            //        }
            //      })
            //    }else{
            //     database.ref(`adverts`).limitToLast(3).on(`value`, snap => {

            //         if(snap.val()){
            //             console.log(`adverts2`)
            //             initPosts(snap.val(),false,true)
            //             setadvertkey(snap.key+``)
            //           }
            //         })
            //    }
            //    console.log(`adverts3`)
            // }
