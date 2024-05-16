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

//     useEffect(() => {
//       console.log("components", components);
//       const walletComponent = components.find(
//         (component) => component.currentEvents
//       );
//       console.log(walletComponent)

//       if (walletComponent) {
//         const config = walletComponent.currentEvents;
//         console.log(config)
//         console.log(typeof(config))
// // let rohit = eval(config.currentEvents.onLoad.code)
// // console.log(rohit)
//         if (typeof config === "string") {
//           try {
//             setAllConfig(JSON.parse(config));
//           } catch (error) {
//             console.error("Error parsing configurations:", error);
//           }
//         } else if (typeof config === "object") {
//           setAllConfig(config);
//         } else {
//           console.warn("Configurations are not a valid string or object.");
//         }
//       }
//     }, [components]);

//   useEffect(() => {
//     if (
//       allConfig &&
//       allConfig.events &&
//       allConfig.events.onLoad &&
//       allConfig.events.onLoad.code
//     ) {
//       executeOnLoadCode();
//     }
//   }, [allConfig]);

//   const executeOnLoadCode = async () => {
//     const web3 = new Web3(window.ethereum);
//     try {
//       setLoading(true);
//       const config = web3.config;
//       const code = allConfig?.events?.onLoad?.code;
//       const result = await eval(`(${code})()`);
//       let vals = data;
//       if (typeof result === "object") {
//         for (const key in result) {
//           vals[key] = result[key];
//         }
//         setData(vals);
//       }
//       setOutputCode(vals);
//     } catch (error) {
//       console.error("Error executing onLoad code:", error);
//     } finally {
//       setLoading(false);
//     }
//   };






  // useEffect(() => {
  //   components.forEach((component) => {
  //     if (component.currentEvents) {
  //       console.log("component.currentEvents:-> ", component.currentEvents)
  //       console.log(typeof component.currentEvents)
  //       executeOnLoadCode(component.currentEvents);
  //     }
  //     // if (component.walletConfig) {
  //     //   executeOnLoadCode(component.walletConfig);
  //     // }
  //     // if (component.sliderConfig) {
  //     //   executeOnLoadCode(component.sliderConfig);
  //     // }
  //     // if (component.optionsConfig) {
  //     //   executeOnLoadCode(component.optionsConfig);
  //     // }
  //   });
  // }, [components]);

  // const executeOnLoadCode = async (config) => {
  //   console.log(config)
  //   console.log(typeof config)
  //   try {
  //     if (typeof config === "string") {
  //       config = JSON.parse(config);
  //       console.log(config)
  //   console.log(typeof config)
  //     }
  //     if (config.onLoad && config.onLoad.code) {
  //       const web3 = new Web3(window.ethereum);
  //       setLoading(true);
  //       const code = config?.onLoad?.code;
  //       // const result = await eval(`(${config.onLoad.code})()`);
  //       const result = await eval(code);

  //       if (typeof result === "object") {
  //         setData(prevData => ({ ...prevData, ...result }));
  //         setOutputCode(prevOutputCode => ({ ...prevOutputCode, ...result }));
  //       }
  //     }

  //     //   let vals = data;
  //     //   if (typeof result === "object") {
  //     //     for (const key in result) {
  //     //       vals[key] = result[key];
  //     //     }
  //     //     setData(vals);
  //     //   }
  //     //   setOutputCode(vals);
  //     // }

  //   } catch (error) {
  //     console.error("Error executing onLoad code:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return null; // doesn't render anything
};

export default App;
