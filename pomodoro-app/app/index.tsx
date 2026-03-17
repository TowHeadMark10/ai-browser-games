import { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity } from "react-native";

// Total work time in seconds (25 min) 
const WORK_TIME = 25 * 60;
// Total break time in seconds (5 min)
const BREAK_TIME = 5 * 60;

export default function Index() {
  // Seconds remaining on the timer
  const [seconds, setSeconds] = useState(WORK_TIME);
  // Whether the timer is currently running
  const [isRunning, setIsRunning] = useState(false);
  // Whether we are in work mode or break mode
  const [isBreak, setisBreak] = useState(false);
  // Reference to the interval so we can cancel it later 
  const IntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start or stop the interval whenever isRunning changes
  useEffect(() => {
    if (isRunning) {
      IntervalRef.current = setInterval(() => {
        setSeconds((s) => {
          // When time runs out, switch modes automatically
          if (s <= 1 ) {
            clearInterval(IntervalRef.current!);
            setIsRunning(false);
            setisBreak((prev) => {
              // If we were on work, switch to break and vice versa
              const nextisBreak = !prev;
              setSeconds(nextisBreak ? BREAK_TIME : WORK_TIME);
              return nextisBreak;
            });
            return 0;
          }
          return s - 1;
        });
      },1000);
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

return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1a1a2e" 
  }}>       
        {/* Shows current mode: Work or Break */}
        <Text style={{ fontSize: 20, color: isBreak ? "#00ff88" : "#e94560", marginBottom: 16, fontWeight: "bold"}}>
          {isBreak ? "BREAK TIME" : "WORK TIME"}
        </Text>

        <Text style={{ fontSize: 72, color: "#ffffff", fontWeight: "bold", marginBottom: 40 }}>
          {formatTime(seconds)}                                                                            
        </Text>                                                                                            
                                                                                                           
        <View style={{ flexDirection: "row", gap: 16 }}>   
          {/* Start/Pause button - inverts isRunning state */}                                                
          <TouchableOpacity                                                                                
            onPress={() => setIsRunning(!isRunning)}        
            style={{ backgroundColor: "#e94560", padding: 16, borderRadius: 8, minWidth: 120, alignItems: "center" }}                                                                                              
          >                                                                                                
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>                             
              {isRunning ? "Pause" : "Start"}  {/* The Start/Pause botton - !isRunning inverts the state. If it's running it pauses it, if it's paused it starts it */}             
            </Text>                                                                                        
          </TouchableOpacity>

          {/* Reset button - goes back to work mode */}                                                                                                 
          <TouchableOpacity                                 
            onPress={reset}
            style={{ backgroundColor: "#444", padding: 16, borderRadius: 8, minWidth: 120, alignItems: "center" }}                                                                                              
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Reset</Text>                 
          </TouchableOpacity>                               
        </View>
      </View>
    );
  }                    
