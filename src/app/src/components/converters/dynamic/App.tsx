import React, { useState, useEffect } from "react";
import Web3 from "web3";

interface Props {
  components: any[];
  data: { [key: string]: any };
  setData: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  setOutputCode: React.Dispatch<React.SetStateAction<any>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   handleRun: (code: string, data: { [key: string]: any }) => void;
}

const App: React.FC<Props> = ({
  components,
  data,
  setData,
  setOutputCode,
  setLoading,
//   handleRun,
}) => {
  const [walletConfig, setWalletConfig] = useState<any | null>(null);
  useEffect(() => {
    const walletComponent = components.find(
      (component) => component.walletConfig
    );

    if (walletComponent) {
      const config = walletComponent.walletConfig;

      if (typeof config === "string") {
        try {
          setWalletConfig(JSON.parse(config));
        } catch (error) {
          console.error("Error parsing configurations:", error);
        }
      } else if (typeof config === "object") {
        setWalletConfig(config);
      } else {
        console.warn("Configurations are not a valid string or object.");
      }
    }
  }, [components]);

  useEffect(() => {
    if (
      walletConfig &&
      walletConfig.events &&
      walletConfig.events.onLoad &&
      walletConfig.events.onLoad.code
    ) {
      executeOnLoadCode();
    }
  }, [walletConfig]);

  const executeOnLoadCode = async () => {
    const web3 = new Web3(window.ethereum);
    try {
      setLoading(true);
      const config = web3.config;
      const code = walletConfig?.events?.onLoad?.code;
      const result = await eval(`(${code})()`);
      let vals = data;
      if (typeof result === "object") {
        for (const key in result) {
          vals[key] = result[key];
        }
        setData(vals);
      }
      setOutputCode(vals);
    } catch (error) {
      console.error("Error executing onLoad code:", error);
    } finally {
      setLoading(false);
    }
  };


//   const handleRun = async (code: string, data: { [key: string]: any }) => {
//     const web3 = new Web3(window.ethereum);
//     try {
//       setLoading(true);
//       const config = web3.config;
//       const result = await eval(code);
//       let vals = { ...data }; // Clone data object to avoid mutating the original state
//       if (typeof result === "object") {
//         for (const key in result) {
//           vals[key] = result[key];
//         }
//         setData(vals);
//       }
//       console.log(vals);
//       console.log(result);
//       setOutputCode(vals);
//     } catch (error) {
//       console.error("Error: ", error); // Log the error for debugging
//       setOutputCode(`Error: ${error}`); // Set error message in output code
//     } finally {
//       setLoading(false); // Always set loading to false after execution
//     }
//   };

  return null; // doesn't render anything
};

export default App;
