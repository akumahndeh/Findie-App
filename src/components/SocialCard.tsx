// import { Plugins } from '@capacitor/core'
// import { CreateAnimation, IonActionSheet, IonAvatar, IonBadge, IonButton, IonCard, IonCardContent, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonModal, IonNote, IonProgressBar, IonRow, IonSlide, IonSlides, IonText, IonToolbar } from '@ionic/react'
// import firebase from 'firebase'
// import { chatbubbleOutline, ellipsisVertical, heart, heartOutline, paperPlaneOutline, person, logoWhatsapp, mail, chatbox, call, download, shareSocialSharp, thumbsDown, trashBin } from 'ionicons/icons'
import React, { useEffect, useRef, useState } from 'react'
// import { Appshare, DeletePost, PostInterface } from '../pages/Gist'
// import { getStorage, userInterface } from '../pages/Info'
// import TimeAgo from 'timeago-react';

// import "./socialCard.css"
// import ReactLinkify from 'react-linkify'
// import { chime } from '../pages/chime'
// import FormatForReading from './FormatForReading'
// import { ModalContent } from '../pages/MenuPages/MyPost'
// import { LaughColumnIcon, LikeColumnIcon } from './likeColumnIcon'

// interface commentInterface {
//     author: string,
//     date: string,
//     message: string,
//     authorimg: string
// }

const SocialCard = ()=>(<div></div>)

// const SocialCard: React.FC<{ localImg: boolean, Posts: PostInterface, viewImages: Function, popopen: Function, updatePost: (post: PostInterface) => void, sendAuthorInfo: (author: userInterface) => void }> = (props) => {
//     const { popopen, Posts } = props
//     let colors = [`secondary`, `danger`, `primary`, `warning`, `dark`, `medium`, `tertiary`, `dark`, `success`, `light`]
//     // const [author, setauthor] = useState<any | userInterface>({ firstName: ``, lastName: ``, image: person });
//     const [image, setimage] = useState(``);
//     const [readmore, setreadmore] = useState(false);
//     const [userid, setuserid] = useState(``);
//     const [disabled, setdisabled] = useState(true);
//     const [imageUrls, setimageUrls] = useState<string[]>([]);
//     const [currentAuthor, setcurrentAuthor] = useState<userInterface>();
//     const [uid, setuid] = useState<string>();
//     const [imageLoaded] = useState(false);
//     const audioRef = useRef<HTMLAudioElement>(null)
//     const [randColor] = useState(colors[Math.round(Math.random() * 100) % colors.length]);
//     const [, setPostImages] = useState<any>(<div></div>);
//     const [contactPerson, setcontactPerson] = useState(false);
//     const database = firebase.database()
//     const [user, setuser] = useState<userInterface>();
//     const [isOnline, setisOnline] = useState(false);
//     const [slideIndex, setslideIndex] = useState(0);
//     const [progress, setprogress] = useState(true);
//     const [openActionSheet, setopenActionSheet] = useState(false);
//     const [openReactions, setopenReactions] = useState<boolean>(false);
//     const [PostImagesLength, setPostImagesLength] = useState<number>(0);
//     const [PostLikesLength, setPostLikesLength] = useState<number>(0);
//     const [PostlaughsLength, setPostlaughsLength] = useState<number>(0);
//     const [PostcommentTextLength, setPostcommentTextLength] = useState<number>(0);



//     const getOptions = () => {
//         setopenActionSheet(true)
//     }

//     let t: any
//     useEffect(() => {
//         if (t) {
//             window.clearTimeout(t)
//         }
//         t = setTimeout(() => {
//             setprogress(false)
//             window.clearTimeout(t)
//         }, 10000);
//         if (!props.localImg) {
//             let onlineRef = database.ref(`onlineUsers`)
//             onlineRef.child(Posts?.userid).on(`value`, snapshot => {
//                 if (snapshot.val()) {
//                     setisOnline(true)
//                 } else {
//                     setisOnline(false)
//                 }
//             })
//         }
//     }, []);


//     function initializeAuthor() {

