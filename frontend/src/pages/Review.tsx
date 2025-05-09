import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FaStar } from "react-icons/fa"; // Star icon
//update
function Review() {
  const { docId } = useParams();
  const context = useContext(AppContext);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const doctor = context?.doctors.find((doc) => doc._id === docId);

  const handleSubmit = () => {
    if (!rating || !comment) return;

    // Simulate backend call
    console.log("Submitting review:", { docId, rating, comment });

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setRating(0);
    setComment("");
  };

  if (!doctor) return <p>Doctor not found.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Leave a Review for Dr. {doctor.name}
      </h2>

      {/* ⭐ Star Rating */}
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

      {/* ✍️ Comment Field */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={4}
        />
      </div>

      {/* 📤 Submit */}
      <button
        onClick={handleSubmit}
        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
      >
        Submit Review
      </button>

      {submitted && (
        <p className="text-green-600 mt-4 font-medium">
          Review submitted successfully!
        </p>
      )}
    </div>
  );
}

export default Review;
