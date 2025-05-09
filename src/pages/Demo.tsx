
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Smartphone } from "lucide-react";

const Demo = () => {
  const [steps, setSteps] = useState(16);
  const [unitType, setUnitType] = useState("m");
  const [jumpRating, setJumpRating] = useState("ok");
  
  // Sample poles data
  const poles = [
    "UCS Spirit 14'", 
    "Spirit 13'6\"", 
    "Pacer FX 14'",
    "Carbon FX 15'", 
    "Essx 13'6\""
  ];

  const handleStepChange = (change: number) => {
    setSteps(prev => Math.max(1, prev + change));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Try the Pole Vault Tracker Demo
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Experience how the app helps vaulters log and analyze their jumps
          </p>
          
          <div className="max-w-md mx-auto">
            {/* iPhone frame */}
            <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
              {/* iPhone notch */}
              <div className="absolute top-0 inset-x-0">
                <div className="mx-auto bg-black w-[40%] h-[25px] rounded-b-3xl"></div>
              </div>
              
              {/* iPhone screen */}
              <div className="w-full h-full bg-white overflow-y-auto p-4">
                {/* App header */}
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs text-gray-500">9:41 AM</div>
                  <div className="flex items-center">
                    <div className="w-4 h-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500">
                        <path fillRule="evenodd" d="M1.371 10.393c.58-1.735 1.502-3.346 2.707-4.734a1 1 0 0 1 1.497.117l2.913 3.597a1 1 0 0 1-.136 1.428 6 6 0 0 0-1.99 1.99 1 1 0 0 1-1.428.136L1.277 11.89a1 1 0 0 1 .094-1.498ZM20.922 10.393c-.58-1.735-1.502-3.346-2.707-4.734a1 1 0 0 0-1.497.117l-2.913 3.597a1 1 0 0 0 .136 1.428 6 6 0 0 1 1.99 1.99 1 1 0 0 0 1.428.136l3.657-2.937a1 1 0 0 0-.094-1.498Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M7.484 18.968a8.968 8.968 0 0 0 9.032 0 1 1 0 0 1 .496-.132H19a2 2 0 0 0 2-2v-3a1 1 0 0 0-.629-.928l-.385-.154a1 1 0 0 0-1.197.371 4 4 0 0 1-6.579 0 1 1 0 0 0-1.197-.37l-.385.154A1 1 0 0 0 10 13.965v4.87a1 1 0 0 0 1 1h.01a1 1 0 0 1 .474.132Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="w-4 h-4 ml-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500">
                        <path fillRule="evenodd" d="M3.75 6.75a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-.037c.856-.174 1.5-.93 1.5-1.838v-2.25c0-.907-.644-1.664-1.5-1.837V9.75a3 3 0 0 0-3-3h-15Zm15 1.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h15Z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-2">
                  {/* Jump form */}
                  <h2 className="text-2xl font-bold mb-1">Jump Details</h2>
                  <p className="text-sm text-gray-500 mb-4">Record the details of your jump</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Pole</label>
                      <Select defaultValue={poles[0]}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a pole" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Your Poles</SelectLabel>
                            {poles.map((pole) => (
                              <SelectItem key={pole} value={pole}>{pole}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Number of Steps</label>
                      <div className="flex items-center">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="h-10 w-10 p-0"
                          onClick={() => handleStepChange(-1)}
                        >
                          -
                        </Button>
                        <div className="h-10 w-20 flex items-center justify-center border-y border-input">
                          {steps}
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="h-10 w-10 p-0"
                          onClick={() => handleStepChange(1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium">Bar Height</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">Units:</span>
                          <span className="text-xs">m</span>
                          <Switch 
                            checked={unitType === "ft"} 
                            onCheckedChange={() => setUnitType(unitType === "m" ? "ft" : "m")}
                          />
                          <span className="text-xs">ft</span>
                        </div>
                      </div>
                      <Input 
                        type="text"
                        placeholder={`Height in ${unitType === "m" ? "meters (e.g., 4.75)" : "feet (e.g., 15.5)"}`}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Grip Height</label>
                      <Input type="text" placeholder={`Grip in ${unitType}`} />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Run Up Length</label>
                      <Input type="text" placeholder={`Length in ${unitType}`} />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Take Off</label>
                      <Input type="text" placeholder={`Distance in ${unitType}`} />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Mid Mark</label>
                      <Input type="text" placeholder={`Distance in ${unitType}`} />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Jump Rating</label>
                      <RadioGroup 
                        value={jumpRating} 
                        onValueChange={setJumpRating} 
                        className="flex justify-between"
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="run_thru" id="run_thru" />
                          <Label htmlFor="run_thru" className="text-sm text-red-500">Run Thru</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="glider" id="glider" />
                          <Label htmlFor="glider" className="text-sm text-orange-500">Glider</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="ok" id="ok" />
                          <Label htmlFor="ok" className="text-sm text-amber-500">OK</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="good" id="good" />
                          <Label htmlFor="good" className="text-sm text-green-500">Good</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="great" id="great" />
                          <Label htmlFor="great" className="text-sm text-blue-500">Great</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Jump Notes</label>
                      <Textarea placeholder="Add any notes about this jump (e.g., 'late plant', 'good takeoff')" />
                    </div>
                    
                    <div className="flex justify-between pt-2">
                      <Button variant="outline">Cancel</Button>
                      <Button className="px-6">Add Jump</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* iPhone home indicator */}
              <div className="absolute bottom-0 inset-x-0 h-[5px]">
                <div className="mx-auto bg-black w-[30%] h-[5px] rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Experience the Full App</h2>
            <p className="text-gray-600 mb-6">
              This is just one of many screens in the Pole Vault Tracker app. Download the full version to access all features 
              including analytics, video uploads, achievements and more.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2">
                <Smartphone className="w-5 h-5" /> Download Now
              </Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Demo;
