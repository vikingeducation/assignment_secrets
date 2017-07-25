const RequestsHelper = {};


RequestsHelper.requestsPath = () => '/requests';
RequestsHelper.newRequestPath = (id) => `/requests/${ id }`;
RequestsHelper.acceptRequestPath = (id) => `/requests/${ id }/accept`;
RequestsHelper.rejectRequestPath = (id) => `/requests/${ id }/reject`;


module.exports = RequestsHelper;