import { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity } from "react-native";


const WORK_TIME = 25 * 60; // 25 mins in secs

export default function Index() {
  const [seconds, setSeconds] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const IntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      IntervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <=1 ) {
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
    return () => clearInterval(IntervalRef.current!);
  }, [isRunning]);

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
              {isRunning ? "Pause" : "Start"}               
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
