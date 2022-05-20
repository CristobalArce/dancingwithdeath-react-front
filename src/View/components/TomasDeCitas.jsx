import React, { useEffect } from "react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { SpinnerRound } from 'spinners-react';

import "react-datepicker/dist/react-datepicker.css";
import FunctionWS from "../../utils/FunctionWS";

export default function TomasDeCitas(params) {
    const [startDate, setStartDate] = useState(new Date());
    const [selectHoras, setSelectHoras] = useState([]);
    const [response, setResponse] = useState('');

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState(true);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(true);
    const [hora, setHora] = useState('');

    const [save, setSave] = useState(false);

    const horas = ['09:00:00','10:00:00','11:00:00','12:00:00','13:00:00','14:00:00','15:00:00','16:00:00','17:00:00','18:00:00']

    function changeEmail(event) {
        setEmail(event.target.value)
        const expression = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
        if (!expression.test(String(event.target.value).toLowerCase()) && event.target.value.trim().length > 0) {
            setEmailError(true)
        } else {
            setEmailError(false)
        }
    }

    function changeName(event) {
        setName(event.target.value);

        if (event.target.value.trim().length > 0 && event.target.value.trim().length < 12) {
            const expression = /^[A-Za-z0-9_ áéíóúñÑàèìòùÀÈÌÒÙ]*$/;
            if (!expression.test(String(event.target.value).toLowerCase())) {
              setNameError(true);
            } else {
              setNameError(false);
            }
        } else {
            setNameError(true);
        }
    }

    function changeDate(date) {
        setStartDate(date)
        getCitas(date)
    }

    async function getCitas(date) {
        let fecha = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        let response = await FunctionWS.getCitas(fecha)
        getHorasPorFechas(fecha);
        setResponse(response)
    }

    async function getHorasPorFechas(date){
        let response = await FunctionWS.getHoras(date)
        setSelectHoras([])
        horas.map((horaA)=>{
            let flag = false;
            
            response.data.data.map((horaB)=>{
                if((horaA) === horaB.ntime){
                    flag = true
                    
                }
            })

            if(flag === false){
                setSelectHoras(oldArray => [...oldArray, horaA]);
            }
        })
    }

    function changeHora(event) {
        setHora(event.target.value);
    }

    async function insertDate() {
        let obj = {
            SNAME: name,
            DDATE: startDate.getFullYear()+'-'+(startDate.getMonth()+1)+'-'+startDate.getDate(),
            NTIME: hora,
            SCONTACT: email,
        }
        await FunctionWS.postProveedor(obj)

        getCitas(startDate);
        getHorasPorFechas(startDate);
        setSave(true)
        setEmail('')
        setName('')
        setHora("")
        setEmailError(true)
        setName(true)
        setTimeout(()=>{
            setSave(false)
        }, 5000);
    }

    useEffect(()=>{
        getCitas(startDate);
    },[])
    
    return(
        <div className="grid absolute top-[410px] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-lg bg-white h-[75vh] w-[85vw] shadow-2xl">
                
                <div className="px-5 pt-5 grid grid-cols-5 gap-x-5 h-[20vh]">
                
                    <div>
                        <span className="font-bold">Selecciona fecha de cita</span>
                        <div className="border-current border-2 w-auto">
                            <DatePicker dateFormat="MMMM d, yyyy" className="w-[100%]" minDate={new Date()} selected={startDate} onChange={(date) => changeDate(date)} />
                        </div>
                    </div>

                    <div>
                        <span className="font-bold">Horas disponibles</span>
                        <div className="border-current border-2 w-auto">
                            <select value={hora} onChange={(event)=>changeHora(event)} className="w-[100%] bg-white">
                                <option value="">Selecciona una hora</option>
                                {
                                    selectHoras.map((hora)=>{
                                        return(<option value={hora}>{hora}</option>)
                                    })
                                }
                            </select>
                        </div>
                        {
                            hora===""?<span className="font-bold text-red-500">Formato incorrecto</span>:<></>
                        }
                    </div>

                    <div>
                        <span className="font-bold">Nombre</span>
                        <div className="border-current border-2 w-auto">
                            <input onChange={(event)=>changeName(event)} className="w-[100%]" placeholder="Ingresa tu nombre" value={name}></input>
                        </div>
                        {
                            nameError?<span className="font-bold text-red-500">Formato incorrecto</span>:<></>
                        }
                    </div>

                    <div>
                        <span className="font-bold">Correo electronico</span>
                        <div className="border-current border-2 w-auto">
                            <input className="w-[100%]" onChange={(event)=>changeEmail(event)} placeholder="E-mail" value={email}></input>
                        </div>
                        {
                            emailError?<span className="font-bold text-red-500">Formato incorrecto</span>:<></>
                        }
                    </div>

                    <div>
                        <button disabled={nameError || emailError || hora===""} onClick={()=>insertDate()} className="mt-6 hover:border-red-600 hover:bg-red-600 border-red-500 border-2 w-[100%] bg-red-500 text-white font-bold  disabled:opacity-75"> Crear Cita </button>
                    </div>
                    
                    <div className="col-span-4 text-center font-bold text-green-500">
                        {
                            save?<span>Se creo la Cita</span>:<></>
                        }
                    </div>
                    
                </div>
                
                <div className="h-1 w-[auto] bg-gray-100"></div>

                <div className="grid grid-cols-4 h-[50vh] border-2 border-gray-500 m-5">

                   <>
                        {
                            response===''?
                            <><SpinnerRound></SpinnerRound></>
                            :
                            <>
                                {
                                    
                                    horas.map((horaA)=>{
                                            let flag = false;
                                            let horaBase
                                            response.data.data.map((horaB)=>{
                                                if((horaA) === horaB.ntime){
                                                    flag = true
                                                    horaBase = horaB
                                                }
                                            })
                                            console.log(horaBase);
                                            if(flag === false){
                                                return(
                                                <div className="bg-gray-100 h-[100%] min-h-[100px] w-[100%] border-2 border-gray-500 grid-cols-1 grid place-content-center text-center">
                                                    <div>{horaA}</div>
                                                    <div>Hora Disponble</div>
                                                </div>)
                                            }else{
                                                return(
                                                    <div className="bg-green-100 h-[100%] min-h-[100px] w-[100%] border-2 border-gray-500 grid-cols-1 grid place-content-center text-center">
                                                        <div>{horaBase.ntime}</div>
                                                        <div>{horaBase.sname}</div>
                                                        <div>{horaBase.scontact}</div>
                                                    </div>
                                                                                )
                                            }
                                        })
                                }
                            </>
                        }
                   </>

                    
                    <div className="h-[100%] w-[100%] border-2 border-gray-500 bg-gray-200">
                        
                    </div>

                    <div className="h-[100%] w-[100%] border-2 border-gray-500 bg-gray-200">
                        
                    </div>

                </div>

            </div>
        </div>
    );
}