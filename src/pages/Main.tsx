import React, { useRef, useState, useEffect } from "react"
import { IonPage, IonHeader, IonToolbar, IonMenuButton, IonTitle, IonIcon, IonAvatar, IonImg, IonSegmentButton, IonSegment, IonFooter, IonPopover, IonItem, useIonViewDidEnter, IonBadge, IonLabel, useIonViewWillEnter, IonButton } from "@ionic/react"
import "./Main.css"
import { search, notifications, chatbox, book } from "ionicons/icons"
import Tour from "./Tour"
import { getStorage } from "./Info"
import { Plugins  } from "@capacitor/core"
import { Assets } from "../media/images/images"
import { Route, useHistory } from "react-router"
import firebase from "firebase" 

const Main: React.FC = () => {
    const slides = useRef<HTMLIonSlidesElement>(null)
    const [, settitle] = useState("Findie");
    const [, setuser] = useState<any>({ image: "" });
    const [slideIndex, setslideIndex] = useState(0);
    const [, setisAuth] = useState(true);
    const [, setloading] = useState(false);
    const [, setscrollContent] = useState(false);

    let history=useHistory()
    const slideTo = (value: number) => {
        slides.current?.slideTo(value)
        settitle(value === 0 ? "Guide" : value === 1 ? "Tour" : value === 2 ? "Gist" : "Info")

    }
    useEffect(() => {
        getStorage(`firstTimer`).then((res)=>{
            if(res.value==`noMore`){
                setloading(false)
            }else{
                Plugins.Storage.set({key:`firstTimer`,value:`noMore`}).then(()=>{
                    history.push(`/Login`)
                    setloading(false)
                })
            }
        })
      
            Plugins.Storage.get({ key: "user" }).then((user) => {
                if(user.value){
                    setuser(JSON.parse(user.value + ""))
                    setisAuth(true)
                }else{
                    setisAuth(false)
                    firebase.auth().signInAnonymously()

                }
               
            })
          
    }
        , [])

    
    useIonViewDidEnter(()=>{
        Plugins.StatusBar.setBackgroundColor({color:`#0d2c6d`}).catch(console.log)
     })
    useIonViewWillEnter(()=>{
        Plugins.StatusBar.setOverlaysWebView({
            overlay: false
          }).catch(()=>{});
    })
     

    return (
        <IonPage>
            <Route path={`/`} component={Tour}/>
            {/* <IonContent>
                <IonLoading spinner={`lines`} message={`initializing`} isOpen={loading} onDidDismiss={()=>{setloading(false)}}/>
                <IonSlides options={{initialSlide:1}} onIonSlideDidChange={slideChange} draggable={false} style={{ height: "100vh" }} className="page-slides" ref={slides}>

                    <IonSlide className="page-slide">
                        <Guide></Guide>
                       </IonSlide >
                    <IonSlide className="page-slide">
                        <Tour></Tour>
                       </IonSlide>
                       <IonSlide className="page-slide">
                    {isAuth?<Gist  />:<Home />}
                             
                        <div className="floor-container"></div>
                    </IonSlide>
                    <IonSlide className="page-slide" style={{backgroundColor:` #f4f5f8`}}>
                        {isAuth?<Info user={user}></Info>:<Home />}
                        <div className="floor-container"></div>
                    </IonSlide>
                   
                </IonSlides>

            </IonContent> */}

            <MainFooter slideIndex={slideIndex} Page={slideTo}></MainFooter>z

        </IonPage>
    )
}
export default Main;

export const Header: React.FC<{ title: string, user: any }> = props => {
    const [image, setimage] = useState(Assets.logo);
    const [popover, setpopover] = useState(false);
    function restoreImage() {
        Plugins.Storage.get({ key: "user" }).then(data => {
          try{ 
            if(data.value){
            let value = JSON.parse(data.value + "")
               if(value?.image){

                setimage(value.image)
            } }
        }catch{}
        })
    }
    useEffect(() => {
       restoreImage()
      
    }, []);
    useIonViewDidEnter(()=>{
        
    })
    return (
        <IonHeader mode={`md`}>
            <IonToolbar color="primary">
                <IonMenuButton slot="start"></IonMenuButton>
                <IonTitle>{props.title}</IonTitle>
                <IonAvatar style={image==Assets.logo?{background:`white`}:{}} onClick={() => setpopover(true)} className="profile-ava" slot="end">
                    <IonImg alt="" src={image}></IonImg>
                   </IonAvatar>
            </IonToolbar>
            <IonPopover isOpen={popover} onDidDismiss={() => setpopover(false)} >
                <img alt="" src={image} />
                <IonItem>
                    <IonButton fill={`clear`} onClick={() => setpopover(false)} routerLink="/Profile">view profile</IonButton>
                </IonItem>
            </IonPopover>
        </IonHeader>
    )
}

