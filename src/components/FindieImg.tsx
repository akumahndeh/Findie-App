import { FilesystemDirectory, Plugins } from "@capacitor/core";
import React, { useEffect, useState } from "react";

const { Filesystem } = Plugins

const FindieImg: React.FC<{ src: string, className: string, style: any }> = ({ src, className, style }) => {

    const [image, setimage] = useState(src)
    const imageUrl:any=src
    const [imgUrl] = useState(imageUrl.replaceAll(`/`,``).replaceAll(`.`,``).replaceAll(`=`,``).replaceAll(`?`,``))
   
    useEffect(() => {
        getFile()
    }, [])

    async function getFile() {
        

        try {
            const result = await Filesystem.readFile({ path: `${imgUrl}`, directory:FilesystemDirectory.Data })
            console.log(`uptaining... `,result.data)
            if (result.data) {
                setimage(result.data)
            }else{
                setimage(src)
            }
        } catch (err) {
            if (!src) return;
            const img:any = await fetchImage(src)
            if(!img) return;
            console.log(`saving... `,img)
            await Filesystem.writeFile({ data:img, path:`${imgUrl}`, directory:FilesystemDirectory.Data })
            setimage(src)
           return;
        }
    }

    return (
        <img className={className} style={style} src={src} alt="" />
    )
}

const IonFindieImg: React.FC<{ src: string, className: string, style: any }> = ({ src, className, style }) => {

    const [image, setimage] = useState(src)
    const imageUrl:any=src
    const [imgUrl] = useState(imageUrl.replaceAll(`/`,``).replaceAll(`.`,``).replaceAll(`=`,``).replaceAll(`?`,``))
   
    useEffect(() => {
        getFile()
    }, [])

    async function getFile() {
        

        try {
            const result = await Filesystem.readFile({ path: `${imgUrl}`, directory:FilesystemDirectory.Data })
            console.log(`uptaining... `,result.data)
            if (result.data) {
                setimage(result.data)
            }else{
                setimage(src)
            }
        } catch (err) {
            if (!src) return;
            const img:any = await fetchImage(src)
            if(!img) return;
            console.log(`saving... `,img)
            await Filesystem.writeFile({ data:img, path:`${imgUrl}`, directory:FilesystemDirectory.Data })
            setimage(src)
           return;
        }
    }

    return (
        <img className={className} style={style} src={src} alt="" />
    )
}


async function fetchImage(src: string) {

    return (new Promise((resolve, reject) => {
        fetch(src).then(async result => {
            const blob = await result.blob()
            if (!blob) {
                reject(undefined)
                return;
            }
            const fr = new FileReader()
            fr.onloadend = () => {
               resolve(fr.result||``)
            }
            fr.readAsDataURL(blob)
        })
    }))
}


export {IonFindieImg, FindieImg}


// /storage/emulated/0/Findie/