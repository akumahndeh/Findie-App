import React, { useEffect, useState } from "react";

import { Plugins } from "@capacitor/core";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonButton,
  IonItemDivider,
  IonText,
  IonImg,
  IonSpinner,
  IonButtons,
  IonModal,
  IonIcon,
  IonBackdrop,
  IonCardContent,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import MapModal from "../components/MapModal";
import ViewPicture from "../components/ViewPicture";
import Pictures, { Assets } from "../media/images/images";
import { getStorage } from "./Info";
import "./Tour.css";
import firebase from "../firebase/Firebase";
import { IonFindieImg } from "../components/FindieImg";
import Map from "../components/Map";
interface TourInfoInterface {
  name: string;
  mainpic: string;

  maxCoords: {
    x: number;
    y: number;
  };
  category: string;
  about: string;
  type: string;
}
const TourInfo: React.FC<{
  onDidDismiss: Function;
  isOpen: boolean;
  placedata: TourInfoInterface;
}> = ({ isOpen, onDidDismiss, placedata }) => {
  const [Images, setImages] = useState<string[]>([]);
  const [currentImg, setcurrentImg] = useState(``);
  const content = React.useRef<HTMLIonContentElement>(null);
  const [loadingImages, setloadingImages] = useState(true);
  const [OfflineImages, setOfflineImages] = useState<string[]>([]);
  const [openMapModal, setopenMapModal] = useState(false);
  const [showModal, setshowModal] = useState(false);

  function closeModal() {
    setshowModal(false);
  }

  const openMap = () => {
    setshowModal(true);
    // setopenMapModal(true);
  };
  useEffect(() => {
    if (placedata) {
      try {
        updateImage("places/" + placedata?.type + "/" + placedata?.name);
      } catch {}
    }
  }, [placedata]);

  // useEffect(() => {
  //     if (location) {
  //         setplacedata(location?.state)
  //     }

  // }, [location]);

  function getImages(path: string) {
    try {
      firebase
        .storage()
        .ref()
        .child(path)
        .listAll()
        .then((ele) => {
          if (ele && ele?.items) {
            let items = ele.items;
            setImages(items.map((item) => item.name));

            content.current?.scrollToBottom(1000);
          }

          setloadingImages(false);
        })
        .catch((err) => Plugins.Toast.show({ text: err.message }));
    } catch {}
  }

  function updateImage(databasePath: string) {
    getStorage(`places`).then((res) => {
      let value = res.value;
      if (value) {
        let places = JSON.parse(value);
        let specificPlace: string[] = places[`${placedata?.name}`];
        setOfflineImages(specificPlace);
      } else {
        getImages(databasePath);
      }
    });
  }
  return (
    <IonModal
      cssClass={`tour-modal`}
      isOpen={isOpen}
      onDidDismiss={() => onDidDismiss()}
    >
      <IonHeader>
        <IonToolbar color="primary" className="">
          <IonButtons slot={`start`}>
            <IonButton>
              <IonIcon icon={arrowBack} />
              <IonBackdrop></IonBackdrop>
            </IonButton>
          </IonButtons>
          <IonTitle>{placedata?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={content} className={`tour-info`}>
        <div className="ion-padding-top">
          <IonCard
            onClick={() => openMap()}
            color="dark"
            className="ion-margin tour-card ripple-parent"
          >
            <img
            //   className={`map-img`}
              alt=""
              style={{ width: "100%" }}
              src={Pictures.map}
            />
            <IonButton
              className="cardButton"
              style={{ marginTop: "-40px" }}
              expand="block"
            >
              view on map
            </IonButton>
          </IonCard>
          <div className="ion-padding">
            <label>{placedata.about}</label>
          </div>
          <IonItemDivider color="none">
            <IonText color="primary" style={{ fontSize: "20px" }}>
              Video Tour
            </IonText>
          </IonItemDivider>
          <div className={`tour-video`}>
            <iframe
              allowFullScreen
              src="https://www.youtube.com/embed/GGE0xIhwe7Y"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
          <IonItemDivider color="none">
            <IonText color="primary" style={{ fontSize: "20px" }}>
              Images
            </IonText>
          </IonItemDivider>
          <img
            alt=""
            onClick={() => setcurrentImg(placedata?.mainpic)}
            style={{ height: "300px", margin: "6px" }}
            src={placedata?.mainpic}
          ></img>
          {Images?.map((img, index) => {
            return (
              <div key={index}>
                <DownloadedImg
                  path={"places/" + placedata?.type + "/" + placedata?.name}
                  getImage={(image: string) => setcurrentImg(image)}
                  key={index}
                  img={img}
                ></DownloadedImg>
              </div>
            );
          })}
          {OfflineImages?.map((img, index) => {
            return (
              <div key={index}>
                <IonImg src={`data:image/webp;base64,` + img} />
              </div>
            );
          })}
          {loadingImages && <IonSpinner color="danger" />}
        </div>
      </IonContent>
      {/* <MapModal Place={placedata} moreImages={Images} otherMarkers={[]} placename={placedata?.name} maxCoords={placedata?.maxCoords} closeModal={() => setopenMapModal(false)} img={placedata?.mainpic} isOpen={openMapModal} onDidDismiss={() => { setopenMapModal(false) }} ></MapModal> */}

      <IonModal
        isOpen={showModal}
        onDidDismiss={() => {
          setshowModal(false);
        }}
      >
        <Map
          location={{ placedata }}
          isModal={true}
          closeModal={closeModal}
        ></Map>
      </IonModal>

      <ViewPicture
        description={placedata?.about}
        isOpen={currentImg != ``}
        OndidDismiss={() => {
          setcurrentImg(``);
        }}
        imageRef={currentImg}
      ></ViewPicture>
    </IonModal>
  );
};
export default TourInfo;

export const DownloadedImg: React.FC<{
  img: string;
  getImage: Function;
  path: string;
}> = ({ img, path, getImage }) => {
  const [image, setimage] = useState("");

  useEffect(() => {
    updateImage();
  }, [img]);

  async function updateImage() {
    let imageurl = (await getStorage(path + "/" + img)).value;
    if (imageurl) {
      setimage(imageurl);
    } else {
      firebase
        .storage()
        .ref()
        .child(path + "/" + img)
        .getDownloadURL()
        .then((url) => {
          setimage(url);
          console.log(`fetching`);
          Plugins.Storage.set({ key: path + "/" + img, value: url });
        });
    }
  }
  return (
    <>
      <div style={{ height: "300px", textAlign: "center", padding: "6px" }}>
        {image == "" ? (
          <IonSpinner color="primary" />
        ) : (
          <div
            onClick={() => {
              getImage(image);
            }}
          >
            <IonFindieImg
              src={image == `` ? Assets.loading : image}
              style={{}}
              className={``}
            ></IonFindieImg>
          </div>
        )}
      </div>
    </>
  );
};

// function updateImage(){
//     Plugins.Filesystem.readFile({
//         directory:FilesystemDirectory.Cache,
//         path:path+`/${img}`
//        }).then((res)=>{
//             setimage(`data:image/webp;base64,${res.data}`)
//        }).catch(err=>{
//            console.log(err)
//            firebase.storage().ref().child(path+"/"+img).getDownloadURL()
//            .then(url=>{
//                setimage(url)
//                fetch(url,{mode:`no-cors`}).then(async (res)=>{
//                       console.log(await res.text())
//                })
//            })
//        })
// }
