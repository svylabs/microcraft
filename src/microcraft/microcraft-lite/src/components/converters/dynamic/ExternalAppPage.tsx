import DynamicApp from '@svylabs/microcraft-lib';
import React, { useEffect, useState, useRef } from "react";
import "./ActionPage.scss";
import { redirect, useLocation, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
// import { BASE_API_URL } from "~/components/constants";
import Loading from "./loadingPage/Loading";
import App from "./Renderer/App";
import { randomUUID } from 'crypto';
import AppCarousel from './Carousel';
// import { net } from "web3";

interface Output {
  [key: string]: any;
}

const ExternalAppPage = () => {
  const location = useLocation();
  const [output, setOutput] = useState<any>(location?.state?.output || {});
  const queryParams = new URLSearchParams(location.search);
  const [components, setComponents] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [data, setData] = useState<{ [key: string]: any }>({});
  const [outputCode, setOutputCode] = useState<Output | string>();
  const [loading, setLoading] = useState(false);
  const [externalAppUrl, setExternalAppUrl] = useState("");
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [runId, setRunId] = useState("");
  // const [feedback, setFeedback] = useState(false);

  const apps = [
    {
        "name": "User Balances",
        "description": "Check the current status of the connected address in the protocol",
        "path": "https://github.com/svylabs/stablebase/tree/main/frontends/user-balances"
    },
    {
        "name": "Borrow",
        "description": "Borrow $DFID on StableBase",
        "path": "borrow/dist",
    },
    {
        "name": "Stake DFID",
        "description": "Stake $DFID to earn protocol rewards",
        "path": "stakeDFID/dist"
    },
    {
        "name": "Unstake DFID",
        "description": "Unstake $DFID from the protocol",
        "path": "unstakeDFID/dist"
    },
    {
        "name": "Repay $DFID",
        "description": "Repay borrowed $DFID",
        "path": "repay/dist"
    },
    {
        "name": "Close Safe",
        "description": "Close the safe and withdraw collateral",
        "path": "closeSafe"
    }
];

  const isAuthenticated = () => {
    if (localStorage.getItem("userDetails")) {
      return true;
    }
    return false;
  };

  const fetchGithubContent = async (url: string, branch: string, type: "json" | "str" = "json") => {
    //console.log(url);
    const contentUrl = url + ((branch !== undefined && branch !== "") ? "?ref=" + branch : "");
    console.log(contentUrl)
    const res = await fetch(contentUrl);
    const appRawData = await res.json();
    if (!res.ok) {
      toast.error("Error loading external app / functions");
      console.log(res);
      setLoading(false);
      return;
    }
    console.log(appRawData);
    if (type === "str") {
      return atob(appRawData.content);
    } else {
      const data = JSON.parse(atob(appRawData.content));
      return data;
    }
    return data;
  };

  useEffect(() => {
    const source = queryParams.get("source") || "";
    const urlPath = queryParams.get("path") || "";
    console.log(source, urlPath);
    if (source === "github" && urlPath !== undefined) {
      setExternalAppUrl(urlPath);
      loadApp(urlPath);
    }
    if (source === "local") {
      loadAppFromLocal(urlPath);
    }
  }, []);

  const onAppSelected = async (index: number) => {
    const app = apps[index];
    if (app.path.startsWith("https://")) {
      //setExternalAppUrl(app.path);
      loadApp(app.path);
    } else {
      loadApp(externalAppUrl + app.path);
    }
  }

  const loadAppFromLocal = async (localPath) => {
    setLoading(true);
    setData({});
    try {
      if (!localPath) {
        setLoading(false);
        return;
      }
      let url = "/applet/app.json";
      const data = await (await fetch(url + "?base_path=" + localPath)).json();
      const appName = data.name;
      const appDescription = data.description;
      const components = data.components;
      const contractDetails = data.contracts || [];
      const networkDetails = data.networks || [];

      for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (component.type === "button") {
          if (component.codeRef !== undefined) {
            const codeRefParts = component.codeRef.split("#");
            const relPath = codeRefParts[0];
            //const entryPoint = codeRefParts[1];
            let codeUrl = `/applet/files?base_path=${localPath}&file_path=${relPath}`
            const data = await (await fetch(codeUrl)).text();
            component.code = data;
          }
        }
        if (component.events && component.events.length > 0) {
          for (let j=0; j<component.events.length; j++) {
            const event = component.events[j];
            if (event.codeRef !== undefined) {
              const codeRefParts = event.codeRef.split("#");
              const relPath = codeRefParts[0];
              //const entryPoint = codeRefParts[1];
              let codeUrl = `/applet/files?base_path=${localPath}&file_path=${relPath}`
              const data = await (await fetch(codeUrl)).text();
              event.code = data;
            }
          }
        }
      }
      for (let i = 0; i < contractDetails.length; i++) {
        const contract = contractDetails[i];
        if (contract.abiRef !== undefined) {
          const codeRefParts = contract.abiRef.split("#");
          const relPath = codeRefParts[0];
          //const entryPoint = codeRefParts[1];
          let codeUrl = `/applet/files?base_path=${localPath}&file_path=${relPath}`
          const data = await (await fetch(codeUrl)).json();
          contract.abi = data;
        }
      }
      setAppDescription(appDescription);
      setAppName(appName);
      setComponents(components);
      setContracts(contractDetails);
      setNetworks(networkDetails);
    } catch (error) {
      console.error("Error loading external app: ", error);
      toast.error("Error loading external app. Please try again.");
    } finally {
      setLoading(false);
      setRunId(crypto.randomUUID());
    }
  }

  const loadApp = async (appPath?: string) => {
    setLoading(true);
    setData({});
    const path = appPath || externalAppUrl;
    try {
      if (!path) {
        setLoading(false);
        return;
      }
      if (path.indexOf("github.com/") === -1) {
        toast.error("Please enter a valid github url");
        setLoading(false);
        return;
      }
      const parts = path.split("github.com/");
      const repoParts = parts[1].split("/");
      const repoOwner = repoParts[0];
      const repoName = repoParts[1];
      let appPath = "";
      let branch = "";
      if (repoParts.length >= 4) {
        if (repoParts.length > 4) {
          appPath = repoParts.slice(4).join("/");
          appPath += "/";
        }
        branch = repoParts[3];
      }
      let url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contents/" + appPath + "app.json";
      const data = await fetchGithubContent(url, branch);
      const appName = data.name;
      const appDescription = data.description;
      const components = data.components;
      const contractDetails = data.contracts || [];
      const networkDetails = data.networks || [];

      for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (component.type === "button") {
          if (component.codeRef !== undefined) {
            const codeRefParts = component.codeRef.split("#");
            const relPath = codeRefParts[0];
            //const entryPoint = codeRefParts[1];
            let codeUrl = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contents/" + appPath + relPath;
            const data = await fetchGithubContent(codeUrl, branch, "str");
            component.code = data;
          }
        }
        if (component.events && component.events.length > 0) {
          for (let j=0; j<component.events.length; j++) {
            const event = component.events[j];
            if (event.codeRef !== undefined) {
              const codeRefParts = event.codeRef.split("#");
              const relPath = codeRefParts[0];
              //const entryPoint = codeRefParts[1];
              let codeUrl = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contents/" + appPath + relPath;
              const data = await fetchGithubContent(codeUrl, branch, "str");
              event.code = data;
            }
          }
        }
      }
      for (let i = 0; i < contractDetails.length; i++) {
        const contract = contractDetails[i];
        if (contract.abiRef !== undefined) {
          const codeRefParts = contract.abiRef.split("#");
          const relPath = codeRefParts[0];
          //const entryPoint = codeRefParts[1];
          let codeUrl = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contents/" + appPath + relPath;
          const data = await fetchGithubContent(codeUrl, branch, "json");
          contract.abi = data;
        }
      }
      setAppDescription(appDescription);
      setAppName(appName);
      setComponents(components);
      setContracts(contractDetails);
      setNetworks(networkDetails);
    } catch (error) {
      console.error("Error loading external app: ", error);
      toast.error("Error loading external app. Please try again.");
    } finally {
      setLoading(false);
      setRunId(crypto.randomUUID());
    }
  }

  useEffect(() => {
  }, [runId]);

  // function submitFeedback() {
  //   setFeedback(false);
  //   window.location.href = "/";
  // }

  return (
    <>
      <div className="image-pdf px-4 min-h-[85.6vh] flex flex-col pb-10">
        <ToastContainer />
        <div className="flex flex-col lg:flex-row gap-5 text-xs md:text-base font-bold py-2 lg:mx-auto">
          <input
            className="py-2 px-4 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            type="text"
            size={80}
            placeholder="Enter github url of the app here"
            value={externalAppUrl}
            onChange={(e) => setExternalAppUrl(e.target.value)}
            id="output"
          />
          <div className="mx-auto">
            <button
              className="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600"
              onClick={() => loadApp()}
            >Load App</button>
          </div>
        </div>

        {(apps.length > 0) && (
          <AppCarousel apps={apps} onAppSelected={onAppSelected} />
        )}

        <div className=" bg-gray-100 shadow-lg rounded-md flex flex-col gap-5 p-2 pt-3 md:p-3 lg:pt-8 lg:p-6 lg:mx-20 xl:mx-40">
          {(output.approval_status || "pending") === "pending" && (
            <div className="bg-yellow-200 text-yellow-800 p-2 rounded-md md:text-sm flex justify-center items-center animate-pulse">
              <p>
                <span className="font-bold text-lg mr-2">⚠️ Caution:</span>
                This is an external app, use it at your own risk.
              </p>
            </div>
          )}
          <div className="px-2 text-wrap">
            <div className="flex flex-col md:flex-row md:justify-between mb-4 md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto">
              <h1 className="font-semibold text-lg md:text-xl">{appName}</h1>
              <h3 className="text-sm md:text-base lg:text-lg">{appDescription}</h3>
            </div>
            {(components.length > 0) && (
              // <App
              //   components={components}
              //   data={data}
              //   setData={setData}
              //   contracts={contracts || []}
              //   networks={networks || []}
              //   debug={setOutputCode}
              // />
              <DynamicApp
                runId={runId}
                components={components}
                updateData={setData}
                contracts={contracts || []}
                networks={networks || []}
                debug={setOutputCode}
                whitelistedJSElements={{fetch: fetch.bind(globalThis), alert: alert.bind(globalThis)}}
              />
            )}
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
};

export default ExternalAppPage;
