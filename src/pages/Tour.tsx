import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  IonList,
  IonSlides,
  IonSlide,
  IonIcon,
  IonText,
  IonCard,
  IonButton,
  IonTitle,
  IonVirtualScroll,
  IonRippleEffect,
  useIonViewDidLeave,
  IonContent,
  IonPage,
  useIonViewDidEnter,
  useIonViewWillEnter,
  IonHeader,
  IonToolbar,
  IonMenuButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonImg,
  IonModal,
} from "@ionic/react";
import {
  book,
  fastFood,
  cafeSharp,
  basketball,
  home,
  search,
  mapOutline,
  restaurant,
  map,
  list,
} from "ionicons/icons";
import {
  Classes,
  offices,
  sports,
  Docs,
  Restaurants,
  Others,
  All,
} from "../media/images/images";
import { HapticVibrate } from "../components/MapModal";
import { Plugins } from "@capacitor/core";
import TourInfo from "./TourInfo";
import TourSearchModal from "../components/TourSearchModal";
import "./Tour.css";
import { IonFindieImg } from "../components/FindieImg";
import Map from "../components/Map";

const Tour: React.FC = () => {
  const [category, setcategory] = useState(Restaurants);
  const [currentCategory, setcurrentCategory] = useState(Restaurants);
  const [hint, sethint] = useState(true);
  const [openSearch, setopenSearch] = useState(false);
  const [loadspinner, setloadspinner] = useState(false);
  const [ShowMap, setShowMap] = useState(false);
  const [ToggleDisplay, setToggleDisplay] = useState(true);
  const history = useHistory();

  function closeSearch() {
    setopenSearch(false);
  }
  useIonViewDidLeave(() => {
    sethint(false);
  });
  var t: any, k: any;

  const searchValue = (event: any) => {
    const value = event.target.value.toLowerCase().replace(" ", "");
    setcategory(
      currentCategory.filter((item) => {
        return transformForSearch(item.describtion).match(
          transformForSearch(value)
        );
      })
    );
  };
  function getcat() {
    if (currentCategory == Classes) {
      return `classes`;
    }
    if (currentCategory == All) {
      return `all`;
    } else if (currentCategory === offices) {
      return `offices`;
    } else if (currentCategory === Docs) {
      return `docs`;
    } else if (currentCategory === Restaurants) {
      return `restaurants`;
    } else if (currentCategory === sports) {
      return `sports`;
    } else if (currentCategory === Others) {
      return `others`;
    }
    return "";
  }
  useIonViewDidEnter(() => {
    if (document.body.classList.contains(`dark`)) {
      Plugins.StatusBar.setBackgroundColor({ color: `#152b4d` }).catch(
        console.log
      );
    } else {
      Plugins.StatusBar.setBackgroundColor({ color: `#0d2c6d` }).catch(
        console.log
      );
    }
  });
  useIonViewWillEnter(() => {
    Plugins.StatusBar.setOverlaysWebView({
      overlay: false,
    }).catch(() => {});
  });
  function closeModal() {
    setShowMap(false);
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={"tour-toolbar"} color="primary">
          <IonMenuButton slot="start"></IonMenuButton>
          <IonTitle>Tour</IonTitle>
          {ToggleDisplay ? (
            <IonButton
              slot="end"
              fill="clear"
              color="light"
              size="small"
              onClick={() => {
                setToggleDisplay(false);
              }}
            >
              <IonIcon color={`light`} size='large' icon={list} />
            </IonButton>
          ) : (
            <>
              <IonButton
                slot="end"
                fill="clear"
                color="light"
                size="small"
                onClick={() => {
                  setToggleDisplay(true);
                }}
              >
                <IonIcon color={`light`} icon={map} />
              </IonButton>

              <IonButton
                slot={`end`}
                fill={`clear`}
                color={`light`}
                size={`small`}
                onClick={() => {
                  setopenSearch(true);
                  HapticVibrate();
                }}
              >
                <IonIcon color={`light`} icon={search} />
              </IonButton>
            </>
          )}
        </IonToolbar>
      </IonHeader>

      {ToggleDisplay ? (
        <Map location={{}} isModal={false} closeModal={undefined}></Map>
      ) : (
        <>
          <IonContent>
            <TourHeader
              getCategory={(cat: any) => {
                setcategory(cat);
                setcurrentCategory(cat);
              }}
            ></TourHeader>
            <>
              <IonVirtualScroll
                style={{ overflowY: "scroll", marginBottom: "300px" }}
                items={All}
              >
                <ListBody category={getcat()} place={category}></ListBody>
                <div style={{ height: `100px` }}></div>
              </IonVirtualScroll>
            </>
            <TourSearchModal
              onDidDismiss={() => closeSearch()}
              isOpen={openSearch}
            ></TourSearchModal>
          </IonContent>
        </>
      )}
    </IonPage>
  );
};
export default Tour;

