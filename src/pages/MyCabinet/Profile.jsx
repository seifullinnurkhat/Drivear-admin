import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DefaultPage from "../components/DefaultPage";
import { ReactComponent as ProfileIcon } from "../../assets/icons/profile.svg";
import { ReactComponent as ReviewsIcon } from "../../assets/icons/star.svg";
import {
  Button,
  Checkbox,
  CircularProgress,
  createMuiTheme,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
  ThemeProvider,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import fire from "../../fire";
import { Map, Placemark, YMaps } from "react-yandex-maps";
import { storage } from "../../fire";
import { connect } from "react-redux";
import { SET_USER } from "../../redux/types";
import { history } from "../../history";

function Profile({ user }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [carwashName, setCarwashName] = useState("");
  const [phone, setPhone] = useState("");
  const [legalAddress, setLegalAddress] = useState("");
  const [type, setType] = useState("");
  const [bin, setBin] = useState("");
  const [avatarImg, setAvatarImg] = useState(null);
  const [progress, setProgress] = useState(null);
  const avatar = useRef();
  const [coords, setCoords] = useState([43.238352, 76.8958813]);
  const [services, setServices] = useState([
    "Free Wifi",
    "Cashless Payment",
    "Waiting Room",
    "Cafe",
  ]);
  const [selectedServices, setSelectedServices] = useState([]);
  const theme = createMuiTheme({
    palette: {
      primary: green,
    },
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const currentUser = fire.auth().currentUser;
    currentUser == null && history.push("/login");
    if (currentUser || userId) {
      const ref = fire
        .firestore()
        .collection("users")
        .doc(currentUser?.uid || userId);
      console.log(currentUser?.uid, userId);
      console.log(currentUser, userId);
      setLoading(true);
      ref.get().then((value) => {
        console.log(value.data());
        setEmail(value.data()?.email ?? "");
        setPhone(value.data()?.phone ?? "");
        setBin(value.data()?.bin ?? "");
        setType(value.data()?.type ?? "");
      });
      fire
        .firestore()
        .collection("car_wash")
        .doc(currentUser?.uid || userId)
        .get()
        .then((value) => {
          console.log(value.data());
          setCarwashName(value.data()?.name ?? "");
          setCoords(value.data()?.location ?? "");
          setLegalAddress(value.data()?.legalAddress ?? "");
          setSelectedServices(value.data()?.additionalServices ?? []);
          setLoading(false);
        });
      storage
        .ref("images/car_washs")
        .child(`${currentUser?.uid || userId}.png`)
        .getDownloadURL()
        .then((url) => {
          setAvatarImg(url);
        });
    } else {
      history.push("/login");
    }
  }, []);

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      console.log(event.target.files[0]);
      setAvatarImg(event.target.files[0]);
    }
    const userId = localStorage.getItem("userId") ?? user.uid;
    console.log(`images/car_washs/${userId}.png`);
    const uploadTask = storage
      .ref(
        `images/car_washs/${userId}.${event.target.files[0].name.split(".")[1]}`
      )
      .put(event.target.files[0], {
        contentType: "image/png",
      });
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images/car_washs")
          .child(`${userId}.png`)
          .getDownloadURL()
          .then((url) => {
            setAvatarImg(url);
            setProgress(null);
          });
      }
    );
  };

  return (
    <DefaultPage>
      <div className="cabinet__profile" style={{ display: "flex" }}>
        <div className="tabs">
          <Link to="/cabinet/profile" style={{ textDecoration: "none" }}>
            <div className="tab-item active">
              <ProfileIcon />
              <p>Profile</p>
            </div>
          </Link>
          <Link to="/cabinet/reviews" style={{ textDecoration: "none" }}>
            <div className="tab-item">
              <ReviewsIcon />
              <p>RATING AND REVIEWS</p>
            </div>
          </Link>
        </div>
        {loading ? (
          <CircularProgress />
        ) : (
          <div className="content">
            <div className="title">PROFILE</div>
            <div className="profile_img">
              {progress ? <progress value={progress} max="100" /> : null}
              <input
                onChange={handleImageChange}
                accept="image/png"
                type="file"
                id="profile_img"
                ref={avatar}
              />
              <img
                src={
                  avatarImg ??
                  "data:image/png;base64,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"
                }
                alt=""
                onClick={() => {
                  console.log("tets");
                  avatar?.current?.click();
                }}
              />
            </div>
            <div className="form_field">
              <p>Car wash legal name: </p>
              <TextField
                id="outlined-basic"
                variant="outlined"
                value={carwashName}
                onChange={(e) => setCarwashName(e.target.value)}
              />
            </div>
            <div className="form_field">
              <p>Email: </p>
              <TextField
                id="outlined-basic"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form_field">
              <p>Contract number: </p>
              <TextField
                id="outlined-basic"
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form_field">
              <p>A type: </p>
              <TextField
                id="outlined-basic"
                variant="outlined"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div className="form_field">
              <p>Legal address: </p>
              <TextField
                id="outlined-basic"
                variant="outlined"
                value={legalAddress}
                onChange={(e) => setLegalAddress(e.target.value)}
              />
            </div>
            <div className="form_field">
              <p>INN / EDRPOU:: </p>
              <TextField
                id="outlined-basic"
                variant="outlined"
                value={bin}
                onChange={(e) => setBin(e.target.value)}
              />
            </div>
            <div className="maps_services">
              <div className="map" style={{ width: "50%" }}>
                <YMaps>
                  <Map
                    instanceRef={(ref) => {
                      if (ref) {
                        ref.events.add("click", function (e) {
                          console.log(e.get("coords"));
                          setCoords(e.get("coords"));
                        });
                      }
                    }}
                    defaultState={{
                      center: [43.238352, 76.8958813, 17],
                      zoom: 10,
                    }}
                  >
                    <Placemark geometry={coords} />
                  </Map>
                </YMaps>
              </div>
              <div className="services" style={{ width: "50%" }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Additional Services</FormLabel>
                  <FormGroup>
                    {services.map((service) => {
                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedServices.includes(service)}
                              onChange={() => {
                                console.log(service, selectedServices);
                                setSelectedServices([
                                  ...selectedServices,
                                  ...[service],
                                ]);
                              }}
                              name={service}
                            />
                          }
                          label={service}
                        />
                      );
                    })}
                  </FormGroup>
                </FormControl>
              </div>
            </div>
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={() => {
                  const currentUser = fire.auth().currentUser;
                  const userId = localStorage.getItem("userId");
                  const ref = fire
                    .firestore()
                    .collection("users")
                    .doc(currentUser?.uid || userId);
                  const ref1 = fire
                    .firestore()
                    .collection("car_wash")
                    .doc(currentUser?.uid || userId);
                  fire
                    .firestore()
                    .collection("car_wash")
                    .doc(currentUser?.uid || userId)
                    .get()
                    .then((value) => {
                      ref1.set({
                        ...(value.data() ?? {}),
                        name: carwashName,
                        location: coords,
                        legalAddress: legalAddress,
                        additionalServices: selectedServices,
                      });
                    });

                  setLoading(true);
                  ref.get().then((value) => {
                    console.log({
                      ...(value.data() ?? {}),
                      email: email,
                      phone: phone,
                      bin: bin,
                      legalAddress: legalAddress,
                      additionalServices: selectedServices,
                      type: type,
                    });
                    const docSnapshot = ref
                      .set({
                        ...(value.data() ?? {}),
                        email: email,
                        phone: phone,
                        bin: bin,

                        type: type,
                      })
                      .then((response) => {
                        console.log(response);
                        setLoading(false);
                      });
                  });
                }}
              >
                Save
              </Button>
            </ThemeProvider>
          </div>
        )}
      </div>
    </DefaultPage>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.authReducer.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setUser: (payload) => dispatch({ type: SET_USER, payload: payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
