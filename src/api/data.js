import axios from 'axios'
import config from '@/config'
import md5 from 'js-md5'
const baseUrl =
  process.env.NODE_ENV === 'development'
    ? config.baseUrl.dev
    : config.baseUrl.pro
export const getComData = params => {
  var requestData = {
    ver: 3,
    sign: '',
    key: config.appKey,
    time: parseInt(new Date().getTime() / 1000),
    token: '123465798',
    auth: "superadmin"
  }
  for (const key in params) {
    requestData[key] = params[key]
  }
  requestData.sign = md5(requestData.time + config.appSecret)
  return new Promise((resolve, reject) => {
    axios.post(baseUrl, requestData).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export const login = ({ userName, password }) => {
  var requestData = {
    ver: 3,
    sign: 'ea6fe9b019d2f1872d51cbab125be13f',
    key: 1497318634,
    time: 1528342465,
    loginName: userName,
    password: password,
    method: 'login'
  }
  return axios.request({
    url: '',
    method: 'post',
    data: requestData
  })
}

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}
