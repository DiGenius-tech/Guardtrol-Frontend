import { Button, Modal, Label, TextInput, Select, Radio } from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFwConfig,
  selectPsConfig,
} from "../../../../redux/selectors/selectedPlan";
import { selectToken, selectUser } from "../../../../redux/selectors/auth";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import moment from "moment";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../redux/slice/suspenseSlice";
import RegularButton from "../../../Sandbox/Buttons/RegularButton";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { post } from "../../../../lib/methods";
import Swal from "sweetalert2";
import { useGetGuardsQuery } from "../../../../redux/services/guards";
import { useGetBeatsQuery } from "../../../../redux/services/beats";
import {
  useAddSubscriptionMutation,
  useGetAllMySubscriptionsQuery,
  useGetSubscriptionQuery,
} from "../../../../redux/services/subscriptions";
import { BEAT_PRICE, GUARD_PRICE } from "../../../../constants/static";
import { useReactToPrint } from "react-to-print";
import Invoice from "../../../../components/invoice";

// Constants for pricing

function parseDate(dateString) {
  return new Date(dateString);
}

const ViewInvoice = ({ openModal, setViewInvoiceModal, invoice }) => {
  const [isLoading, setIsLoading] = useState(false);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    documentTitle: "Invoice",
    content: () => componentRef.current,
  });

  return (
    <Modal
      size={"7xl"}
      dismissible
      show={openModal}
      onClose={() => setViewInvoiceModal(false)}
    >
      <Modal.Header>Invoice</Modal.Header>
      <Modal.Body>
        <Invoice componentRef={componentRef} invoice={invoice} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          isProcessing={isLoading}
          disabled={isLoading}
          onClick={() => handlePrint()}
          style={{ backgroundColor: "#008080" }}
          type="submit"
        >
          Print
        </Button>

        <Button color="gray" onClick={() => setViewInvoiceModal(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ViewInvoice;
