import Axios, { AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { history } from 'umi';
import Env from '@/conf/env';
import { getLonginUser, setLonginUser, setRediectPath, User } from '@/session';

Axios.defaults.withCredentials = false;

Axios.defaults.timeout = 60000;

Axios.interceptors.request.use(
  (config: AxiosRequestConfig<any>) => {
    let user: User = getLonginUser();
    // console.log(user);
    if (config.headers) {
      config.headers['Authorization'] = user ? user.token! : '';
    }
    return config;
  },
  (err) => {
    console.error(err);
    return Promise.reject(err);
  },
);

Axios.interceptors.response.use(
  function (response) {
    if (response.data) {
      if (response.data.status === 0) {
        response.data = response.data.data;
      } else if (response.data.status === 1) {
        message.error(response.data.message);
        return Promise.reject(response.data.message);
      }
    }
    return response;
  },
  function (error) {
    console.log(error);
    if (Axios.isCancel('')) {
      return Promise.reject(error);
    } else {
      if (error.response) {
        if (error.response.status === 401) {
          const path = window.location.href.substring(
            window.location.href.indexOf('#') + 1,
          );
          setRediectPath(path);
          // history.push('/login');
          const user = getLonginUser();
          setLonginUser({ ...user, token: undefined });
          message.error('尚未登录或登录已过期，请重新登录!');
        } else if (error.response.status === 403) {
          message.error('权限不足!');
        } else if (error.response.status === 404) {
          message.error('404 Not Found');
        } else if (error.response.status === 500) {
          if (error.response.config.responseType === 'arraybuffer') {
            // 将ArrayBuffer转换回JSON
            const jsonBuffer = new Uint8Array(error.response.data).buffer;
            const jsonStr = new TextDecoder('utf-8').decode(jsonBuffer);
            const errorMsg = JSON.parse(jsonStr);
            message.error(errorMsg?.data?.message);
          } else {
            if (error.response.data?.data?.message) {
              message.error(error.response.data.data.message);
            } else {
              message.error('Server Exception');
            }
          }
        } else {
          message.error('Unchecked Status Code Error');
        }
      } else if (
        error.message &&
        error.message.toLowerCase().startsWith('error: timeout')
      ) {
        message.error('Server Timeout');
      } else if (
        error.message &&
        error.message.toLowerCase().startsWith('Network Error')
      ) {
        message.error('Network Error');
      } else {
        message.error('Not Error Response Error');
      }
      return Promise.reject(error);
    }
  },
);

let serverURL = Env.serverURL;
Axios.defaults.baseURL = serverURL;

export const POST = async <T>(uri: string, params: T) => {
  const res = await Axios.post(`${serverURL}${uri}`, params);
  return res.data;
};
export const GET = async <T>(uri: string, params?: T) => {
  const res = await Axios.get(`${uri}`, {
    params: params,
  });
  return res.data;
};

export const PUT = async <T>(uri: any, params: T) => {
  const res = await Axios.put(`${serverURL}${uri}`, params);
  return res.data;
};

export const DELETE = async <T>(uri: any, params: { vos: T[] }) => {
  const res = await Axios.delete(`${serverURL}${uri}`, {
    params: params,
  });
  return res.data;
};

export const PATCH = async <T>(uri: any, params: T) => {
  const res = await Axios.patch(`${serverURL}${uri}`, params);
  return res.data;
};

export const GET_DOWNLOAD = async (uri: any, downloadFileName?: string) => {
  await Axios.get(`${serverURL}${uri}`, { responseType: 'arraybuffer' }).then(
    (res) => {
      if (!downloadFileName) {
        if (!res.headers) {
          return Promise.reject('No Response Headers error');
        }
        let contentDisposition = res.headers['content-disposition'];
        // console.log(res.headers);
        if (!contentDisposition) {
          return Promise.reject(
            'Response Headers Error: No Content-Disposition Header',
          );
        }
        //content-disposition value is attachment;filename=xxx.xx
        let fileNameEncode;
        if (
          contentDisposition.indexOf('=') > 0 &&
          contentDisposition.indexOf('=') < contentDisposition.length
        ) {
          fileNameEncode = contentDisposition.substring(
            contentDisposition.lastIndexOf('=') + 1,
          );
        }
        if (!fileNameEncode || fileNameEncode.length < 1) {
          return Promise.reject(
            'Response Headers Error: Content-Disposition Header filename Is Empty',
          );
        }
        downloadFileName = decodeURI(fileNameEncode);
      }
      // 这里 data 是返回来的二进制数据
      var blob = new Blob([res.data], {
        type: 'application/x-msdownload;charset=UTF-8',
      });
      // 创建一个blob的对象链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // 把获得的blob的对象链接赋值给新创建的这个 a 链接
      link.setAttribute('download', downloadFileName); // 设置下载文件名
      document.body.appendChild(link);
      // 使用js点击这个链接
      link.click();
      document.body.removeChild(link);
    },
  );
};

const BaseAPI = {
  POST,
  GET,
  PUT,
  DELETE,
  PATCH,
  GET_DOWNLOAD,
};

export default BaseAPI;
