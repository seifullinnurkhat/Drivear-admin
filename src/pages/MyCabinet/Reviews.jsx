import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DefaultPage from "../components/DefaultPage";
import { ReactComponent as ProfileIcon } from "../../assets/icons/profile.svg";
import { ReactComponent as ReviewsIcon } from "../../assets/icons/star.svg";
import { ReactComponent as RatingStar } from "../../assets/icons/rating_star.svg";
import { ReactComponent as RatingStarBorder } from "../../assets/icons/star_border.svg";
import { TextField } from "@material-ui/core";
import ReviewsTable from "./components/ReviewsTable";
import fire from "../../fire";
import { connect } from "react-redux";
import { SET_USER } from "../../redux/types";

function Reviews() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const ref = fire.firestore().collection("comments").doc(userId);
    const docSnapshot = ref.get().then((value) => {
      setComments(value.data()?.list ?? []);
      console.log(value.data()?.list ?? []);
    });
  }, []);

  return (
    <DefaultPage>
      <div className="cabinet__profile" style={{ display: "flex" }}>
        <div className="tabs">
          <Link to="/cabinet/profile" style={{ textDecoration: "none" }}>
            <div className="tab-item">
              <ProfileIcon />
              <p>Profile</p>
            </div>
          </Link>
          <Link to="/cabinet/reviews" style={{ textDecoration: "none" }}>
            <div className="tab-item active">
              <ReviewsIcon />
              <p>RATING AND REVIEWS</p>
            </div>
          </Link>
        </div>
        <div className="content">
          <div className="title">RATING AND REVIEWS</div>
          <div className="rating">
            <div className="value">
              <p>
                <span>
                  {comments.length > 0
                    ? (
                        comments.reduce((prev, curr) => prev + curr.rating, 0) /
                        comments.length
                      ).toFixed(1)
                    : 0}
                </span>{" "}
                out of 5
              </p>
              <p>Total votes: {comments.length}</p>
            </div>
            <div className="values">
              <div className="type">
                <RatingStar />
                <RatingStar />
                <RatingStar />
                <RatingStar />
                <RatingStar />
                <div className="line">
                  <div className="line_80"></div>
                </div>
              </div>
              <div className="type">
                <RatingStar />
                <RatingStar />
                <RatingStar />
                <RatingStar />
                <RatingStarBorder />
                <div className="line">
                  <div className="line_80"></div>
                </div>
              </div>
              <div className="type">
                <RatingStar />
                <RatingStar />
                <RatingStar />
                <RatingStarBorder />
                <RatingStarBorder />
                <div className="line">
                  <div className="line_60"></div>
                </div>
              </div>
              <div className="type">
                <RatingStar />
                <RatingStar />
                <RatingStarBorder />
                <RatingStarBorder />
                <RatingStarBorder />
                <div className="line">
                  <div className="line_40"></div>
                </div>
              </div>
              <div className="type">
                <RatingStar />
                <RatingStarBorder />
                <RatingStarBorder />
                <RatingStarBorder />
                <RatingStarBorder />
                <div className="line">
                  <div className="line_20"></div>
                </div>
              </div>
            </div>
          </div>
          <ReviewsTable rows={comments} />
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Reviews);
