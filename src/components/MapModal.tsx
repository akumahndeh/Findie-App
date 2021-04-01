import React, { useState, useRef, useEffect } from "react"
import { IonModal, IonContent, IonImg, IonFabButton, IonFab, IonFabList, IonTitle, IonIcon, useIonViewDidLeave, IonToast, IonLabel, IonHeader, IonToolbar, IonList, IonItem, IonText, createGesture, IonPopover, IonCardContent, IonAlert, AlertButton, AlertInput, IonLoading, IonSpinner, IonToggle, IonListHeader, IonChip } from "@ionic/react"

import { close, menu, locate, barChart, pinOutline, people, search, settings, call } from "ionicons/icons"
import "./MapModal.css"
import { GeolocationPosition, HapticsImpactStyle, HapticsNotificationType, Plugins } from "@capacitor/core"
import ViewPicture from "./ViewPicture"
import ReactSpeedometer from "react-d3-speedometer"; 
import { selectedPlaces } from "../media/images/images"
import firebase from "firebase"
import { getStorage, notifyUser, userInterface } from "../pages/Info"
import map from "../media/images/map.png"
import { initializeTheme } from "../App"

const MapModal: React.FC<{ Place: any, moreImages: any[], otherMarkers: { x: number, y: number }[] | undefined, placename: string, isOpen: boolean, img: string, maxCoords: { x: number, y: number }, onDidDismiss: any, closeModal: Function }> = props => {
    let minCoords = { x: props.maxCoords?.x / 1.2418181818181817, y: props.maxCoords?.y / 1.2427184466019416 }
    let database = firebase.database()
    const [mapWidth, setmapWidth] = useState<number>(1100);
    const [offset, setoffset] = useState(minCoords);
    const content = useRef<HTMLIonContentElement>(null) 
    const [userLocation, setuserLocation] = useState<GeolocationPosition>();
    const [viewimage, setviewimage] = useState(``);
    const [locationToast, setlocationToast] = useState<string | undefined>(undefined);
    const [outofRange, setoutofRange] = useState(false);
    const [openstats, setopenstats] = useState(false);
    const [distance, setdistance] = useState<number>();
    const [popImages, setpopImages] = useState<any>([]);
    const [popImgstyle] = useState({ opacity: 1, transform: `translateY(${0}px)` });
    const [geoid, setgeoid] = useState<string>();
    const [viewOthers, setviewOthers] = useState(false);
    const [showLocationAlert, setshowLocationAlert] = useState(false);
    const [user, setuser] = useState<userInterface>();
    const [friends, setfriends] = useState<{ id: string, geo: GeolocationPosition }[]>([]);
    const [fetchingFriend, setfetchingFriend] = useState(false);
    const [friendsObj, setfriendsObj] = useState<any>();
    const [friendName, setfriendName] = useState<string>();
    const [friendImg, setfriendImg] = useState<string>();
    const [friendInfo, setfriendInfo] = useState(false);
    const [showPeople, setshowPeople] = useState(false);
    const [visible, setvisible] = useState(false);

    const [clickedLocation, setclickedLocation] = useState<{
        type: string;
        name: string;
        maxCoords: {
            x: number;
            y: number;
        };
        about: string;
        describtion: string;
        mainpic: string;
    } | undefined>();
    const gearColor = [
        { left: `yellow`, right: `red` },
        { left: `lightblue`, right: `darkblue` },
        { left: `silver`, right: `black` },
        { left: `green`, right: `red` },
        { left: `violet`, right: `red` },

    ]
    const [choosen, setchoosen] = useState(0);
    let popModal = useRef<HTMLIonContentElement>(null)
    const AlertButtons: (string | AlertButton)[] = [{ text: `Find Friend`, cssClass: ``, handler: (event) => findFriend(event) }, { text: `cancel` }]
    const AlertInputs: (AlertInput)[] = [{ min: 9, max: 13, placeholder: `Enter Friend\`s phone number`, type: `number`, name: `number` }]

    const [mapel, setmapel] = useState<any>();
    const closeModal = () => {
        props.closeModal()
    }

    function shareLocation() {
        setshowLocationAlert(true)
    }
    function findFriend(event: any) {
        let number = event.number;

        setfetchingFriend(true)
        database.ref(`locations`).child(number).on(`value`, (snap) => {
            let value = snap.val()
            if (value) {
                let friendPos: GeolocationPosition = JSON.parse(value)
                setfriendsObj({ ...friendsObj, [number]: friendPos })

            }
            else {
                Plugins.Modals.alert({ message: `User may not have the Findie app opened or location is switched off`, title: `Unable to Find Friend`, buttonTitle: `Ok Findie` })
            }

            setfetchingFriend(false)
        })

    }

    useEffect(() => {
        if (friendsObj) {
            let friendtemp = Object.keys(friendsObj).map((key) => ({ id: key, geo: friendsObj[key] }))
            setfriends(friendtemp)
        }
    }, [friendsObj]);
     

    const resizeTo = (value: number) => {
        setmapWidth(value);
        if (value === 1100) {
            setoffset(minCoords)
        }
        else setoffset(props.maxCoords)
    }

    const find = () => {
        fetchLocation()
        if (!userLocation) {
            content.current?.scrollToPoint(offset?.x - 100, offset?.y - 50, 700)

        } else {

            content.current?.scrollToPoint(computeLong(userLocation?.coords.longitude) - 100, computeLat(userLocation?.coords.latitude) - 50, 700)
        }

    }
    useEffect(() => {
        if (props.maxCoords) {
            setoffset(minCoords)
            find()

        }


        if (props.isOpen == true) {
            Plugins.StatusBar.hide().catch(() => { })
            Plugins.StatusBar.setOverlaysWebView({ overlay: true }).catch(console.log)
        }
        else {
            Plugins.StatusBar.show().catch(() => { }).catch(console.log)
            Plugins.StatusBar.setOverlaysWebView({ overlay: false }).catch(console.log)

        }
       if(!props.isOpen){
        Plugins.StatusBar.show().catch(() => { })
         initializeTheme()
        
       }
     
    }, [props]);



    let k = 0
    useEffect(() => {


        fetchLocation()
        // setallplaces(All) 

    }, []);

    useEffect(() => {
        calculateDist()

    }, [userLocation]);


    const updateConditionally = (initialLocation: GeolocationPosition | undefined, currentLocation: GeolocationPosition) => {

        if (initialLocation) {
            let latitudeDiff = computeAproxLat(initialLocation.coords.latitude, mapWidth) - computeAproxLat(currentLocation.coords.latitude, mapWidth)
            let longitudeDiff = computeAproxLong(initialLocation.coords.longitude, mapWidth) - computeAproxLong(currentLocation.coords.longitude, mapWidth)
            if (latitudeDiff > 80 || longitudeDiff > 80) {
                uploadMyLocation()

            }
        }
        else {
            uploadMyLocation()
        }


    }
    var id: any
    function fetchLocation() {
        if (id) Plugins.Geolocation.clearWatch(id);
        id = Plugins.Geolocation.watchPosition({ enableHighAccuracy: true, maximumAge: 1000 }, res => {
            console.log(res)
            if (res) {
                updateConditionally(userLocation, res)
                setuserLocation(res)

            } else {
                if (!k) {
                    Plugins.Toast.show({ text: `turn on your location and make sure you have good internet connection` })
                        .then(() => { }).catch(() => { alert(`turn on your location and make sure you have good internet connection`) })
                    k++;
                }
                else if (k == 1) {
                    Plugins.Toast.show({ duration: `long`, text: `losing your location, check your connection or location settings` }).catch(() => { alert(`losing your location, check your connection`) })
                    fetchLocation()
                }
                k++
            }
        })
        setgeoid(id)
    }

    let counter = 0;
    function calculateDist() {

        let y = ActualLat(userLocation?.coords.latitude, mapWidth)
        let x = ActualLong(userLocation?.coords.longitude, mapWidth);
        let x2 = props.maxCoords?.x
        let y2 = props.maxCoords?.y
        let R = Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2))
        if ((R * Math.sqrt(1)) <= 50) {
            setdistance(0)
            if (counter != 0) {
                Plugins.Modals.alert({ message: `you are at your destination 😍😍💃`, title: `Arrival 🎊🎊👏`, buttonTitle: `Awesome` })
                Plugins.Accessibility.speak({ value: `you have reached your destination` })
                counter++;
            }
        }
        else
            setdistance((R * Math.sqrt(1)))
        if ((R * Math.sqrt(1)) <= 50) {

        }
    }
    function computeLong(long: number | undefined) {

        if (!long || long > 9.292873 || long < 9.277874) {
            return 0
        }

        let alpha = (9.292873 - 9.277874) / mapWidth
        let x = (long - 9.277874) / alpha
        console.log(x)

        return x;
    }
    function computeLat(lat: number | undefined) {
        let h = 768
        if (!lat) {
            return 0
        }
        else {
            if (lat < 4.143990 || lat > 4.152133) {
                if (!outofRange) {
                    Plugins.Toast.show({ text: `you are not on campus` }).catch(() => alert(`you have left the school campus`))
                    Plugins.Accessibility.speak({ value: `you are not on campus` })
                    setoutofRange(true)
                }
                return 0
            } else {
                if (outofRange) {
                    Plugins.Toast.show({ text: `you are in school` }).catch(() => alert(`you are in school`))
                    notifyUser(`You are in school`, `last checked ${(new Date()).toLocaleTimeString()}`)
                    setoutofRange(false)
                }
            }
        }
        if (mapWidth == 1100) {
            h = 618
        }
        let beta = (4.152133 - 4.143990) / h
        let y = h - (lat - 4.143990) / beta
        console.log(y)
        return y;
    }

    function computeHeading(heading: number | undefined) {
        if (heading) {
            return heading
        }
        return 0
    }
    useIonViewDidLeave(() => {
        Plugins.StatusBar.show().catch(() => { })
        setmapWidth(1100)
        setoffset(minCoords)
        if (geoid) {
            Plugins.Geolocation.clearWatch({ id: geoid })
        }
    })

    function expandContract() {
        resizeTo(mapWidth == 1100 ? 1366 : 1100)
    }
    useEffect(() => {
        console.log(mapel?.target)
        if (mapel?.target) {
            let starttime = 0, resize = 1366
            let gesture = createGesture({
                el: mapel?.target, gestureName: `doubletap`, threshold: 0,
                onStart: () => {
                },
                onMove: () => {
                    starttime = 0
                },
                onEnd: () => {
                    let endTime = Date.now()
                    if (Math.abs(endTime - starttime) <= 500 && starttime != 0) {
                        resizeTo(resize)
                        resize = resize == 1100 ? 1366 : 1100
                        starttime = 0
                    } else {
                        starttime = endTime
                    }
                }
            })
            gesture.enable()
        }
    }, [mapel]);

    async function uploadMyLocation() {
        let string = (await getStorage(`user`)).value
        if (string) {
            let user: userInterface = JSON.parse(string)
            setuser(user)
            if (userLocation && visible) {
                database.ref(`locations`).child(user.number).set(JSON.stringify(userLocation))
                    .catch((err) => {
                        Plugins.Toast.show({ text: err.message })
                    }).then(() => {
                        Plugins.Toast.show({ text: `updated` })
                    })

            }

        }
    }
    function fetchUser(id: string) {
        setfriendInfo(true)
        database.ref(`users/`).orderByChild(`number`).equalTo(id).once(`value`, snap => {
            let value: userInterface = snap.val()
            if (value) {
                setfriendName(value.firstName + ` ` + value.lastName)
                setfriendImg(value.image)
            }
            alert(value)
        })

    }

    function viewPeople(){
     setshowPeople(true)
    }
    function toggleVisibility(){
        if(visible){
            if(user){
                database.ref(`locations`).child(user?.number).remove().then(()=>{
                    Plugins.Toast.show({text:`Going invisible...`})
                    setvisible(false)
                })
                 }
        }
        setvisible(!visible)
    }
    useEffect(() => {
        if(visible && user){
            database.ref(`locations`).child(user?.number).set(JSON.stringify(userLocation))
            .catch((err) => {
                Plugins.Toast.show({ text: err.message })
            }).then(() => {
                Plugins.Toast.show({ text: `updated` })
            })
        }
        
    }, [visible]);
    return (
        <>

            <IonModal swipeToClose mode="ios" isOpen={props.isOpen} onDidDismiss={props.onDidDismiss}>
                <IonPopover isOpen={friendInfo} onDidDismiss={() => { setfriendInfo(false); setfriendName(undefined) }}>
                    <img src={friendImg} alt="" />
                    {friendImg == undefined && <IonSpinner />}
                    <IonContent>
                        <IonCardContent>
                            <IonText>
                                {friendName}
                                {friendName == undefined && <IonSpinner />}
                            </IonText>
                        </IonCardContent>
                    </IonContent>
                </IonPopover>
                <IonPopover isOpen={showPeople} onDidDismiss={()=>setshowPeople(false)}>
                    <IonContent>
                        <IonToolbar>
                          <IonItem>
                              <IonLabel>Turn on visibility to friends</IonLabel>
                              <IonToggle checked={visible} onIonChange={()=>toggleVisibility()}></IonToggle>
                          </IonItem>
                          <IonList>
                              <IonItem>
                              <IonListHeader>visible friends</IonListHeader>
                              </IonItem>
                              <IonCardContent>
                              {friends.map((friend,index)=>{
                                  return <IonChip>
                                      <IonIcon icon={call}/>
                                      {friend.id}
                                  </IonChip>
                              })}
                              {
                                  friends.length<=0&&<IonTitle>none</IonTitle>
                              }
                              </IonCardContent>
                          </IonList>
                        </IonToolbar>
                    </IonContent>
                </IonPopover>
                <IonLoading message={`fetching friend\`s location`} isOpen={fetchingFriend} onDidDismiss={() => setfetchingFriend(false)} />
                <IonContent ref={content} scrollY style={{ position: "relative" }} className={`map-content`} scrollX>
                    <IonPopover cssClass={`describtion-pop`} animated isOpen={clickedLocation != undefined} onDidDismiss={() => { setclickedLocation(undefined) }}>
                        <IonContent>
                            <IonImg src={clickedLocation?.mainpic} />
                            <IonCardContent>
                                <IonText>
                                    {clickedLocation?.about}
                                </IonText>
                            </IonCardContent>
                        </IonContent>
                    </IonPopover>
                    <IonAlert  inputs={AlertInputs} onDidDismiss={() => setshowLocationAlert(false)} isOpen={showLocationAlert} buttons={AlertButtons} header={`Find Friend on Campus - In Beta`} message={`Enter the Phone number of the person you want to Find`} ></IonAlert>

                    <div className="map-container">


                        <IonImg onIonImgDidLoad={(el) => { setmapel(el) }} datatype={`webp`} onClick={() => setopenstats(false)} onDoubleClick={expandContract} alt="" className="mapImg" style={{ width: `${mapWidth}px` }} src={map} />
                        <div className="marker" style={{ top: `${offset?.y - 40}px`, left: `${offset?.x - 40}px` }}>
                            <div className="arrow"></div>
                            <div className="pin" onClick={() => { setlocationToast(`choosen Destination`); }}></div>
                            <div className="pin-effect"></div>
                        </div>
                    </div>
                    <div className="markerRed" style={{ transform: `rotate(${computeHeading(userLocation?.coords.heading) - 35}deg)`, top: `${computeLat(userLocation?.coords.latitude) - 60}px`, left: `${computeLong(userLocation?.coords.longitude) - 40}px` }}>
                        <div className="arrow"></div>
                        <div className="pin" onClick={() => { setlocationToast(`Your location`) }} ></div>
                        <div className="pin-effect"></div>
                    </div>
                    <IonToast translucent mode={`ios`} color={`light`} position={`bottom`} duration={1500} message={locationToast} isOpen={locationToast != undefined} onDidDismiss={() => setlocationToast(undefined)} ></IonToast>
                    {
                        viewOthers && mapWidth != 1100 && selectedPlaces.map(ele => {
                            let coords = { x: ele.maxCoords?.x / 1.2418181818181817, y: ele.maxCoords?.y / 1.2427184466019416 }

                            return <div className="allmarkers" style={{ top: `${mapWidth === 1100 ? coords.y : ele.maxCoords.y - 40}px`, left: `${mapWidth === 1100 ? coords.x : ele.maxCoords.x - 40}px` }}>

                                <div className="pin others" onClick={() => { setclickedLocation(ele); }}></div>

                            </div>
                        })
                    }
                    {
                        friends.map((pos, index) => {
                            return <FriendsPin mapWidth={mapWidth} key={index} position={pos} initiateFetch={fetchUser} ></FriendsPin>
                        })
                    }
                </IonContent>
                
                    <MenuFab viewed={viewOthers} viewOthers={() => { setviewOthers(!viewOthers); resizeTo(1366) }} viewstats={() => setopenstats(true)} locate={find} resizeTo={resizeTo} closeModal={closeModal}></MenuFab>
                    <IonFab  vertical={`center`} horizontal={`end`}>
                        <IonFabButton  color={`light`}>
                            <IonIcon icon={people} />
                        </IonFabButton>
                        <IonFabList  side={`top`}>
                            <IonFabButton onClick={() => shareLocation()}>
                                <IonIcon icon={search} />
                            </IonFabButton>
                            <IonFabButton onClick={viewPeople}>
                                <IonIcon icon={settings} />
                            </IonFabButton>
                        </IonFabList>
                        
                    </IonFab>
               
                
                  <div onClick={() => setviewimage(props.img)}><ImageFab maxCoordsY={props.maxCoords?.y} Image={props.img}></ImageFab></div>
                
                <ViewPicture description={props.Place?.about} isOpen={viewimage != ``} OndidDismiss={() => { setviewimage(``) }} imageRef={viewimage} ></ViewPicture>

            </IonModal>
            <IonModal onDidDismiss={() => setopenstats(false)} swipeToClose backdropDismiss showBackdrop mode={`ios`} isOpen={openstats} cssClass={`stats`}>
                <IonHeader color={`none`}>
                    <IonToolbar color={`none`}>
                        <div className="stat-content">
                            <div className="line"></div>
                            <IonList color={`none`}>
                                <IonItem>
                                    <IonText>distance from choosen location</IonText>
                                    <IonItem lines={`none`}>
                                        <h4>{convertScale(distance)}</h4>
                                    </IonItem>
                                </IonItem>
                                <IonItem>
                                    <IonText>Current Status</IonText>
                                    <IonItem lines={`none`}>
                                        <h4>{computeLat(userLocation?.coords.latitude) == 0 && computeLong(userLocation?.coords.longitude) == 0 ? `out of campus` : `on campus`}</h4>
                                    </IonItem>
                                </IonItem>
                                <IonItem>
                                    <IonText>Destination</IonText>
                                    <IonItem lines={`none`}>
                                        <h4 style={{ textTransform: `capitalize` }}>{props.placename}</h4>
                                    </IonItem>
                                </IonItem>
                                <IonItem>
                                    <IonText>Estimated time to destination</IonText>
                                    <IonItem lines={`none`}>
                                        <h4 style={{ textTransform: `capitalize` }}>{getUserTime(userLocation?.coords.speed, distance)}</h4>
                                    </IonItem>
                                </IonItem>

                                <IonToolbar onClick={() => setchoosen(Math.ceil(Math.random() * 100) % gearColor.length)} className={`speedo`}>
                                    <IonTitle>
                                        Your speed
                                        </IonTitle>
                                    <ReactSpeedometer forceRender startColor={gearColor[choosen].left} endColor={gearColor[choosen].right} value={getSpeed(userLocation?.coords.speed)} segments={10} needleColor={`blue`} needleHeightRatio={0} minValue={0} maxValue={20} />
                                    <div style={{ transform: `translate(150px ,-255px) rotate(${getAngle(getSpeed(userLocation?.coords.speed), 0, 20)}deg)` }} className="gear-arrow"></div>

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


const FriendsPin: React.FC<{ position: { id: string, geo: GeolocationPosition }, mapWidth: number, initiateFetch: Function }> = ({ position, mapWidth, initiateFetch }) => {
    const [ranColor, setranColor] = useState(getRandomColor())
    const [top, settop] = useState(0);
    const [left, setleft] = useState(0);
    const { id, geo } = position

    useEffect(() => {
        settop(computeAproxLat(geo.coords.latitude, mapWidth, `user may not be on campus`))
        setleft(computeAproxLong(geo.coords.latitude, mapWidth, `user may not be on campus`))
    }, []);
    return (
        <div onClick={() => { initiateFetch(id) }} className="markerRed friends" style={{ top: `${top - 60}px`, left: `${left - 40}px` }}>
            <div className="arrow"></div>
            <div className="pin" style={{ background: ranColor }} ></div>
            <div className="pin-effect" style={{ background: ranColor }} ></div>
        </div>
    )
}

const MenuFab: React.FC<{ viewed: boolean, viewOthers: Function, viewstats: Function; closeModal: Function, locate: Function, resizeTo: Function }> = (props) => {
    const [expandMap, setexpandMap] = useState(true);
    const { viewstats, viewOthers, viewed } = props
    const [] = useState(true);
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
        <IonFab style={{ transform: `translateY(100px)` }} horizontal="end" vertical="center">
            <IonFabButton onClick={() => { viewstats() }} color="light">
                <IonIcon icon={barChart}></IonIcon>
            </IonFabButton>
        </IonFab>
        <IonFab style={{ transform: `translateY(80px)` }} horizontal="start" vertical="center">

            <IonFabButton>
                <IonIcon icon={menu}></IonIcon>
            </IonFabButton>
            <IonFabList side="bottom">
                <IonFabButton onClick={() => props.closeModal()} color="dark">
                    <IonIcon icon={close}></IonIcon>
                </IonFabButton>

            </IonFabList>
            <IonFabList side={`top`}>
                <IonFabButton style={{ opacity: viewed ? 0.6 : 1 }} onClick={() => viewOthers()}>
                    <IonIcon color={`danger`} icon={pinOutline}></IonIcon>
                </IonFabButton>
            </IonFabList>
            {/* <IonFabList side="bottom">
                <IonFabButton onClick={resizeMap} color="danger">
                    <IonIcon icon={expandMap ? resize : contract}></IonIcon>
                </IonFabButton>
            </IonFabList> */}
            <IonFabList side="end">
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
    let position = props.maxCoordsY > 580 ? bottom : bottom;
    return (
        <img alt="" style={{ width: "130px", ...position, position: "fixed", borderRadius: "6px" }} src={props.Image}></img>

    )
}
export const openBrowseImage = (imageurl: string) => {
    Plugins.Browser.open({ url: imageurl, toolbarColor: `#44d` })

}

function convertScale(dist: number | undefined) {
    if (dist == undefined) {
        return `uncertain`
    }
    if (dist > 999) {
        return (dist / 1000 + ``).substr(0, 4) + `km`
    }
    return dist + `m`
}

function getUserTime(speed: number | undefined, distance: number | undefined) {

    if (speed == undefined || distance == undefined) {
        return `infinite `
    }
    if (distance == 0) {
        return `you are at your destination`
    }
    let t = (distance / speed)
    if (t > 60 && t < 60 * 60) {
        return Math.round(t / 60) + ` min`
    }
    else if (t >= 60 * 60 && t < 60 * 60 * 24) {
        return Math.round(t / 360) + ` hr`
    }
    else if (t > 60 * 60 * 24) {
        return Math.round(t / (360 * 24)) + ` days`

    }
    return Math.round(t) + `s`

}

function getSpeed(speed: number | undefined) {
    if (speed) {
        return speed;
    } return 0
}

function getAngle(val: number | undefined, min: number, max: number) {
    if (val) {
        let beta = (max - min) / 180
        let angle = val / beta - 90
        if (angle > 90) angle = 99
        console.log(angle)
        return angle
    }
    return -90
}

export function HapticVibrate() {
    try{Plugins.Haptics.vibrate()
    Plugins.Haptics.notification({ type: HapticsNotificationType.SUCCESS })
    Plugins.Haptics.impact({ style: HapticsImpactStyle.Heavy })
}catch{}
}

function ActualLong(long: number | undefined, mapWidth: number) {

    if (!long) {
        return 0
    }

    let alpha = (9.292873 - 9.277874) / mapWidth
    let x = (long - 9.277874) / alpha

    return x;
}
function ActualLat(lat: number | undefined, mapWidth: number) {
    let h = 768
    if (!lat) {
        return 0
    }
    else {
        if (mapWidth == 1100) {
            h = 618
        }
        let beta = (4.152133 - 4.143990) / h
        let y = h - (lat - 4.143990) / beta
        console.log(y)
        return y;
    }
}

function getRandomColor() {
    let R = Math.ceil(Math.random() * 1000) % 255
    let G = Math.ceil(Math.random() * 1000) % 255
    let B = Math.ceil(Math.random() * 1000) % 255
    return `rgb(${R},${G},${B})`;
}

function computeAproxLong(long: number | undefined, mapWidth: number, notfoundText = `user not found`) {

    if (!long) {
        return 0

    }
    if (long > 9.292873 || long < 9.277874) {
        Plugins.Toast.show({ text: notfoundText, position: `center` })
        if(userCounter%2)
        Plugins.Toast.show({ text: notfoundText, position: `center` })

        return 0;
    }

    let alpha = (9.292873 - 9.277874) / mapWidth
    let x = (long - 9.277874) / alpha
    console.log(x)

    return x;
}
var userCounter=1;
function computeAproxLat(lat: number | undefined, mapWidth: number, notfoundText = `user not found`) {
    let h = 768
    if (!lat) {
        if(userCounter%2)
        Plugins.Toast.show({ text: notfoundText, position: `center` })

        userCounter++

        return 0

    }


    if (mapWidth == 1100) {
        h = 618
    }
    let beta = (4.152133 - 4.143990) / h
    let y = h - (lat - 4.143990) / beta
    console.log(y)
    return y;
}
