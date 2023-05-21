import { message } from 'antd';
import { history } from 'umi';
import request from '@/utils/request';

function chooseRouterWithReturnCode(returnCode) {
    let path;
    switch (returnCode) {
      case -2:
        message.error('操作失败：没有操作权限');
        break;
      case -3:
        window.localStorage.removeItem('token');
        path = '/login';
        break;
      default:
        break;
    }
    return path;
  }

function commonRequest(url, data, shouldReturnError, method = 'POST') {
    return request(url, {
      method,
      body: data,
      
    })
      .then(response => {
        if (response && response.returnCode !== 0) {
          const curPath = window.location.href.split('/').pop();
          const route = chooseRouterWithReturnCode(response.returnCode);
          if (route && curPath !== route) {
            history.push(route);
          }
          return Promise.reject(response);
        }
        return response;
      })
      .catch(err => {
        if (!shouldReturnError) {
          message.destroy();
          message.error(`操作失败：${err.returnMessage || ''}`);
        }
        return Promise.reject(err);
      });
  }

  function graphqlRequest(data, shouldReturnError) {
    const url = `/graphql`

    
    return request(url, {
      method: 'POST',
      body: data,
      
      
    })
      .then(response => {
        if (response && response.returnCode !== 0) {
          const curPath = window.location.href.split('/').pop();
          const route = chooseRouterWithReturnCode(response.returnCode);
          if (route && curPath !== route) {
            history.push(route);
          }
          return Promise.reject(response);
        }
        return response;
      })
      .catch(err => {
        if (!shouldReturnError) {
          message.destroy();
          message.error(`操作失败：${err.returnMessage || ''}`);
        }
        return Promise.reject(err);
      });
  }

  export {
    commonRequest,
    graphqlRequest
  }