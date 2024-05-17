import React, { useState, useEffect } from "react";
import Web3 from "web3";

interface Props {
  components: any[];
  data: { [key: string]: any };
  setData: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  setOutputCode: React.Dispatch<React.SetStateAction<any>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const App: React.FC<Props> = ({
  components,
  data,
  setData,
  setOutputCode,
  setLoading,
}) => {
  const [allConfig, setAllConfig] = useState<any | null>(null);


    useEffect(() => {
      console.log(components)
      components.forEach((component) => {
        if (component.events) {
          component.events.forEach((event) => {
            if (event.eventsCode) {
              executeOnLoadCode(event.eventsCode);
            }
          });
        }
      });
    }, [components]);

    const executeOnLoadCode = async (code) => {
      try {
        setLoading(true);
        const result = await eval(code);
        if (typeof result === "object") {
          setData((prevData) => ({ ...prevData, ...result }));
          setOutputCode((prevOutputCode) => ({ ...prevOutputCode, ...result }));
        }
      } catch (error) {
        console.error("Error executing onLoad code:", error);
      } finally {
        setLoading(false);
      }
    };

  return null; // doesn't render anything
};

export default App;
