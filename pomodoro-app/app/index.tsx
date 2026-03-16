import { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity } from "react-native";

// Total work time in seconds (25 min) 
const WORK_TIME = 25 * 60;

export default function Index() {
  // Seconds remaining on the timer
  const [seconds, setSeconds] = useState(WORK_TIME);
  // Whether the timer is currently running
  const [isRunning, setIsRunning] = useState(false);
  // Reference to the interval so we can cancel it later 
  const IntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start or stop the interval whenever isRunning changes
  useEffect(() => {
    if (isRunning) {
      IntervalRef.current = setInterval(() => {
        setSeconds((s) => {
          // Stop automatically when time runs out
          if (s <= 1 ) {
            clearInterval(IntervalRef.current!);
            setIsRunning(false);
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

  function reset() {
    setIsRunning(false);
    setSeconds(WORK_TIME);
  }

return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1a1a2e" 
  }}>                                                                                                      
        <Text style={{ fontSize: 72, color: "#ffffff", fontWeight: "bold", marginBottom: 40 }}>
          {formatTime(seconds)}                                                                            
        </Text>                                                                                            
                                                                                                           
        <View style={{ flexDirection: "row", gap: 16 }}>                                                   
          <TouchableOpacity                                                                                
            onPress={() => setIsRunning(!isRunning)}        
            style={{ backgroundColor: "#e94560", padding: 16, borderRadius: 8, minWidth: 120, alignItems:  
  "center" }}                                                                                              
          >                                                                                                
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>                             
              {isRunning ? "Pause" : "Start"}  {/* The Start/Pause botton - !isRunning inverts the state. If it's running it pauses it, if it's paused it starts it */}             
            </Text>                                                                                        
          </TouchableOpacity>
                                                                                                           
          <TouchableOpacity                                 
            onPress={reset}
            style={{ backgroundColor: "#444", padding: 16, borderRadius: 8, minWidth: 120, alignItems: 
  "center" }}                                                                                              
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Reset</Text>                 
          </TouchableOpacity>                               
        </View>
      </View>
    );
  }                    
