<template>
  <div class="m-content">
    <vue-canvas-nest :config="config"></vue-canvas-nest>
    <el-page-header @back="goBack" content="个人主页">
    </el-page-header>

    <h3>欢迎来到树洞博客</h3><br>
    
    <span class="block">
      <el-upload 
        v-if="admin === 9866 || user.id === storeUserId"
        action="http://47.104.92.236:8081/file/upload"
        :data="extraData"
        :before-upload="beforeAvatarUpload"
        :on-success="success"
        :show-file-list="false">
        <el-avatar :size="65" :src="user.avatar"></el-avatar>
        <!-- <img class="avatar" :src="user.avatar" width="100" height="100" style="cursor: pointer; border-radius: 50%; border-bottom: 1px;"/> -->
      </el-upload>
      <div v-else>
        <el-avatar :size="65" :src="user.avatar"></el-avatar>
      </div>
      <span v-if="hasLogin" style="font-size: 18px; color: dimgray; margin-left: 2%">@{{ user.username }}</span>
      <span v-else style="font-size: 18px; color: dimgray">@{{ user.username }}</span>
    </span>
    <el-link v-show="hasLogin" @click="showEdit" class="el-icon-edit" style="font-size: 13px; color: dimgray" >编辑</el-link>
    
    <br>
    <div v-show="!edit"><br></div>

    <div v-show="edit">
      <h1 style="margin-right: 11.8%; font-size: 13px; line-height: 6px">Name</h1>
      <el-input v-model="inputUsername" placeholder="用户名" style="width: 14%; margin: 0 auto" size="small" @keyup.enter.native="editUsername"></el-input><br><br>
      <!-- <h1 style="margin-right: 12.8%; font-size: 12px; line-height: 6px">Bio</h1>
      <el-input v-model="input" placeholder="请输入内容" style="width: 14%" size="large"></el-input><br><br> -->
      <!-- <el-button size="mini" type="primary">确定</el-button>
      <el-button size="mini" @click="cancleEdit">取消</el-button><br><br> -->
    </div>

    <calendar-heatmap style="width: 52%" :endDate="today" :values="values"/><br><br>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 54.2%; margin-left: 23.4%">
      <el-tab-pane label="博客" name="first">
      </el-tab-pane>
      <el-tab-pane label="收藏博客" name="second">
      </el-tab-pane>
      <el-tab-pane v-if="user.id & user.id===1" label="关于我" name="third"></el-tab-pane>
      <!-- <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane> -->
    </el-tabs>
    <div v-if="showBlogs">
      <el-row :gutter="10" style="width: 55%; margin-left: 23%">
        <div v-if="!blogs.length>0">
          <br>
          <el-card style="width: 95%; margin: 0 auto">未发表博客</el-card>
          <br>
        </div>
        <el-col :span="8" v-for="blog in blogs" :key="blog.id">
          <br>
          <el-card style="height: 160px" shadow="hover" :body-style="{ padding: '17px' }">
            <el-link @click="toBlog(blog.id)" style="color: #58A6FF; font-size: 11px; float:left; text-align: left">
              {{ blog.title }}
            </el-link><br><br>
            <div style="text-align: left; font-size: 0.1px;">{{blog.description.slice(0, 50) + (blog.description.length>50 ? '...' : '')}}</div>
            <br>
            <div style="margin-right: 138px; bottom: 1px; color: gray;">{{blog.created}}</div>
          </el-card>
        </el-col>
      </el-row><br><br><br>

      <el-pagination class="mpage"
                    v-if="blogs.length>0"
                    background
                    layout="prev, pager, next"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :total="total"
                    @current-change=page>
      </el-pagination>
    </div>

    <div v-if="showFavorite">
      <el-row :gutter="10" style="width: 55%; margin-left: 23%">
        <div v-if="favorites.length===0">
          <br>
          <el-card style="width: 95%; margin: 0 auto">未收藏博客</el-card>
          <br>
        </div>
        <el-col :span="8" v-for="blog in favorites" :key="blog.id">
          <br>
          <el-card style="height: 160px" shadow="hover" :body-style="{ padding: '17px' }">
            <el-link @click="toBlog(blog.id)" style="color: #58A6FF; font-size: 11px; float:left; text-align: left">
              {{ blog.title }}
            </el-link><br><br>
            <div style="text-align: left; font-size: 0.1px;">{{blog.description.slice(0, 50) + (blog.description.length>50 ? '...' : '')}}</div>
            <br>
            <div style="margin-right: 138px; bottom: 1px; color: gray;">{{blog.created}}</div>
          </el-card>
        </el-col>
      </el-row><br><br><br>

      <el-pagination class="mpage"
                    v-if="favorites.length>0"
                    background
                    layout="prev, pager, next"
                    :current-page="currentPage2"
                    :page-size="pageSize2"
                    :total="total2"
                    @current-change=getFavorite>
      </el-pagination>
    </div>
    <span v-if="showAboutMe">
      <h1 style="font-size: 33px; margin-left: 18%; line-height: 1%">
        一位靓仔
        <i class="el-icon-cold-drink"></i>
        <el-button round style="margin-left: 10%" @click="showVideos">彩蛋点这里</el-button>
      </h1>
      <img :src=meUrl style="width: 26.5%">
    </span>

    <el-row :gutter="115" style="width: 50%; margin-left: 25%" v-if="showVideo">
      <el-col :span="12">
        <video-player class="video-player vjs-custom-skin" 
              ref="videoPlayer" 
              :playsinline="true" 
              :options="option1"
              >
        </video-player>
      </el-col>
      <el-col :span="12">
        <video-player class="video-player vjs-custom-skin" 
              ref="videoPlayer" 
              :playsinline="true" 
              :options="option2">
        </video-player>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { CalendarHeatmap } from 'vue-calendar-heatmap'
  import vueCanvasNest from "vue-canvas-nest";
  import _ from 'lodash';
  import { videoPlayer } from 'vue-video-player'
  import 'video.js/dist/video-js.css'
  export default {
    components: {
      CalendarHeatmap,
      vueCanvasNest,
      videoPlayer,
    },
    data() {
      return {
        activeName: 'first',
        showBlogs: true,
        showFavorite: false,
        config: {
          color: "255,0,0",
          opacity: 1.3,
          zIndex: 55,
          count: 88,
        },
        inputUsername: '',
        admin: 0,
        userId: '',
        avatar: '',
        extraData: {
          id: 0
        },
        edit: false,
        hasLogin: false,
        values: [],
        currentPage: 1,
        today: new Date(),
        user: {
          id: 0,
          username: '游客',
          avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F02%2F63%2F69%2F59fc9e8a7a49e_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1643737983&t=20c09318fb5b88ccf706c093b748fcf1',
        },
        storeUserId: '',
        hasLogin: false,
        input: '',
        days: [],
        blogs: {},
        total: 0,
        pageSize: 6,
        favorites: [],
        currentPage2: 1,
        total2: 0,
        pageSize2: 6,
        showAboutMe: false,
        showVideo: false,
        playerOptions: {
          playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
          autoplay: false, // 如果为true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 是否视频一结束就重新开始。
          preload: true, // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '9:16', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          poster: '', // 封面地址
          notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true, // 当前时间和持续时间的分隔符
            durationDisplay: true, // 显示持续时间
            remainingTimeDisplay: false, // 是否显示剩余时间功能
            fullscreenToggle: true // 是否显示全屏按钮
          }
        },
        option1: {},
        option2: {},
        meUrl: '',
      }
    },
    methods: {
      showVideos(){
        this.showAboutMe = false;
        this.showVideo = true
      },
      handleClick(tab) {
        if (tab.index === '0') {
          this.showBlogs = true;
          this.showFavorite = false;
          this.showAboutMe = false;
          this.showVideo = false;
        }
        if (tab.index === '1') {
          this.showBlogs = false;
          this.showFavorite = true;
          this.showAboutMe = false;
          this.showVideo = false;
        }
        if (tab.index === '2') {
          this.showBlogs = false;
          this.showFavorite = false;
          this.showVideo = false;
          this.showAboutMe = true;
          const url1 = 'kong.mp4';
          const url2 = 'yaoyuandeta.mp4';
          const picurl = 'me.JPG'
          this.$axios.get("/file/getUrl/"+url1).then(res =>{
            const rawUrl1 = res.data.data;
            this.option1 = {
              sources: [{
                type: "video/mp4", // 类型
                src: rawUrl1 // url地址
              }],
              ...this.playerOptions
            };
          });
          this.$axios.get("/file/getUrl/"+url2).then(res =>{
            const rawUrl2 = res.data.data;
            this.option2 = { 
              sources: [{
                type: "video/mp4", // 类型
                src: rawUrl2 // url地址
              }],
              ...this.playerOptions
            };
          });
          this.$axios.get("/file/getUrl/"+picurl).then(res =>{
            this.meUrl = res.data.data;
          });
        }
      },
      editUsername() {
        if(this.inputUsername.length<2){
          this.$message.error("账号长度至少两位")
        } else {
          const userId = this.$route.params.id ? this.$route.params.id : this.$store.getters.getUser.id;
          this.$axios.get("/user/editUsername/" + userId + "?username=" + this.inputUsername).then(res => {
            this.$alert('修改成功', '提示', {
              callback: action => {
                const userInfo = this.$store.getters.getUser;
                userInfo.username = this.inputUsername
                this.$store.commit("SET_USERINFO", userInfo)
                // 保存记录
                this.$axios.get('/records/add/'+ userId + '?type=editUsername')
                this.$router.go(0);
              }
            });
          })
        }
      },
      beforeAvatarUpload(item){
        if(!this.$store.getters.getUser.id){
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
        // 保存记录
        this.$axios.get('/records/add/'+ this.userId + '?type=editAvatar')

      },
      showEdit(){
        if (this.$store.getters.getUser.id != this.user.id){
          this.$message("非本人")
        } else {
          this.edit = !this.edit;
        }
      },
      cancleEdit() {
        this.edit = false;
      },
      page(currentPage) {
        const userId = typeof this.$route.params.id === 'undefined' ? this.$store.getters.getUser.id : this.$route.params.id;
        this.$axios.get("/blogsByUserId/" + userId + '?currentPage=' + currentPage).then(res => {
          const data = res.data.data;
          this.blogs = data.records;
          this.total = data.total;
          this.pageSize = data.size;
          this.currentPage = data.current;
        })
      },
      toBlog(id) {
        this.$router.push({name: 'BlogDetail', params: {blogId: id}});
      },
      goBack() {
        this.$router.go(-1);
      },
      async initUser() {
        if (typeof this.$route.params.id != 'undefined') {
          this.userId = this.$route.params.id;
        } else {
          if (this.$store.getters.getUser.id) {
            this.userId = this.$store.getters.getUser.id
          }
        }

        if (this.userId) {
          await this.$axios.get("/user/getUser/" + this.userId).then(res => {
            this.user.id = res.data.data.id;
            this.user.username = res.data.data.username;
            this.avatar = res.data.data.avatar;
            this.inputUsername = this.user.username;
          });
          if(this.avatar != '') {
            this.$axios.get("/file/getUrl/"+this.avatar).then(res =>{
              this.user.avatar = res.data.data;
            })
          } else {
            this.user.avatar = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F02%2F63%2F69%2F59fc9e8a7a49e_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1643737983&t=20c09318fb5b88ccf706c093b748fcf1'
          }

          if (this.$store.getters.getUser.id) {
            this.storeUserId = this.$store.getters.getUser.id;
            await this.$axios.get("/user/getUser/" + this.$store.getters.getUser.id).then(res => {
              this.admin = res.data.data.isAdmin;
            });      
          }
          this.hasLogin = true;
          this.getFavorite(1);
          this.initBlogs();
          this.getRecord();
        } 
      },
      getFavorite(currentPage) {
        this.$axios.get("/user/getFavorite/" + this.userId).then(res => {
          this.favorites = [];
          const favorite = res.data.data
          if (favorite.length != 0){
            this.$axios.post("blog/listByIds?currentPage=" + currentPage, favorite).then(res => {
              const data = res.data.data;
              this.total2 = data.total;
              this.pageSize2 = data.size;
              this.favorites = data.records;
              this.currentPage2 = data.current;
            })
          }
        })
      },
      initBlogs(){
        this.$axios.get("/blogsByUserId/" + this.userId + '?currentPage=' + this.currentPage).then(res => {
          const data = res.data.data;
          this.blogs = data.records;
          this.total = data.total;
          this.pageSize = data.size;
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
            this.values.push(i)
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