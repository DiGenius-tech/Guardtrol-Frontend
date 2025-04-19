import React, { useState, useEffect } from "react";
import { MdAddHomeWork, MdPeople } from "react-icons/md";
import {
  useGetAllMySubscriptionsQuery,
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
} from "../../redux/services/subscriptions";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../redux/selectors/auth";
import { useCurrency, POOLING_TIME } from "../../constants/static";
import { Label, Select } from "flowbite-react";
import {
  selectFwConfig,
  selectPsConfig,
} from "../../redux/selectors/selectedPlan";
import Swal from "sweetalert2";
import { suspenseHide, suspenseShow } from "../../redux/slice/suspenseSlice";
import { toast } from "react-toastify";
import { useGetInvoicesQuery } from "../../redux/services/invoice";
import { api } from "../../redux/services/api";
import { useGetUserOrganizationRoleQuery } from "../../redux/services/role";

const UpdateSubscription = () => {
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const organization = useSelector(selectOrganization);
  const { getBeatPrice, getGuardPrice } = useCurrency();

  const { data: userRole } = useGetUserOrganizationRoleQuery(organization, {
    skip: organization ? false : true,
  });

  const USED_BEAT_PRICE = userRole?.organization?.BEAT_PRICE || getBeatPrice();
  const USED_GUARD_PRICE = userRole?.organization?.GUARD_PRICE || getGuardPrice();

  // ... existing code ...
} 