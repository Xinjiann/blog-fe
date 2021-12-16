<template>
  <div>
    <Header></Header>
    <div class="mblog">
      <h2> {{ blog.title }}</h2>
      <el-link icon="el-icon-edit" v-if="ownBlog">
        <router-link :to="{name: 'BlogEdit', params: {blogId: blog.id}}" >
        编辑
        </router-link>
      </el-link>
      <el-divider></el-divider>
      <div class="markdown-body" v-html="blog.content"></div>
      <el-divider></el-divider>
      <div v-for="comment in comments" :key="comment.id"> {{comment.content}}</div>

    </div>

  </div>
</template>

<script>
  import 'github-markdown-css'
  import Header from "../components/Header";

  export default {
    name: "BlogDetail.vue",
    components: {Header},
    data() {
      return {
        blog: {
          id: "",
          title: "",
          content: "",
        },
        comments: [{
          createUser: "",
          createTime: "",
          content: "",
        }],
        ownBlog: false
      }
    },
    created() {
      const blogId = this.$route.params.blogId
      const _this = this
      this.$axios.get('/blog/' + blogId).then(res => {
        const blog = res.data.data
        _this.blog.id = blog.id
        _this.blog.title = blog.title

        var MardownIt = require("markdown-it")
        var md = new MardownIt()

        var result = md.render(blog.content)
        _this.blog.content = result
        _this.ownBlog = (blog.userId === _this.$store.getters.getUser.id)

      })

      this.$axios.get('/comment/' + 1).then(res => {
        const comments = res.data.data
        
        for(let i=0; i<comments.length; i++){
          
          let comment = comments[i];
          _this.comments.push(
            {
              createUser: "",
              createTime: "",
              content: "",
            }
          )
          _this.comments[i].createUser = comment.createUser
          _this.comments[i].createTime = comment.createTime
          _this.comments[i].content = comment.content
          
        }
        
        

      })
    }
  }
</script>

<style scoped>
  .mblog {
    box-shadow: 0 2px 12px 0 rgba(5, 0, 0, 0.1);
    width: 100%;
    min-height: 700px;
    padding: 20px 15px;
  }

</style>