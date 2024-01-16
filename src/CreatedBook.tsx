import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { useMyContext } from "./MyContext";

// ... (import statements)

export default function CreateBook() {
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const { runFetchBooks, setRunFetchBooks } = useMyContext();
  const [formData, setFormData] = React.useState({
    title: "",
    writer: "",
    coverImage: "",
    price: "",
    tags: "",
  });

  const handleOpen = () => {
    setOpen(true);
    setErrorMessage("");
  };

  const handleClose = () => {
    setOpen(false);
    setErrorMessage("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Check if any field is empty
    if (Object.values(formData).some((value) => value === "")) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    try {
      // Make POST request
      await axios.post("http://localhost:3000/api/books", {
        title: formData.title,
        writer: formData.writer,
        cover_image: formData.coverImage,
        price: parseFloat(formData.price),
        tags: formData.tags,
      });

      // Close the modal after successful submission
      alert("Book Succesfully created");
      handleClose();
    } catch (error) {
      console.error("Error creating book:", error);
      setErrorMessage("Error creating book. Please try again.");
    }
  };

  return (
    <>
      <span>
        <button onClick={handleOpen} className="m-2 p-2 bg-gray-600 text-white">
          Create Book
        </button>
      </span>

      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box className="fixed top-1/2 left-1/2 transform -translate-x-1/2 w-[80%] md:w-[500px]  -translate-y-1/2 bg-white p-4">
          <div>
            <h2 className="text-xl font-bold mb-4">Create a Book</h2>

            <form>
              {errorMessage && (
                <div className="mb-4 text-red-500">{errorMessage}</div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Writer
                </label>
                <input
                  type="text"
                  name="writer"
                  value={formData.writer}
                  onChange={handleChange}
                  className="w-full border p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="w-full border p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Price
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full border p-2"
                />
              </div>
              <button
                type="button"
                className="bg-blue-500 text-white p-2"
                onClick={() => {
                  handleSubmit();
                  setRunFetchBooks(!runFetchBooks);
                }}
              >
                Create Book
              </button>
            </form>
          </div>
        </Box>
      </Modal>
    </>
  );
}
