import React, { useEffect, useRef, useState } from "react"
import { IonFab, IonFabButton, IonIcon, IonGrid, IonCol, IonRow, IonSkeletonText, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonActionSheet, IonPopover, IonImg, IonList, IonItem, IonLabel, IonButton, IonModal, IonToolbar, IonTitle, IonHeader, IonBackdrop, IonRefresher, IonRefresherContent, useIonViewDidEnter, useIonViewWillEnter, IonToast, IonAvatar, IonBadge, IonTabButton, IonInput } from "@ionic/react"
import { add, arrowBack, download, heart, shareSocialSharp, thumbsDown, trashBin } from "ionicons/icons";
import "./Gist.css"
import { AnimatePopover, ImageDownload, SocialCard } from "../components/SocialCard";
import firebase, { storage } from "firebase";
import { FilesystemDirectory, NetworkStatus, Plugins } from "@capacitor/core";
import { getStorage, notifyUser, userInterface } from "./Info";
import ViewPicture from "../components/ViewPicture";
import CreateGist from "../components/GistModal";
import { ModalContent } from "./MenuPages/MyPost";
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
    const [PostObj, setPostObj] = useState<any>();
    const [Posts, setPosts] = useState<PostInterface[]>([]);
    const [disableInfinite, setdisableInfinite] = useState(!true);
    const [currentImgUrl, setcurrentImgUrl] = useState(``);
    const atag = useRef<HTMLAnchorElement>(null)
     const [currentUser, setcurrentUser] = useState<userInterface>();
    const [currentPost, setcurrentPost] = useState<PostInterface>();
    const [currentImages, setcurrentImages] = useState<{ local: boolean, images: any[] }>({ local: false, images: [] });
    let btnRef = useRef<HTMLIonButtonElement>(null)
    const [NoPost, setNoPost] = useState(false);
    const [viewImage, setviewImage] = useState(false);
    const [createAgist, setcreateAgist] = useState(false);
    const [openReactions, setopenReactions] = useState<PostInterface | undefined>();
    const offset = 20
    const [seefriends, setseefriends] = useState(false);
    /**loading data sequencially to database */
    const [index, setindex] = useState({ initial: 0, final: offset });
    const [PostKeys, setPostKeys] = useState<string[]>([]);
    const [MyPost, setMyPost] = useState<PostInterface[]>([]);
    const refresherRef = useRef<HTMLIonRefresherElement>(null)
    const [networkToast, setnetworkToast] = useState({ message: ``, connected: true, color: `success` });
     const [postsReady, setPostsReady]=useState(false)
    useEffect(() => {

        initialteGist()
        Plugins.Network.getStatus().then(res => {
            if (!res.connected)
                IndicateNetChange(res)
        })
        Plugins.Network.addListener(`networkStatusChange`, status => {
            console.log(`status changed`)
            IndicateNetChange(status)

        })

    }, []);

    async function initialteGist() {
        let storedGist = (await getStorage(`gistIndex`)).value
        let userstring = (await getStorage(`user`)).value
        if (storedGist && userstring) {
            let storedArray: string[] = JSON.parse(storedGist)
            let user: userInterface = JSON.parse(userstring)
            database.ref().child(`gistIndex/${user?.faculty}`).limitToLast(1).once(`value`, (snapshot) => {
                let value = snapshot.val()
                if (value) {
                    let key = Object.keys(value)[0]
                    if (key == storedArray[0]) {
                        setPostKeys(storedArray)
                        let temp: any = {}

                        storedArray.forEach((key) => {
                            temp[key] = null

                        })
                        setPostObj(temp)
                        let init = true
                        getPosts(storedArray, temp, init)
                        setdisableInfinite(false)
                    } else {
                        InitialDatabaseFetch()
                    }
                }
            })
        } else {
            InitialDatabaseFetch()
        }

    }

    function IndicateNetChange(status: NetworkStatus) {
        let message, color, connected;
        if (status.connected) {

            message = `Back online`
            color = `dark`
            connected = true
            if(userid)
            database.ref(`onlineUsers`).child(userid).set(Date.now())
        }
        else {
            message = `Not connected`
            color = `danger`
            connected = false

        }

        setnetworkToast({ message, color, connected })
    }

    const getReactions = (post: PostInterface | undefined) => {
        setopenReactions(post)
    }


    async function InitialDatabaseFetch() {
        try {
            Plugins.Storage.get({ key: `user` }).then((res) => {
                let user: userInterface = JSON.parse(res.value + ``)
                setuser(user)
                if (user) {
                    database.ref().child(`gistIndex/${user?.faculty}`).once(`value`, (snapshot) => {
                        let value = snapshot.val()
                        if (value) {
                            let keys: string[] = Object.keys(value).reverse()
                            Plugins.Storage.set({ key: `gistIndex`, value: JSON.stringify(keys) })
                            setPostKeys(keys)
                            let temp: any = {}

                            keys.forEach((key) => {
                                temp[key] = null

                            })
                            setPostObj(temp)
                            let init = true
                            getPosts(keys, temp, init)
                            setdisableInfinite(false)

                        }
                        else {
                            setNoPost(true)
                        }
                    })
                }
            })
        } catch { }
    }


    async function getPosts(keys: string[], PostObj: any, init = false) {
        let initial = init
        try {
            let tempObj: any = PostObj
            Plugins.Storage.get({ key: `user` }).then((res) => {
                let user: userInterface = JSON.parse(res.value + ``)
                setuser(user)
                if (user) {

                    for (let i = 0 ; i < keys.length;i++)  {
                         let key=keys[i]
                        if (i < index.final && i >= index.initial) {
                            database.ref(`gists/${user.faculty}`).child(key).once(`value`, snap => {
                                let value = snap.val()
                                if (initial) {
                                    setPosts([])
                                    initial = false
                                }


                                if (value) {
                                    if (snap.key) {
                                        tempObj[snap.key] = JSON.parse(value)
                                        setPostObj(tempObj)
                                        let tempArray: any = Object.keys(tempObj).filter(key => tempObj[key] != null).map((key) => {
                                            ; return { id: key, ...tempObj[key] }
                                        })
                                        setPosts([...tempArray])
                                        refresherRef.current?.complete()
                                        if (i == 0) {
                                            notifyUser(`Gists are now available`, `find out what your friends in your faculty are talking about `)
                                        }
                                       if(i==index.final-1){
                                        setPostsReady(true)
                                       }
                                    }
                                }
                            })
                            if (i == keys.length - 1) {
                                setdisableInfinite(true)
                            }
                        }


                    }
                    setindex({ final: index.final + offset, initial: index.final })
                }

            })
        } catch { }
    }

    function onInfinite() {
        getPosts(PostKeys, PostObj)
    }
    // 


    function RefreshState() {
        setindex({ final: 0, initial: 0 })
        setindex({ final: 0, initial: 0 })
        InitialDatabaseFetch()
    }
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
            database.ref(`gists/${user.faculty}/`).child(newPost.id).set(JSON.stringify(newPost))
            setPosts(Posts.map((p) => {
                if (p.id == newPost.id) {
                    return newPost
                }
                return p
            }))
        }

  }

  function DeletePost(){
   if(user){
    database.ref(`gists/${user?.faculty}`).child(`${currentPost?.id}`).remove( )
    let images:string[]=  Object.values(currentPost?.images) 
    for(let i=0; i<images.length;i++){
        storage().ref(images[i]).delete().then(()=>{
            if(i===images.length-1){
                Plugins.Toast.show({text:`Deleted Post`})
            }
        })
    }

   }

}
    let Infopost: PostInterface | undefined;
    function viewImages(post: PostInterface, local: boolean) {
        if (post.images)
            setcurrentImages({ local, images: Object.values(post.images) })
    }
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
    const [text, settext] = useState(``);

    const [play, setplay] = useState(false);
    const [stop, setstop] = useState(false);
    return (
        <>
            <IonContent className={`gist`}>
                {/* <IonItem>
                    <IonInput onIonChange={(e)=>settext(e.detail.value+``)}></IonInput>
                    <IonButton onClick={()=>jobDone({id:text,done:true})} ></IonButton>
                </IonItem> */}
                <IonRefresher onIonRefresh={RefreshState} ref={refresherRef} slot={`fixed`}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <IonList >
                    {/* <div style={{height:`100%`}} > */}
                    <IonPopover isOpen={currentUser ? true : false} onDidDismiss={() => { setcurrentUser(undefined) }}>
                        <IonImg onClick={() => { setviewImage(true) }} className={`popover-img`} src={currentUser?.image} />
                        <IonContent>
                            <IonList style={{ height: `100px`, overflow: `scroll` }}>
                                <IonItem><IonLabel>{`${currentUser?.firstName} ${currentUser?.lastName}`}</IonLabel></IonItem>
                                <IonItem><IonLabel>{currentUser?.faculty}</IonLabel></IonItem>
                                <IonItem><IonLabel>{currentUser?.department}</IonLabel></IonItem>
                                <IonItem><IonLabel>{currentUser?.email}</IonLabel></IonItem>
                                <IonItem><IonLabel>{currentUser?.proff}</IonLabel></IonItem>
                            </IonList>
                        </IonContent>
                    </IonPopover>
                    <div className="imageless-text">
                    </div>
                    <ViewPicture description={currentPost?.message ? currentPost?.message : ``} isOpen={viewImage} OndidDismiss={() => setviewImage(false)} imageRef={currentUser?.image + ``}></ViewPicture>
                    <a href={currentImgUrl} ref={atag} download></a>
                    <AnimatePopover play={play} stop={stop} comments={comments} ondidDismiss={() => {
                        setstop(true);
                        setplay(false)
                    }}></AnimatePopover>
                    {
                        MyPost.length > 0 && MyPost.map((post, index) => {
                            return <SocialCard localImg={true} viewImages={() => { viewImages(post, true) }} updatePost={(post) => updatePost(post, true)} ReportPost={() => setcurrentPost(post)} sendAuthorInfo={viewAuthor} shareSocial={(url: string) => setcurrentImgUrl(url)} popopen={openComments} Posts={post} key={index} ></SocialCard>
                        })
                    }

                    {!NoPost ? <>{
                        Posts.length > 0 && postsReady ? Posts.map((post, index) => {
                            console.log(post?.images)
                            return <SocialCard localImg={false} viewImages={() => { viewImages(post, false) }} updatePost={updatePost} ReportPost={() => setcurrentPost(post)} sendAuthorInfo={viewAuthor} shareSocial={(url: string) => setcurrentImgUrl(url)} popopen={openComments} Posts={post} key={index} ></SocialCard>
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

                    {Posts.length > 0 && <IonInfiniteScroll color={`danger`} onIonInfinite={onInfinite} disabled={disableInfinite}>
                        <IonInfiniteScrollContent></IonInfiniteScrollContent>
                    </IonInfiniteScroll>}
                    <IonActionSheet translucent isOpen={currentImgUrl != ``} onDidDismiss={() => setcurrentImgUrl(``)}
                        buttons={[{ text: `share`, icon: shareSocialSharp, handler: () => Appshare(currentImgUrl) },
                        { text: `Reactions`, icon: heart, handler: () => getReactions(currentPost) },
                        { text: `download`, icon: download, handler: () => Download(btnRef, currentPost?.images[`0`]) }, { text: `report`, icon: thumbsDown, handler: () => ReportPost(currentPost, userid) },currentPost?.userid ==userid?{text:`Delete`, icon:trashBin, handler:DeletePost}:{}]} ></IonActionSheet>

                    <IonButton style={{ display: `none` }} download={currentImgUrl} ref={btnRef}></IonButton>
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
                    <IonModal mode={`ios`} swipeToClose isOpen={openReactions != undefined} onDidDismiss={() => { setopenReactions(undefined) }}>
                        <ModalContent posts={openReactions}></ModalContent>
                    </IonModal>
                    <FriendsModal isOpen={seefriends} onDidDismiss={() => { setseefriends(false) }}></FriendsModal>
                </IonList>
                <IonToast buttons={[{ side: `start` }]}  cssClass={`network-toast`} position={`top`} mode={`ios`} onDidDismiss={() => setnetworkToast({ ...networkToast, message: `` })} duration={2600} isOpen={networkToast.message != ``} color={networkToast.color} message={networkToast.message} ></IonToast>
            </IonContent>
            {  <IonFab className={`option-fab`} horizontal="end" vertical="bottom">
                <IonFabButton onClick={() => { setcreateAgist(true) }} color={`tertiary`} >
                    <IonIcon icon={add} />
                    {/* <IonBadge color={`danger`}>3</IonBadge> */}
                </IonFabButton>
                {/* <IonFabList side={`top`}> */}

                {/* <IonFabButton onClick={() => { setcreateAgist(true) }} color={`primary`} >
                        <IonIcon icon={add} />
                    </IonFabButton> */}
                {/* <IonFabButton  >
                        <IonIcon icon={notifications} />
                        <IonBadge color={`danger`}>3</IonBadge> 
                       </IonFabButton> */}
                {/* <IonFabButton onClick={() => setseefriends(true)} > */}
                {/* <IonIcon icon={people} /> */}
                {/* {notifyState>0&&  <IonBadge color={`danger`}>{notifyState}</IonBadge>} */}
                {/* </IonFabButton> */}
                {/* </IonFabList> */}
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
                link.href = currentImgUrl ;
                 link.download = `post.jpg`;
                 link.target=`__blank`
                link.click();
    // fetch(currentImgUrl, { mode: `no-cors` }).then(res => {

    //     res.blob().then((res) => {
    //         let value = res
    //         let fr = new FileReader()
    //         fr.onload = () => {
    //             const link = document.createElement('a');
    //             link.href = fr.result + ``;
    //             document.body.appendChild(link);
    //             link.download = `post.jpg`
    //             link.click();
    //             document.body.removeChild(link);
    //             Plugins.Filesystem.writeFile({ data: fr.result + ``, path: `findie`, directory: FilesystemDirectory.Data }).then(() => {
    //                 Plugins.Toast.show({ text: `saved`, duration: `short`, position: `center` })
    //             })
    //         }
    //         fr.readAsDataURL(value)

    //     })
    // }) 

}
const ReportPost = (post: PostInterface | undefined, userid: string | undefined) => {
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
