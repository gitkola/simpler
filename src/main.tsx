import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store/index";
import "./styles/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip"

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <TooltipProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </TooltipProvider>
  // </React.StrictMode>,
);
