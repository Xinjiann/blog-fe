<template>
  <div class="mcontaner">
    <Header @searchBlog="search"></Header>

    <div class="blogs">
      
      <el-timeline>

        <el-timeline-item v-bind:timestamp="blog.created" placement="top" v-for="blog in blogs" :key="blog.id">
          <el-card>
            <h4>
              <router-link :to="{name: 'BlogDetail', params: {blogId: blog.id}}">
                {{blog.title}}
              </router-link>
            </h4>
            <p>{{blog.description}}</p>
          </el-card>
        </el-timeline-item>

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

  export default {
    name: "Blogs.vue",
    components: {Header},
    data() {
      return {
        blogs: {},
        currentPage: 1,
        total: 0,
        pageSize: 5,
        currentPage2: 1,
        input: '',
      }
    },
    methods: {
      page(currentPage) {
        const _this = this
        _this.$axios.get("/blogs?currentPage=" + currentPage).then(res => {
          _this.blogs = res.data.data.records
          _this.currentPage = res.data.data.current
          _this.total = res.data.data.total
          _this.pageSize = res.data.data.size
          console.log(res)

        })
      },

      search(input){
        this.input = input;
        this.$axios.post('blog/search', this.input).then(res => {
          this.blogs = res.data.data;
          console.log(input)
        })
      }
      
    },

  
    created() {
      this.page(1)
    }
  }
</script>

<style scoped>

  .mpage {
    margin: 0 auto;
    text-align: center;
  }

  .blogs {
    width:55%;
    margin: 0 auto;
  }

</style>