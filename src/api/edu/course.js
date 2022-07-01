import request from '@/utils/request'
const api_name = '/eduservice/course'
export default {
  saveCourseInfo(courseInfo) {
    return request({
      url: `${api_name}/saveCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  getCourseInfoByCourseId(courseId){
    return request({
      url:`${api_name}/getCourseInfoByCourseId/${courseId}`,
      method:'get'
    })
  },
  updateCourse(courseInfo){
    return request({
      url:`${api_name}/updateCourse`,
      method:'post',
      data:courseInfo
    })
  },
  getCoursePublishInfoById(id) {
    return request({
      url: `${api_name}/coursePublishInfo/${id}`,
      method: 'get'
    })
  },
  publishCourse(id) {
    return request({
      url: `${api_name}/publishCourse/${id}`,
      method: 'put'
    })
  },
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  }
}
