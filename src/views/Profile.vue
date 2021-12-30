<template>
  <div class="m-content">
    <el-page-header @back="goBack" content="个人主页">
    </el-page-header>

    <h3>欢迎来到树洞博客</h3><br>
    
    <span class="block">
      <el-upload 
        action="http://localhost:8081/file/upload"
        :data="extraData"
        :before-upload="beforeAvatarUpload"
        :on-success="success"
        :show-file-list="false">
        <el-avatar :size="50" :src="user.avatar"></el-avatar>
      </el-upload>
      <span v-if="hasLogin" style="font-size: 18px; color: dimgray; margin-left: 2%">@{{ user.username }}</span>
      <span v-else style="font-size: 18px; color: dimgray">@{{ user.username }}</span>
    </span>
    <el-link v-show="hasLogin" @click="showEdit" class="el-icon-edit" style="font-size: 13px; color: dimgray">编辑</el-link>
    
    <br>
    <div v-show="!edit"><br></div>

    <div v-show="edit">
      <!-- <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <el-button size="mini" type="primary">上传头像</el-button>
      </el-upload> -->
      <h1 style="margin-right: 11.8%; font-size: 13px; line-height: 6px">Name</h1>
      <el-input v-model="input" placeholder="请输入内容" style="width: 14%; margin: 0 auto" size="small"></el-input>
      <h1 style="margin-right: 12.8%; font-size: 12px; line-height: 6px">Bio</h1>
      <el-input v-model="input" placeholder="请输入内容" style="width: 14%" size="large"></el-input><br><br>
      <el-button size="mini" type="primary">确定</el-button>
      <el-button size="mini" @click="cancleEdit">取消</el-button><br><br>
    </div>

    <calendar-heatmap style="width: 52%" :endDate="today" :values="values"/><br><br>
    <h3 style="margin-right: 50.5%; font-size: 14px">Blogs</h3>
    <el-row :gutter="10" style="width: 55%; margin-left: 23%">
      <el-col :span="8" v-for="blog in blogs" :key="blog.id">
        <br>
        <el-card style="height: 160px" shadow="hover" :body-style="{ padding: '17px' }">
          <el-link @click="toBlog(blog.id)" style="color: #58A6FF; font-size: 11px; float:left; text-align: left">
            {{ blog.title }}
          </el-link><br><br>
          <div style="text-align: left; font-size: 0.1px;">{{blog.description.slice(0, 50) + (blog.description.length>50 ? '...' : '')}}</div>
          <br>
          <div style="margin-right: 138px; bottom: 1px">{{blog.created}}</div>
        </el-card>
      </el-col>
    </el-row><br><br><br>

    <el-pagination class="mpage"
                   background
                   layout="prev, pager, next"
                   :current-page="currentPage"
                   :page-size="pageSize"
                   :total="total"
                   @current-change=page>
    </el-pagination>
  </div>
</template>

<script>
  import { CalendarHeatmap } from 'vue-calendar-heatmap'
  import _ from 'lodash';
  export default {
    components: {
      CalendarHeatmap
    },
    data() {
      return {
        userId: '',
        avatar: '',
        extraData: {
          id: 0
        },
        edit: false,
        hasLogin: false,
        imageUrl: '',
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        values: [],
        currentPage: 1,
        today: new Date(),
        user: {
          username: '游客',
          avatar: ''
        },
        hasLogin: false,
        input: '',
        days: [],
        blogs: {},
        total: 0,
        pageSize: 6,
      }
    },
    methods: {
      beforeAvatarUpload(item){
        if(!this.$store.getters.getUser.username){
          this.$message.error("请先登陆")
        }else {
          const isJPG = item.type === 'image/jpeg' || item.type === 'image/png';
          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
            return isJPG
          }
          const userId = typeof this.$route.params.id === 'undefined' ? this.$store.getters.getUser.id : this.$route.params.id;
          this.extraData.id = userId;
        }
      },
      success(){
        this.$message("头像上传成功")
        this.initUser();
      },
      showEdit(){
        this.edit = !this.edit;
      },
      cancleEdit() {
        this.edit = false;
      },
      page(currentPage) {
        const userId = typeof this.$route.params.id === 'undefined' ? this.$store.getters.getUser.id : this.$route.params.id;
        this.$axios.get("/blogsByUserId/" + userId + '?currentPage=' + currentPage).then(res => {
          this.blogs = res.data.data.records;
          this.total = res.data.data.total;
          this.pageSize = res.data.data.size;
        })
      },
      toBlog(id) {
        this.$router.push({name: 'BlogDetail', params: {blogId: id}});
      },
      goBack() {
        this.$router.go(-1);
      },
      async initUser() {
        if(this.$store.getters.getUser.username) {
          this.userId = typeof this.$route.params.id === 'undefined' ? this.$store.getters.getUser.id : this.$route.params.id;
          await this.$axios.get("/user/getUser/" + this.userId).then(res => {
            this.user.username = res.data.data.username;
            this.avatar = res.data.data.avatar;
            
          });
          if(this.avatar != '') {
            this.$axios.get("/file/getUrl/"+this.avatar).then(res =>{
              this.user.avatar = res.data.data;
            })
          }
          this.hasLogin = true;
          this.initBlogs();
          this.getRecord();
        }
      },
      initBlogs(){
        this.$axios.get("/blogsByUserId/" + this.userId + '?currentPage=' + this.currentPage).then(res => {
          this.blogs = res.data.data.records;
          this.total = res.data.data.total;
          this.pageSize = res.data.data.size;
        });
      },
      calculateValue(value) {
        const valueExists = this.history[value];
        if (valueExists) {
          if (valueExists >= 10) {
            return '#1e6823'
          }
          if (valueExists >= 7 & valueExists < 10) {
            return '#44a340'
          }
          if (valueExists >= 4 & valueExists < 7) {
            return '#8cc665'
          }
          if (valueExists <= 3) {
            return '#d6e685'
          }
        }
        return '#eeeeee';
      },

      getRecord(){
        this.$axios.get("/records/" + this.userId).then(res => {
          res.data.data.forEach(i => {
            this.values.push({
              date: i.date,
              count: i.count
            })
          });
        });
      },
    },
    created() {
      this.initUser();
    }
  }
</script>

<style scoped>

  .m-content {
    max-width: 100%;
    margin: 0 auto;
    text-align: center;
  }
  .maction {
    margin: 10px 0;
  }
  .search {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  .el-row {
    margin-bottom: 20px;

  }
  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>