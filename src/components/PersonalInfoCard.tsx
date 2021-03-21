import React, { useEffect, useState } from "react"
import { IonCard, IonCardHeader, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonText, IonCheckbox, IonCardTitle, IonProgressBar } from "@ionic/react"
import { Plugins } from "@capacitor/core";
import  "./signupCard.css"

const PersonalInfoCard: React.FC<{ getUserInfo: Function }> = (props) => {
  const [faculty, setfaculty] = useState("");
  const [accept, setaccept] = useState(false);
  const [progress, setprogress] = useState({firstName:0,lastName:0,advert:0, code:0, pass:0,faculty:0, email:0,department:0,id:0,number:0});
  const [pvalue, setpvalue] = useState(0);
  function submit(event: any) {
        event.preventDefault()
        let formObject = event.target
        let userInfo: any[] = []
        for (const key in formObject) {
            if (Object.prototype.hasOwnProperty.call(formObject, key)) {
                if (formObject[key].name)
                   {  if(formObject[key].name==`email` || formObject[key].name==`pass`){
                       userInfo[formObject[key].name] = formObject[key].value.toLowerCase()
                    }else{
                        userInfo[formObject[key].name] = formObject[key].value
                    }
                }
            }
        }
        props.getUserInfo(userInfo)
    }
    function updateProgress(event:any){
        let name:string=event.target.name
        if(event.target.value!=``)
          setprogress({...progress,[name]:0.1})
        else{
            setprogress({...progress,[name]:0.0})
          }
    }
    useEffect(() => {
       let arr= Object.values(progress).filter((val:number)=>val!=0)
      
         setpvalue(
            arr.length*0.1
         )
    }, [progress]);
    return (
        <>
        <IonCard >
            <IonCardHeader color="primary">
                Final Step
                  </IonCardHeader>
                  <IonProgressBar color={`danger`} value={pvalue+((accept)?0.3:0)}></IonProgressBar>
            <IonLabel color={`danger`}>
            {pvalue==0.2 && pvalue<0.4?`keep going 😃`:pvalue>=0.5 && accept==false?`almost there 😘`:pvalue>=0.7 && accept==true?`Complete 🥂`:``}

            </IonLabel>
            <IonCardContent>
                <form onSubmit={submit}>
                    <IonItem>
                        <IonLabel position="floating">first name</IonLabel>
                       <IonInput onIonChange={updateProgress} required name="firstName"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">last name</IonLabel>
                       <IonInput onIonChange={updateProgress} required name="lastName"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">faculty or school</IonLabel>
                        <div style={{opacity:0}}>
                       <IonInput onIonChange={updateProgress} style={{height:"1px"}} required name="faculty" value={faculty}></IonInput>
                        </div>
                        <IonSelect className={`faculty-options`} onIonChange={(e:any)=>setfaculty(e.target.value)} aria-required interface="action-sheet" >
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
                    <IonItem>
                        <IonLabel position="floating">department</IonLabel>
                       <IonInput onIonChange={updateProgress} required name="department"></IonInput>
                    </IonItem>

                    <IonItem>
                        <IonLabel position="floating">phone number</IonLabel>
                       <IonInput onIonChange={updateProgress} required type='number' name="number"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">email</IonLabel>
                       <IonInput onIonChange={updateProgress} required type="email" name="email"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">enter password</IonLabel>
                       <IonInput onIonChange={updateProgress} required name="pass"></IonInput>
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