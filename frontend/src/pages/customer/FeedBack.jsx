import React from "react";
import { useNavigate } from "react-router-dom";
import useFeedbackStore from "../../store/customer/FeedbackStore";

const FeedbackPage = () => {
  const navigate = useNavigate();

  // Zustand state
  const feedbackText = useFeedbackStore((state) => state.feedbackText);
  const setFeedbackText = useFeedbackStore((state) => state.setFeedbackText);
  const clearFeedback = useFeedbackStore((state) => state.clearFeedback);

  const handleSubmit = () => {
    console.log("Feedback submitted:", feedbackText);
    clearFeedback();
    navigate("/ordertracking");
  };

  const handleSkip = () => {
    clearFeedback();
    navigate("/ordertracking");
  };

  return (
    <div className="relative bg-white min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#FFD700] rounded-full blur-[150px] opacity-20" />
      <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#FF0000] rounded-full blur-[150px] opacity-20" />

      <div className="relative z-10 py-10 px-6">
        <div className="max-w-2xl mx-auto bg-black/5 backdrop-blur-sm border border-black/10 rounded-2xl shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 bg-gradient-to-r from-[#FF0000] via-[#FFD700] to-[#FF0000] bg-clip-text text-transparent">
            Feedback
          </h1>

          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Write your feedback here"
            rows={5}
            className="w-full p-4 rounded-xl border border-black/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-black placeholder-black/50"
          />

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 inline-flex items-center justify-center font-semibold py-3 rounded-xl shadow-md transition-all duration-200 bg-gradient-to-r from-[#FF0000] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FF0000] text-black"
            >
              Submit
            </button>
            <button
              onClick={handleSkip}
              className="flex-1 inline-flex items-center justify-center font-semibold py-3 rounded-xl shadow-md transition-colors duration-200 bg-black/5 border border-black/10 text-black hover:bg-[#FF0000] hover:text-white"
            >
              Skip Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
