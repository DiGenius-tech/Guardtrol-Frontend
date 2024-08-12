import React, { useEffect, useRef, useState } from "react";
import "./styles/PaymentSuccess.scss";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import { useGetSubscriptionQuery } from "../../../redux/services/subscriptions";
import { useDispatch, useSelector } from "react-redux";
import { selectOrganization, selectUser } from "../../../redux/selectors/auth";
import { useGetUserQuery } from "../../../redux/services/user";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";

const PaymentSuccess = () => {
  const tick_icon_ref = useRef();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const organization = useSelector(selectOrganization);

  const { data: userData, refetch: refetchUserData } = useGetUserQuery(
    user._id,
    {
      skip: user?._id ? false : true,
    }
  );
  const dispatch = useDispatch();
  //   dispatch(suspenseHide());

  const {
    data: sub,
    isError,
    refetch,
  } = useGetSubscriptionQuery(organization, {
    skip: organization ? false : true,
  });

  // console.log(sub);
  // useEffect(() => {
  //   const payed = localStorage.getItem("paymentComplete") || false;

  //   if (!payed) {
  //     navigate("/onboarding/membership");
  //   }
  // });

  const handleNext = async () => {
    try {
      dispatch(suspenseShow());
      await refetchUserData();
      navigate("/onboarding/configure-beats");
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
    <div>
      {/* payment-success-app works! */}
      <h1 className="font-bold text-center text-2xl text-dark-450">
        Membership
      </h1>
      <p className="text-sm text-center mx-auto max-w-[430px] text-dark-400">
        The subscription goes towards getting access to the security software to
        help manage your security personnel
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

          <p className="text-lg font-bold text-center">Thank You!</p>
          <div className="my-4"></div>

          <RegularButton
            text={"Continue to configure Beats"}
            onClick={() => handleNext()}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
