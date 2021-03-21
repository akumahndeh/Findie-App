import React, { useEffect, useRef, useState } from "react"
import { IonHeader, IonToolbar, IonIcon, IonTitle, IonContent, IonCard, IonCardContent, IonItem, IonTextarea, IonLabel, IonButtons, IonButton, IonText, IonPopover, useIonViewDidEnter, IonSpinner, IonProgressBar, IonToast, IonSlide, IonModal, IonBackdrop, IonCheckbox, IonNote, CreateAnimation } from "@ionic/react"
import { arrowBack, cameraSharp, crop, imagesSharp } from "ionicons/icons";
import { Plugins, CameraOptions, CameraResultType, CameraSource } from "@capacitor/core"
import "./GistModal.css"
import firebase from "firebase";
import { HapticVibrate } from "./MapModal";
import { getStorage, userInterface } from "../pages/Info";

const { Camera } = Plugins

export const cameraOption: CameraOptions =
{
    saveToGallery: true,
    presentationStyle: "fullscreen",
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Camera,
    quality: 60
}
export const galleryOption: CameraOptions =
{
    presentationStyle: "fullscreen",
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Photos,
    quality: 60

}
const CreateGist: React.FC<{ openModal: boolean, closeModal: Function, jobDone: Function }> = ({ openModal, closeModal, jobDone }) => {
    const [images, setimages] = useState<any[]>([]);
    const [removeImage, setremoveImage] = useState(-1);
    const [userid, setuserid] = useState(``);
    const [user, setuser] = useState<userInterface>();
    const [posting, setposting] = useState(false);
    const [, setprogress] = useState(false);
    const [success, setsuccess] = useState(false);
    const backbutton = useRef(null), divRef = useRef<HTMLDivElement>(null);
    let pickerRef = useRef<HTMLInputElement>(null)
    const [contactme, setcontactme] = useState(false);
    const [animateText, setanimateText] = useState(false);
    const [RandomlyView, setRandomlyView] = useState(Math.ceil(Math.random() * 100) % 2 == 0);
     


    useEffect(() => {
        if (openModal) {
            setanimateText(true)
            setRandomlyView(Math.ceil(Math.random() * 100) % 2 == 0)

        }
    }, [openModal]);

    useIonViewDidEnter(() => {
        initializeContactMe()

    });

    async function initializeContactMe() {
        let cancontact = await getStorage(`contactme`)
        if (cancontact.value) {
            setcontactme(true)
        }
    }
    function updateContactMe(event: any) {
        let detail = event.detail
        if (detail.checked) {
            Plugins.Storage.set({ key: `contactme`, value: detail.checked })
            
        } else {
            Plugins.Storage.remove({ key: `contactme` })

        }
        setcontactme(detail.checked)

    }
    function clickPicker(){
        pickerRef.current?.click()
    }
    
    const takeImage = async (option: CameraOptions) => {
        try {
            const image = await Camera.getPhoto(option)
            setimages([...images, image.dataUrl + ""])
        } catch (err) {
            alert(err)
        }
    }
    
function getMultipleImages(element:any){
    let files:Blob[]=  Array.from( element.target?.files )
   
    Promise.all(files.map((file:Blob)=>{
        return( new Promise((resolve,reject)=>{
            
            let reader= new FileReader()
       reader.addEventListener(`load`,(ev)=>{
           resolve(ev.target?.result)
       })
       reader.addEventListener(`error`, reject)
       reader.readAsDataURL(file)
      
        }))
    })).then(res=>{
       setimages( res)
    })
 }
  
    useEffect(() => {
        if (images.length > 0) {
            divRef.current?.scrollTo({ behavior: `smooth`, top: 1000 * images.length })
        }

    }, [images]);


    useEffect(() => {
        // takeImage(cameraOption)
        Plugins.Storage.get({ key: `userid` }).then(res => setuserid(res.value + ``))
        Plugins.Storage.get({ key: `user` }).then(user => setuser(JSON.parse(user?.value + ``)))
    }, [])
    const cancelremove = () => {
        setremoveImage(-1)
    }
    const remove = () => {
        let imgs = images
        imgs.splice(removeImage, 1)
        setremoveImage(-1)
        setimages([...imgs])
    }

    const submit = async function (event: any) {
        console.log(user)
        event.preventDefault()

        let message = event.target.message.value
        let date = new Date()
        let dateString = (`${date.toDateString()}`)
        let date2 = Date.now()
        if (!message && images.length <= 0) {
            Plugins.Modals.alert({ message: `Enter a text or Post an Image`, title: `Empty Post`, buttonTitle: `Ok` })
            return
        }

        let gist: any = {
            userid: userid,
            message: message,
            date: dateString,
            date2: date2,

        }
        console.log(`contact,me`, contactme)
        if (contactme) {
            gist = { ...gist, contact: user?.number }
        }
        setposting(true)
        let id = Math.random() + ``
        let uploadableImages=images
        setimages([])
        let SelectedImages =uploadableImages.length > 0 ?uploadableImages : undefined
        closeModal({ ...gist, email: `false`, id, images: SelectedImages })

        setposting(false)
        setprogress(false)
        if (user) {
            firebase.database().ref(`/gists`).child(user?.faculty).push(gist).then((result) => {

                if (result) {
                    let key = result.key

                    let imageRefs =uploadableImages.map((img, index) => {
                        return `gists/${user?.faculty}/${key}/image${index}`
                    })
                   uploadableImages.forEach((imgurl, index) => {
                        fetch(imgurl).then(async (res) => {
                            let blobimg = await res.blob()
                            firebase.storage().ref(imageRefs[index]).put(blobimg).then(() => {

                                setprogress(true)
                            })
                        })
                    })

                    if (key) {
                          firebase.database().ref(`gists/${user?.faculty}`).child(key + ``).set(JSON.stringify({ ...gist, images: imageRefs })).then(() => {
                            setposting(false)
                            console.log(`done posting`)
                            jobDone({ id, done: true });
                            Plugins.Toast.show({ text: `Post Sent`, duration: `short`, position: `center` }).then(() => {
                               })

                        }).catch((err) => alert(err.message))

                        firebase.database().ref(`/gistIndex`).child(user?.faculty).child(key).set(userid)
                    }
                }
            })

        }
    }
    return (
        <IonModal swipeToClose mode={`ios`} isOpen={openModal} onDidDismiss={() => { closeModal() }}>
            <IonHeader mode={`md`}>
                <IonToolbar className={`tb-create-gist`} color="primary">
                    <IonButtons ref={backbutton} slot={`start`}>
                        <IonButton color={`light`} onClick={() => HapticVibrate()}>
                            <IonBackdrop></IonBackdrop>
                            <IonIcon icon={arrowBack}></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Create Gist</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonPopover isOpen={removeImage != -1} onDidDismiss={() => setremoveImage(-1)}>
                <img src={images[removeImage]} alt="" />
                <IonItem lines={`none`}>
                    <IonButton onClick={cancelremove} fill={`clear`}>cancel</IonButton>
                    <IonButtons slot={`end`}>
                        <IonButton onClick={remove} color={`danger`}>remove</IonButton>
                    </IonButtons>
                </IonItem>
            </IonPopover>
            <IonContent  >

                {RandomlyView ? <div className="ion-padding ion-margin gist-intro">
                    <CreateAnimation play={animateText} stop={!animateText} delay={400} duration={2000} fromTo={[{ fromValue: 0, toValue: 1, property: `opacity` }]}>
                        <IonLabel style={{ opacity: 0 }}>
                           Share <b>Sensational</b> Pictures, Make someone <b>Laugh</b>, <b>Advertise</b> your Products,  share an <b>Opportunity</b>, post something <b>Amazing</b>
                    </IonLabel>
                    </CreateAnimation>
                    
                </div>:<div style={{height:`20%`}}>
                    
                    </div>}
                <IonCard mode={`ios`}>
                    <IonItem mode={`md`} lines={`none`}>
                        <IonText>
                             <IonNote>allow people to contact me from this post</IonNote>
                          </IonText>
                        <IonCheckbox slot={`end`} onIonChange={updateContactMe} checked={contactme}  ></IonCheckbox>
                    </IonItem>
                    <IonCardContent>
                       {images.length>0&& <div ref={divRef} style={{ overflowY: `scroll`, width: `100%`, height: `210px` }} >

                            {
                                images.map((img, index) => <IonSlide key={index}>
                                    <img onClick={() => setremoveImage(index)} alt="" src={img}/>
                                </IonSlide>)
                            }
                        </div>}

                        <form onSubmit={submit}>
                            <IonItem>
                                <IonLabel position="floating" >Enter Gist</IonLabel>
                                <IonTextarea disabled={posting} name={`message`} rows={2}></IonTextarea>
                            </IonItem>
                            <IonProgressBar color={`danger`} type={posting ? `indeterminate` : `determinate`}  ></IonProgressBar>
                            <IonButtons className="ion-margin-top">
                                <IonButton disabled={posting} onClick={() => takeImage(cameraOption)} size="large">
                                    <IonIcon size="large" icon={cameraSharp}></IonIcon>
                                </IonButton>
                                <span className="ion-padding"> </span>
                                <IonButton disabled={posting} mode={`md`} onClick={() => {takeImage({ ...galleryOption })}}  size="large">
                                    <IonIcon size="large" icon={imagesSharp}></IonIcon>
                                </IonButton>
                                
                                <span className="ion-padding"> </span>
                                <IonButton disabled={posting} mode={`md`} onClick={() => {takeImage({ ...galleryOption, allowEditing: true });
                                 Plugins.Toast.show({text:`Does not work properly on some devices`, duration:`long`, position:`center`})}}
                                  size="large">
                                    <IonIcon size="large" icon={crop}></IonIcon>
                                </IonButton>
                                <span className="ion-padding"> </span>
                                <input multiple accept="image/*" type="file" onChange={getMultipleImages} ref={pickerRef} hidden />
                            </IonButtons>

                            <div className="ion-padding ion-margin-top">
                                <IonButton disabled={posting} type={`submit`} expand="block" >
                                    {posting ? <IonSpinner paused={false} /> : `post`}
                                </IonButton>
                            </div>
                        </form>
                    </IonCardContent>

                </IonCard>
                <IonToolbar style={{ textAlign: `center` }}>
                    <IonLabel>
                        <IonNote>Only visible to members of your faculty</IonNote>
                    </IonLabel>
                </IonToolbar>
            </IonContent>
            <IonToast isOpen={success} duration={1400} onDidDismiss={() => setsuccess(false)} mode={`ios`} message={`successful`}></IonToast>
        </IonModal>
    )
}

export default CreateGist;


