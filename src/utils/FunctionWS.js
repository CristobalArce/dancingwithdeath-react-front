import axios from "axios";
class FunctionWS {

    getCitas(date) {
        return axios.get(`http://localhost:4000/API/DWD/CITA_POR_DIA/${date}`)
    }

    getHoras(date) {
        return axios.get(`http://localhost:4000/API/DWD/HORA_POR_FECHA/${date}`)
    }

    postProveedor(date) {
        return axios.post(`http://localhost:4000/API/DWD/ASIGNAR_CITA`, date)
    }

}

export default new FunctionWS();