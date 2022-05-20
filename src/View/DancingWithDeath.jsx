import React from "react";
import TomasDeCitas from "./components/TomasDeCitas";
import logo from "./../Assets/logo.jpg"
import '../index.css'


export default function DancingWithDeath(props) {
    
    return(
        <div className="h-[100vh] w-[100vw] bg-gray-100">
            <div className="rounded-b-lg bg-red-500 h-[200px] grid-cols-2 p-5 shadow-md">
                <div className="grid place-content-center"><img alt="Dancing With Death" className="h-[70px] w-[70px] rounded-full" src={logo}></img></div>
                <div className="grid place-content-center"><span className="text-5xl font-bold text-white">Dancing With Death</span></div>
            </div>
            <TomasDeCitas></TomasDeCitas>
        </div>
    );
}