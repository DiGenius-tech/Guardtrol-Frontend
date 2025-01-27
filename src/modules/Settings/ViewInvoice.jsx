import { Button, Modal, Label, TextInput, Select, Radio } from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Invoice from "../../components/invoice";

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
      <Button color="gray" onClick={() => setViewInvoiceModal(false)}>
          Cancel
        </Button>
        <Button
          isProcessing={isLoading}
          disabled={isLoading}
          onClick={() => handlePrint()}
          style={{ backgroundColor: "#008080" }}
          type="submit"
        >
          Print
        </Button>

  
      </Modal.Footer>
    </Modal>
  );
};
export default ViewInvoice;
