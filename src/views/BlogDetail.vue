<template>
  <div>
    <!-- <vue-canvas-nest :config="config"></vue-canvas-nest> -->
    <Header></Header>
    <div class="mblog">
      <h2> {{ blog.title }}</h2>
      <!-- <span style="font-size: 14px; color: #626567;">作者：</span> -->
      <el-row :gutter="0">
        <el-col :span="1.5">
          <img :src="blogCreatorAvatar" width="42" height="42" @click="toProfile(blog.userId)" style="margin-left: 4px; vertical-align: middle; cursor: pointer; border-radius: 50%;"/>
        </el-col>
        <el-col :span="6">
          <span>
        
            <div class="span-line" style="font-size: 16px; font-weight:350; color: black; cursor: pointer; margin-left: 6px;" @click="toProfile">
            {{createUserInfo.name}}
            </div>
            <div style="font-size: 13px; font-weight:350; color: #626567; margin-left: 6px">{{blog.createTime}}</div>
          </span>
        </el-col>

      </el-row>
      
      <div v-if="ownBlog||admin">
        <br>
        <el-link icon="el-icon-edit">
          <router-link :to="{name: 'BlogEdit', params: {blogId: blog.id}}" >
          编辑
          </router-link>
        </el-link>
        <el-link v-if="favorite.indexOf(blog.id+'')!=-1" icon="el-icon-lollipop" style="margin-left: 14px" @click="rmFavorite(blog.id)">已收藏</el-link>
        <el-link v-else icon="el-icon-lollipop" style="margin-left: 14px" @click="addFavorite(blog.id)">收藏</el-link>

        <el-popover
          placement="bottom-start"
          width="100"
          v-model="visible"
          style="margin-left: 14px">
          <!-- <p></p> -->
          <div style="text-align: center; margin: 0">
            <el-link size="mini" type="text" @click="newClass" style="font-size: 14px">创建分类 | </el-link>
            <el-link type="primary" size="mini" @click="selectClass" style="margin-left: 4px; font-size: 14px"> 选择分类</el-link>
          </div>
          <el-link slot="reference" icon="el-icon-lollipop" style="">分类</el-link>
        </el-popover>

        <el-select v-if="isSelectClass" v-model="selectValue" placeholder="请选择分类" size="mini" style="margin-left: 18px">
          <el-option
            v-for="item in options"
            :key="item.label"
            :label="item.label"
            :value="item.value"> 
          </el-option>
        </el-select>
        

        <el-input v-if="isNewClass" v-model="selectValue" size="mini" placeholder="请输入内容" style="margin-left: 18px; width: 15%"></el-input>
        <el-link v-if="isSelectClass||isNewClass" style="margin-left: 14px" @click="submitClass">确定</el-link>
        <el-link icon="el-icon-edit" style="float: right;">
          <span @click="deleteBlog()">删除</span>
        </el-link>
      </div>
      <div v-if="!ownBlog">
        <br>
        <el-link v-if="favorite.indexOf(blog.id+'')!=-1" icon="el-icon-lollipop" @click="rmFavorite(blog.id)">已收藏</el-link>
        <el-link v-else icon="el-icon-lollipop" @click="addFavorite(blog.id)">收藏</el-link>
      </div>
      <el-divider></el-divider>
      <div class="markdown-body" v-html="blog.content"></div>
      <el-divider></el-divider>
      <Comment :comments="comments" @like="like" :key="refresh"></Comment><br>

      <el-pagination class="mpage"
                     background
                     layout="prev, pager, next"
                     :current-page="currentPage"
                     :page-size="pageSize"
                     :total="total"
                     @current-change=page>
      </el-pagination>

    </div>

  </div>
</template>

