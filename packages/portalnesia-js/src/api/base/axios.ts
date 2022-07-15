import { PortalnesiaOptions } from './index'
/**
 * @module
 */
import axios from 'axios'

export default function getAxiosInstance(opt?: PortalnesiaOptions['axios']) {
    return axios.create({
        timeout:10000,
        ...opt
    })
}