//         getStorage(Posts?.userid).then((res) => {
//             let value = res.value
//             if (!value) {
//                 let authorref = database.ref(`users/${Posts?.userid}`)
//                 authorref.on(`value`, snap => {
//                     // setauthor(snap.val())
//                     setcurrentAuthor(snap.val())
//                     Plugins.Storage.set({ key: Posts?.userid, value: JSON.stringify(snap.val()) })
//                     getStorage(`mates`).then((res) => {
//                         let value = res.value;
//                         if (value) {
//                             let mates: any = JSON.parse(value)
//                             mates[Posts?.userid] = snap.val().lastName
//                             Plugins.Storage.set({ key: `mates`, value: JSON.stringify(mates) })
//                         }
//                     })
//                 })
//             } else {
//                 let author = JSON.parse(value)
//                 // setauthor(author)
//                 setcurrentAuthor(author)
//             }

//         })
//     }
//     useEffect(() => {
//         initializeAuthor()
//         getStorage(`user`).then((user) => {
//             let u = JSON.parse(user.value + ``)
//             let image = u.image
//             setimage(image)
//             if (u)
//                 setuser(u)
//             return
//         })
//         getStorage(`userid`).then((res) => {
//             setuid(res.value + ``)
//         })
//         // updatePostProp(`viewedPeople`)
//     }, [])


//     function comment(event: any) {
//         event.preventDefault()
//         let comment = event.target.comment.value
//         event.target.comment.value = ``
//         audioRef.current?.play()
//         Plugins.Storage.get({ key: `userid` }).then((res) => {
//             let userid = res.value + ``
//             Plugins.Storage.get({ key: `user` }).then((res) => {
//                 let user = JSON.parse(res.value + ``)
//                 let info = {
//                     author: userid,
//                     date: (new Date()).toDateString(),
//                     message: comment,
//                     authorimg: user.image
//                 }

//                 updatePost({ ...Posts, commentText: { ...Posts.commentText, [Date.now() + `` + Math.random()]: info } })
//                 // let postref = database.ref(`gists/${user.faculty}/${Posts?.id}`)
//                 // postref.child(`commentText`).push(info).catch(console.log)
//             })
//         })
//     }
//     const showComment = () => {
//         if (Posts) {
//             if (Posts?.commentText)
//                 return Object.values(Posts?.commentText).map((val: any, index) => {
//                     return (<CommentItem key={index} {...{ ...val }}></CommentItem>)

//                 })

//         }
//     }
//     function getImages() {
//         if (Posts) {

//             if (Posts?.images) {
//                 return Object.values(Posts?.images).map((img: any, index) => {
//                     if (index > 0) return ``
//                     if (!props.localImg)
//                         return (<IonSlide key={index}>
//                             <ImageDownload sendUrl={(url: string) => appendUrl(url)} key={index} image={img} />
//                         </IonSlide>)
//                     else {
//                         return <IonSlide> <IonImg src={img} /></IonSlide>
//                     }
//                 })
//             }

//             else return ([``])
//         }
//         return [``]
//     }
//     function appendUrl(url: string) {
//         setimageUrls([...imageUrls, url])
//     }
//     function aboutAuthor() {
//         if (currentAuthor) {
//             props.sendAuthorInfo(currentAuthor)
//         }
//     }
//     function objectLength(object: any) {
//         console.log(object)
//         if (object) {
//             return Object.values(object).length
//         }
//         else return 0
//     }

//     function updatePostProp(property: `likes` | `laughs` | `viewedPeople`) {
//         let tempPost: PostInterface = Posts

//         if (uid) {
//             if (tempPost[property]) {
//                 if (verifyBooleanProp(property)) {
//                     tempPost[property] = { ...tempPost[property], [uid]: null }
//                     updatePost(tempPost)
//                 } else {
//                     tempPost[property] = { ...tempPost[property], [uid]: Date.now() }
//                     updatePost(tempPost)
//                     if (property == `laughs` || property == `likes`) {
//                         audioRef.current?.play()
//                     }
//                 }

//             } else {
//                 tempPost = { ...tempPost, [property]: { [uid]: Date.now() } }
//                 updatePost(tempPost)
//                 console.log(tempPost)
//             }
//         }
//     }

