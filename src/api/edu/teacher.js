import request from '@/utils/request'
const api_name = '/eduservice/teacher'
export default {
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/pageConditionTeacher/${page}/${limit}`,
      method: 'post',
      data: searchObj
    })
  },
  removeById(teacherId) {
    return request({
      url: `${api_name}/${teacherId}`,
      method: 'delete'
    })
  },
  save(teacher) {
    return request({
      url: `${api_name}/addTeacher`,
      method: 'post',
      data: teacher//使用data,会以json形式传给后端
    })
  },
  updateById(teacher){
    return request({
      url: `${api_name}/${teacher.id}`,
      method: 'put',
      data: teacher
    })
  },
  getById(id){
    return request({
      url: `${api_name}/getTeacherById/${id}`,
      method: "get"
    })
  },
  getList() {
    return request({
      url:`${api_name}/findAll`,
      method:"get"
    })
  }
}
