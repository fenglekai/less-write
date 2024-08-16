import axios, { Canceler } from "axios";

const service = axios.create({
  timeout: 10000,
});
window._axiosPromiseArr = [];
service.interceptors.request.use(
  function (config: { cancelToken: any; }) {
    // 创建取消请求函数
    // eslint-disable-next-line import/no-named-as-default-member
    config.cancelToken = new axios.CancelToken((cancel) => {
      window._axiosPromiseArr?.push({ cancel });
    });
    return config;
  },
  function (error) {
    const responseData = error.response.data;
    console.error(responseData.msg);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  function (response) {
    const data = response.data.data;
    if (response.data instanceof Blob) {
      return response;
    }
    return data;
  },
  function (error) {
    // 默认请求超时响应
    if (
      error.code === "ECONNABORTED" ||
      error.message === "Network ERROR" ||
      error.message.includes("timeout")
    ) {
      console.error("请求超时响应");
    }
    // 业务请求失败响应
    if (error.response.data) {
      const responseData = error.response.data;
      console.error(
        responseData.msg ||
          responseData.mag ||
          responseData.message ||
          responseData
      );
      return Promise.reject(responseData);
    }

    return Promise.reject(error);
  }
);

// 取消请求
export const cancelRequest = () => {
  window._axiosPromiseArr?.forEach(
    (element: Element & { cancel: Canceler }, index: number) => {
      element.cancel("cancel");
      delete window._axiosPromiseArr[index];
    }
  );
};

export default service;