//     function verifyBooleanProp(property: `likes` | `laughs` | `viewedPeople`) {
//         let tempPost: PostInterface = Posts
//         if (uid) {
//             if (tempPost[property]) {
//                 let tempProp = tempPost[property]
//                 if (tempProp[uid]) {
//                     return true
//                 }
//                 else return false
//             }
//             return false
//         }
//         return false
//     }
//     function updatePost(newPost: PostInterface) {
//         props.updatePost(newPost)
//         if (user) {
//             database.ref(`FindieGists/${user.faculty}/`).child(newPost.id).set(JSON.stringify(newPost)).then(() => { }).catch(alert)

//         }
//     }
//     let k = 0

//     useEffect(() => {
//         if (Posts) {
//             if (k == 0) {
//                 setPostImages(getImages())
//                 k++
//             }
//             if (Posts.images) {
//                 setPostImagesLength(Object.values(Posts.images).length)
//             }
//             if (Posts.commentText) {
//                 setPostcommentTextLength(Object.values(Posts.commentText).length)
//             }
//             if (Posts.laughs) {
//                 setPostlaughsLength(Object.values(Posts.laughs).length)
//             }
//             if (Posts.likes) {
//                 setPostLikesLength(Object.values(Posts.images).length)
//             }
//         }
//     }, [Posts]);

//     function contactFriend(type: `whatsapp` | `text` | `mail` | `call`) {
//         let link = ``, friend: userInterface = author ? author : user
//         console.log(friend, `friend`)
//         let number = friend?.number.indexOf(`+`) == 0 ? friend.number : friend?.number.indexOf(`237`) == 0 ? `+` + friend?.number : `+237${friend?.number}`;
//         switch (type) {
//             case `whatsapp`: link = `https://api.whatsapp.com/send?phone=${number}&text=Regarding%20your%20post%20on%20Findie%20:%20`
//                 break;
//             case `text`: link = `sms:${friend?.number}&body=Regarding%20your%20post%20on%20Findie%20:%20`; break;
//             case `call`: link = `tel:${number}`; break;
//             case `mail`: link = `mailto:${friend?.email}`; break;

//             default:
//                 break;
//         }
//         let a = window.document.createElement(`a`)
//         a.href = link
//         a.target = `__blank`
//         a.click()
//         window.document.removeChild(a)
//     }

//     async function updateIndex(target: any) {

//         setslideIndex(await target.getActiveIndex())
//     }
//     useEffect(() => {
//         async function inituid() {
//             let uid = (await getStorage(`userid`)).value
//             if (uid)
//                 setuserid(uid)
//         }
//         inituid()
//     }, [])

//     return (
//         <IonCard className="social-card">
//             <a href="mailto:"></a>
//             <audio ref={audioRef} src={chime}></audio>
//             <IonItem lines={`none`} className={`header`}>
//                 <div className="avatar-online">
//                     <IonAvatar onClick={aboutAuthor}>
//                         {props.localImg ? <IonImg src={image} /> : <IonImg src={author?.image == person ? `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm_pzCGUjj2_BmLkB5HYgELYffuJ_aOQrAbQ&usqp=CAU` : author?.image}></IonImg>
//                         }
//                     </IonAvatar>
//                     {(isOnline || props.localImg) && <IonBadge color={`danger`}> </IonBadge>}
//                 </div>
//                 <IonChip color={`light`}>  <IonLabel color={`dark`} onClick={aboutAuthor} style={{ textTransform: `capitalize` }}>{!props.localImg ? `${author?.firstName} ${author?.lastName}` : `You`}</IonLabel>
//                 </IonChip>
//                 <IonButton slot={`end`} onClick={getOptions} color={`dark`} fill={`clear`}>
//                     <IonIcon icon={ellipsisVertical}></IonIcon>
//                 </IonButton>
//             </IonItem>

//             {progress && Posts?.email == `false` && <IonProgressBar color={PostImagesLength <= 0 ? randColor : `primary`} type={`indeterminate`}  ></IonProgressBar >}
//             {Posts?.images != undefined && Posts?.images != null && <div className={`img-container`}>

