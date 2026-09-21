import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import "./styles.css";
import { Story } from "./story/Story";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Story />
    <Analytics />
  </StrictMode>,
);