<script>
  import 'github-markdown-css'
  import Header from "../components/Header";
  import Comment from '../components/Comment'
  import vueCanvasNest from "vue-canvas-nest";
  
  export default {

    name: "BlogDetail.vue",
    components: {Header, Comment, vueCanvasNest},
    data() {
      return {
        refresh: 0,
        config: {
          color: "255,0,0",
          opacity: 1.3,
          zIndex: -100000,
          count: 150,
        },
        blogId: 0,
        total: 0,
        pageSize: 5,
        currentPage: 1,
        blog: {
          id: "",
          title: "",
          content: "",
          createUser: "",
          createTime: "",
        },
        comments: [],
        ownBlog: false,
        admin: false,
        createUserId: 0,
        createUserInfo: {
          name: "",
          avatar: "",
        },
        favorite: [],
        storeId: 0,
        hasLogin: false,
        blogCreatorAvatar: '',
        visible: false,
        isNewClass: false,
        isSelectClass: false,
        selectValue: '',
        options: [{
          value: '算法/数据结构',
          label: '算法/数据结构'
        },
        {
          value: 'Java',
          label: 'Java'
        },
        {
          value: 'Spring',
          label: 'Spring'
        },
        {
          value: 'SpringBoot',
          label: 'SpringBoot'
        },
        {
          value: 'Mysql',
          label: 'Mysql'
        },
        {
          value: 'Redis',
          label: 'Redis'
        },
        {
          value: '扯淡',
          label: '扯淡'
        },
        ],
      }
    },
    created() {
      this.checkLogin();
      this.blogId = this.$route.params.blogId;
      this.initFavorite();
      this.getBlog(this.blogId);
      this.page(1);
    },
    methods: {
      submitClass() {
        this.$axios.get("blog/editClass/" + this.blogId + '?class=' + this.selectValue).then(res => {
          this.$message.success("修改成功")
          this.isSelectClass = false;
          this.isNewClass = false;
        })
      },
      newClass() {
        this.isSelectClass = false;
        this.isNewClass = true;
        this.visible = false;
      },
      selectClass() {
        this.isNewClass = false;
        this.isSelectClass = true;
        this.visible = false;
      },
      checkLogin() {
        if (this.$store.getters.getUser.id) {
          this.storeId = this.$store.getters.getUser.id;
          this.hasLogin = true;
        }
      },
      addFavorite(blogId) {
        if(!this.hasLogin) {
          this.$message.error("请先登录")
        } else {
          this.$axios.get("blog/addFavorite?userId=" + this.storeId + "&blogId=" + blogId).then(res => {
            this.initFavorite();
          })
        }
      },
      rmFavorite(blogId) {
        if(!this.hasLogin) {
          this.$message.error("请先登录")
        } else {
          this.$axios.get("blog/rmFavorite?userId=" + this.storeId + "&blogId=" + blogId).then(res => {
            this.initFavorite();
          })
        }
      },
      async like(commentId, index) {
        await this.$axios.get('/like?targetId=' + commentId + '&likeUserId=' + this.storeId).then(res => {
          this.$axios.get('/like/count?' + 'commentId=' + commentId).then(res => {
            const i = res.data.data;
            const comment = this.comments[index];
            comment.likes = i;
            this.comments.splice(index,1,comment)
          })
        });
        this.refresh++;
      },
      toProfile(){
        this.$router.push({name: "Profile", params: {id: this.createUserId}})
      },
      page(currentPage){
        this.comments = [];
        this.$axios.get('/comment/' + this.blogId + "?currentPage=" + currentPage).then(res => {

          for (let i=0; i<res.data.data.records.length; i++){
            let comment = res.data.data.records[i]
            this.$axios.get('/user/getUser/'+comment.createUserId).then(res => {
              let avatar =  res.data.data.avatar;
              comment.createUser = res.data.data.username;
              if(avatar != '') {
                this.$axios.get("/file/getUrl/"+avatar).then(res =>{
                  comment.userAvatar = res.data.data;
                })
              } else {
                comment.userAvatar = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F02%2F63%2F69%2F59fc9e8a7a49e_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1643737983&t=20c09318fb5b88ccf706c093b748fcf1'
              }
            });
            this.$axios.get('/like/count?' + 'commentId=' + comment.id).then(res => {
              const count = res.data.data;
              this.comments[i].likes = count;
            })
            this.comments.push(comment)
          }
          this.currentPage = res.data.data.current
          this.total = res.data.data.total
          this.pageSize = res.data.data.size
        })    
      },
      async initFavorite() {
        if (this.hasLogin) {
          await this.$axios.get("/user/getFavorite/" + this.storeId).then(res => {
            this.favorite = res.data.data
          })
        }
      },
      async getBlog(blogId){
        await this.$axios.get('/blog/' + blogId).then(res => {
          const blog = res.data.data
          this.blog.id = blog.id
          this.blog.title = blog.title
          this.createUserId = blog.userId;
          this.blog.createTime = blog.created;
          // var MardownIt = require("markdown-it")
          // var md = new MardownIt({
          //   highlight: function (str, lang) {
          //     if (lang && hljs.getLanguage(lang))
          //     {
          //       try
          //       {
          //         return '<pre class="hljs"><code>' +
          //           hljs.highlight(lang, str, true).value +
          //           '</code></pre>';
          //       } catch (__) { }
          //     }
          //     return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
          //   }
          // });
          // var result = md.render(blog.content)
          // this.blog.content = result
          this.blog.content = blog.content;
          this.ownBlog = (blog.userId === this.storeId)

          this.$axios.get('/user/getUser/'+blog.userId).then(res => {
            let avatar =  res.data.data.avatar;
            if(avatar != '') {
              this.$axios.get("/file/getUrl/"+avatar).then(res =>{
                this.blogCreatorAvatar = res.data.data;
              })
            } else {
              this.blogCreatorAvatar = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F02%2F63%2F69%2F59fc9e8a7a49e_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1643737983&t=20c09318fb5b88ccf706c093b748fcf1'
            }
          });
        })
        this.getUserInfo();
      },
      getUserInfo(){
        this.$axios.get('/user/getUser/' + this.createUserId).then(res => {
          const user = res.data.data
          this.createUserInfo.name = user.username;
          this.createUserInfo.avatar = user.avatar;
        });
        if (this.hasLogin) {
          this.$axios.get('/user/getUser/' + this.storeId).then(res => {
            const storeUser = res.data.data;
            this.admin = storeUser.isAdmin === 9866;   
          });
        }
      },
      async deleteBlog(){
        await this.$confirm('确定删除吗?');
        this.$axios.get('/blog/delete/' + this.blog.id, {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
          this.$message('删除成功')
          // 保存记录
          this.$axios.get('/records/add/'+ this.storeId + '?type=deleteBlog')
          this.$router.go(-1)
        });
      },
    }
  }
</script>

<style scoped>
  .mblog {
    box-shadow: 0 2px 12px 0 rgba(5, 0, 0, 0.1);
    width:55%;
    min-height: 700px;
    padding: 20px 15px;
    margin: 0 auto;
  }
  .span-line:hover{
    text-decoration:underline;
  }

</style>