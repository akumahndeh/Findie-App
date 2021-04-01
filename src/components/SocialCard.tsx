import { Plugins } from '@capacitor/core'
import { CreateAnimation, IonActionSheet, IonAvatar, IonBadge, IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonModal, IonNote, IonProgressBar, IonRow, IonSlide, IonSlides, IonText, IonToolbar } from '@ionic/react'
import firebase from 'firebase'
import { chatbubbleOutline, ellipsisVertical, heart, heartOutline, paperPlaneOutline, person, logoWhatsapp, mail, chatbox, call } from 'ionicons/icons'
import React, { useEffect, useRef, useState } from 'react'
import { Assets } from '../media/images/images'
import { PostInterface } from '../pages/Gist'
import { getStorage, userInterface } from '../pages/Info'
import TimeAgo from 'timeago-react';

import "./socialCard.css"
import ReactLinkify from 'react-linkify'
import { chime } from '../pages/chime'
import FormatForReading from './FormatForReading'

interface commentInterface {
    author: string,
    date: string,
    message: string,
    authorimg: string
}

const SocialCard: React.FC<{ localImg: boolean, ReportPost: Function, Posts: PostInterface, viewImages: Function, updatePost: (newPost: PostInterface) => void, popopen: Function, shareSocial: Function, sendAuthorInfo: (author: userInterface) => void }> = (props) => {
    const { popopen, Posts } = props
    let colors = [`secondary`, `danger`, `primary`, `warning`, `dark`, `medium`, `tertiary`, `dark`, `success`, `light`]
    const [author, setauthor] = useState<any | userInterface>({ firstName: ``, lastName: ``, image: person });
    const [image, setimage] = useState(``);
    const [readmore, setreadmore] = useState(false);
    const [disabled, setdisabled] = useState(true);
    const [imageUrls, setimageUrls] = useState<string[]>([]);
    const [currentAuthor, setcurrentAuthor] = useState<userInterface>();
    const [uid, setuid] = useState<string>();
    const [imageLoaded] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null)
    const [randColor] = useState(colors[Math.round(Math.random() * 100) % colors.length]);
    const [, setPostImages] = useState<any>(<div></div>);
    const [contactPerson, setcontactPerson] = useState(false);
    const database = firebase.database()
    const [user, setuser] = useState<userInterface>();
    const [isOnline, setisOnline] = useState(false);
    const [slideIndex, setslideIndex] = useState(0);
    const [progress, setprogress] = useState(true);

    const getOptions = () => {
        let urls=``
       
        if (imageUrls.length>0){
            
            props.shareSocial(imageUrls[slideIndex])
        }else{
            props.shareSocial(Posts.message)
        }
        props.ReportPost()
    }

    let t:any
    useEffect(() => {
        if(t){
            window.clearTimeout(t)
        }
        t=setTimeout(() => {
            setprogress(false)
            window.clearTimeout(t)
        }, 10000);
        if(!props.localImg){
             let onlineRef= database.ref(`onlineUsers`)
             onlineRef.child(Posts?.userid).on(`value`,snapshot=>{
                 if(snapshot.val()){
                 setisOnline(true)
                }else{
                    setisOnline(false)
                }
             })
        }
    }, []);


    function initializeAuthor() {

        getStorage(Posts?.userid).then((res) => {
            let value = res.value
            if (!value) {
                let authorref = database.ref(`users/${Posts?.userid}`)
                authorref.on(`value`, snap => {
                    setauthor(snap.val())
                    setcurrentAuthor(snap.val())
                    Plugins.Storage.set({ key: Posts?.userid, value: JSON.stringify(snap.val()) })
                    getStorage(`mates`).then((res) => {
                        let value = res.value;
                        if (value) {
                            let mates: any = JSON.parse(value)
                            mates[Posts?.userid] = snap.val().lastName
                            Plugins.Storage.set({ key: `mates`, value: JSON.stringify(mates) })
                        }
                    })
                })
            } else {
                let author = JSON.parse(value)
                setauthor(author)
                setcurrentAuthor(author)
            }

        })
    }
    useEffect(() => {
        initializeAuthor()
        getStorage(`user`).then((user) => {
            let u = JSON.parse(user.value + ``)
            let image = u.image
            setimage(image)
            if (u)
                setuser(u)
            return
        })
        getStorage(`userid`).then((res) => {
            setuid(res.value + ``)
        })
        updatePostProp(`viewedPeople`)
    }, [])


    function comment(event: any) {
        event.preventDefault()
        let comment = event.target.comment.value
        event.target.comment.value = ``
        audioRef.current?.play()
        Plugins.Storage.get({ key: `userid` }).then((res) => {
            let userid = res.value + ``
            Plugins.Storage.get({ key: `user` }).then((res) => {
                let user = JSON.parse(res.value + ``)
                let info = {
                    author: userid,
                    date: (new Date()).toDateString(),
                    message: comment,
                    authorimg: user.image
                }

                updatePost({ ...Posts, commentText: { ...Posts.commentText, [Date.now() + `` + Math.random()]: info } })
                // let postref = database.ref(`gists/${user.faculty}/${Posts?.id}`)
                // postref.child(`commentText`).push(info).catch(console.log)
            })
        })
    }
    const showComment = () => {
        if (Posts) {
            if (Posts?.commentText)
                return Object.values(Posts?.commentText).map((val: any, index) => {
                    return (<CommentItem key={index} {...{ ...val }}></CommentItem>)

                })

        }
    }
    function getImages() {
        if (Posts) {

            if (Posts?.images) {
                return Object.values(Posts?.images).map((img: any, index) => {
                    if (index > 0) return ``
                    if (!props.localImg)
                        return (<IonSlide key={index}>
                            <ImageDownload sendUrl={(url: string) => appendUrl(url)} key={index} image={img} />
                        </IonSlide>)
                    else {
                        return <IonSlide> <IonImg src={img} /></IonSlide>
                    }
                })
            }

            else return ([``])
        }
        return [``]
    }
    function appendUrl(url: string) {
        setimageUrls([...imageUrls, url])
    }
    function aboutAuthor() {
        if (currentAuthor) {
            props.sendAuthorInfo(currentAuthor)
        }
    }
    function objectLength(object: any) {
        if (object) {
            return Object.values(object).length
        }
        else return 0
    }

    function updatePostProp(property: `likes` | `laughs` | `viewedPeople`) {
        let tempPost: PostInterface = Posts

        if (uid) {
            if (tempPost[property]) {
                if (verifyBooleanProp(property)) {
                    tempPost[property] = { ...tempPost[property], [uid]: null }
                    updatePost(tempPost)
                } else {
                    tempPost[property] = { ...tempPost[property], [uid]: Date.now() }
                    updatePost(tempPost)
                    if (property == `laughs` || property == `likes`) {
                        audioRef.current?.play()
                    }
                }

            } else {
                tempPost = { ...tempPost, [property]: { [uid]: Date.now() } }
                updatePost(tempPost)
                console.log(tempPost)
            }
        }
    }

    function verifyBooleanProp(property: `likes` | `laughs` | `viewedPeople`) {
        let tempPost: PostInterface = Posts
        if (uid) {
            if (tempPost[property]) {
                let tempProp = tempPost[property]
                if (tempProp[uid]) {
                    return true
                }
                else return false
            }
            return false
        }
    }
    function updatePost(newPost: PostInterface) {
        props.updatePost(newPost)
    }
    useEffect(() => {
        if (Posts) {
            setPostImages(getImages())
        }
    }, [Posts]);

    function contactFriend(type: `whatsapp` | `text` | `mail` | `call`) {
        let link = ``, friend: userInterface = author ? author : user
        console.log(friend, `friend`)
        let number = friend?.number.indexOf(`+`) == 0 ? friend.number : friend?.number.indexOf(`237`) == 0 ? `+` + friend?.number : `+237${friend?.number}`;
        switch (type) {
            case `whatsapp`: link = `https://api.whatsapp.com/send?phone=${number}&text=Regarding%20your%20post%20on%20Findie%20:%20`
                break;
            case `text`: link = `sms:${friend?.number}&body=Regarding%20your%20post%20on%20Findie%20:%20`; break;
            case `call`: link = `tel:${number}`; break;
            case `mail`: link = `mailto:${friend?.email}`; break;

            default:
                break;
        }
        let a = window.document.createElement(`a`)
        a.href = link
        a.target = `__blank`
        a.click()
        window.document.removeChild(a)
    }

   async function updateIndex(target:any){
        
       setslideIndex(await target.getActiveIndex())
    }
    return (
        <IonCard className="social-card">
            <a href="mailto:"></a>
            <audio ref={audioRef} src={chime}></audio>
            <IonItem lines={`none`} color={`none`} className={`header`}>
                {/* <IonAvatar onClick={aboutAuthor}>
                    {props.localImg ? <IonImg src={image} /> : <IonImg src={author?.image == person ? `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm_pzCGUjj2_BmLkB5HYgELYffuJ_aOQrAbQ&usqp=CAU` : author?.image}></IonImg>
                    } </IonAvatar> */}
                <div className="avatar-online">
                    <IonAvatar onClick={aboutAuthor}>
                        {props.localImg ? <IonImg src={image} /> : <IonImg src={author?.image == person ? `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm_pzCGUjj2_BmLkB5HYgELYffuJ_aOQrAbQ&usqp=CAU` : author?.image}></IonImg>
                        }
                    </IonAvatar>
                   {(isOnline || props.localImg)&& <IonBadge color={`danger`}> </IonBadge>}
                </div>
                <IonButton fill={`clear`}>
                <IonLabel onClick={aboutAuthor} style={{ textTransform: `capitalize` }}>{!props.localImg ? `${author?.firstName} ${author?.lastName}` : `You`}</IonLabel>

                </IonButton>
                <IonButton slot={`end`} onClick={getOptions} color={`dark`} fill={`clear`}>
                    <IonIcon icon={ellipsisVertical}></IonIcon>
                </IonButton>
            </IonItem>

            {progress && Posts?.email==`false` && <IonProgressBar  color={objectLength(Posts?.images) <= 0 ? randColor : `primary`} type={`indeterminate`}  ></IonProgressBar >}
            {Posts?.images != undefined && Posts?.images != null && <div className={`img-container`}>

                {/* // <GetImageZero imiagezero={getImages()[0]}></GetImageZero> */}
                <IonSlides onIonSlideDidChange={(e)=>updateIndex(e.currentTarget)} pager={objectLength(Posts?.images) > 1} style={{ ...(objectLength(Posts?.images) > 1 ? { paddingBottom: `40px`, marginBottom: `-10px` } : {}) }}>
                    {Object.values((Posts?.images) ? Posts?.images : {}).map((img: any, index) => {
                        if (!props.localImg)
                            return (<IonSlide key={index}>
                                <ImageDownload sendUrl={(url: string) => appendUrl(url)} key={index} image={img} />
                            </IonSlide>)
                        else {
                            return <IonSlide><div className={`image-download`} style={{
                                backgroundImage: `url(${!imageLoaded ? img : img})`,
                                height: `60vh`
                            }}>
                                <IonImg className={`post-img`} src={img} />
                            </div>
                            </IonSlide>
                        }
                    })
                    }
                </IonSlides>
            </div>}
            {Posts?.message && objectLength(Posts?.images) ?
                <IonItem lines={`none`} onClick={() => setreadmore(true)}>
                    <ReactLinkify >
                        {!readmore ?
                            <IonLabel> {Posts?.message} </IonLabel>
                            :
                            <IonText>
                                {Posts?.message}
                            </IonText>
                        }
                    </ReactLinkify>
                </IonItem> : Posts?.message &&
                <IonToolbar className={`imageless-text`} color={randColor}>
                    <ReactLinkify >
                        <IonLabel>
                            <FormatForReading text={Posts?.message} />
                        </IonLabel>
                    </ReactLinkify>
                </IonToolbar>

            }
            <IonToolbar>

                <IonGrid className={`card-grid`}>

                    <IonRow className={`reactions`}>
                        <IonCol onClick={() => updatePostProp(`likes`)} >
                            <CreateAnimation play={verifyBooleanProp(`likes`)} stop={!verifyBooleanProp(`likes`)} delay={500} duration={1000} keyframes={[
                                { offset: 0, transform: `scale(1)` },
                                { offset: 0.3, transform: `scale(1.7)` },
                                { offset: 0.4, transform: `scale(1.8)` },
                                { offset: 0.6, transform: `scale(0.977)` },
                                { offset: 0.8, transform: `scale(1.1)` },
                                { offset: 1, transform: `scale(1)` },
                            ]} >
                                <IonButton fill={`clear`} color={`danger`}><label>{objectLength(Posts?.likes)  }</label>{verifyBooleanProp(`likes`) ? <IonIcon size={`large`} color={`danger`} icon={heart} /> : <IonIcon size={`large`} icon={heartOutline} />}</IonButton>
                            </CreateAnimation>
                        </IonCol>
                        <IonCol onClick={() => { popopen(showComment()) }} >
                            <IonButton fill={`clear`} color={`dark`}> <label>{objectLength(Posts?.commentText)}</label><IonIcon size={`large`} icon={chatbubbleOutline}></IonIcon></IonButton></IonCol>
                        <IonCol onClick={() => updatePostProp(`laughs`)}>
                            <CreateAnimation play={verifyBooleanProp(`laughs`)} stop={!verifyBooleanProp(`laughs`)} delay={500} duration={1000} keyframes={[
                                { offset: 0, transform: `scale(1) rotate(0deg)`, },
                                { offset: 0.3, transform: `scale(1.7) rotate(60deg)` },
                                { offset: 0.4, transform: `scale(2) rotate(70deg)` },
                                { offset: 0.6, transform: `scale(0.977) rotate(0deg)` },
                                { offset: 0.8, transform: `scale(1.4) rotate(0deg)` },
                                { offset: 1, transform: `scale(1) rotate(0deg)` },
                            ]}>
                                <IonButton color={`warning`} fill={`clear`}><label>{objectLength(Posts?.laughs)}</label><IonLabel style={{ opacity: verifyBooleanProp(`laughs`) ? 1 : 0.6 }}>😂</IonLabel></IonButton>

                            </CreateAnimation>
                        </IonCol>
                        {Posts?.contact && <IonCol>
                            {/* href={`https://api.whatsapp.com/send?phone=678106170&text=Regarding%20your%20post%20on%20Findie`} */}
                            <IonButton onClick={() => setcontactPerson(true)} fill={`clear`} color={`primary`}>
                                <IonIcon size={`large`} icon={paperPlaneOutline}></IonIcon>
                            </IonButton>
                            <IonActionSheet header={`Contact ${author?.lastName ? author?.lastName : `Friend`}`}
                                isOpen={contactPerson}
                                onDidDismiss={() => { setcontactPerson(false) }}
                                buttons={[{ text: `whatsapp`, icon: logoWhatsapp, handler: () => { contactFriend(`whatsapp`) } },
                                { text: `call`, icon: call, handler: () => { contactFriend(`call`) } },
                                { text: `text`, icon: chatbox, handler: () => { contactFriend(`text`) } },
                                { text: `email`, icon: mail, handler: () => { contactFriend(`mail`) } }]}  ></IonActionSheet>

                        </IonCol>}
                        {/* <IonCol offset={`3`} size={`2`}>{objectLength(Posts?.viewedPeople)+1} views</IonCol> */}
                    </IonRow>

                    <>
                        {objectLength(Posts?.commentText) > 0 &&
                            <IonRow>
                                <div className="ion-item comments">
                                    <IonNote onClick={() => { popopen(showComment()) }}>view all {showComment()?.length} comments</IonNote>
                                </div>

                            </IonRow>}</>
                </IonGrid>

                <form action="" onSubmit={comment}>
                    <IonItem lines={`none`} className={`header`}>
                        <IonAvatar>
                            <IonImg src={image}></IonImg>
                        </IonAvatar>
                        <IonInput name={`comment`} onIonChange={(event: any) => setdisabled(event.target.value == `` ? true : false)} className={`comment`} placeholder={`Add a comment`} />
                        <IonButton type={`submit`} fill={`clear`} disabled={disabled}>POST</IonButton>
                    </IonItem>
                </form>
                <div style={{ textAlign: `left`, padding: `0 20px `, color: `gray` }}><small>
                    {Date.now() - Posts.date2 < 60000 ? `just now` : <TimeAgo
                        datetime={Posts.date2}
                        locale='en'
                    />}
                </small>

                </div>

            </IonToolbar>
        </IonCard>
    )
}

