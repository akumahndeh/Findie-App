import { IonCol, IonGrid, IonRow, IonSkeletonText } from "@ionic/react"
import React from "react"
import "./SkeletonText.css"

const SkeletonText: React.FC = () => {
    return (
        <>
            <IonSkeletonText className="img"></IonSkeletonText>
            <IonGrid className="grid">
                <IonRow>
                    <IonCol>
                        <IonSkeletonText className="dp"></IonSkeletonText>
                    </IonCol>
                    <IonCol size="8">
                        <IonSkeletonText className="text"></IonSkeletonText>
                        <IonSkeletonText className="text"></IonSkeletonText>
                        <IonSkeletonText className="text"></IonSkeletonText>
                        <IonSkeletonText className="text"></IonSkeletonText>
                        <IonSkeletonText className="text"></IonSkeletonText>
                        
                    </IonCol>
                </IonRow>
            </IonGrid>
        </>
    )
}

export default SkeletonText;