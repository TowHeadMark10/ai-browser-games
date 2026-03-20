import { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";

// Total work time in seconds (25 min)
const WORK_TIME = 25 * 60;
// Total break time in seconds (5 min)
const BREAK_TIME = 5 * 60;
// Available task categories
const CATEGORIES = [
  { label: "Work", emoji: "💼" },
  { label: "Personal", emoji: "🙋" },
  { label: "Home", emoji: "🏠" },
  { label: "Health", emoji: "💪" },
  { label: "Learning", emoji: "📚" },
];

export default function Index() {
  // Seconds remaining on the timer
  const [seconds, setSeconds] = useState(WORK_TIME);
  // Whether the timer is currently running
  const [isRunning, setIsRunning] = useState(false);
  // Whether we are in work mode or break mode
  const [isBreak, setisBreak] = useState(false);
  // Counts how many pomodoros (work sessions) have been completed
  const [pomodoroCount, setPomodoroCount] = useState(0);
  // Each task has a title, a done status and a category
  const [tasks, setTasks] = useState<
    { title: string; done: boolean; category: string }[]
  >([]);
  // Text currently typed in the input
  const [taskInput, setTaskInput] = useState("");
  // Category selected when adding a new task
  const [selectedCategory, setSelectedCategory] = useState("Work");
  // Category filter to show only tasks of a certain category (null = show all)
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  // Index of the task being edited (null means no task is being edited)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  // Text in the edit input
  const [editInput, setEditInput] = useState("");
  // Reference to the interval so we can cancel it later
  const IntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start or stop the interval whenever isRunning changes
  useEffect(() => {
    if (isRunning) {
      IntervalRef.current = setInterval(() => {
        setSeconds((s) => {
          // When time runs out, switch modes automatically
          if (s <= 1) {
            clearInterval(IntervalRef.current!);
            setIsRunning(false);
            setisBreak((prev) => {
              // Play different sounds for work end and break end
              if (prev) {
                playAlarm();
              } else {
                playChime();
              }
              // If we were on work, switch to break and vice versa
              const nextisBreak = !prev;
              // If switching to break, if means a work session just ended - add 1
              if (nextisBreak) setPomodoroCount((c) => c + 1);
              setSeconds(nextisBreak ? BREAK_TIME : WORK_TIME);
              return nextisBreak;
            });
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(IntervalRef.current!);
    }
    // Cleanup interval when component unmounts
    return () => clearInterval(IntervalRef.current!);
  }, [isRunning]);

  // Converts seconds to MM:SS format. padStart(2,"0") makes sure it always has two digits - so it shows 04:05 and not 4:5
  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  // Reset goes back to work mode
  function reset() {
    setIsRunning(false);
    setisBreak(false);
    setSeconds(WORK_TIME);
  }

  // Skips the break and goes back to work mode immediately
  function skipBreak() {
    setisBreak(false); // returns to work mode
    setIsRunning(false); // pauses the timer so the user can start it whenever they want
    setSeconds(WORK_TIME); // loads the 25 mins again
  }

  // Plays a soft chime sound using the Web Audio API
  function playChime() {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(528, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      440,
      ctx.currentTime + 0.8,
    );

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 1.2);
  }

  // Plays a soft alarm sound to signal break is over
  function playAlarm() {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.setValueAtTime(660, ctx.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.4);
    oscillator.frequency.setValueAtTime(660, ctx.currentTime + 0.6);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.8);
  }

  // Adds a new task to the list
  function addTask() {
    if (!taskInput.trim()) return;
    // New tasks start as not done
    setTasks([
      ...tasks,
      { title: taskInput.trim(), done: false, category: selectedCategory },
    ]);
    setTaskInput("");
  }
  //Removes a task by its index
  function deleteTask(index: number) {
    setTasks(tasks.filter((_, i) => i != index));
  }
  // Toggles a task between done and not done
  function toggleTask(index: number) {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task,
      ),
    );
  }
  // Sets a task into edit mode
  function startEdit(index: number) {
    setEditingIndex(index);
    setEditInput(tasks[index].title);
    // Load current category so it can be edited
    setSelectedCategory(tasks[index].category);
  }
  //Saves the edited task
  function saveEdit() {
    if (!editInput.trim()) return;
    setTasks(
      tasks.map((task, i) =>
        i === editingIndex
          ? { ...task, title: editInput.trim(), category: selectedCategory }
          : task,
      ),
    );
    setEditingIndex(null);
    setEditInput("");
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1a1a2e",
      }}
    >
      {/* Shows how many pomodoros have been completed */}
      <Text style={{ fontSize: 16, color: "#aaaaaa", marginBottom: 8 }}>
        Pomodoros: {pomodoroCount}
      </Text>
      {/* Shows current mode: Work or Break */}
      <Text
        style={{
          fontSize: 20,
          color: isBreak ? "#00ff88" : "#e94560",
          marginBottom: 16,
          fontWeight: "bold",
        }}
      >
        {isBreak ? "BREAK TIME" : "WORK TIME"}
      </Text>

      {/* Only show Skip Break button during break time */}
      {isBreak && (
        <TouchableOpacity onPress={skipBreak} style={{ marginBottom: 16 }}>
          <Text style={{ color: "#aaaaff", fontSize: 14 }}>Skip Break</Text>
        </TouchableOpacity>
      )}

      <Text
        style={{
          fontSize: 72,
          color: "#ffffff",
          fontWeight: "bold",
          marginBottom: 40,
        }}
      >
        {formatTime(seconds)}
      </Text>

      <View style={{ flexDirection: "row", gap: 16 }}>
        {/* Start/Pause button - inverts isRunning state */}
        <TouchableOpacity
          onPress={() => setIsRunning(!isRunning)}
          style={{
            backgroundColor: "#e94560",
            padding: 16,
            borderRadius: 8,
            minWidth: 120,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
            {isRunning ? "Pause" : "Start"}{" "}
            {/* The Start/Pause botton - !isRunning inverts the state. If it's running it pauses it, if it's paused it starts it */}
          </Text>
        </TouchableOpacity>

        {/* Reset button - goes back to work mode */}
        <TouchableOpacity
          onPress={reset}
          style={{
            backgroundColor: "#444",
            padding: 16,
            borderRadius: 8,
            minWidth: 120,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>

      {/* Task input */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 40 }}>
        <input
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Add a task..."
          style={{
            flex: 1,
            backgroundColor: "#2a2a4e",
            color: "#ffffff",
            padding: 10,
            borderRadius: 8,
            border: "none",
            fontSize: 15,
            outline: "none",
          }}
        />
        <TouchableOpacity
          onPress={addTask}
          style={{
            backgroundColor: "#e94560",
            padding: 10,
            borderRadius: 8,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Category selector - only shows when typing */}
      {taskInput.length > 0 && (
        <>
          <Text style={{ color: "#888", fontSize: 11, marginTop: 8 }}>
            CATEGORY
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 8,
            }}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.label}
                onPress={() => setSelectedCategory(cat.label)}
                style={{
                  backgroundColor:
                    selectedCategory === cat.label ? "#e94560" : "#2a2a4e",
                  padding: 6,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 11 }}>
                  {cat.emoji} {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Category filter buttons */}
      <Text style={{ color: "#888", fontSize: 11, marginTop: 16 }}>
        FILTER BY
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 8,
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => setFilterCategory(null)}
          style={{
            backgroundColor: filterCategory === null ? "#e94560" : "#2a2a4e",
            padding: 8,
            borderRadius: 16,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12 }}>All</Text>
        </TouchableOpacity>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.label}
            onPress={() => setFilterCategory(cat.label)}
            style={{
              backgroundColor:
                filterCategory === cat.label ? "#e94560" : "#2a2a4e",
              padding: 8,
              borderRadius: 16,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 12 }}>
              {cat.emoji} {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Task list */}
      <ScrollView style={{ width: "100%", marginTop: 16 }}>
        {tasks
          .filter(
            (task) =>
              filterCategory === null || task.category === filterCategory,
          )
          .map((task, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#2a2a4e",
                padding: 12,
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              {editingIndex === index ? (
                // Edit mode — show input and save button
                <>
                  <View style={{ flex: 1 }}>
                    <input
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      style={{
                        width: "100%",
                        backgroundColor: "#1a1a2e",
                        color: "#fff",
                        padding: 6,
                        borderRadius: 6,
                        border: "none",
                        fontSize: 16,
                        outline: "none",
                      }}
                    />
                    {/* Category selector in edit mode */}
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 4,
                        marginTop: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                          key={cat.label}
                          onPress={() => setSelectedCategory(cat.label)}
                          style={{
                            backgroundColor:
                              selectedCategory === cat.label
                                ? "#e94560"
                                : "#2a2a4e",
                            padding: 4,
                            borderRadius: 8,
                          }}
                        >
                          <Text style={{ color: "#fff", fontSize: 10 }}>
                            {cat.emoji} {cat.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={saveEdit}
                    style={{ marginLeft: 8 }}
                  >
                    <Text style={{ color: "#00ff88", fontWeight: "bold" }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                // Normal mode — show task and action buttons
                <>
                  <TouchableOpacity onPress={() => toggleTask(index)}>
                    <Text
                      style={{
                        color: task.done ? "#888" : "#fff",
                        textDecorationLine: task.done ? "line-through" : "none",
                      }}
                    >
                      {task.done ? "✓ " : "○ "}{" "}
                      {CATEGORIES.find((c) => c.label === task.category)?.emoji}
                      {" " + task.title}
                    </Text>
                  </TouchableOpacity>
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity onPress={() => startEdit(index)}>
                      <Text style={{ color: "#aaaaff", fontWeight: "bold" }}>
                        Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteTask(index)}>
                      <Text style={{ color: "#e94560", fontWeight: "bold" }}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))}
      </ScrollView>
    </View>
  );
}
