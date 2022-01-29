import axios from 'axios'
import { PortalnesiaOptions } from './type'

export default function getAxiosInstance(opt?: PortalnesiaOptions['axios']) {
    return axios.create({
        timeout:10000,
        ...opt
    })
}
