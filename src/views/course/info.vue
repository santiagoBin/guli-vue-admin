<template>
  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          @change="subjectLevelOneChanged"
          v-model="courseInfo.subjectParentId"
          placeholder="请选择">
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>


      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>
      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <Tinymce title="课程简介" :height="300" class="tinymce-container" v-model="courseInfo.description"></Tinymce>
      </el-form-item>
      <el-form-item label="课程封面">
        <el-upload
          class="cover-uploader"
          :action="BASE_API+'/eduoss/fileoss'"
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          >
          <img v-if="courseInfo.cover" :src="courseInfo.cover" class="cover">
          <i v-else class="el-icon-plus cover-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from '@/api/edu/course'
import subject from '@/api/subject/subject'
import teacher from "@/api/edu/teacher"
import Tinymce from "@/components/Tinymce"
const defaultForm = {
  id:'',
  title: '',
  subjectId: '',
  teacherId: '',
  lessonNum: 0,
  description: '',
  cover: '',
  price: 0,
  subjectParentId:''
}
export default {
  components:{
    Tinymce
  },
  data() {
    return {
      courseInfo: defaultForm,
      saveBtnDisabled: false, // 保存按钮是否禁用
      subjectNestedList: [],//一级分类列表
      subSubjectList: [],//二级分类列表
      teacherList: [] ,// 讲师列表
      BASE_API: process.env.VUE_APP_BASE_API, // 接口API地址
    }
  },

  watch: {
    $route(to, from) {
      console.log('watch $route')
      this.init()
    }
  },
  created() {
    console.log('info created')
    this.init()
  },
  methods: {
    init() {
      if (this.$route.params && this.$route.params.courseId) {
        const courseId = this.$route.params.courseId
        this.fetchCourseInfoById(courseId)
      } else {
        this.courseInfo = { ...defaultForm }
        // 初始化分类列表
        this.initSubjectList()
        // 获取讲师列表
        this.initTeacherList()
      }
    },
    next() {
      console.log('next')
      this.saveBtnDisabled = true
      if (!this.courseInfo.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    // 保存
    saveData() {
      course.saveCourseInfo(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        return response// 将响应结果传递给then
      }).then(response => {
        this.$router.push({ path: '/course/chapter/' + response.data.courseId
        })
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },
    updateData() {
      course.updateCourse(this.courseInfo).then(response=>{
        if (response.success === true){
          this.$message({
            type: 'success',
            message: response.message
          })
        }else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      }).catch(error=>{
        this.$message({
          type: 'error',
          message: error.message
        })
      })
      this.$router.push({ path: '/course/chapter/'+this.courseInfo.id })
    },
    initSubjectList() {
      subject.getNestedTreeList().then(response => {
        this.subjectNestedList = response.data.items
      })
    },
    subjectLevelOneChanged(value) {
      console.log(value)
      this.courseInfo.subjectParentId = value
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        if (this.subjectNestedList[i].id === value) {
          this.subSubjectList = this.subjectNestedList[i].children
          this.courseInfo.subjectId = ''
        }
      }
    },
    initTeacherList() {
      teacher.getList().then(response => {
        this.teacherList = response.data.items
      })
    },
    handleCoverSuccess(response) {
      if (response.success === true) {
        this.fileUploadBtnText = '导入成功'
        this.courseInfo.cover=response.data.url
        this.$message({
          type: 'success',
          message: response.message
        })
      }
    },
    beforeCoverUpload(file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt5M;
    },
    fetchCourseInfoById(id) {
      course.getCourseInfoByCourseId(id).then(responseCourse => {
        this.courseInfo = responseCourse.data.courseInfo
        // 初始化分类列表
        subject.getNestedTreeList().then(responseSubject => {
          this.subjectNestedList = responseSubject.data.items
          for (let i = 0; i < this.subjectNestedList.length; i++) {
            if (this.subjectNestedList[i].id === this.courseInfo.subjectParentId) {
              this.subSubjectList = this.subjectNestedList[i].children
            }
          }
        })
        // 获取讲师列表
        this.initTeacherList()
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },
  },
}
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
.cover-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.cover-uploader .el-upload:hover {
  border-color: #409EFF;
}
.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.cover {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
