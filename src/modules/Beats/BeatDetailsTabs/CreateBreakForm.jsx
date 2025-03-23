import React, { useState } from "react";
import { Button, Modal, Label, TextInput } from "flowbite-react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateBreakMutation } from "../../../redux/services/breaks";

const CreateBreakForm = ({ openModal, setOpenModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    minutes: 15,
  });
  const { beatId } = useParams();
  const [createBreak, { isLoading }] = useCreateBreakMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "minutes" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return toast.error("Please enter a break name");
    }
    
    if (!formData.minutes || formData.minutes <= 0) {
      return toast.error("Minutes must be greater than 0");
    }

    try {
      // Add beat ID to the form data
      const breakData = {
        ...formData,
        beat: beatId,
      };

      await createBreak(breakData).unwrap();
      toast.success("Break created successfully!");
      setFormData({ name: "", minutes: 15 });
      setOpenModal(false);
    } catch (error) {
      console.error("Failed to create break:", error);
      toast.error("Failed to create break. Please try again.");
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Create New Break</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" value="Break Name" />
            <TextInput
              id="name"
              name="name"
              placeholder="Lunch break, Coffee break, etc."
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="minutes" value="Duration (minutes)" />
            <TextInput
              id="minutes"
              name="minutes"
              type="number"
              min={1}
              value={formData.minutes}
              onChange={handleChange}
              required
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={handleSubmit}
          style={{ backgroundColor: "#008080" }}
          disabled={isLoading}
          isProcessing={isLoading}
        >
          Create Break
        </Button>
        <Button color="gray" onClick={() => setOpenModal(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateBreakForm;