import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFwConfig,
  selectPsConfig,
} from "../../redux/selectors/selectedPlan";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../redux/selectors/auth";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import moment from "moment";
import { suspenseHide, suspenseShow } from "../../redux/slice/suspenseSlice";
import RegularButton from "../Sandbox/Buttons/RegularButton";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { post } from "../../lib/methods";
import Swal from "sweetalert2";
import { useGetGuardsQuery } from "../../redux/services/guards";
import { useGetBeatsQuery } from "../../redux/services/beats";
import {
  useAddSubscriptionMutation,
  useGetAllMySubscriptionsQuery,
  useGetSubscriptionQuery,
} from "../../redux/services/subscriptions";
import { useCurrency, POOLING_TIME } from "../../constants/static";
import axios from "axios";
import { useGetInvoicesQuery } from "../../redux/services/invoice";
import { persistor } from "../../redux/store";
import { api } from "../../redux/services/api";
import { logout } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { useGetUserOrganizationRoleQuery } from "../../redux/services/role";

const Subscription = () => {
  const { getBeatPrice, getGuardPrice } = useCurrency();
  const psConfig = useSelector(selectPsConfig);

  const { data: userRole } = useGetUserOrganizationRoleQuery(organization, {
    skip: organization ? false : true,
  });
  const USED_BEAT_PRICE = userRole?.organization?.BEAT_PRICE || getBeatPrice();
  const USED_GUARD_PRICE = userRole?.organization?.GUARD_PRICE || getGuardPrice();

  // ... rest of the existing code ...
}; 