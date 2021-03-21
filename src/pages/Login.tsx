import React, { useEffect, useRef, useState } from "react"
import { IonHeader, IonPage, IonContent, IonImg, IonSlides, IonSlide, IonCard, IonCardHeader, IonCardContent, IonInput, IonItem, IonLabel, IonButton, IonIcon, IonAlert, IonLoading, IonRouterLink, IonPopover, IonAvatar, IonText, IonGrid, IonRow, IonCol, useIonViewWillLeave } from "@ionic/react"
import gblock from "../media/images/gblock.jpg"
import "./SignUp.css"
import { useHistory } from "react-router-dom"
import { mail, logIn, person, eye, eyeOff } from "ionicons/icons"
import app from "firebase"
import {Plugins} from "@capacitor/core"
import firebase from "firebase"
import { HapticVibrate } from "../components/MapModal"

const {Storage }=Plugins




const Login:React.FC=()=>{
   const slides = useRef < HTMLIonSlidesElement > (null)
   const content = useRef < HTMLIonContentElement > (null)
   const [offlineUser, setofflineUser] = useState({name:"",image:person});
   const [offpopover, setoffpopover] = useState(false);
   const [ ImageScale,  setImageScale] = useState(1);
   const [seePass, setseePass] = useState(false);
    let initAlert = {
       show: false,
       message: "",
       header: "",
       okhandler: () => {}
   }
   const [alert, setalert] = useState(initAlert);
   const link=useRef<HTMLAnchorElement>(null)
const [loading, setloading] = useState(false);
const history= useHistory()
    function signIn(email:string,pass:string,code:string){
      
        app.auth().signInWithEmailAndPassword(email, pass).then((res) => {
            let uid=res.user?.uid+``
            app.database().ref(`users/${uid}`).once(`value`,snapshot=>{
               if(snapshot.val()?.code==code){
                Storage.set({key:`user`,value:JSON.stringify(snapshot.val())}).then(()=>{
                    Storage.set({key:`userid`,value:uid}).then(()=>{
                    link.current?.click()
                    })
                })
               
               }
               else{
                loginError({code:`database not found`,message:` could not find your account`})
                setloading(false)
               
                 }
            })
            
          
           
         }).catch(async(err)=>{
            if(err.code==="auth/network-request-failed"){
                 try{const uservalue = await Storage.get({key:"user"})
                 const user = JSON.parse(uservalue.value+'')
                if(user)
                { if(user.email===email && user.pass===pass && user.code===code){
                    setofflineUser({name:`${user.firstName} ${user.lastName}`,image:user.image})
                   setoffpopover(true)
                }
            }
                else{
                    loginError(err);
                  }
                }catch{}
             }
             else{
                loginError(err);
             }
           
            setloading(false)
        })
    }
    useEffect(()=>{
          Plugins.StatusBar.setOverlaysWebView({
            overlay: true
          }).catch(()=>{});
    },[])
    
   const submit = (event: any) => {
       setloading(true)
       event.preventDefault()
       const email = event.target.email.value.toLowerCase(),
           code = event.target.code.value.toLowerCase(),
           pass = event.target.pass.value.toLowerCase();
      signIn(email,pass,code)
   }

   const loginError=async(err:{message:string,code:string})=> {
   
    setalert({
           show: true,
           header: "login error",
           message: ""+err.message,
           okhandler: () => {
               history.push(`/signup`)
           }
       })
      
   }
   useIonViewWillLeave(()=>{
       setloading(false)
        Plugins.StatusBar.setOverlaysWebView({
        overlay: false
      }).catch(()=>{});
   })
   function forgotPass(){
       firebase.auth().sendPasswordResetEmail(prompt("enter your email")+'').then(()=>{
          setalert({header:`reset password`,message:`a password reset link has been sent to your mail`,okhandler:()=>{},show:true})
          firebase.auth().getRedirectResult().then(()=>{
                history.push(`/`)

           })
           }).catch((err)=>{
               setalert({header:`password reset failed`,message:err.message,show:true,okhandler:()=>{ history.push(`/signup`)}})
           })
          
   }
  async function animateImage(event:any){
      let scrollElement= await content.current?.getScrollElement()
       if(scrollElement){ 
            let height= scrollElement?.scrollHeight- scrollElement?.clientHeight
            let ratio=scrollElement?.scrollTop/height*1 +0.5
         setImageScale(ratio>=1?ratio:1)
        }
   }
   

    return(
        <IonPage>
           
            <IonPopover isOpen={offpopover} onDidDismiss={()=>{setoffpopover(false);HapticVibrate()}}>
                <IonContent>
                   <IonItem>
                   <IonAvatar slot="start">
                        <IonImg src={ offlineUser.image}/>
                    </IonAvatar>
                        <IonLabel>{ offlineUser.name}</IonLabel>
                   </IonItem>
                   <IonItem className="ion-padding">
                   <IonText>
                        You are currently offline... you will only be able use limited features
                    </IonText>
                    <br/>
                   </IonItem>
                    <IonButton routerLink={"/"} onClick={()=>{setoffpopover(false);HapticVibrate()}}  expand="block">ok, log me in</IonButton>
                </IonContent>
            </IonPopover>
            <IonLoading isOpen={loading} message="verifying" spinner="bubbles" ></IonLoading>
            <IonAlert isOpen={alert.show} buttons={[{text:"ok",},{text:"create account",handler:()=>alert.okhandler(),role:"ok"},]} message={alert.message} header={alert.header} onDidDismiss={()=>{setalert(initAlert)}}></IonAlert>
            <IonHeader></IonHeader>
            <IonContent scrollEvents onIonScroll={animateImage} ref={content}>
              <IonImg style={{position:`fixed`,transition:`transform 0.25s`,transform:`scale(${ImageScale})`}} src={gblock}/>
             <IonSlides ref={slides}  className="signup-card">
                <IonSlide>
                  <IonCard>
                      <IonCardHeader color="primary">
                          Login
                      </IonCardHeader>
                      <IonCardContent>
                         <form onSubmit={submit}>
                         <IonItem lines="inset" >
                             <IonIcon slot="start" icon={mail}></IonIcon>
                              <IonLabel position="floating">Enter email</IonLabel>
                              <IonInput name="email"/>
                          </IonItem>
                          <IonItem lines="inset">
                             <IonIcon slot="start" icon={logIn}></IonIcon>
                              <IonLabel  position="floating">matriculation number</IonLabel>
                              <IonInput name="code" />
                          </IonItem>
                          <IonItem lines="inset">
                             <IonIcon onClick={()=>setseePass(!seePass)} slot="start" icon={seePass? eyeOff:eye}></IonIcon>
                              <IonLabel  position="floating" >password</IonLabel>
                              <IonInput type={seePass? `text`:`password`} name="pass" />
                          </IonItem>
                          <div className="ion-padding ion-margin-top">
                               <IonButton type="submit">
                                   <IonLabel>Login</IonLabel>
                               </IonButton>
                          </div>
                          <IonGrid>
                              <IonRow>
                                  <IonCol>
                                  <IonRouterLink   routerLink="/signup">
                                    <IonButton className="ion-padding" style={{maxWidth:`90%`,fontSize:`11px`,margin:`auto`}} fill={`outline`}>  i dont have an account yet</IonButton>
                                </IonRouterLink>
                             </IonCol>
                                  <IonCol>
                                  <p>
                              <IonLabel onClick={forgotPass} color="primary" >
                                  <IonButton className={`ion-margin`} fill={`clear`} style={{fontSize:`12`}}>forgot password ?</IonButton>
                              </IonLabel>
                          </p>
                                  </IonCol>
                              </IonRow>
                          </IonGrid>
                         </form>
                      </IonCardContent>
                 </IonCard>  
                
               </IonSlide>
                   
             </IonSlides>
             <a href="/" ref={link}></a>
             <IonButton onClick={()=>HapticVibrate()} routerLink={`/teacher`}  fill={`clear`} >...</IonButton>
            </IonContent>
        </IonPage>
    )
}

export default Login
