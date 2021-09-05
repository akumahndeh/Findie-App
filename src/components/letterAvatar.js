import React from 'react';
import LetteredAvatar from 'react-lettered-avatar';
 
function LetterAvatar({props:{name, size}}) {
      

    return(
        <LetteredAvatar
            name={name}
            size={size}
            backgroundColors={arrayWithColors}

        />
    )
}
export function LetterAvatarBorderRadius({props:{name, size, borderRadius}}) {
      

    return(
        <LetteredAvatar
            name={name}
            size={size}
            backgroundColors={arrayWithColors}
            borderRadius={borderRadius}

        />
    )
}


export default LetterAvatar


const arrayWithColors=[
    `var(--ion-color-secondary)`,
    `var(--ion-color-primary)`,
    `var(--ion-color-dark)`,
    `var(--ion-color-tertiary)`,
    `var(--ion-color-danger)`,
    `var(--ion-color-warning)`,
    `var(--ion-color-success)`,
    `var(--ion-color-dark)`, 
    `var(--ion-color-dark)`,
    `var(--ion-color-medium)`,
]