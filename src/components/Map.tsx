import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonItem,
  IonPage,
  IonPopover,
  IonRange,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";  
import { 
  removeCircleOutline, 
  exit,
  help, 
  layers, 
  locateOutline, 
  logoBuffer, 
  options,
  pin,
  pinOutline, 
} from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { buildings } from "./buildings";
import React from "react";
import { All } from "../media/images/images";
import ReactDOMServer from 'react-dom/server';
import { messaging } from "firebase";

const Map: React.FC<{location:{},isModal:boolean, closeModal:any}> = (props) => {
  const mapFrame = useRef<HTMLIFrameElement>(null);
  // const searchWidget = useRef<HTMLIonFabButtonElement>(null);
  // const [maptheme, setMaptheme] = useState(false);
  const [threeDMap, setThreeDMap] = useState(true);
  const [searchControl, setSearchControl] = useState(true);
  // const [fromModal, setfromModal] = useState(false);
  const [popover, setpopover] = useState({
    setpopover: false,
    event: undefined,
  });
  const [popoverRange, setpopoverRange] = useState({
    setpopover: false,
    event: undefined,
  });
  const [value, setValue] = useState(15);
  const [ShowPoints, setShowPoints] = useState(false);
  const fab = useRef<HTMLIonFabButtonElement>(null);

  //if map is called via modal, disable show all point button
  if(props.isModal){
    fab.current?.setAttribute("disabled","true")
  }          

  //set buildings data file to local storage to be extracted and used in the iframes
  localStorage.setItem("buildings", JSON.stringify(buildings));
  localStorage.setItem('all', JSON.stringify(All));


/**
 * How it Works
 * Sending data to the iframe from the parent window. 
 */ 

  let mapdata = `<div id="iframeMapHolder">

          <script src="https://api.mapbox.com/mapbox-gl-js/v2.4.1/mapbox-gl.js"></script>
          <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.0/mapbox-gl-directions.js"></script>
          <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js"></script>
          
          <link href="https://api.mapbox.com/mapbox-gl-js/v2.4.1/mapbox-gl.css" rel="stylesheet">
        <!-- <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.0/mapbox-gl-directions.css" type="text/css">  -->
        <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.2/mapbox-gl-geocoder.css" type="text/css">
        
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
          <style> 

          body {
            margin: 0;
            padding: 0;
        }

        #map {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
        }

        #marker { 
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
        }

        .mapboxgl-popup {
            max-width: 200px;
        }
        </style>
          <button id="getMe" style="display: none;" onClick="drawMyPath()">locate person</button>
          <button id="rgetMe" style="display: none;" onClick="rdrawMyPath()">locate person</button>
          <button id="darkMap" style="display: none;" onClick="changeStyle('dark-v10')">enable dark</button> 
          <button id="lightMap" style="display: none;" onClick="changeStyle('light-v10')">enanle light</button> 
          <button id="outdoorMap" style="display: none;" onClick="changeStyle('outdoors-v11')">enable outdoor</button> 
          <button id="3dbuttonSet" style="display: none;" onClick="set3D()">set 3d</button> 
          <button id="3dbuttonRemove" style="display: none;" onClick="remove3D()">remove 3d</button> 
          <button id="removeWayPointButton" style="display: none;" onClick="removeMapRoutes()">remove 3d</button> 
          <button id="changePitchButton" style="display: none;" onClick="removeMapRoutes()">remove 3d</button> 
          <button id="showMapPointsButton" style="display: none;" onClick="showMapPoints()">Show poitns</button> 
          <button id="hideMapPointsButton" style="display: none;" onClick="hideMapPoints()">Hide poitns</button> 
          <button id="instanceLocationButton" style="display: none;" onClick="instanceLocation()">Hide poitns</button> 
          <div id="map"></div>
        
          <script>   
              mapboxgl.accessToken = 'pk.eyJ1IjoibmRlaC1uZ3dhIiwiYSI6ImNramh5OGJzdTRhZzIyc25xbnNldXozdWUifQ.j9cFW3pofGHmkpiVKwp8ww';
              const map = new mapboxgl.Map({
                  container: 'map',
                  style: 'mapbox://styles/mapbox/outdoors-v11',
                  center: [9.2879, 4.1489],
                  zoom: 16,
                  pitch: 50,
                  bearing: 200,
                  antialias: true,
              });

              function removeMapRoutes(){
                createMyPath.removeRoutes();
              }

              function reverseCoordinates(value){
                let temp = [];
                let a = value[0];
                let b = value[1];
                return temp = [b,a];
              }
              
              let allBuildings = JSON.parse(localStorage.getItem("all")); 

            var spotMe = new mapboxgl.GeolocateControl({
                  positionOptions: {
                      enableHighAccuracy: true
                  }, 
                  // trackUserLocation: true, 
                  // showUserHeading: true,
                  // showUserLocation:true
              }); 


              function pitch(value){
                map.options.pitch = value; 
              }

              function forwardGeocoder(query) {
                let tempBuildings = JSON.parse(localStorage.getItem('buildings'));  
                let matchingFeatures = [];
                for (let feature of tempBuildings.features) {   
                  if (feature.properties.name.toLowerCase().includes(query.toLowerCase())){ 
                    feature["place_name"] =  feature.properties.name;
                    feature["center"] = feature.geometry.coordinates[0][0];
                    matchingFeatures.push(feature);
                  } 
                };
                return matchingFeatures;
              };

              var geoCoder = 
                new MapboxGeocoder({
                  accessToken: mapboxgl.accessToken,
                  localGeocoder: forwardGeocoder,
                  zoom: 17.2,
                  placeholder: 'Search location',
                  mapboxgl: mapboxgl,
                  proximity:[9.2879,4.1489],
                  bbox:[9.28105571875642,4.142657073694693,9.29656682063461,4.153580877961076],
                  reverseGeocode: true, 
                })
        
            // What is used to create the path. The control center is disabled so we can use the default geocoder. 
            var createMyPath =
                    new MapboxDirections({
                        accessToken: mapboxgl.accessToken,
                        mapboxgl: mapboxgl,
                        profile:"mapbox/walking",
                        alternatives: true,
                        controls:{
                          inputs:false,
                          instructions:false,
                          routePadding:20, 
                        }
                    });
          
                    //Rotate camera function, not implemented
                    
              function rotateCamera(timestamp) {
                  // clamp the rotation between 0 -360 degrees
                  // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
                  map.rotateTo((timestamp / 100) % 360, {
                      duration: 0
                  });
                  // Request the next frame of the animation.
                  requestAnimationFrame(rotateCamera);
              }

              map.addControl(spotMe,"bottom-right");
              map.on('load', () => { 
                  spotMe.trigger();
                  map.addControl(createMyPath, "bottom-right");
                  map.addControl(geoCoder, "top-left")
              }); 

              function drawMyPath() { 
                createMyPath.options.controls.inputs = true
                console.log('added Path setter');
              }

              function rdrawMyPath() {  
                console.log('removed path setter called');
              }

              let mapStyle = {
                  outdoor: "outdoors-v11",
                  satellite: "satellite-v9",
                  light: "light-v10",
                  dark: "dark-v10",
                  street: "streets-v11",
              };
        
            function changeStyle(value){ 
              map.setStyle("mapbox://styles/mapbox/" + value);
              console.log(value);
            }
        

            function remove3D(){
              // If a layer with ID 'state-data' exists, remove it. 
              if (map.getLayer('add-3d-buildings')){
                map.removeLayer('add-3d-buildings');
                console.log("removed layer");
              }
            }

            function set3D(){ 
              layers = map.getStyle().layers;
              map.addLayer({
                        'id': 'add-3d-buildings',
                        'source': 'composite',
                        'source-layer': 'building',
                        'filter': ['==', 'extrude', 'true'],
                        'type': 'fill-extrusion',
                        'minzoom': 15,
                        'paint': {
                            'fill-extrusion-color': '#aaa',

                            // Use an 'interpolate' expression to
                            // add a smooth transition effect to
                            // the buildings as the user zooms in.
                            'fill-extrusion-height': [
                                'interpolate', ['linear'],
                                ['zoom'],
                                15,
                                0,
                                15.05, ['get', 'height']
                            ],
                            'fill-extrusion-base': [
                                'interpolate', ['linear'],
                                ['zoom'],
                                15,
                                0,
                                15.05, ['get', 'min_height']
                            ],
                            'fill-extrusion-opacity': 0.6
                        }
                    },
                    layers.find(
                      (layer) => layer.type === 'symbol' && layer.layout['text-field']
                  ).id 
                ); 
                console.log("added 3d layer");
            } 
             
            function createHTML(name, text, image){
              let string = "<div class='card' style='width: 100%;'><img src=" + image + " class='card-img-top'/><div class='card-body'>  <h5 class='card-title'> " + name + " </h5><p class='card-text'> " + text + " </p></div></div>"
              return string;
            }

            var markerArray = [];
           function showMapPoints(){ 
              allBuildings.forEach((building) => { 
                // create the popup
                const popup = new mapboxgl.Popup({ offset: 25, closeButton:false }).setHTML(createHTML(building.name,building.about, building.mainpic)) 
                
                // create DOM element for the marker
                const el = document.createElement('img');
                el.id = 'marker';
                el.src = building.mainpic;
                
                // create the marker 
               const marker = new mapboxgl.Marker(el)
                .setLngLat(reverseCoordinates(building.coords))
                .setPopup(popup) // sets a popup on this marker
                .addTo(map);

                markerArray.push(marker); 
              }); 

            }

            function hideMapPoints(){
              markerArray.forEach(marker => {
                marker.remove();
              });
            };
 
            function instanceLocation(){ 
                let item = JSON.parse(localStorage.getItem("itemLocation"));  
                // create the popup
                const popup = new mapboxgl.Popup({ offset: 25, closeButton:false }).setHTML(createHTML(item.placedata.name, item.placedata.about, item.placedata.mainpic)) 
                
                // create DOM element for the marker
                const el = document.createElement('img');
                el.id = 'marker';
                el.src = item.placedata.mainpic;
                
                // create the marker 
               const marker = new mapboxgl.Marker(el)
                .setLngLat(reverseCoordinates(item.placedata.coords))
                .setPopup(popup)  
                .addTo(map); 
                markerArray.push(marker);  
            }
          </script> 
        </div>  `;
  
  function drawPath() {
    let f = mapFrame.current?.contentWindow;
    f?.postMessage(searchControl, "*");
    f?.addEventListener("message", (e) => {
      if (e.data) {
        f?.document.getElementById("getMe")?.click();
      }
      if (!e.data) {
        f?.document.getElementById("rgetMe")?.click();
      }
    });
  }
  let mapStyle = {
    outdoor: "outdoors-v11",
    satellite: "satellite-v9",
    light: "light-v10",
    dark: "dark-v10",
    street: "streets-v11",
  };

  function changePitch(value: any) {
    let f = mapFrame.current?.contentWindow;
    f?.postMessage(value, "*");
    f?.addEventListener("message", (message) => {
      f?.mapPitch.call(message.data);
    });

    console.log("from parent: " + value);
  }

  function set3dMap(state: boolean) {
    let f = mapFrame.current?.contentWindow;
    f?.postMessage(state, "*");
    f?.addEventListener("message", (message) => {
      if (message.data) {
        //add 3d layer
        f?.document.getElementById("3dbuttonSet")?.click();
      }
      if (!message.data) {
        //remove layer
        f?.document.getElementById("3dbuttonRemove")?.click();
      }
    });
  }

  function showPoints(){
    let f = mapFrame.current?.contentWindow;
    f?.postMessage(ShowPoints, "*");
    f?.addEventListener("message",(message)=>{
      if (!message.data){
        f?.document.getElementById("showMapPointsButton")?.click();
      }else{
        f?.document.getElementById("hideMapPointsButton")?.click();
      }
    })
  }

  function removeMapRoute() {
    let f = mapFrame.current?.contentWindow;
    f?.postMessage(true, "*");
    f?.addEventListener("message", (e) => {
      if (e.data) {
        f?.document.getElementById("removeWayPointButton")?.click();
      }
    });
  }
// change map style/type: dark mode etc
  function changeMapStyle(value: string) {
    let f = mapFrame.current?.contentWindow;
    f?.postMessage(value, "*");
    f?.addEventListener("message", (e) => {
      let s = e.data;
      switch (s) {
        case "dark-v10":
          f?.document.getElementById("darkMap")?.click();
          break;
        case "light-v10":
          f?.document.getElementById("lightMap")?.click();
          break;
        case "outdoors-v11":
          f?.document.getElementById("outdoorMap")?.click();
          break;
        default:
          console.log("error");
      }
    });
  }

  if(props.isModal){
    localStorage.setItem('itemLocation',JSON.stringify(props.location));
    let f = mapFrame.current?.contentWindow;
    f?.postMessage(props.isModal, "*");
    f?.addEventListener("message",(message)=>{ 
      f?.document.getElementById("instanceLocationButton")?.click(); 
    })
  } 
  return (
    <> 
        <iframe
          ref={mapFrame}
          title="Map"
          srcDoc={mapdata}
          width="100%"
          height="100%"
          frameBorder="0"
          id="mapframe"
        ></iframe>
        <IonFab vertical="bottom" horizontal="start">
          <IonFabButton>
            <IonIcon icon={options} />
          </IonFabButton>
          <IonFabList side="top">
            {/* {searchControl ? (
              <IonFabButton
                ref={searchWidget}
                onClick={(event) => {
                  drawPath();
                  setSearchControl(false)
                }}
                color="secondary"
              >
                <IonIcon icon={search} />
              </IonFabButton>
               
            ) : ( 
              <IonFabButton
                ref={searchWidget}
                onClick={(event) => {
                  drawPath();
                  setSearchControl(true)
                }}
                color="dark"
              >
                <IonIcon icon={search} />
              </IonFabButton>
            )} */}
            {/* {maptheme ? (
              <IonFabButton
                color="dark"
                onClick={() => {
                  changeMapStyle(mapStyle.outdoor);
                  setMaptheme(false);
                }}
              >
                <IonIcon color="light" icon={invertMode} />
              </IonFabButton>
            ) : (
              <IonFabButton
                color="light"
                onClick={() => {
                  changeMapStyle(mapStyle.dark);
                  setMaptheme(true);
                }}
              >
                <IonIcon icon={invertMode} color="dark" />
              </IonFabButton>
            )} */}
            {threeDMap ? (
              <IonFabButton
                color="tertiary"
                onClick={() => {
                  set3dMap(true);
                  setThreeDMap(false);
                }}
              >
                <IonIcon icon={logoBuffer} />
              </IonFabButton>
            ) : (
              <IonFabButton
                onClick={() => {
                  set3dMap(false);
                  setThreeDMap(true);
                }}
              >
                <IonIcon icon={logoBuffer} />
              </IonFabButton>
            )}
 
            {ShowPoints?(<IonFabButton
            ref={fab}
              color="tetiary"
              onClick={(e: any) => {
                showPoints();
                setShowPoints(false)
              }}
            >
              <IonIcon icon={pin} />
            </IonFabButton>):(<IonFabButton
            ref={fab}
              color="tetiary"
              onClick={(e: any) => {
                showPoints();
                setShowPoints(true)
              }}
            >
              <IonIcon icon={pinOutline} />
            </IonFabButton>)}
 
            <IonFabButton
              color="danger"
              onClick={(e: any) => {
                removeMapRoute();
              }}
            >
              <IonIcon icon={removeCircleOutline} />
            </IonFabButton>
            <IonFabButton
              color="warning"
              onClick={(e: any) => {
                e.persist();
                setpopover({ setpopover: true, event: e });
              }}
            >
              <IonIcon icon={help} />
            </IonFabButton>
            {props.isModal?
            <IonFabButton
              color="dark"
              onClick={()=>{
                props.closeModal()
              }} 
            >
              <IonIcon icon={exit} />
            </IonFabButton>:""}
          </IonFabList>
        </IonFab> 

        <IonPopover
          event={popoverRange.event}
          isOpen={popoverRange.setpopover}
          onDidDismiss={() =>
            setpopoverRange({ setpopover: false, event: undefined })
          }
        >
          <IonContent>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Adjust Pitch</IonCardTitle>
              </IonCardHeader>
              <IonItem>
                <IonRange min={-200} max={200}>
                  <IonRange
                    pin={true}
                    value={value}
                    onIonChange={(e) => {
                      setValue(e.detail.value as number);
                      changePitch(e.detail.value as number); 
                    }}
                  />
                </IonRange>
              </IonItem>
            </IonCard>
          </IonContent>
        </IonPopover>
        {/* Map tutorial popover */}
        <IonPopover
          event={popover.event}
          isOpen={popover.setpopover}
          onDidDismiss={() =>
            setpopover({ setpopover: false, event: undefined })
          }
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Map Tutorial</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent>
            {props.isModal?(
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Close Map</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText> 
                      Click{" "}
                      <IonChip>
                        exit <IonIcon icon={exit}></IonIcon>
                      </IonChip>{" "}
                      to close map
                </IonText>
              </IonCardContent>
            </IonCard>):" "}
            
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Show All</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText> 
                      Click{" "}
                      <IonChip>
                        pin <IonIcon icon={pin}></IonIcon>
                      </IonChip>{" "}
                      to toggle on and off all map locations. This option is disable for local searches
                </IonText>
              </IonCardContent>
            </IonCard>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Create Path</IonCardTitle>
              </IonCardHeader>
              <IonCardContent> 
                <IonText> - Click on one place to set the source. 
                   <br /> - Click on another place to set the destination. 
                   <br />
                      - Click{" "}
                      <IonChip>
                        close<IonIcon icon={removeCircleOutline}></IonIcon>
                      </IonChip>{" "}
                      to remove paths 
                </IonText>
              </IonCardContent>
            </IonCard>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>GPS Tracking</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText>
                  Click{" "}
                  <IonChip>
                    close<IonIcon icon={locateOutline}></IonIcon>
                  </IonChip>{" "}
                  at the bottom-right of the map to toggle on and off GPS
                  tracking.
                </IonText>
              </IonCardContent>
            </IonCard>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>3D Buildings</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText>
                  Click{" "}
                  <IonChip>
                    stack<IonIcon icon={layers}></IonIcon>
                  </IonChip>{" "}
                  in the floating below to toggle on and off 3D buildings
                </IonText>
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonPopover> 
    </>
  );
};

declare global {
  interface Window {
    mapPitch: any;
  }
}

export default Map;
