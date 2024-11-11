import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import "./index.css";
import { initializeApp } from "firebase/app";
import { Toaster } from "@/components/ui/toaster"

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_2F-iiJk0MydHD4PhVGp34QYqGPFM1Qc",
    authDomain: "react-login-sign-up-page-auth.firebaseapp.com",
    projectId: "react-login-sign-up-page-auth",
    storageBucket: "react-login-sign-up-page-auth.appspot.com",
    messagingSenderId: "274151294475",
    appId: "1:274151294475:web:fe7f16a519ccb7e9ed690e",
    measurementId: "G-PVQ8TFFT9P"
};

// Initialize Firebase
initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider>
            <App />
            <Toaster />
        </ThemeProvider>
    </React.StrictMode>
);