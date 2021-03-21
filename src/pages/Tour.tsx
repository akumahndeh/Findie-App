import React, { useState, useRef, useEffect } from "react"
import { IonList, IonListHeader, IonSlides, IonSlide, IonIcon, IonText, IonSearchbar, IonLabel, IonCard, IonButton, IonTitle, IonGrid, IonRow, IonCol, IonImg, IonVirtualScroll, IonRippleEffect, IonLoading, useIonViewDidLeave, IonContent, IonPage, useIonViewDidEnter, useIonViewWillEnter, IonHeader, IonToolbar, IonFab, IonAvatar, IonItem, IonMenuButton, IonPopover, IonButtons, IonSpinner, CreateAnimation } from "@ionic/react"
import { book, fastFood, cafeSharp, basketball, searchCircle, home, buildOutline, image, search, mapOutline } from "ionicons/icons";
import { Classes, offices, sports, Docs, Restaurants, Others, All, Assets } from "../media/images/images";
import { Link, useHistory, useLocation } from "react-router-dom";
import "./Tour.css"
import { HapticVibrate } from "../components/MapModal";
import { Capacitor, Plugins } from "@capacitor/core";
import ReactLinkify from "react-linkify";
import { getStorage } from "./Info";
import TourInfo from "./TourInfo";
import { Header } from "./Main";
import TourSearchModal from "../components/TourSearchModal";
import firebase from "firebase";
import { HideTab } from "../App";

const Tour: React.FC = () => {
    const [category, setcategory] = useState(All);
    const [currentCategory, setcurrentCategory] = useState(Classes);
    const [hint, sethint] = useState(true);
     const [openSearch, setopenSearch] = useState(false);
     const [loaded, setloaded] = useState(false);
     const [loadspinner, setloadspinner] = useState(false);
    const history = useHistory()

    function closeSearch(){
        setopenSearch(false)
    }
    useIonViewDidLeave(() => {
        sethint(false)
    })
    var t:any,k:any;
    useEffect(() => {
        getStorage(`firstTimer`).then((res) => {
            if (res.value == `noMore`) {

            } else {
                Plugins.Storage.set({ key: `firstTimer`, value: `noMore` }).then(() => {
                    history.push(`/Login`)
                })
            }
        })
    //     clearTimeout(t)
    //     clearTimeout(k)
    //   t=setTimeout(() => {
    //     if(!loaded)   
    //       setloaded(true)
    //   }, 3000); 
    //   k=setTimeout(() => {
    //     if(!loadspinner)   
    //       setloadspinner(true)
    //   }, 7000);  

       

    }, []);
    useIonViewDidEnter(()=>{
        
    })

    const searchValue = (event: any) => {
        const value = event.target.value.toLowerCase().replace(" ", "");
        setcategory(currentCategory.filter((item) => {
            return transformForSearch(item.describtion).match(transformForSearch(value))
        }))
    }
    function getcat() {
        if (currentCategory == Classes) {
            return `classes`

        }
        if (currentCategory == All) {
            return `all`

        }
        else if (currentCategory === offices) {
            return `offices`
        }
        else if (currentCategory === Docs) {
            return `docs`
        }
        else if (currentCategory === Restaurants) {
            return `restaurants`
        }
        else if (currentCategory === sports) {
            return `sports`
        }
        else if (currentCategory === Others) {
            return `others`
        }
        return ""
    }
    useIonViewDidEnter(() => {
        if( document.body.classList.contains(`dark`)){
            Plugins.StatusBar.setBackgroundColor({ color: `#152b4d` }).catch(console.log)
           }else {
            Plugins.StatusBar.setBackgroundColor({ color: `#0d2c6d` }).catch(console.log)
           }
    })
    useIonViewWillEnter(() => {
        Plugins.StatusBar.setOverlaysWebView({
            overlay: false
        }).catch(() => { });
    })

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className={"tour-toolbar"} color="primary">
                    <IonMenuButton slot="start"></IonMenuButton>
                    <IonTitle>Tour</IonTitle>
                          <IonButton slot={`end`} fill={`clear`} color={`light`} size={`large`} onClick={()=>{setopenSearch(true); HapticVibrate()}}>
                             <IonIcon color={`light`} icon={search}/>
                         </IonButton>
                   </IonToolbar>
              </IonHeader>
            <IonContent className={`tour-content`}>
            <TourHeader getCategory={(cat: any) => { setcategory(cat); setcurrentCategory(cat); }} ></TourHeader>
               
                  { loaded&&<>
                
               <IonVirtualScroll style={{ overflowY: "scroll", marginBottom: "300px" }} items={All} >
                    <ListBody loaded={loaded} category={getcat()} place={category}></ListBody>
                    <div style={{ height: `100px` }}></div>
                </IonVirtualScroll>
                
                </> 
             }
             <IonLoading  message={`loading places data...`} onDidDismiss={()=>{setloaded(true); setloadspinner(true)}} duration={1000} isOpen={!loadspinner}   cssClass={`loading spinner`} />
             <IonLoading spinner={`lines-small`} message={`loading images`} onDidDismiss={()=>{}} duration={4000} isOpen={loaded}   cssClass={`loading spinner`} />
              <TourSearchModal  onDidDismiss={()=>closeSearch()}  isOpen={openSearch} ></TourSearchModal>
             
                </IonContent>
        </IonPage>

    )
}
export default Tour;





