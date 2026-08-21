import React, { useState } from "react";
import "./InterviewScheduling.css";

const interviewDays = [
  {
    date: "2026-08-15",
    day: "Saturday",
    label: "15",
    month: "AUG",
  },
  {
    date: "2026-08-16",
    day: "Sunday",
    label: "16",
    month: "AUG",
  },
  {
    date: "2026-08-17",
    day: "Monday",
    label: "17",
    month: "AUG",
  },
];

const timeSlots = [
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
];

function InterviewScheduling() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Temporary candidate data
  // Later we can get this from the URL / backend.
  const candidate = {
    name: "Omar Adel",
    email: "omar.adel@example.com",
    job: "Backend Developer",
  };

  const handleConfirm = async () => {
  if (!selectedDate || !selectedTime) {
    setError("Please select a date and time.");
    return;
  }

  setError("");
  setLoading(true);

  try {
    const response = await fetch(
      "https://bigdata123.app.n8n.cloud/webhook-test/interview-schedule", // ← شيل -test للـ Production
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate: candidate.name,
          email: candidate.email,
          job: candidate.job,
          date: selectedDate,
          time: selectedTime,
        }),
      }
    );

    const data = await response.json();

    if (response.status === 409) {
      setError("⚠️ This interview slot is already booked. Please choose another time.");
      return;
    }

    if (!response.ok) {
      setError(data.message || "Failed to schedule interview. Please try again.");
      return;
    }

    // Save response data for success screen
    setCalendarEventId(data.calendarEventId);
    setSuccess(true);
  } catch (err) {
    setError("Something went wrong. Please check your connection and try again.");
  } finally {
    setLoading(false);
  }
};


  if (success) {
    return (
      <div className="scheduling-page">
        <div className="success-card">
          <div className="success-icon">✓</div>

          <h1>Interview Confirmed!</h1>

          <p className="success-text">
            Your interview for the <strong>{candidate.job}</strong> position
            has been successfully scheduled.
          </p>

          <div className="appointment-card">
            <div>
              <span>Date</span>
              <strong>{selectedDate}</strong>
            </div>

            <div>
              <span>Time</span>
              <strong>{selectedTime}</strong>
            </div>
          </div>

          <p className="confirmation-note">
            A confirmation email will be sent to{" "}
            <strong>{candidate.email}</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="scheduling-page">
      <div className="scheduling-card">

        {/* Header */}
        <div className="header">
          <div className="logo">HR</div>

          <span className="secure-badge">
            🔒 Secure Scheduling
          </span>
        </div>

        {/* Candidate info */}
        <div className="welcome">
          <p className="eyebrow">INTERVIEW SCHEDULING</p>

          <h1>
            Hi, {candidate.name} <span>👋</span>
          </h1>

          <p>
            Congratulations! You have been selected for the next stage
            of our recruitment process.
          </p>
        </div>

        <div className="job-card">
          <div className="job-icon">💼</div>

          <div>
            <span>Interview for</span>
            <strong>{candidate.job}</strong>
          </div>
        </div>

        {/* Date */}
        <section className="section">
          <div className="section-title">
            <span className="step">1</span>

            <div>
              <h2>Select a date</h2>
              <p>Choose a convenient day for your interview.</p>
            </div>
          </div>

          <div className="date-grid">
            {interviewDays.map((item) => (
              <button
                key={item.date}
                className={`date-option ${
                  selectedDate === item.date ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedDate(item.date);
                  setError("");
                }}
              >
                <span>{item.month}</span>

                <strong>{item.label}</strong>

                <small>{item.day}</small>
              </button>
            ))}
          </div>
        </section>

        {/* Time */}
        <section className="section">
          <div className="section-title">
            <span className="step">2</span>

            <div>
              <h2>Select a time</h2>
              <p>All times are shown in your local timezone.</p>
            </div>
          </div>

          <div className="time-grid">
            {timeSlots.map((time) => (
              <button
                key={time}
                className={`time-option ${
                  selectedTime === time ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedTime(time);
                  setError("");
                }}
              >
                🕐 {time}
              </button>
            ))}
          </div>
        </section>

        {/* Selected appointment */}
        {selectedDate && selectedTime && (
          <div className="selected-appointment">
            <div className="calendar-icon">📅</div>

            <div>
              <span>Your selected appointment</span>

              <strong>
                {selectedDate} · {selectedTime}
              </strong>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Confirm */}
        <button
          className="confirm-button"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Scheduling...
            </>
          ) : (
            <>
              Confirm Interview
              <span>→</span>
            </>
          )}
        </button>

        <p className="privacy">
          🔒 Your information is securely handled and will only be used
          for recruitment purposes.
        </p>

      </div>
    </div>
  );
}

export default InterviewScheduling;