export { SocialCard }


const CommentItem: React.FC<commentInterface> = (props) => {
    const database = firebase.database()
    const [name, setname] = useState(``);
    Plugins.Storage.get({ key: `user` }).then(() => {
        database.ref(`users/${props.author}`).child(`firstName`).once(`value`, (snapshot) => {
            setname(snapshot.val())
        })
    })
    return (
        <IonItem style={{ padding: `0` }} >
            <IonAvatar slot={`start`}>
                <IonImg src={props.authorimg == person ? `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm_pzCGUjj2_BmLkB5HYgELYffuJ_aOQrAbQ&usqp=CAU` : props.authorimg} />
            </IonAvatar>
            <ReactLinkify>
                <IonText style={{ fontSize: `13px` }} ><b>{name} </b> {props.message}</IonText>
            </ReactLinkify>
        </IonItem>
    )
}

export const ImageDownload: React.FC<{ image: string, sendUrl: Function }> = ({ image, sendUrl }) => {
    const [img, setimg] = useState(``)
    const [imageLoaded, setimageLoaded] = useState(false);

    if (!img) {
        Plugins.Storage.get({ key: image }).then(res => {
            if (res.value) {
                setimg(res.value)
                sendUrl(res.value)
            } else {
                firebase.storage().ref(image).getDownloadURL().then((url) => {
                    setimg(url)
                    sendUrl(url)
                    Plugins.Storage.set({ key: image, value: url })
                })
            }
        })

    }


    return (
        <> <div className={`image-download`} style={{
            backgroundImage: `url(${!imageLoaded ? Assets.loading : img})`,
            height: `60vh`
        }}>

            <IonImg className={`post-img`}
                onIonImgDidLoad={() => { setimageLoaded(true); }}
                style={{
                    filter: imageLoaded ? `` : `blur(6px)`, transition: `0.39s`,
                    width: imageLoaded ? `auto` : `100%`,
                    transform: imageLoaded ? `scale(1)` : `scale(0.9777)`
                }}
                src={img} alt={``} />
        </div>
        </>

    )
}

export const AnimatePopover: React.FC<{ comments: any[] | undefined, stop: boolean, play: boolean, ondidDismiss: Function }> = ({ comments, play, ondidDismiss }) => {

    return (
        <IonModal swipeToClose cssClass={`animated-popover`} mode={`ios`} isOpen={play} onDidDismiss={() => ondidDismiss()}>
            <IonHeader >
                <IonToolbar color={`primary`}>
                    <IonLabel > comments</IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonContent className={`comment-card`}>

                <IonCardContent>
                    {
                        comments
                    }
                </IonCardContent>
            </IonContent>
            {/* {play && <div onClick={() => ondidDismiss()} className="back-drop"> </div>} */}

        </IonModal>

    )
}