const TourHeader: React.FC<{ getCategory: Function }> = (props) => {
    const selectColor = "danger"
    const init = { all: `medium`, class: "medium", rest: "medium", office: "medium", sport: "medium", doc: "medium", others: `medium` }
    const [chipColor, setchipColor] = useState({ ...init, all: selectColor });
    const tourslides = useRef<HTMLIonSlidesElement>(null)
    const getPlace = (value: number) => {
        if (value === 1) {
            setchipColor({ ...init, all: selectColor })
            props.getCategory(All)

        }
        if (value === 2) {
            setchipColor({ ...init, rest: selectColor })
            props.getCategory(Restaurants)

        }
        else if (value === 3) {
            setchipColor({ ...init, class: selectColor })
            props.getCategory(Classes)
        }
        else if (value === 4) {
            setchipColor({ ...init, office: selectColor })
            props.getCategory(offices)
        }
        else if (value === 5) {
            setchipColor({ ...init, sport: selectColor })
            props.getCategory(sports)
        }
        else if (value === 6) {
            setchipColor({ ...init, doc: selectColor })
            props.getCategory(Docs)
        }
        else if (value === 7) {
            setchipColor({ ...init, others: selectColor })
            props.getCategory(Others)
        }
        tourslides.current?.slideTo(value - 1)
    }

    return (
        <IonToolbar className={`header-bar`}>
            <IonSlides className="tour-slides" ref={tourslides}
                options={{ initialSlide: 0, speed: 200, spaceBetween: 10, centeredSlides: true, loop: false, slidesPerView: 2 }}>

                <IonSlide>
                    <IonButton fill="solid" onClick={() => getPlace(1)} color={chipColor.all} >
                        <IonIcon slot="start" icon={mapOutline} />
                        <IonText>All Places</IonText>
                    </IonButton>
                </IonSlide>
                <IonSlide>
                    <IonButton fill="solid" onClick={() => getPlace(2)} color={chipColor.rest} >
                        <IonIcon slot="start" icon={fastFood} />
                        <IonText>Restaurants</IonText>
                    </IonButton>
                </IonSlide>
                <IonSlide>

                    <IonButton fill="solid" onClick={() => getPlace(3)} color={chipColor.class} >
                        <IonIcon slot="start" icon={book}></IonIcon>
                        <IonText>Classrooms</IonText>
                    </IonButton>
                </IonSlide>
                <IonSlide>
                    <IonButton fill="solid" onClick={() => getPlace(4)} color={chipColor.office} >
                        <IonIcon slot="start" icon={cafeSharp} />
                        <IonText>Offices</IonText>
                    </IonButton>
                </IonSlide>
                <IonSlide>
                    <IonButton fill="solid" onClick={() => getPlace(5)} color={chipColor.sport}>
                        <IonIcon slot="start" icon={basketball} />
                        <IonText>sports</IonText>
                    </IonButton>
                </IonSlide>
                <IonSlide>
                    <IonButton fill="solid" onClick={() => getPlace(6)} color={chipColor.doc}>
                        <IonIcon slot="start" icon={book} />
                        <IonText>Documentations</IonText>
                    </IonButton>
                </IonSlide>
                <IonSlide>
                    <IonButton fill="solid" onClick={() => getPlace(7)} color={chipColor.others}>
                        <IonIcon slot="start" icon={home} />
                        <IonText>Others</IonText>
                    </IonButton>
                </IonSlide>
            </IonSlides>
        </IonToolbar>

    )
}

{/*  */ }



const ListBody: React.FC<{ place: any[], category: string,loaded:boolean }> = (props) => {
    const [tourData, settourData] = useState<any>();

    const openInfo = (obj: any) => {
        settourData({ pathname: `/tourInfo`, state: obj })
    }
    useEffect(() => {

    }, [props]);
    const [loading, setloading] = useState(false);
    useIonViewDidLeave(() => {
        setloading(false)
    })
    return (

        <div className="ion-padding-top "  >
            
                   
            {
                props.place.map((item, index) => {
                    return (
                       
                            <CreateAnimation key={index} play={props.loaded && index<=5} stop={!props.loaded && index>=5}
                        duration={1300}
                          fromTo={[{fromValue:`0`,toValue:`1`,property:`opacity`},
                          {fromValue:`translateX(-${100+index*50}px)`,toValue:`translateX(0)`,property:`transform`},
                         ]}
                        >
                        <IonCard key={index} onClick={() => { openInfo({ ...props.place[index], "category": props.category }); HapticVibrate(); setloading(true) }} className="ion-margin tour-card ion-activatable ripple-parent">
                            <DestinationImg item={item} />
                            <IonRippleEffect></IonRippleEffect>
                            <IonButton fill="outline" color="light" style={{ marginTop: "-40px" }} expand="block">{item.name}</IonButton>
                        </IonCard>
                        </CreateAnimation>
                       
                    )
                })
            }
 

            {props.place.length <= 0 && <p>result not found... please check another category 😢</p>}
            <TourInfo location={tourData} isOpen={tourData != undefined} onDidDismiss={() => { settourData(undefined) }} />
        </div>

    )
}

const DestinationImg: React.FC<{ item: any }> = ({ item }) => {
    const [loaded, setloaded] = useState(false);
    return (
        <img onLoad={() => { setloaded(true) }} alt="" style={{ height: `200px`, transition: `0.6s` }} src={item.mainpic} />
    )
}

export function transformForSearch(text: string) {
    text = text.toLowerCase().trim()
    while (text.match(" ")) {
        text = text.replace(" ", "")
    }
    return text;
}



