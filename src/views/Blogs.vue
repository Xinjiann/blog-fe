<template >
  <div class="mcontaner">
    <vue-canvas-nest :config="config"></vue-canvas-nest>
    <Header @searchBlog="search" @classSelect="getClassedBlogs" showSearch='true'></Header>
    <!-- <Header2></Header2> -->
    <div class="blogs">
      <el-timeline>
        <el-timeline-item v-bind:timestamp="blog.created" placement="top" v-for="blog in blogs" :key="blog.id">
          <el-card>
            <h4>
              <router-link :to="{name: 'BlogDetail', params: {blogId: blog.id}}" class="span-line">
                {{blog.title}}
              </router-link>
              <i v-if="favorite.indexOf(blog.id+'') != -1" class="el-icon-star-on" style="color: red; cursor: pointer; margin-left: 1px" @click="rmFavorite(blog.id)"></i>
              <i v-else class="el-icon-star-off" style="color: blue; cursor: pointer; margin-left: 4px" @click="addFavorite(blog.id)"></i>
            </h4>
            <p>{{blog.description}}</p>
          </el-card>
        </el-timeline-item>
        <div v-if="blogs.length===0">
          <br>
          <el-card>无数据</el-card>
          <br>
        </div>
      </el-timeline>

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
  import Header from "../components/Header";
  import vueCanvasNest from "vue-canvas-nest";

  export default {
    name: "Blogs.vue",
    components: {Header, vueCanvasNest},
    data() {
      return {
        storeId: 0,
        favorite: [],
        hasLogin: false,
        config: {
          color: "255,0,0",
          opacity: 1.3,
          zIndex: 55,
          count: 120,
        },
        blogs: {},
        currentPage: 1,
        total: 0,
        pageSize: 5,
        currentPage2: 1,
        input: '',
      }
    },
    methods: {
      getClassedBlogs(input) {
        
        this.$axios.get("blog/getClassedBlogs?class=" + input).then(res => {
          console.log(res)
          this.blogs = res.data.data;
        })
      },
      checkLogin() {
        if(!this.$store.getters.getUser){
          this.$store.commit("REMOVE_INFO")
        }
        if (this.$store.getters.getUser.id) {
          this.storeId = this.$store.getters.getUser.id;
          this.hasLogin = true;
        }
      },
      async initFavorite() {
        if (this.hasLogin) {
          await this.$axios.get("/user/getFavorite/" + this.storeId).then(res => {
            this.favorite = res.data.data
          })
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
      page(currentPage) {
        const _this = this
        _this.$axios.get("/blogs?currentPage=" + currentPage).then(res => {
          _this.blogs = res.data.data.records
          _this.currentPage = res.data.data.current
          _this.total = res.data.data.total
          _this.pageSize = res.data.data.size
        })
      },

      search(input){
        if(input===''){
          this.page(1);
        }else {
          if(input==='%'){
            input = '/%';
          }
          this.$axios.post('blog/search', input, {
            headers: {
              "Content-Type": "text/plain"
            }
          }).then(res => {
            this.blogs = res.data.data;
          })
        }
      }
    },
    created() {
      this.checkLogin();
      this.initFavorite();
      this.page(1)
    }
  }
</script>

<style scoped>

  a{
    text-decoration: none;
  }

  .router-link-active {
    text-decoration: none;
  }

  .span-line:hover{
    text-decoration:underline;
  }

  .mpage {
    margin: 0 auto;
    text-align: center;
  }

  .blogs {
    width:55%;
    margin: 0 auto;
  }

</style>