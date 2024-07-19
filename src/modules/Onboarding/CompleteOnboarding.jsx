import React, { useEffect, useRef } from "react";
import "./Subscription/styles/PaymentSuccess.scss";
import { Link } from "react-router-dom";
import RegularButton from "../Sandbox/Buttons/RegularButton";
import { useNavigate, useLocation } from "react-router-dom";
import { setOnboardingLevel } from "../../redux/slice/onboardingSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/selectors/auth";
import { useGetUserQuery } from "../../redux/services/user";
import { updateUser } from "../../redux/slice/authSlice";
import { suspenseHide, suspenseShow } from "../../redux/slice/suspenseSlice";

const OnboardingComplete = () => {
  const tick_icon_ref = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const { data: userData, refetch } = useGetUserQuery(user._id, {
    skip: user?._id ? false : true,
  });

  const submit = async () => {
    try {
      dispatch(suspenseShow());
      const UpdatedUser = await refetch();

      console.log(UpdatedUser);
      dispatch(updateUser(UpdatedUser.data));
      dispatch(setOnboardingLevel(null));
      navigate("/client/dashboard");
    } catch (error) {
    } finally {
      dispatch(suspenseHide());
    }
  };
  useEffect(() => {
    // console.log(tick_icon_ref)
    const tick_icon = tick_icon_ref?.current;
    // console.log("tick_icon: ", tick_icon)
    // console.log("tick_icon.classList.contains('hide'): ", tick_icon.classList.contains("hide"))
    // tick_icon.classList.remove("hide")
    // tick_icon ? (tick_icon.classList.contains("hide") ? tick_icon.classList.remove("hide") :
    //     null) : null;

    if (tick_icon) {
      if (tick_icon.classList.contains("hide")) {
        tick_icon.classList.remove("hide");
      }
    }

    return () => {};
  }, []);

  return (
    <div className=" py-24">
      {/* payment-success-app works! */}
      <h1 className="font-bold text-center text-2xl text-dark-450">
        Onboarding Complete
      </h1>
      <p className="text-sm text-center mx-auto max-w-[400px] text-dark-400 ">
        Congratulations!!!
        <br />
        You have successfully completed your onboarding process
      </p>

      <div className="mx-auto max-w-[500px] my-16">
        <div className="min-h-96 flex place-content-center flex-col">
          <div
            ref={tick_icon_ref}
            className="tick-icon | hide relative inline-flex mx-auto mb-12"
          >
            {/* <!-- tick circle --> */}
            <div>
              <svg
                width="109"
                height="109"
                viewBox="0 0 109 109"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M54.5 109C84.5548 109 109 84.5548 109 54.5C109 24.4452 84.5548 0 54.5 0C24.4452 0 0 24.4452 0 54.5C0 84.5548 24.4452 109 54.5 109ZM54.5 2.65854C83.0793 2.65854 106.341 25.9207 106.341 54.5C106.341 83.0793 83.0793 106.341 54.5 106.341C25.9207 106.341 2.65854 83.0793 2.65854 54.5C2.65854 25.9207 25.9207 2.65854 54.5 2.65854Z"
                  fill="#45C3EB"
                />
              </svg>
            </div>

            {/* <!-- tick --> */}
            <div className="tick-animate-wrap | absolute top-8 start-6">
              <svg
                className="tick-animate mx-auto"
                width="61"
                height="37"
                viewBox="0 0 61 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M60.6906 2.98998L59.0975 0.855469L17.2545 33.1551L2.41596 12.8705L0.309326 14.4815L16.741 36.9274L60.6906 2.98998Z"
                  fill="#45C3EB"
                />
              </svg>
            </div>
          </div>

          <p className="text-lg font-bold text-center">Well Done!</p>
          <div className="my-4"></div>
          <RegularButton
            text={"Proceed to Dashboard"}
            onClick={() => {
              submit();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingComplete;