//                 <IonSlides onIonSlideDidChange={(e) => updateIndex(e.currentTarget)} pager={PostImagesLength > 1} style={{ ...(PostImagesLength > 1 ? { paddingBottom: `40px`, marginBottom: `-10px` } : {}) }}>
//                     {Object.values((Posts?.images) ? Posts?.images : {}).map((img: any, index) => {
//                         // if (!props.localImg)
//                         if (PostImagesLength == 1) return <IonSlide key={index}>
//                             <ImageOneDownload sendUrl={(url: string) => appendUrl(url)} key={index} image={img} />
//                         </IonSlide>
//                         return (<IonSlide key={index}>
//                             <ImageDownload sendUrl={(url: string) => appendUrl(url)} key={index} image={img} />
//                         </IonSlide>)

//                     })
//                     }


//                 </IonSlides>
//             </div>}
//             {Posts?.message && PostImagesLength ?
//                 <IonItem lines={`none`} onClick={() => setreadmore(true)}>
//                     <ReactLinkify >
//                         {!readmore ?
//                             <IonLabel> {Posts?.message} </IonLabel>
//                             :
//                             <IonText>
//                                 {Posts?.message}
//                             </IonText>
//                         }
//                     </ReactLinkify>
//                 </IonItem> : Posts?.message &&
//                 <IonToolbar className={`imageless-text`} color={randColor}>
//                     <ReactLinkify >
//                         <IonLabel>
//                             <FormatForReading text={Posts?.message} />
//                         </IonLabel>
//                     </ReactLinkify>
//                 </IonToolbar>

//             }
//             <IonToolbar>

//                 <IonGrid className={`card-grid`}>

//                     <IonRow className={`reactions`}>
//                         <LikeColumnIcon Posts={Posts} verifyBooleanProp={verifyBooleanProp} updatePostProp={updatePostProp}></LikeColumnIcon>
//                         <IonCol onClick={() => { popopen(showComment()) }} >
//                             <IonButton fill={`clear`} color={`dark`}> <label>{PostcommentTextLength}</label><IonIcon size={`large`} icon={chatbubbleOutline}></IonIcon></IonButton></IonCol>
//                             <LaughColumnIcon Posts={Posts} verifyBooleanProp={verifyBooleanProp} updatePostProp={updatePostProp}></LaughColumnIcon>

//                         {Posts?.contact && <IonCol>
//                             <IonButton onClick={() => setcontactPerson(true)} fill={`clear`} color={`primary`}>
//                                 <IonIcon size={`large`} icon={paperPlaneOutline}></IonIcon>
//                             </IonButton>
//                             <IonActionSheet header={`Contact ${author?.lastName ? author?.lastName : `Friend`}`}
//                                 isOpen={contactPerson}
//                                 onDidDismiss={() => { setcontactPerson(false) }}
//                                 buttons={[{ text: `whatsapp`, icon: logoWhatsapp, handler: () => { contactFriend(`whatsapp`) } },
//                                 { text: `call`, icon: call, handler: () => { contactFriend(`call`) } },
//                                 { text: `text`, icon: chatbox, handler: () => { contactFriend(`text`) } },
//                                 { text: `email`, icon: mail, handler: () => { contactFriend(`mail`) } }]}  ></IonActionSheet>

//                         </IonCol>}
//                     </IonRow>

//                     <>
//                         {objectLength(Posts?.commentText) > 0 &&
//                             <IonRow>
//                                 <div className="ion-item comments">
//                                     <IonNote onClick={() => { popopen(showComment()) }}>view all {showComment()?.length} comments</IonNote>
//                                 </div>

//                             </IonRow>}</>
//                 </IonGrid>

//                 <form action="" onSubmit={comment}>
//                     <IonItem lines={`none`} className={`header`}>
//                         <IonAvatar>
//                             <IonImg src={image}></IonImg>
//                         </IonAvatar>
//                         <IonInput name={`comment`} onIonChange={(event: any) => setdisabled(event.target.value == `` ? true : false)} className={`comment`} placeholder={`Add a comment`} />
//                         <IonButton type={`submit`} fill={`clear`} disabled={disabled}>POST</IonButton>
//                     </IonItem>
//                 </form>
//                 <div style={{ textAlign: `left`, padding: `0 20px `, color: `gray` }}><small>
//                     {Date.now() - Posts.date2 < 60000 ? `just now` : <TimeAgo
//                         datetime={Posts.date2}
//                         locale='en'
//                     />}
//                 </small>

