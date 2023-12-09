import React, { useEffect, useState, useRef } from "react";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import { useMyContext } from "./MyContext";

// Define the type for the book data
interface Book {
  id: number;
  title: string;
  writer: string;
  cover_image: string;
  price: string;
  tags: string;
}

const api = axios.create({
  baseURL: "http://localhost:3000",
});

function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { points, setPoints, order, setOrder } = useMyContext();

  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get<Book[]>("/api/books", {
          params: { page, searchTerm },
        });
        setBooks((prevBooks) => [...prevBooks, ...response.data]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, searchTerm]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.8,
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loader]);

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];

    if (target.isIntersecting) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const openModal = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setIsModalOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset page to 1 when search term changes
  };

  return (
    <div className="py-10 px-40">
      <div className="w-full flex justify-end items-center">
        <FaShoppingCart className="mr-2" size={24} color="#FFA500" />
        <div className="text-xl font-extrabold text-orange-600 italic">
          Orders
        </div>
        <span className="text-xl font-extrabold text-orange-600 italic ml-2">
          {order}
        </span>
      </div>
      <h1 className="italic text-2xl text-center pb-12">Jabbar Books</h1>
      <h2 className="italic text-2xl text-center pb-12">{points} points</h2>
      <input
        type="text"
        placeholder="Search books..."
        onChange={handleSearch}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <div className="grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1">
        {books.map((book) => (
          <div
            key={book.id}
            className="h-70 w-full space-y-2 p-2 flex justify-center flex-col items-center border border-gray-300"
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
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 w-[20rem] rounded-md">
            <button
              className="absolute top-5 right-14 text-red-900"
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
                onClick={() => setOrder(order + 1)}
                size={30}
                color="#FFA500"
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
