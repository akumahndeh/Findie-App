import { IonCol, CreateAnimation, IonButton, IonIcon, IonLabel } from "@ionic/react"
import { heart, heartOutline } from "ionicons/icons"
import React, { useEffect, useState } from "react"
import { PostInterface } from "../pages/Gist"



export const LikeColumnIcon: React.FC<{ updatePostProp: (str: `likes`) => void, verifyBooleanProp: (str: `likes` | `laughs` | `viewedPeople`) => boolean, Posts: PostInterface }> = ({ updatePostProp, verifyBooleanProp, Posts }) => {

    const [likes, setlikes] = useState(0)
    const [isLiked, setisLiked] = useState(false)

    useEffect(() => {
       
        if (Posts) {
            if (Posts.likes) {
                setlikes(Object.values(Posts.likes).filter(key=>key!=null).length)
            } else {
                setlikes(0)
            }
            setisLiked(verifyBooleanProp(`likes`))
        }
    }, [Posts.likes])
    return (
        <IonCol onClick={() => updatePostProp(`likes`)} >
            <CreateAnimation play={isLiked} stop={!isLiked} delay={500} duration={1000} keyframes={[
                { offset: 0, transform: `scale(1)` },
                { offset: 0.3, transform: `scale(1.7)` },
                { offset: 0.4, transform: `scale(1.8)` },
                { offset: 0.6, transform: `scale(0.977)` },
                { offset: 0.8, transform: `scale(1.1)` },
                { offset: 1, transform: `scale(1)` },
            ]} >
                <IonButton fill={`clear`} color={`danger`}><label>{likes}</label>{isLiked ? <IonIcon size={`large`} color={`danger`} icon={heart} /> : <IonIcon size={`large`} icon={heartOutline} />}</IonButton>
            </CreateAnimation>
        </IonCol>
    )
}





export const LaughColumnIcon: React.FC<{ updatePostProp: (str: `laughs`) => void, verifyBooleanProp: (str: `likes` | `laughs` | `viewedPeople`) => boolean, Posts: PostInterface }> = ({ updatePostProp, verifyBooleanProp, Posts }) => {

    const [laughs, setlaughs] = useState(0)
    const [isLaughed, setisLaughed] = useState(false)

    useEffect(() => {

        if (Posts) {
            if (Posts.laughs) {
                setlaughs(Object.values(Posts.laughs).filter(key=>key!=null).length)
            }
            setisLaughed(verifyBooleanProp(`laughs`))
        }
    }, [Posts])
    return (
        <IonCol onClick={() => updatePostProp(`laughs`)} >
            <CreateAnimation play={isLaughed} stop={!isLaughed} delay={500} duration={1000} keyframes={[
                { offset: 0, transform: `scale(1) rotate(0deg)`, },
                { offset: 0.3, transform: `scale(1.7) rotate(60deg)` },
                { offset: 0.4, transform: `scale(2) rotate(70deg)` },
                { offset: 0.6, transform: `scale(0.977) rotate(0deg)` },
                { offset: 0.8, transform: `scale(1.4) rotate(0deg)` },
                { offset: 1, transform: `scale(1) rotate(0deg)` },
            ]}>
                <IonButton fill={`clear`} color={`danger`}><label>{laughs}</label><IonLabel style={{ opacity: isLaughed ? 1 : 0.6 }}>😂</IonLabel></IonButton>
            </CreateAnimation>
        </IonCol>
    )
}

