import { BASE_API_URL } from "~/components/constants";

export const setSelectedApp = (appId, toast) => {
    fetch(`${BASE_API_URL}/appdata/set-selected-app`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       "credentials": "include"},
     body: JSON.stringify({selected_app: appId })
    }).then((response) => {
      if (response.ok) {
         console.log("App selected successfully");
      } else {
        if (toast) {
         toast.error("Error initializing the app - some features of the app may not function properly. Please refresh the page and try again.");
        }
      }
    })
 }

 export const isAuthenticated = () => {
    if (localStorage.getItem("userDetails")) { 
      return true;
    }
    return false;
 }