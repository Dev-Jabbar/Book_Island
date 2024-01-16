import React, { useEffect, useState, useRef } from "react";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import { useMyContext } from "./MyContext";
import { MdCancel } from "react-icons/md";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { format } from "date-fns";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import CreateBook from "./CreatedBook";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// Define the type for the book data
interface Book {
  id: number;
  title: string;
  writer: string;
  cover_image: string;
  price: string;
  tags: string;
}

interface CartEntity {
  cart_id: number; // Cart ID (optional, as it may be generated by the database)
  customer_id: number; // Customer ID (required)
  title: string; // Book ID (required)
  cover_image: string;
  price: number;
}

interface ordersParams {
  order_id: number;
  created_at: Date;
  customer_name: string;
}
const api = axios.create({
  baseURL: "https://book-island-backend.onrender.com",
});

function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [carts, setCarts] = useState<CartEntity[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [SelectBookloading, setSelectBookLoading] = useState(false);

  const { customerId, runFetchBooks } = useMyContext();
  const [cartHidden, setCartHidden] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const loader = useRef<HTMLDivElement | null>(null);

  const [creatingCart, setCreatingCart] = useState(false);
  const [deletingCart, setDeletingCart] = useState(false);

  const [customerPoints, setCustomerPoints] = useState();
  const [localError, setLocalError] = useState<string | null>(null);

  const [createdOrders, setCreatedOrders] = useState();

  const [orders, setOrders] = useState<ordersParams[] | undefined>(undefined);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  useEffect(() => {
    !customerId && navigate("/login");
  }, [customerId, navigate]);

  const handleCreateOrder = async (
    customerId: number | null,
    carts: CartEntity[]
  ) => {
    try {
      const createOrderResponse = await fetch(
        `https://book-island-backend.onrender.com/createFromCart/${customerId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(carts),
        }
      );

      const createOrderData = await createOrderResponse.json();

      if (createOrderResponse.ok) {
        // Order creation successful
        console.log("Order creation successful:", createOrderData);

        toast.success("Order creation successful", {
          position: "top-right",
          autoClose: 3000, // Set the duration for the notification to be visible (in milliseconds)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setCreatedOrders(createOrderData);

        // Call handleGetOrder after order creation
        handleGetOrder(customerId, totalPoints);
      } else {
        // Order creation failed
        setLocalError(createOrderData.error);
        // Handle error as needed
      }
    } catch (error) {
      console.error("Error creating order:", error);
      // Handle other errors if needed
      setLocalError("Internal Server Error");
    }
  };

  const handleGetOrder = async (
    customerId: number | null,
    totalPoints: number | null
  ) => {
    if (totalPoints! > customerPoints!) {
      toast.success(
        "Cart is greater than customer points. Remove items from cart.",
        {
          position: "top-right",
          autoClose: 3000, // Set the duration for the notification to be visible (in milliseconds)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } else {
      try {
        const getOrderResponse = await fetch(
          `https://book-island-backend.onrender.com/api/order/details/${customerId}/${totalPoints}`
        );

        const getOrderData = await getOrderResponse.json();

        if (getOrderResponse) {
          // Order creation successful

          setOrders(getOrderData);

          // You can handle the response or perform any actions
        } else {
          // Order creation failed
          setLocalError(getOrderData.error);
          // Handle error as needed
        }
      } catch (error) {
        console.error("Error creating order:", error);
        // Handle other errors if needed
        setLocalError("Internal Server Error");
      }
    }
  };
  const handleCreateCart = async (
    bookId: number,
    customerId: number | null
  ) => {
    try {
      setCreatingCart(true); // Set loading state to true

      const response = await api.post("/api/cart/create", {
        customerId,
        bookId,
      });

      console.log("Cart created:", response.data);

      setSelectBookLoading(false);

      toast.success(`cart ${carts.length + 1} successfully created`, {
        position: "top-right",
        autoClose: 3000, // Set the duration for the notification to be visible (in milliseconds)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setCreatingCart(false); // Set loading state to false after successful creation
    } catch (error) {
      console.error("Error creating cart:", error);
      setCreatingCart(false); // Set loading state to false on error
    }
  };

  const handleDeleteCart = async (
    customerId: number | null,
    cartId: number
  ) => {
    try {
      setDeletingCart(true); // Set loading state to true

      await api.delete(`api/cart/${customerId}/delete/${cartId}`);

      console.log(`Cart with ID ${cartId} deleted successfully.`);

      setDeletingCart(false); // Set loading state to false after successful deletion
    } catch (error) {
      console.error("Error deleting cart:", error);
      setDeletingCart(false); // Set loading state to false on error
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get<Book[]>("/api/books");
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [runFetchBooks]);

  useEffect(() => {
    const fetchCustomerPoints = async () => {
      try {
        const response = await api.get(`/api/customer/${customerId}/points`);
        setCustomerPoints(response.data.points);
      } catch (error) {
        console.error("Error fetching Customer Points:", error);
      }
    };

    fetchCustomerPoints();
  }, [createdOrders]);

  useEffect(() => {
    const getAllCartDetailsForCustomer = async () => {
      try {
        const response = await api.get<CartEntity[]>(
          `api/cart/details/${customerId}`
        );
        // Set the carts state variable with the fetched data
        setCarts(response.data);
        // Calculate the total sum of cart prices
        const totalCartPrice = response.data.reduce(
          (acc, cart) => acc + Number(cart.price),
          0
        );
        // Format the totalCartPrice to two decimal places
        const formattedTotalCartPrice = totalCartPrice.toFixed(2);

        // Set the totalPoints state variable with the formatted sum
        // Convert the string to a number before setting the state
        setTotalPoints(Number(formattedTotalCartPrice));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getAllCartDetailsForCustomer();
  }, [selectedBook, handleDeleteCart]);

  const openModal = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setIsModalOpen(false);
  };

  const handleDeleteAllOrders = async () => {
    try {
      const response = await fetch(
        "https://book-island-backend.onrender.com/api/order/deleteAll",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Add any additional headers if needed
          },
        }
      );

      if (response.ok) {
        console.log("All orders deleted successfully");
        // Add any additional logic after successful deletion
      } else {
        console.error("Failed to delete all orders");
        // Handle error as needed
      }
    } catch (error) {
      console.error("Error deleting all orders:", error);
      // Handle other errors if needed
    }
  };

  useEffect(() => {
    !isOpen && handleDeleteAllOrders();
  }, [isOpen]);

  return (
    <div className="py-10 md:px-40 px-5 bg-gray-500 text-white">
      <ToastContainer />

      <div className="flex justify-center items-center">
        {SelectBookloading && <Spinner />}
      </div>
      <div className="w-full  flex justify-end items-center">
        <div
          className={`fixed top-0 h-[35rem] text-black ${
            cartHidden ? "hidden" : "flex"
          }  flex-col px-4   overflow-y-auto  w-[20rem] bg-gray-100 right-0`}
        >
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col space-y-1">
              <span className="text-gray-400">Total</span>
              <div className="flex space-x-1 italic pb-2">
                <span>{totalPoints}</span>
                <span className="text-gray-600">points</span>
              </div>
            </div>

            <span
              className="text-lg font-extrabold text-red-500 cursor-pointer py-4"
              onClick={() => {
                setCartHidden(!cartHidden);
              }}
            >
              Close
            </span>
          </div>

          {carts && carts.length > 0 ? (
            carts.map((cart) => {
              return (
                <div
                  key={cart.cart_id}
                  className="border border-x-0 border-gray-300 py-5 flex justify-between "
                >
                  <div>
                    <img
                      src={cart.cover_image}
                      alt="react"
                      className="h-10 w-10"
                    />
                    <div className="text-xs font-thin max-w-[10rem] pt-4">
                      {cart.title}
                    </div>
                  </div>
                  <div className="flex flex-col h-full space-y-3">
                    <div>Price</div>
                    <div className=" text-xs font-thin">
                      <span className="font-bold">{cart.price}</span>
                      <span className="ml-2 ">points</span>
                    </div>
                    <div
                      className="text-xs font-thin cursor-pointer"
                      onClick={() => handleDeleteCart(customerId, cart.cart_id)}
                    >
                      {deletingCart ? (
                        <Spinner /> // Show spinner while deleting
                      ) : (
                        <MdCancel className="h-5 w-5 text-red-700" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div>
              <img src="./emptyCart.jpg" />
            </div>
          )}

          <div className="w-full flex justify-center">
            <span
              className="italic py-4 font-extrabold text-blue-400 cursor-pointer"
              onClick={() => {
                if (
                  totalPoints !== null &&
                  customerPoints !== undefined &&
                  totalPoints > customerPoints
                ) {
                  toast.success(
                    "Cart is greater than customer points. Remove items from cart.",
                    {
                      position: "top-right",
                      autoClose: 3000, // Set the duration for the notification to be visible (in milliseconds)
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    }
                  );
                } else {
                  setCartHidden(!cartHidden);
                  setIsOpen(!isOpen);
                  handleCreateOrder(customerId, carts);
                }
              }}
            >
              Proceed to Order
            </span>
          </div>

          <Transition show={isOpen} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={() => {
                setIsOpen(false);
              }}
            >
              <div className="flex items-center justify-center min-h-screen">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <div className="relative bg-white p-4 h-[30rem] w-[25rem] rounded-md max-w-md mx-auto">
                  <div className="flex flex-col space-y-12">
                    <div className="h-full  flex justify-between flex-row">
                      <Dialog.Title className="text-lg font-bold mb-4">
                        Order Summary
                      </Dialog.Title>
                      {/* Add order summary content here */}
                      <span>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        >
                          Close
                        </button>
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Order ID</span>
                      {orders && orders.length > 0 && (
                        <span>{orders[0].order_id}</span>
                        // Or use any other format you prefer, e.g., toDateString(), toLocaleString(), etc.
                      )}
                    </div>

                    <div className="flex justify-between">
                      <span>Customer Name</span>
                      {orders && orders.length > 0 && (
                        <span>{orders[0].customer_name}</span>
                        // Or use any other format you prefer, e.g., toDateString(), toLocaleString(), etc.
                      )}
                    </div>

                    <div className="flex justify-between">
                      <span>Total Books bought</span>
                      {orders && orders.length > 0 && (
                        <span>{orders.length}</span>
                        // Or use any other format you prefer, e.g., toDateString(), toLocaleString(), etc.
                      )}
                    </div>

                    <div className="flex justify-between">
                      <span>Date Created</span>
                      {orders && orders.length > 0 && (
                        <span>
                          {orders && orders.length > 0 && (
                            <span>
                              {format(
                                new Date(orders[0].created_at),
                                "dd/MM/yyyy"
                              )}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
        <div
          className="flex cursor-pointer"
          onClick={() => {
            setCartHidden(!cartHidden);
          }}
        >
          <FaShoppingCart className="mr-2" size={24} color="#FFA500" />
          <div className="text-xl font-extrabold text-orange-600 italic">
            Cart
          </div>
          <span className="text-xl font-extrabold text-orange-600 italic ml-2">
            {carts.length}
          </span>
        </div>
      </div>
      <h1 className="italic text-2xl text-center font-extrabold pb-12">
        Books Island
      </h1>
      <h2 className="italic text-2xl text-center pb-12">
        {customerPoints} points
      </h2>
      <input
        type="text"
        placeholder="Search books..."
        className="mb-4 p-2 border text-black border-gray-300 rounded"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <CreateBook />

      <div className="grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1">
        {books
          .filter(
            (book) =>
              book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              book.writer.toLowerCase().includes(searchQuery.toLowerCase()) ||
              book.tags.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((book) => (
            <div
              key={book.id}
              className="h-70 w-full space-y-2 p-2 flex bg-gray-700 justify-center flex-col items-center border border-gray-300 shadow-md shadow-white"
              onClick={() => openModal(book)}
            >
              <img
                src={book.cover_image}
                alt={book.title}
                className="h-32 w-32"
              />
              <h1 className="text-xs text-center">{book.title}</h1>
              <h2 className="text-xs text-center font-extrabold">
                {book.writer}
              </h2>
              <div className="text-xs text-center font-extrabold text-gray-400 italic">
                {book.price} points
              </div>
              <div className="text-xs text-center font-extrabold text-yellow-500 italic">
                {book.tags}
              </div>
            </div>
          ))}
      </div>
      <div ref={loader} className="flex justify-center items-center">
        {loading && <p>Loading...</p>}
      </div>
      {isModalOpen && selectedBook && (
        <div
          key={selectedBook.id}
          className="fixed top-0 text-black left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center"
        >
          <div className="bg-white p-4 w-[20rem] rounded-md">
            <button
              className="absolute top-5 right-14 text-white"
              onClick={closeModal}
            >
              Close
            </button>
            <div className="w-full flex justify-between items-center pr-10">
              <div className="w-40 h-40">
                <img
                  src={selectedBook.cover_image}
                  alt={selectedBook.title}
                  className="h-full w-full object-cover mb-4"
                />
              </div>
              <FaShoppingCart
                className="mr-2 cursor-pointer"
                size={30}
                color="#FFA500"
                onClick={() => {
                  handleCreateCart(selectedBook.id, customerId);
                  setSelectBookLoading(true);
                }}
              />
            </div>
            <h1 className="font-bold mb-2">{selectedBook.title}</h1>
            <h2 className="mb-2">{selectedBook.writer}</h2>
            <p className="text-gray-500 italic mb-2">
              {selectedBook.price} points
            </p>
            <p className="text-yellow-500 italic">{selectedBook.tags}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
