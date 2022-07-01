import request from '@/utils/request'
const api_name = '/eduservice/subject/getSubjectTreeList'
export default {
  getNestedTreeList() {
    return request({
      url: `${api_name}`,
      method: 'get'
    })
  }
}
