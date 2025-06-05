import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";

interface RouteParams {
  appointmentId: number;
  patientId: number;
  doctorName: string;
}

function Review() {
const { appointmentId, patientId, doctorName } = useParams() as unknown as RouteParams;


  const navigate = useNavigate();

  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      setError("Please provide both rating and comment.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/patient/add", {
        appointmentId,
        patientId,
        rating,
        comment,
      });

      if (response.status === 201) {
        setSubmitted(true);
        setError("");
        // Optional: redirect after submission
        setTimeout(() => {
          navigate("/"); // or wherever you want after submission
        }, 3000);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to submit review. Try again."
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Leave a Review for Dr. {decodeURIComponent(doctorName || "")}
      </h2>

      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Rating:</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer transition-colors ${
                (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              size={24}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={4}
          placeholder="Write your review here..."
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitted}
        className={`${
          submitted
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        } text-white px-6 py-2 rounded transition`}
      >
        Submit Review
      </button>

      {submitted && (
        <p className="text-green-600 mt-4 font-medium">
          Review submitted successfully!
        </p>
      )}
      {error && <p className="text-red-600 mt-4 font-medium">{error}</p>}
    </div>
  );
}

export default Review;
