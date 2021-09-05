import React, { useEffect, useState } from "react"
import { IonCard, IonCardHeader, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonText, IonCheckbox, IonCardTitle, IonProgressBar, IonLoading } from "@ionic/react"
import { Plugins } from "@capacitor/core";
import  "./signupCard.css"
import { userInterface } from "../pages/Info";
import { auth, db, fstore } from "../firebase/Firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, update_user } from "../state/user-state";
import { useHistory } from "react-router";
 


const {Modals, Storage} = Plugins

const defaultUser={email:``,pass:``,faculty:``,image:``,username:``,number:``}

const PersonalInfoCard: React.FC<{ getUserInfo: Function }> = (props) => {
  const [faculty, setfaculty] = useState("");
  const [accept, setaccept] = useState(false);
  const [userInfo, setuserInfo]= useState<userInterface>(defaultUser)
  const [loading, setloading] = useState(false)
  const userData = useSelector(selectUser)
  const dispatch= useDispatch()
  const history = useHistory()

  useEffect(()=>{
    console.log(userData)
  },[userData])

  async function submit(event: any) {
        event.preventDefault()
      try{
        if(!validateCredentials(Object.values({...userInfo,image:`sjkk`,number:`jwhhdj`}))){
            Modals.alert({message:`Some credentials have not been entered`,title:`Missen info`})
            console.log(userInfo)
            return;
        }

        const user = userInfo
        setloading(true)
       await auth.createUserWithEmailAndPassword(user.email, user.pass)
       await fstore.collection(`users`).doc(user.email).set(user)
       Storage.set({ key: `user`, value: JSON.stringify(user) }) 
       Storage.set({ key: "userid", value: user.email })
       history.push(`/guide`)
       dispatch(update_user(user))
       setloading(false)
      }
      catch(err)   {
        setloading(false)
        Modals.alert({message:err.message||`unexpected error occured while signing in`,title:`Authentication error`})
      }
   
    }

    // function updateProgress(event:any){
    //     let name:string=event.target.name
    //     if(event.target.value!=``)
    //       setprogress({...progress,[name]:0.2})
    //     else{
    //         setprogress({...progress,[name]:0.0})
    //       }
    // }
    // useEffect(() => {
    //    let arr= Object.values(progress).filter((val:number)=>val!=0)
      
    //      setpvalue(
    //         arr.length*0.1
    //      )
    // }, [progress]);
    return (
        <>
        <IonCard >
            <IonCardHeader color="primary">
                Final Step
                  </IonCardHeader>
            <IonLabel color={`danger`}>
            <IonLoading onDidDismiss={() => setloading(false)} isOpen={loading} message="please wait..." spinner="bubbles" ></IonLoading>
                  
            </IonLabel>
            <IonCardContent>
                <form onSubmit={submit}>
                    <IonItem>
                        <IonLabel position="floating">user name</IonLabel>
                       <IonInput value={userInfo.username} onIonChange={(e)=>setuserInfo({...userInfo, username:(e.detail.value || ``).trim()})} required name="username"></IonInput>
                    </IonItem>
                    {/* <IonItem>
                        <IonLabel position="floating">last name</IonLabel>
                       <IonInput onIonChange={updateProgress} required name="lastName"></IonInput>
                    </IonItem> */}
                    <IonItem>
                        <IonLabel  position="floating">faculty or school</IonLabel>
                        <div style={{opacity:0}}>
                       <IonInput value={userInfo.faculty} onIonChange={(e)=>setuserInfo({...userInfo, faculty:(e.detail.value || ``).trim()})}    style={{height:"1px"}} required name="faculty" ></IonInput>
                        </div>
                        <IonSelect className={`faculty-options`} value={userInfo.faculty} onIonChange={(e)=>setuserInfo({...userInfo, faculty:(e.detail.value || ``).trim()})} aria-required interface="action-sheet" >
                            <IonSelectOption >A.S.T.I</IonSelectOption>
                            <IonSelectOption>College Of Technology</IonSelectOption>
                            <IonSelectOption >Agriculture and Vertinary medicine</IonSelectOption>
                            <IonSelectOption>Arts</IonSelectOption>
                            <IonSelectOption>engineering and technology</IonSelectOption>
                            <IonSelectOption>Faculty of Education</IonSelectOption>
                            <IonSelectOption>Health Science</IonSelectOption>
                            <IonSelectOption>Law and Political Sciences</IonSelectOption>
                            <IonSelectOption>Science</IonSelectOption>
                            <IonSelectOption>Social Management Science S.M.S</IonSelectOption>
                            <IonSelectOption>H.T.T.T.C</IonSelectOption>
                            <IonSelectOption>S.Y.M</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    {/* <IonItem>
                        <IonLabel position="floating">department</IonLabel>
                       <IonInput onIonChange={updateProgress} required name="department"></IonInput>
                    </IonItem> */}

                    {/* <IonItem>
                        <IonLabel position="floating">phone number</IonLabel>
                       <IonInput onIonChange={updateProgress} required type='number' name="number"></IonInput>
                    </IonItem> */}
                    <IonItem>
                        <IonLabel position="floating">email</IonLabel>
                       <IonInput value={userInfo.email} onIonChange={(e)=>setuserInfo({...userInfo, email:(e.detail.value || ``).trim()})}  required type="email" name="email"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel  position="floating">enter password</IonLabel>
                       <IonInput value={userInfo.pass} onIonChange={(e)=>setuserInfo({...userInfo, pass:(e.detail.value || ``).trim()})} required name="pass"></IonInput>
                    </IonItem>
                    <div className="ion-padding ion-margin-top">
                        <IonCheckbox className={`ion-margin-end`} onIonChange={(e:any)=>{ setaccept(e.detail.checked)}}></IonCheckbox><IonLabel>i accept the <IonText onClick={viewTerms} color={`primary`}>terms and conditions</IonText> of findie</IonLabel>
                    </div>
                    <div className="ion-padding ion-margin-top">
                        <IonButton disabled={!accept} type="submit" expand="full">create</IonButton>
                    </div>
                </form>
            </IonCardContent>
        </IonCard>
        <br/><br/>
         <IonCard>
         <IonCardContent>
           <IonCardTitle>why all the information</IonCardTitle>
           <p>
             Findie is much more than an app that helps you find your way on campus. it helps you connect with friends and recieve information from your faculty.
             As stated in the privacy policy, we can not disclose this information to anyone, niether can we see your credentials. 
             We also needed the provided information to confirm that those registering belong to the university. Enjoy the application and do not forget to
             leave a feedback
             
           </p>
         </IonCardContent>
       </IonCard>
       </>
    )
}


export default PersonalInfoCard;


export function viewTerms(){
  Plugins.Browser.open({url:`https://findieapp.web.app/terms`})
}


const validateCredentials=(array:string[])=>{
    if(array.filter(val=>(!!val)).length === array.length){
        return true
    }
    else{
        return false
    }

}