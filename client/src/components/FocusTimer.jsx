import { useState, useEffect, useRef, useContext } from "react";
import { API_BASE_URL } from "../config";
import { X, Play, Pause, Square, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import confetti from "canvas-confetti";
import AuthContext from "../context/AuthContext";

const FocusTimer = ({ isOpen, onClose, task, onComplete }) => {
  const { user } = useContext(AuthContext);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false); // future feature
  const timerRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const handleComplete = async () => {
    setIsActive(false);
    clearInterval(timerRef.current);

    // Sound effect
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
    );
    audio.play();

    // Confetti
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Update User Focus Time
    try {
      await fetch(`${API_BASE_URL}/api/users/focus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ minutes: 25 }),
      });
    } catch (error) {
      console.error("Failed to update focus time", error);
    }

    // Optional: Auto-complete task or prompt
    // For now, we'll just show a "Focus Session Complete" state or close/verify
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle>Focus Mode</DialogTitle>
          <DialogDescription>
            {task ? `Focusing on: ${task.title}` : "Stay focused!"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-8xl font-bold font-mono tracking-tighter mb-8">
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-4">
            <Button
              size="lg"
              className={`w-32 ${
                isActive ? "bg-amber-500 hover:bg-amber-600" : ""
              }`}
              onClick={toggleTimer}
            >
              {isActive ? (
                <>
                  <Pause className="mr-2 h-4 w-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Start
                </>
              )}
            </Button>
            <Button size="lg" variant="outline" onClick={resetTimer}>
              <Square className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>

        {timeLeft === 0 && (
          <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg flex flex-col items-center">
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
              Session Complete! 🎉
            </h3>
            <Button
              className="w-full"
              variant="default"
              onClick={() => {
                onClose();
                onComplete && onComplete(task);
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Verify & Complete Task
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FocusTimer;
