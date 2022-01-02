<template>
  <div>
    <Header></Header>
    <div class="mblog">
      <h2> {{ blog.title }}</h2>
      <span style="font-size: 14px; color: #626567;">作者：</span>
      <span class="span-line" style="font-size: 14px; color: #626567; cursor: pointer" @click="toProfile">{{createUserInfo.name}}</span>
      <span style="font-size: 14px; color: #626567; float: right">{{blog.createTime}}</span><br>
      <div v-if="ownBlog||admin">
        <br>
        <el-link icon="el-icon-edit">
          <router-link :to="{name: 'BlogEdit', params: {blogId: blog.id}}" >
          编辑
          </router-link>
        </el-link>
        <el-link icon="el-icon-edit" style="float: right;">
          <span @click="deleteBlog()">删除</span>
        </el-link>
      </div>
      <el-divider></el-divider>
      <div class="markdown-body" v-html="blog.content"></div>
      <el-divider></el-divider>
      <Comment :comments="comments"></Comment><br>

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

  export default {

    name: "BlogDetail.vue",
    components: {Header, Comment},
    data() {
      return {
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
      }
    },
    created() {
      this.blogId = this.$route.params.blogId;
      this.getBlog(this.blogId);
      this.page(1);
      
    },
    methods: {
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
            this.comments.push(comment)
          }
          this.currentPage = res.data.data.current
          this.total = res.data.data.total
          this.pageSize = res.data.data.size
          
        })    
        
        
      },
      async getBlog(blogId){
        await this.$axios.get('/blog/' + blogId).then(res => {
          const blog = res.data.data
          this.blog.id = blog.id
          this.blog.title = blog.title
          this.createUserId = blog.userId;
          this.blog.createTime = blog.created;
          var MardownIt = require("markdown-it")
          var md = new MardownIt()

          var result = md.render(blog.content)
          this.blog.content = result
          this.ownBlog = (blog.userId === this.$store.getters.getUser.id)
        })
        this.getUserInfo();
      },
      
      getUserInfo(){
        this.$axios.get('/user/getUser/' + this.createUserId).then(res => {
          const user = res.data.data
          this.createUserInfo.name = user.username;
          this.createUserInfo.avatar = user.avatar;
        });
        if (this.$store.getters.getUser.id) {
          this.$axios.get('/user/getUser/' + this.$store.getters.getUser.id).then(res => {
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