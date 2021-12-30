<template>
  <div>
    <Header></Header>
    <div class="mblog">
      <h2> {{ blog.title }}</h2>
      <el-link icon="el-icon-edit" v-if="ownBlog||admin">
        <router-link :to="{name: 'BlogEdit', params: {blogId: blog.id}}" >
        编辑
        </router-link>
      </el-link>
      <el-link icon="el-icon-edit" v-if="ownBlog||admin" style="float: right;">
        <span @click="deleteBlog()">删除</span>
      </el-link>
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
      page(currentPage){
        this.comments = [];
        this.$axios.get('/comment/' + this.blogId + "?currentPage=" + currentPage).then(res => {
          for (let i=0; i<res.data.data.length; i++){
            let comment = res.data.data[i]
            this.$axios.get('/user/getUserByName/'+comment.createUser).then(res => {
              let avatar =  res.data.data.avatar;
              if(avatar != '') {
                this.$axios.get("/file/getUrl/"+avatar).then(res =>{
                  comment.userAvatar = res.data.data;
                })
              }else {
                comment = ''
              }
            });
            this.comments.push(comment)
          }
          console.log(this.comments)

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
        this.admin = this.$store.getters.getUser.isAdmin === 1;
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

</style>