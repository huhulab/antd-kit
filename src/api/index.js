import axios from 'axios';
import cookie from 'react-cookie';
import { message } from 'antd';


const tokenKey = "X-Token";


function appendFiles(fd, name, files) {
  files.forEach(function(item) {
    if (item instanceof FileList) {
      var cnt = item.length;
      for (var i = 0; i < cnt; i++) {
        var file = item[i];
        fd.append(name, file);
      }
    } else if (item instanceof File) {
      fd.append(name, item);
    }
  });
}

function makeFormData(obj) {
  var fd = new FormData();
  Object.keys(obj).forEach(function(key) {
    var value = obj[key];
    /* console.log('fd.k-v: ', key, value); */
    if (value === undefined || value === null) {
      fd.append(key, '');
    } else if (value instanceof FileList) {
      // Append files
      appendFiles(fd, key, [value]);
    } else if (value instanceof Array && value.length > 0 && (value[0] instanceof FileList || value[0] instanceof File)) {
      // Append files
      appendFiles(fd, key, value);
    } else if (value === true || value === false) {
      // Boolean value
      fd.append(key, value ? 1 : 0);
    } else if (value instanceof Array) {
      value.forEach(function(item) {
        fd.append(key, item);
      });
    } else if (value instanceof Object) {
      fd.append(key, JSON.stringify(value));
    } else {
      fd.append(key, value);
    }
  });
  return fd
}


let defaults = {baseURL: ""};
function setAxiosDefaults(baseUrl) {
  defaults.baseURL = baseUrl;
}

function httpErrorCallback(resp) {
  console.error('axios Response:', resp);
  if (resp.data.message !== undefined) {
    message.error(`请求失败!: ${resp.data.message}`);
  } else if (resp.data !== undefined) {
    message.error(`请求失败!: ${resp.data}`);
  } else {
    message.error('请求失败!');
  }
}

function httpRequest(path, config) {
  if (config.headers === undefined) {
    config.headers = {};
  }
  config.headers['Content-Type'] = undefined;
  const token = cookie.load(tokenKey);
  if (token) {
    config.headers[tokenKey] = token;
  }
  config.url = defaults.baseURL + path;
  return axios(config);
}
/* Without data */
function httpGet(path, config) {
  if (config === undefined) {
    config = {};
  }
  config.method = 'get';
  return httpRequest(path, config);
}
function httpDelete(path, config) {
  if (config === undefined) {
    config = {};
  }
  config.method = 'delete';
  return httpRequest(path, config);
}
function httpHead(path, config) {
  if (config === undefined) {
    config = {};
  }
  config.method = 'head';
  return httpRequest(path, config);
}
/* With data */
function httpPost(path, data, config, isRawData) {
  if (config === undefined) {
    config = {};
  }
  config.method = 'post';
  config.data = isRawData ? JSON.stringify(data) : makeFormData(data);
  return httpRequest(path, config);
}
function httpPut(path, data, config, isRawData) {
  if (config === undefined) {
    config = {};
  }
  config.method = 'put';
  config.data = isRawData ? JSON.stringify(data) : makeFormData(data);
  return httpRequest(path, config);
}
function httpPatch(path, data, config, isRawData) {
  if (config === undefined) {
    config = {};
  }
  config.method = 'patch';
  config.data = isRawData ? JSON.stringify(data) : makeFormData(data);
  return httpRequest(path, config);
}


class PageQuery {
  constructor({page, perpage, filters, sort}) {
    this.page = page;
    this.perpage = perpage;
    this.filters = filters;
    this.sort = sort;
  }

  updateFilter(name, operation, value) {
    // console.log('updateFilter', name, operation, value);
    let newFilters = [];
    let matched = false;
    if ((operation == "ilike" || operation == "like")
    && (value !== undefined && value !== "")) {
      value = `%${value}%`;
    }

    this.filters.forEach(function(item) {
      if (item[0] === name && item[1] === operation) {
        matched = true;
        if (value !== undefined && value !== "") {
          newFilters.push([name, operation, value]);
        }
      } else {
        newFilters.push(item);
      }
    });

    if (!matched && value !== undefined && value !== "") {
      newFilters.push([name, operation, value]);
    }
    // console.log('newFilters:', newFilters);
    this.filters = newFilters;
  }

  updateSort(name, order) {
    let newSort = []
    let matched = false;
    this.sort.forEach(function(item) {
      if (item[0] === name) {
        matched = true;
        if (order !== undefined) {
          newSort.push([name, order]);
        }
      } else {
        newSort.push(item);
      }
    });
    if (!matched && order !== undefined) {
      newSort.push([name, order]);
    }
    this.sort = newSort;
  }

  toDict() {
    return {
      type: this.type,
      page: this.page,
      perpage: this.perpage,
      filters: this.filters,
      sort: this.sort,
    };
  }
}

class Resource {
  constructor(path) {
    this.path = path;
  }

  buildDownloadUrl(query, format="csv") {
    let q = query.toDict();
    q.page = 1;
    q.perpage = -1;
    const token = cookie.load(tokenKey);
    const params = {
      q: JSON.stringify(q),
      token: token,
      format: format,
    };
    const downloadUrl = axios.defaults.baseURL + this.path + '?' + queryString.stringify(params);

    return downloadUrl;
  }

  create(obj, isRawData) {
    // const path = this.path.replace(new RegExp('\\/$','g'), '');
    return httpPost(this.path, obj, {}, isRawData);
  }

  update(obj, isRawData) {
    return httpPut(this.path + obj.id, obj, {}, isRawData)
  }

  updateAll(ids, obj, isRawData) {
    return httpPut(this.path + ids.join(), obj, {}, isRawData)
  }

  delete(id) {
    return httpDelete(this.path + id);
  }

  deleteAll(ids) {
    return httpDelete(this.path + ids.join());
  }

  get(id) {
    return httpGet(this.path + id);
  }

  // var query = {
  //     type    : STRING,
  //     page    : NUMBER,
  //     perpage : NUMBER,
  //     filters : [[FIELD, OP, VALUE], [FIELD, OP, VALUE], ...],
  //     sort    : [[FIELD, ORDER], [FIELD, ORDER], ...]
  // };
  objects(query) {
    const q = query instanceof PageQuery ? query.toDict() : query;

    // const path = this.path.replace(new RegExp('\\/$','g'), '');
    return httpGet(this.path, {
      params: { q: JSON.stringify(q) },
    });
  }

  all(query) {
    if (query === undefined) {
      query = {};
    }
    query.page = 1;
    query.perpage = -1;
    return this.objects(query);
  }
}

export {
  tokenKey,
  makeFormData,
  setAxiosDefaults,
  httpErrorCallback, httpRequest,
  httpGet, httpPost, httpPut, httpDelete, httpHead, httpPatch,
  PageQuery,
  Resource
}
