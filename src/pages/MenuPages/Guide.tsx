import React, { useEffect, useState } from "react"
import { IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonNote, IonSearchbar, IonSkeletonText, useIonViewDidEnter, IonContent, IonIcon, IonButton, IonBackdrop, IonSpinner } from "@ionic/react"
import "./Guide.css"
import firebase from "firebase"
import { Capacitor, Plugins } from "@capacitor/core"
import { getStorage } from "../Info"
import { useHistory } from "react-router"
import GuideInfo from "../GuideInfo"
import { arrowBack } from "ionicons/icons"

// const GuideList=[
//     {des:"application, rectification",
//        title:"Transcripts"    }
//     {des:"how, requirements",
//        title:"Credit values"    },
//     {des:"how the work, valid",
//        title:"Admissions"    },
//     {des:"essense, procedure",
//        title:"Matriculation"    },
//     {des:"Games, competition",
//        title:"ub games"    },
//     {des:"fees, medicals",
//        title:"registration"    },
//     {des:"CAs, Exams, resits, carry overs",
//        title:"Evaluations"    }, 
// ]

export interface GuideInterface{
    title:string,
    describtion:string,
   details:string
}

const Guide:React.FC=()=>{
    const [list, setlist] = useState<GuideInterface[]>([]);
    const [GuideList, setGuideList] = useState<GuideInterface[]>([]);
    const [selectedGuide, setselectedGuide] = useState<any>();
    const [refreshing, setrefreshing] = useState(false);
    let history=useHistory()
    useIonViewDidEnter(() => {
        if( document.body.classList.contains(`dark`)){
            Plugins.StatusBar.setBackgroundColor({ color: `#152b4d` }).catch(console.log)
           }else {
            Plugins.StatusBar.setBackgroundColor({ color: `#0d2c6d` }).catch(console.log)
           }
    })
    useIonViewDidEnter(() => {
        Plugins.StatusBar.setOverlaysWebView({
            overlay: false
        }).catch(() => { });
    })
    const search=(event:any)=>{
        const value=event.target.value+""
        if(value==="") {
            setlist(GuideList);
        return ;
    }
        else setlist(GuideList.filter(item=>item?.describtion .toLowerCase(). match(value.toLowerCase()) || item?.title.toLowerCase(). match(value.toLowerCase())  ))

    }

   useEffect(()=>{
       initializeFromStorage()
             LoadGuideFromDatabase()
           
             getStorage(`firstTimer`).then((res)=>{
                if(res.value==`noMore`){
                    
                }else{
                    Plugins.Storage.set({key:`firstTimer`,value:`noMore`}).then(()=>{
                        history.push(`/About`)
                        })
                }
            })
     
      
    },[])
    
     
    function initializeFromStorage(){
        getStorage(`guide`).then((res)=>{
            if(res.value){
                let value=JSON.parse(res.value)
                setlist(Object.values(value).map((item)=>JSON.parse(item+``)))
                setGuideList(Object.values(value).map((item)=>JSON.parse(item+``)))
            }

           })
    }
    function LoadGuideFromDatabase(){
        setrefreshing(true)
        firebase.database().ref('guide').on("value",(snapshot)=>{
            let value=snapshot.val()   
            if(value) 
           { 
               
              setlist(Object.values(value).map((item)=>JSON.parse(item+``)))
              setGuideList(Object.values(value).map((item)=>JSON.parse(item+``)))
              Plugins.Storage.set({key:`guide`,value:JSON.stringify(value)})
              }
             else{
              
             }
             setrefreshing(false)
             
        }, ()=>{
            setrefreshing(false)
        })
    }
    useEffect(() => {
        ExitApp()
        
      }, []);
      // firebase.performance()
    var starttime=0
      function ExitApp() {
       
          if (Capacitor.isNative) {
            Plugins.App.addListener(`backButton`, async () => {
                if( window.location.pathname === `/` &&starttime==0){
                    Capacitor.Plugins?.Toast.show({text:`press back again to exit`}) 
                    starttime=Date.now()
                     }
                else if (window.location.pathname === `/` && Math.abs(Date.now()-starttime)<=2000) {
                         ExitGesture()
                         starttime=0
                }
                else{
                    starttime=0
                }
              
            })
          }
        
    
      }
    
      async function ExitGesture() {
        // let value = await Plugins.Modals.confirm({ message: `Are you sure you want to Exit App?`, title: `Exit`, })
             
        Plugins.App.exitApp()
     
      }
    
    
    return(
         <IonContent  className={`guide-content`}>
            <IonToolbar color={`light`} className={`ion-padding-bottom`}>
                 <IonSearchbar placeholder={`what do you want to learn about?`} onIonChange={search} color="primary" ></IonSearchbar>
              <div className="links">
              {list.length>0?list.map(((item,index)=>{
                      return <AidLinks openGuide={ (val:any)=>{setselectedGuide(val)}} key={index} info={item} />
                  })):
                  ['','','','','','',''].map((ele,index)=><InitSkeleton key={index}></InitSkeleton>)
              }

              <GuideInfo location={selectedGuide} isOpen={selectedGuide!=undefined} onDidDismiss={()=>setselectedGuide(undefined)}/>
             
             </div>
          { refreshing&&   <IonSpinner duration={700} className={`ion-margin`} color={`danger`} style={{transform:`scale(1.2)`}}></IonSpinner>}
        </IonToolbar>
        </IonContent> 
    )
}

export default Guide;

const AidLinks:React.FC<{info:GuideInterface, openGuide:Function}>=({info, openGuide})=>{
   function moreInfo(){
       openGuide({state:info})
  }
    return(
    <IonItem onClick={moreInfo} button className="">
    <IonLabel position="stacked">{info?.title}</IonLabel>
 
   <IonNote>{info?.describtion}</IonNote>
   
    </IonItem>
   )
}


export const MenuLinkHeader:React.FC<{title:string}>=(props)=>{
       return(
        <IonHeader>
        <IonToolbar color="primary">
            <IonGrid>
                <IonRow>
                    <IonCol size="2">
                        <IonButton fill={`clear`} color={`light`} >
                        <IonIcon icon={arrowBack}/>
                        <IonBackdrop></IonBackdrop>
                        </IonButton> 
   </IonCol>
           <IonCol className="ion-padding-top">
       <IonTitle>{props.title}</IonTitle>
           </IonCol>
                </IonRow>
            </IonGrid>
        </IonToolbar>
    </IonHeader>
       )
}

const InitSkeleton:React.FC=()=>{
    return(
        <>
            <IonSkeletonText animated  style={{width:"40%",height:"20px"}} color="dark"></IonSkeletonText>
            <IonSkeletonText style={{height:"20px",marginBottom:"20px"}} color="dark"></IonSkeletonText>
        </>
    )
}

export async function authUser(){
    let user=JSON.parse((await Plugins.Storage.get({key:`user`})).value+``)
    if(!user)
    return  false
    return firebase.auth().signInWithEmailAndPassword(user.email,user.pass)
}

export async function authVisitor(){
    return firebase.auth().signInAnonymously()
}