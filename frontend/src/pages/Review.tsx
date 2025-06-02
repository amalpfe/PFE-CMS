import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { FaStar } from "react-icons/fa";

function Review() {
  const { docId, appointmentId } = useParams<{ docId: string; appointmentId: string }>();

  const context = useContext(AppContext);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>("");

  if (!context) return <p>Context not available.</p>;

  // Ensure both docId and doctors are valid
const doctor = context?.doctors.find((doc) => doc._id === docId);


  // Demo hardcoded patientId and appointmentId
const patientId = context?.user?.id; // ← now dynamic


  const handleSubmit = async () => {
    if (!rating || !comment) {
      setError("Please provide both a rating and comment.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/patient/feedback", {
        appointmentId,
        patientId,
        doctorId: docId, // Send docId as doctorId
        rating,
        comment,
      });

      console.log("Feedback response:", response.data);
      setSubmitted(true);
      setRating(0);
      setComment("");
      setError("");
      setTimeout(() => setSubmitted(false), 5000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error submitting feedback:", err);
      setError(err.response?.data?.message || "Submission failed. Try again.");
    }
  };

  if (!doctor) {
    return <p className="text-red-500 font-medium mt-10 text-center">Doctor not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Leave a Review for Dr. {doctor.name}
      </h2>

      {/* Star Rating */}
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

      {/* Comment Field */}
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

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
      >
        Submit Review
      </button>

      {submitted && (
        <p className="text-green-600 mt-4 font-medium">Review submitted successfully!</p>
      )}

      {error && <p className="text-red-600 mt-4 font-medium">{error}</p>}
    </div>
  );
}

export default Review;