//                 </div>
//                 <IonActionSheet translucent isOpen={openActionSheet} onDidDismiss={() => setopenActionSheet(false)}
//                     buttons={[{ text: `share`, icon: shareSocialSharp, handler: () => Appshare(Posts.images[slideIndex]) },
//                     { text: `Reactions`, icon: heart, handler: () => setopenReactions(true) },
//                     { text: `download`, icon: download, handler: () => { } },
//                     { text: `report`, icon: thumbsDown, handler: () => ReportPost(Posts, userid) }, Posts?.userid == userid ? { text: `Delete`, icon: trashBin, handler: () => DeletePost(user, firebase.database(), Posts) } : ``]} ></IonActionSheet>

//                 <IonModal mode={`ios`} swipeToClose isOpen={openReactions} onDidDismiss={() => { setopenReactions(false) }}>
//                     <ModalContent posts={Posts}></ModalContent>
//                 </IonModal>
//             </IonToolbar>
//         </IonCard>
//     )
// }

export { SocialCard }


// const CommentItem: React.FC<commentInterface> = (props) => {
//     const database = firebase.database()
//     const [name, setname] = useState(``);
//     Plugins.Storage.get({ key: `user` }).then(() => {
//         database.ref(`users/${props.author}`).child(`firstName`).once(`value`, (snapshot) => {
//             setname(snapshot.val())
//         })
//     })
//     return (
//         <IonItem style={{ padding: `0` }} >
//             <IonAvatar slot={`start`}>
//                 <IonImg src={props.authorimg == person ? `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm_pzCGUjj2_BmLkB5HYgELYffuJ_aOQrAbQ&usqp=CAU` : props.authorimg} />
//             </IonAvatar>
//             <ReactLinkify>
//                 <IonText style={{ fontSize: `13px` }} ><b>{name} </b> {props.message}</IonText>
//             </ReactLinkify>
//         </IonItem>
//     )
// }

// export const ImageDownload: React.FC<{ image: string, sendUrl: Function }> = ({ image, sendUrl }) => {
//     const [img, setimg] = useState(image)
//     const [imageLoaded, setimageLoaded] = useState(false);


//     return (
//         <> <div className={`image-download`}
//         >


//             <IonImg className={`post-img`}
//                 onIonImgDidLoad={() => { setimageLoaded(true); }}
//                 style={{
//                     opacity: imageLoaded ? `blur(0)` : `blur(2px)`, transition: `0.8s`,
//                     width: `100%`,
//                     transform: imageLoaded ? `scale(1)` : `scale(0.9777)`,
//                 }}
//                 src={img} alt={``} />

//         </div>
//         </>

//     )
// }


// export const ImageOneDownload: React.FC<{ image: string, sendUrl: Function }> = ({ image, sendUrl }) => {
//     const [img, setimg] = useState(image)
//     const [imageLoaded, setimageLoaded] = useState(false);


//     return (
//         <>

//             <IonImg className={`post-img one`}
//                 onIonImgDidLoad={() => { setimageLoaded(true); }}
//                 style={{
//                     filter: imageLoaded ? `blur(0)` : `blur(2px)`, transition: `1.2s`,
//                     width: `100%`,
//                     transform: imageLoaded ? `scale(1)` : `scale(0.9777)`,
//                     zIndex: 20
//                 }}
//                 src={img} alt={``} />


//         </>

//     )
// }

// export const AnimatePopover: React.FC<{ comments: any[] | undefined, stop: boolean, play: boolean, ondidDismiss: Function }> = ({ comments, play, ondidDismiss }) => {

//     return (
//         <IonModal swipeToClose cssClass={`animated-popover`} mode={`ios`} isOpen={play} onDidDismiss={() => ondidDismiss()}>
//             <IonHeader >
//                 <IonToolbar color={`primary`}>
//                     <IonLabel > comments</IonLabel>
//                 </IonToolbar>
//             </IonHeader>
//             <IonContent className={`comment-card`}>

//                 <IonCardContent>
//                     {
//                         comments
//                     }
//                 </IonCardContent>
//             </IonContent>
//             {/* {play && <div onClick={() => ondidDismiss()} className="back-drop"> </div>} */}

//         </IonModal>

//     )
// }

// function ReportPost(currentPost: any, userid: any): boolean | void | Promise<boolean | void> {
//     throw new Error('Function not implemented.')
// }

