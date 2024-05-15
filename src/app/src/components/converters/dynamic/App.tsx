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
  const [allConfig, setAllConfig] = useState<any | null>(null);

  //   useEffect(() => {
  //     console.log("rohit", components);
  //     const walletComponent = components.find(
  //       (component) => component.walletConfig
  //     );
  //     console.log(walletComponent)

  //     if (walletComponent) {
  //       const config = walletComponent.walletConfig;
  //       console.log(config)

  //       if (typeof config === "string") {
  //         try {
  //           setAllConfig(JSON.parse(config));
  //         } catch (error) {
  //           console.error("Error parsing configurations:", error);
  //         }
  //       } else if (typeof config === "object") {
  //         setAllConfig(config);
  //       } else {
  //         console.warn("Configurations are not a valid string or object.");
  //       }
  //     }
  //   }, [components]);

  // useEffect(() => {
  //   if (
  //     allConfig &&
  //     allConfig.events &&
  //     allConfig.events.onLoad &&
  //     allConfig.events.onLoad.code
  //   ) {
  //     executeOnLoadCode();
  //   }
  // }, [allConfig]);

  // const executeOnLoadCode = async () => {
  //   const web3 = new Web3(window.ethereum);
  //   try {
  //     setLoading(true);
  //     const config = web3.config;
  //     const code = allConfig?.events?.onLoad?.code;
  //     const result = await eval(`(${code})()`);
  //     let vals = data;
  //     if (typeof result === "object") {
  //       for (const key in result) {
  //         vals[key] = result[key];
  //       }
  //       setData(vals);
  //     }
  //     setOutputCode(vals);
  //   } catch (error) {
  //     console.error("Error executing onLoad code:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    components.forEach((component) => {
      if (component.walletConfig) {
        executeOnLoadCode(component.walletConfig);
      }
      if (component.sliderConfig) {
        executeOnLoadCode(component.sliderConfig);
      }
      if (component.optionsConfig) {
        executeOnLoadCode(component.optionsConfig);
      }
    });
  }, [components]);

  const executeOnLoadCode = async (config) => {
    try {
      if (typeof config === "string") {
        config = JSON.parse(config);
      }
      if (config.events && config.events.onLoad && config.events.onLoad.code) {
        const web3 = new Web3(window.ethereum);
        setLoading(true);
        const result = await eval(`(${config.events.onLoad.code})()`);

        if (typeof result === "object") {
          setData(prevData => ({ ...prevData, ...result }));
          setOutputCode(prevOutputCode => ({ ...prevOutputCode, ...result }));
        }
      }

      //   let vals = data;
      //   if (typeof result === "object") {
      //     for (const key in result) {
      //       vals[key] = result[key];
      //     }
      //     setData(vals);
      //   }
      //   setOutputCode(vals);
      // }
      
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