const MainFooter: React.FC<{ Page: Function, slideIndex: number }> = (props) => {
    const [value, setvalue] = useState(`tour`);
    const homeBut = useRef<HTMLIonSegmentButtonElement>(null)
    const tourBut = useRef<HTMLIonSegmentButtonElement>(null)
    const infoBut = useRef<HTMLIonSegmentButtonElement>(null)
    const gistBut = useRef<HTMLIonSegmentButtonElement>(null)
    const segment = useRef<HTMLIonSegmentElement>(null)
     const [notifArray, setnotifArray] = useState<any[]>([]);
    useEffect(() => {
        if (props.slideIndex == 0)
            setvalue(`home`)
        else if (props.slideIndex == 1)
           setvalue(`tour`)

        else if (props.slideIndex == 2)
            setvalue(`gist`)
        else if (props.slideIndex == 3)
          setvalue(`info`)
           


    }, [props.slideIndex])
    const segmentChange = () => {
        let val = segment.current?.value
        if(val)
        setvalue(val)
        if (val == "home")
            props.Page(0)
        else if (val == "tour")
            props.Page(1)
        else if (val == "gist")
            props.Page(2)
        else if (val == "info")
            props.Page(3)

    }
    useEffect(() => {
           if(value==`gist` && notifArray.length>0){
                  setnotifArray([])
           }
    }, [value]);
    // Plugins.LocalNotifications.addListener(`localNotificationReceived`,(notif)=>{
    //      setnotifArray([...notifArray,notif]) 
    // })
   useEffect(() => {
       
    Plugins.LocalNotifications. areEnabled().then((notif)=>{
        setnotifArray([...notifArray,notif]) 
   })
   }, []);
    return (
        <IonFooter >
            <IonToolbar color="primary">
                <IonSegment value={value} onIonChange={segmentChange} ref={segment} color="light" >
                    <IonSegmentButton value="home" ref={homeBut} >
                        <IonIcon icon={book}></IonIcon>

                    </IonSegmentButton>
                    <IonSegmentButton value="tour" ref={tourBut} >
                        <IonIcon icon={search}></IonIcon>

                    </IonSegmentButton>
                   
                    <IonSegmentButton value="gist" ref={gistBut}>
                        <IonIcon icon={chatbox}></IonIcon>
                  {notifArray.length>0&& <IonBadge color={`danger`} ><IonLabel>{notifArray.length}</IonLabel></IonBadge>}
                    
                    </IonSegmentButton>
                     <IonSegmentButton value="info" ref={infoBut}  >
                        <IonIcon icon={notifications}></IonIcon>

                    </IonSegmentButton>
                </IonSegment>
            </IonToolbar>
        </IonFooter>
    )
}







