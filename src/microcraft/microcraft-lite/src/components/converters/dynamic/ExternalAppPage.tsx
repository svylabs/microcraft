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
import { FaChevronDown } from 'react-icons/fa';
// import { net } from "web3";

interface RecentApp {
  name: string;
  description: string;
  path: string;
  lastUsed: Date;
}

interface App {
  name: string;
  description: string;
  path: string;
}

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
  const [recentApps, setRecentApps] = useState<RecentApp[]>([]);
  const [appList, setAppList] = useState<any>({});
  // const [feedback, setFeedback] = useState(false);

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

  // Load recent apps from local storage on component mount
  useEffect(() => {
    const storedApps = localStorage.getItem("recentApps");
    const parsedApps: RecentApp[] = storedApps ? JSON.parse(storedApps) : [];
    setRecentApps(parsedApps);
  }, []);

  const onAppSelected = async (index: number) => {
    if (index >= appList.apps?.length) {
      return;
    }
    const app = appList.apps[index];
    if (app.path.startsWith("https://")) {
      //setExternalAppUrl(app.path);
      console.log("On app selected: loading: ", app.path);
      loadApp(app.path);
    } else {
      const slash = externalAppUrl.endsWith("/") ? "" : "/";
      loadApp(externalAppUrl + slash + app.path);
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
          for (let j = 0; j < component.events.length; j++) {
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

      const newApp: RecentApp = { name: appName, description: appDescription, path: localPath, lastUsed: new Date() };
      updateRecentApps(newApp);
    } catch (error) {
      console.error("Error loading external app: ", error);
      toast.error("Error loading external app. Please try again.");
    } finally {
      setLoading(false);
      setRunId(crypto.randomUUID());
    }
  }

  const loadAppList = async(data: any) => {
    if (data.type === 'list') {
       setAppList(data);
    }
  }

  const isEmpty = (str: string | null | undefined) => {
    if (str === undefined || str === null || str === "") {
      return true;
    }
    return false;
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
      //console.log("Loading ", path, "Repo parts", repoParts);
      if (repoParts.length >= 4) {
        if (repoParts.length > 4) {
          appPath = repoParts.slice(4).join("/");
          appPath += "/";
        }
        branch = repoParts[3];
      }
      let url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contents/" + appPath + "app.json";
      //console.log("Loading....", url);
      const data = await fetchGithubContent(url, branch);
      if (data.type === 'list') {
         loadAppList(data);
         //onAppSelected(0);
      } else {
        const appName = data.name;
        const appDescription = data.description;
        const components = data.components;
        const contractDetails = data.contracts || [];
        const networkDetails = data.networks || [];

        for (let i = 0; i < components.length; i++) {
          const component = components[i];
          if (component.type === "button") {
            if (component.codeRef !== undefined && isEmpty(component.code)) {
              const codeRefParts = component.codeRef.split("#");
              const relPath = codeRefParts[0];
              //const entryPoint = codeRefParts[1];
              let codeUrl = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contents/" + appPath + relPath;
              const data = await fetchGithubContent(codeUrl, branch, "str");
              component.code = data;
            }
          }
          if (component.events && component.events.length > 0) {
            for (let j = 0; j < component.events.length; j++) {
              const event = component.events[j];
              if (event.codeRef !== undefined && isEmpty(event.code)) {
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
          if (contract.abiRef !== undefined && isEmpty(contract.abi)) {
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
      }

      const newApp: RecentApp = { name: appName, description: appDescription, path: appPath, lastUsed: new Date() };
      updateRecentApps(newApp);
    } catch (error) {
      console.error("Error loading external app: ", error);
      toast.error("Error loading external app. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {

  }, [runId]);

  useEffect(() => {
    if (appList.apps?.length > 0) {
      onAppSelected(0);
    }
  }, [appList]);

  // Function to update recent apps in local storage
  const updateRecentApps = (newApp: RecentApp) => {
    const updatedApps = [newApp, ...recentApps.filter(app => app.path !== newApp.path)];
    if (updatedApps.length > 10) {
      updatedApps.pop(); // Remove the oldest app if more than 5
    }
    setRecentApps(updatedApps);
    localStorage.setItem("recentApps", JSON.stringify(updatedApps));
  };

  // Function to display recent apps
  const displayRecentApps = () => {
    console.log(recentApps);
    recentApps.map((app, index) => {
      console.log("app.name:- ", app.name + "app.description:- ", app.description + "app.path:- ", app.path);
    });
    return (
      <div className="recent-apps">
        <h3>Recently Opened Apps</h3>
        <ul>
          {recentApps.map((app, index) => (
            <li key={index}>
              <a href={app.path} target="_blank" rel="noopener noreferrer">
                {app.name} - {app.description}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // function submitFeedback() {
  //   setFeedback(false);
  //   window.location.href = "/";
  // }

  return (
    <>
      <div className="image-pdf px-4 min-h-[85.6vh] flex flex-col pb-10">
        <ToastContainer />
        <div className="flex flex-col lg:flex-row gap-5 text-xs md:text-base font-bold py-2 lg:mx-auto">
          <div className="relative flex">
            <input
              className="py-2 px-4 rounded border border-gray-300 focus:outline-none focus:border-blue-500 pr-12"
              type="text"
              size={80}
              placeholder="Enter github url of the app here"
              value={externalAppUrl}
              onChange={(e) => setExternalAppUrl(e.target.value)}
              id="output"
            />
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded"
              onClick={displayRecentApps}
            >
              <FaChevronDown className="text-slate-700" />
            </button>
          </div>
          <div className="mx-auto">
            <button
              className="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600"
              onClick={() => { setRunId(crypto.randomUUID()); setAppList({}); loadApp()} }
            >
              Load App
            </button>
          </div>
        </div>


        {(appList.apps?.length > 0) && (
          <AppCarousel name={appList.name} description={appList.description} apps={appList.apps} onAppSelected={onAppSelected} />
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
                whitelistedJSElements={{ fetch: fetch.bind(globalThis), alert: alert.bind(globalThis) }}
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
