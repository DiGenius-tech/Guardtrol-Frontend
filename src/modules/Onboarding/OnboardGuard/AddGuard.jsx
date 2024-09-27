import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import useHttpRequest from "../../../shared/Hooks/HttpRequestHook";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import HistoryButton from "../../Sandbox/Buttons/HistoryButton";
import { SubscriptionContext } from "../../../shared/Context/SubscriptionContext";
import AlertDialog from "../../../shared/Dialog/AlertDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentSubscription,
  selectSubscriptionState,
} from "../../../redux/selectors/subscription";
import {
  useAddGuardMutation,
  useGetGuardsQuery,
} from "../../../redux/services/guards";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../../redux/selectors/auth";
import { selectOnboardingGuards } from "../../../redux/selectors/onboarding";
import { addOnboardingGuard } from "../../../redux/slice/onboardingSlice";
import { useGetSubscriptionQuery } from "../../../redux/services/subscriptions";
import Swal from "sweetalert2";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { toast } from "react-toastify";

function AddGuard({ onBoarding = true }) {
  const [isGotIt, setIsGotIt] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const token = useSelector(selectToken);

  const params = useParams();
  const { beatId } = params;
  const dispatch = useDispatch();
  const onboardingGuards = useSelector(selectOnboardingGuards);

  const organization = useSelector(selectOrganization);
  const { data: guards, refetch } = useGetGuardsQuery(
    { organization },
    {
      skip: organization ? false : true,
    }
  );

  const navigate = useNavigate();

  const { data: sub } = useGetSubscriptionQuery(organization, {
    skip: organization ? false : true,
  });
  const [addGuard] = useAddGuardMutation();

  const [guard, setGuard] = useState({
    full_name: "",
    phone: "",
  });

  const handle_is_got_it = () => {
    setIsGotIt(true);
  };

  const handleChange = (e) => {
    setGuard({ ...guard, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const saveGuard = async (e) => {
    setisLoading(true);
    try {
      e.preventDefault();
      if (
        guards.find(
          (g) =>
            g.name?.toLocaleLowerCase() === guard.full_name?.toLocaleLowerCase()
        )
      ) {
        setValidationErrors({
          ...validationErrors,
          full_name: "Guard with this name already exists",
        });
        return;
      }

      if (
        guards.find((g) => g.phone === guard.phone) ||
        onboardingGuards.find((g) => g.phone === guard.phone)
      ) {
        setValidationErrors({
          ...validationErrors,
          phone: "Guard with this phone number already exists",
        });
        return;
      }

      if (guard.full_name === "" || guard.full_name.length < 5) {
        setValidationErrors({
          ...validationErrors,
          full_name: "Enter A Valid Guard Name",
        });
        return;
      }

      if (guard.phone === "" || guard.phone.length < 8) {
        setValidationErrors({
          ...validationErrors,
          phone: "Enter A Valid Phone Number",
        });
        return;
      }

      if (onBoarding) {
        if (
          onboardingGuards.find((g) => {
            return (
              g.full_name?.toLocaleLowerCase() ===
              guard.full_name?.toLocaleLowerCase()
            );
          })
        ) {
          setValidationErrors({
            ...validationErrors,
            full_name: "Guard with this name already exists",
          });
          return;
        }
        if (
          onboardingGuards?.length >=
          sub?.maxbeats * 5 + sub?.maxextraguards
        ) {
          Swal.fire({
            title: "OOPS!! You've ran out of Guards",
            text: "Would you like to subscribe for more guards?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#008080",
            confirmButtonText: "Subscribe for more!",
            cancelButtonColor: "#d33",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/client/settings/billing");
            }
          });
          return;
        }
        dispatch(addOnboardingGuard(guard));
        navigate("../");
      } else {
        if (guards?.length >= sub?.maxbeats * 5 + sub?.maxextraguards) {
          Swal.fire({
            title: "OOPS!! You've ran out of Guards",
            text: "Would you like to subscribe for more Guards?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#008080",
            confirmButtonText: "Subscribe for more!",
            cancelButtonColor: "#d33",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/client/settings/billing?action=update");
              // Swal.fire({
              //   title: "Deleted!",
              //   text: "Your file has been deleted.",
              //   icon: "success",
              // });
            }
          });
          return;
        } else {
          dispatch(suspenseShow());
          const { data } = await addGuard({ organization, guard });
          if (data) {
            await refetch();
            navigate(-1);
            dispatch(suspenseHide());
            toast("Guard Added Successfully");
          }
        }
      }
    } catch (error) {
    } finally {
      setisLoading(false);
    }
  };

  return (
    <>
      {/* add-guard-app works! */}

      <div className="max-w-md mx-auto block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <form method="post" onSubmit={saveGuard}>
          {/*  */}

          {/*  */}
          <div className="mb-6">
            <TextInputField
              label="Full Name"
              name="full_name"
              type="text"
              placeholder="Full Name"
              id="full_name"
              error={validationErrors["full_name"]}
              onChange={handleChange}
              required="required"
              value={guard.full_name}
            />
          </div>
          <div className="mb-6">
            <TextInputField
              label="Phone Number"
              name="phone"
              type="number"
              placeholder="Phone Number"
              id="phone"
              error={validationErrors["phone"]}
              onChange={handleChange}
              required="required"
              value={guard.phone}
            />
          </div>
          <div className="">
            <div className="relative">
              <div className="flex items-center justify-between">
                <RegularButton
                  disabled={isLoading}
                  isLoading={isLoading}
                  text="Save"
                  rounded="full"
                  width="auto"
                  padding="px-8 py-2.5"
                  textSize="sm"
                />
                <HistoryButton type="button" text="Cancel" />
              </div>
              {/* static tooltip */}
              {/* {!isGotIt && onBoarding ? (
                <div className="mt-2 sm:mt-0 absolute sm:top-0 sm:left-24 ms-2">
                  <div className="relative bg-secondary-500 text-white inline-flex flex-col rounded-lg p-4 max-w-sm">
                    <div className="hidden sm:block tip absolute top-4 -left-2"></div>
                    <div className="sm:hidden tip sm-scrn absolute -top-2 left-6"></div>
                    <p className="text-xs mb-4">
                      When you click on “save” a message will be sent to the
                      guard to finish the onboading
                    </p>
                    <button
                      className="underline inline-flex font-semibold text-xs"
                      onClick={handle_is_got_it}
                    >
                      Got it
                    </button>
                  </div>
                </div>
              ) : null} */}
            </div>
          </div>
        </form>
      </div>
      <div className="mb-32"></div>

      <AlertDialog
        open={open}
        title="OOPS!! You've ran out of Guards"
        description="Would You Like To Subscribe For Another Guard?"
        setOpen={setOpen}
        actionText="Subscribe"
        action={() => {}}
      />
    </>
  );
}

export default AddGuard;