/**  
 * 
 * 
 * 
       <IonModal swipeToClose mode="ios" isOpen={props.isOpen} onDidDismiss={props.onDidDismiss}>

                <IonContent ref={content} scrollY style={{ position: "relative" }} color="dark" scrollX>

                    <div className="map-container">

                        <IonImg onClick={()=>setopenstats(false)} onDoubleClick={expandContract} alt="" className="mapImg" style={{ width: `${mapWidth}px` }} src={`static/media/map.337fc9e3.webp`} />
                        {/* <CreateAnimation
                        play={true}
                        duration={700}
                        iterations={Infinity}
                        keyframes={[{ offset: 0.2, transfrom: "scale(1)", opacity: 1, background: "brown" },
                        { offset: 0.4, transfrom: "scale(1.2)", opacity: 0.6, background: "green" },
                        { offset: 0.8, transfrom: "scale(0.4)", opacity: 0.3, background: "purple" },
                        { offset: 0.8, transfrom: "scale(1.2)", opacity: 0.8, background: "white" },
                        { offset: 1, transfrom: "scale(1)", opacity: 1, background: "purple" }]}
                    >
                        <div className="markercircle" style={{ top: `${offset?.y}px`, left: `${offset?.x}px` }}></div>
                    </CreateAnimation>  
                    <div className="marker" style={{ top: `${offset?.y - 40}px`, left: `${offset?.x - 40}px` }}>
                    <div className="arrow"></div>
                    <div className="pin" onClick={() => { setlocationToast(`choosen Destination`); setpopImg(true) }}></div>
                    <div className="pin-effect"></div>
                </div>
            </div>
            <div className="markerRed" style={{ transform:`rotate(${computeHeading(userLocation?.coords.heading)})`,top: `${computeLat(userLocation?.coords.latitude) - 60}px`, left: `${computeLong(userLocation?.coords.longitude) - 40}px` }}>
                <div className="arrow"></div>
                <div className="pin" onClick={() => { setlocationToast(`Your location`) }} ></div>
                <div className="pin-effect"></div>
            </div>
            <IonToast translucent mode={`ios`} color={`light`} position={`bottom`} duration={1500} message={locationToast} isOpen={locationToast != undefined} onDidDismiss={() => setlocationToast(undefined)} ></IonToast>

        </IonContent>
        <MenuFab viewstats={() => setopenstats(true)} locate={find} resizeTo={resizeTo} closeModal={closeModal}></MenuFab>
        {
            (!popImg) && <div onClick={() => setpopImg(true)}><ImageFab maxCoordsY={props.maxCoords?.y} Image={props.img}></ImageFab></div>
        }<IonPopover isOpen={popImg} onDidDismiss={() => setpopImg(false)} >
            <IonImg alt="" onClick={() => setviewimage(props.img)} src={props.img} />
            <IonLabel>{props.placename}</IonLabel>
        </IonPopover>
        <ViewPicture isOpen={viewimage != ``} OndidDismiss={() => { setviewimage(``) }} imageRef={viewimage} ></ViewPicture>

    </IonModal>
    <IonModal onDidDismiss={()=>setopenstats(false)} swipeToClose backdropDismiss showBackdrop mode={`ios`} isOpen={openstats} cssClass={`stats`}>
        <IonHeader color={`none`}>
            <IonToolbar color={`none`}>
                <div className="stat-content">
                    <div className="line"></div>
                  <IonList color={`none`}>
                      <IonItem>
                                <IonText>distance from choosen location</IonText>
                             <IonItem lines={`none`}>
                             <h4>{ convertScale(distance)}</h4> 
                             </IonItem>
                          </IonItem>
                          <IonItem>
                             <IonText>Current Status</IonText>
                             <IonItem lines={`none`}>
                             <h4>{outofRange? `out of campus`:`on campus`}</h4> 
                             </IonItem>
                          </IonItem>
                          <IonItem>
                             <IonText>Destination</IonText>
                             <IonItem lines={`none`}>
                              <h4 style={{textTransform:`capitalize`}}>{props.placename}</h4> 
                             </IonItem>
                            </IonItem>
                            <IonItem>
                             <IonText>Estimated time to destination</IonText>
                             <IonItem lines={`none`}>
                              <h4 style={{textTransform:`capitalize`}}>{ getUserTime(userLocation?.coords.speed,distance)}</h4> 
                             </IonItem>
                            </IonItem>
                            <IonToolbar className={`speedo`}>
                                <ReactSpeedometer forceRender startColor={`yellow`} endColor={`red`} value={getSpeed(userLocation?.coords.speed)} segments={10} needleColor={`blue`} needleHeightRatio={0}   minValue={0} maxValue={20} />
                               <div  style={{ transform:`translate(150px ,-255px) rotate(${getAngle(getSpeed(userLocation?.coords.speed),0,20)}deg)`}} className="gear-arrow"></div>
                                </IonToolbar>
                  </IonList>
                </div>
            </IonToolbar>
        </IonHeader>
    </IonModal>
</>
)
}

export default MapModal;

const MenuFab: React.FC<{ viewstats: Function; closeModal: Function, locate: Function, resizeTo: Function }> = (props) => {
const [expandMap, setexpandMap] = useState(true);
const { viewstats } = props
const resizeMap = () => {
if (expandMap) {
    props.resizeTo(1366)
}
else {
    props.resizeTo(1100)
}
setexpandMap(!expandMap)
}
const maplocate = () => {
props.locate()
}
return (<>
<IonFab style={{transform:`translateY(100px)`}} horizontal="end" vertical="center">
        <IonFabButton onClick={() => { viewstats() }} color="light">
            <IonIcon icon={barChart}></IonIcon>
        </IonFabButton> 
</IonFab>
<IonFab  horizontal="end" vertical="center">
    <IonFabButton>
        <IonIcon icon={menu}></IonIcon>
    </IonFabButton>
    <IonFabList side="bottom">
        <IonFabButton onClick={() => props.closeModal()} color="dark">
            <IonIcon icon={close}></IonIcon>
        </IonFabButton>
    </IonFabList>
    <IonFabList side="start">
        <IonFabButton onClick={resizeMap} color="danger">
            <IonIcon icon={expandMap ? resize : contract}></IonIcon>
        </IonFabButton>
    </IonFabList>
    <IonFabList side="top">
        <IonFabButton onClick={maplocate} color="light">
            <IonIcon icon={locate}></IonIcon>
        </IonFabButton>
          </IonFabList>
</IonFab>
</>
)
}

const ImageFab: React.FC<{ Image: string, maxCoordsY: number }> = (props) => {
let bottom = { bottom: "10px", left: "10px" }
let top = { top: "10px", left: "10px" }
let position = props.maxCoordsY > 580 ? top : bottom;
return (
<img alt="" style={{ width: "130px", ...position, position: "fixed", borderRadius: "6px" }} src={props.Image}></img>

)
}
export const openBrowseImage = (imageurl: string) => {
Plugins.Browser.open({ url: imageurl, toolbarColor: `#44d` })

}

function convertScale(dist:number|undefined){
if(!dist){
return `uncertain`
}
if(dist>999){
return (dist/1000+``).substr(0,5)+`km`
}
return dist+`m`
}

function getUserTime(speed:number|undefined,distance:number|undefined){

if(speed==undefined || distance==undefined  ){
return  `infinite`
}
if(distance==0){
   return `you are at your destination`
}
return Math.ceil(speed/distance)+`s`

}

function getSpeed(speed:number|undefined){
if(speed){
return speed
} return 0
}

function getAngle(val:number|undefined,min:number,max:number){
if(val){
let beta=(max-min)/180
let angle=val/beta -90
if(angle>90) angle=99
console.log(angle)
return angle
}
return -90
}* 
 * 
 * 
 * 
 * 







 * 
 * */ 