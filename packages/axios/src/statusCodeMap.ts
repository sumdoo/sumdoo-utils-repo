const statusCodeMap = new Map();

statusCodeMap.set(404, () => '请求资源不存在!');
statusCodeMap.set(500, () => '内部错误，请稍后重试!');
statusCodeMap.set(502, () => '服务无响应,请稍后重试!');
statusCodeMap.set(503, () => '服务器正在维护，请稍后重试!');

export default statusCodeMap;
