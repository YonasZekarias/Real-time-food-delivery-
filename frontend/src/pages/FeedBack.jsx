import React from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";

const FeedbackPage = () => {
  const navigate = useNavigate();

  // Get feedback state from Zustand
  const feedbackText = useStore((state) => state.feedbackText);
  const setFeedbackText = useStore((state) => state.setFeedbackText);
  const clearFeedback = useStore((state) => state.clearFeedback);

  const handleSubmit = () => {
    console.log("Feedback submitted:", feedbackText);
    clearFeedback(); // reset after submission
    navigate("/ordertracking");
  };

  const handleSkip = () => {
    clearFeedback(); // reset anyway
    navigate("/ordertracking");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Feedback</h1>
      <textarea
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
        placeholder="Write your feedback here"
        rows={5}
        style={{ width: "100%" }}
      />
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSubmit} style={{ marginRight: "1rem" }}>
          Submit
        </button>
        <button onClick={handleSkip}>Skip Feedback</button>
      </div>
    </div>
  );
};

export default FeedbackPage;