const TourHeader: React.FC<{ getCategory: Function }> = (props) => {
  const selectColor = "danger";
  const init = {
    all: `medium`,
    class: "medium",
    rest: "medium",
    office: "medium",
    sport: "medium",
    doc: "medium",
    others: `medium`,
  };
  const [chipColor, setchipColor] = useState({ ...init, rest: selectColor });
  const tourslides = useRef<HTMLIonSlidesElement>(null);
  const getPlace = (value: number) => {
    if (value === 1) {
      setchipColor({ ...init, all: selectColor });
      props.getCategory(All);
    }
    if (value === 2) {
      setchipColor({ ...init, rest: selectColor });
      props.getCategory(Restaurants);
    } else if (value === 3) {
      setchipColor({ ...init, class: selectColor });
      props.getCategory(Classes);
    } else if (value === 4) {
      setchipColor({ ...init, office: selectColor });
      props.getCategory(offices);
    } else if (value === 5) {
      setchipColor({ ...init, sport: selectColor });
      props.getCategory(sports);
    } else if (value === 6) {
      setchipColor({ ...init, doc: selectColor });
      props.getCategory(Docs);
    } else if (value === 7) {
      setchipColor({ ...init, others: selectColor });
      props.getCategory(Others);
    }
    tourslides.current?.slideTo(value - 1);
  };

  return (
    <IonToolbar className={`header-bar`}>
      <IonSlides
        className="tour-slides"
        ref={tourslides}
        options={{
          initialSlide: 1,
          speed: 200,
          spaceBetween: 10,
          centeredSlides: true,
          loop: false,
          slidesPerView: 2,
        }}
      >
        <IonSlide>
          <IonButton
            fill="solid"
            onClick={() => getPlace(1)}
            color={chipColor.all}
          >
            <IonIcon slot="start" icon={mapOutline} />
            <IonText>All Places</IonText>
          </IonButton>
        </IonSlide>
        <IonSlide>
          <IonButton
            fill="solid"
            onClick={() => getPlace(2)}
            color={chipColor.rest}
          >
            <IonIcon slot="start" icon={fastFood} />
            <IonText>Restaurants</IonText>
          </IonButton>
        </IonSlide>
        <IonSlide>
          <IonButton
            fill="solid"
            onClick={() => getPlace(3)}
            color={chipColor.class}
          >
            <IonIcon slot="start" icon={book}></IonIcon>
            <IonText>Classrooms</IonText>
          </IonButton>
        </IonSlide>
        <IonSlide>
          <IonButton
            fill="solid"
            onClick={() => getPlace(4)}
            color={chipColor.office}
          >
            <IonIcon slot="start" icon={cafeSharp} />
            <IonText>Offices</IonText>
          </IonButton>
        </IonSlide>
        <IonSlide>
          <IonButton
            fill="solid"
            onClick={() => getPlace(5)}
            color={chipColor.sport}
          >
            <IonIcon slot="start" icon={basketball} />
            <IonText>sports</IonText>
          </IonButton>
        </IonSlide>
        <IonSlide>
          <IonButton
            fill="solid"
            onClick={() => getPlace(6)}
            color={chipColor.doc}
          >
            <IonIcon slot="start" icon={book} />
            <IonText>Documentations</IonText>
          </IonButton>
        </IonSlide>
        <IonSlide>
          <IonButton
            fill="solid"
            onClick={() => getPlace(7)}
            color={chipColor.others}
          >
            <IonIcon slot="start" icon={home} />
            <IonText>Others</IonText>
          </IonButton>
        </IonSlide>
      </IonSlides>
    </IonToolbar>
  );
};

const ListBody: React.FC<{ place: any[]; category: string }> = (props) => {
  return (
    <div className="ion-padding-top ">
      <IonList>
        {props.place.map((item, index) => {
          return (
            <PlaceCard index={index} props={props} key={index} item={item} />
          );
        })}
      </IonList>

      {props.place.length <= 0 && (
        <p>result not found... please check another category 😢</p>
      )}
    </div>
  );
};

const DestinationImg: React.FC<{ item: any }> = ({ item }) => {
  const [loaded, setloaded] = useState(false);
  return (
    <IonFindieImg
      className={``}
      style={{ transition: `0.6s` }}
      src={item.mainpic}
    />
  );
};

export function transformForSearch(text: string) {
  text = text.toLowerCase().trim();
  while (text.match(" ")) {
    text = text.replace(" ", "");
  }
  return text;
}

const PlaceCard: React.FC<{ item: any; props: any; index: number }> = ({
  item,
  props,
  index,
}) => {
  const [tourData, settourData] = useState<any>();
  const openInfo = (obj: any) => {
    settourData(obj);
  };

  return (
    <>
      <IonCard
        onClick={() =>
          openInfo({ ...props.place[index], category: props.category })
        }
        className="tour-card ion-activatable ripple-parent"
      >
        <DestinationImg item={item} />
        <IonRippleEffect></IonRippleEffect>
        <IonButton
          style={{ marginTop: "-38px" }}
          className="cardButton"
          expand="block"
        >
          {item.name}
        </IonButton>
      </IonCard>
      {tourData && (
        <TourInfo
          placedata={tourData}
          isOpen={tourData != undefined}
          onDidDismiss={() => {
            settourData(undefined);
          }}
        />
      )}
    </>
  );
};
