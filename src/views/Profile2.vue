<template>
  <div>
    <el-page-header @back="goBack" content="个人主页">
      </el-page-header>
    <el-container>
      <el-aside>
          <el-avatar :size="50" :src="user.avatar"></el-avatar>
          <div style="font-size: 18px; color: dimgray">@{{ user.username }}</div>
      </el-aside>

      <el-container>
        <el-header>
          <calendar-heatmap style="width: 50%" :endDate="today" :values="values"/><br><br>
        </el-header>

        <el-main>
          <div style="margin-right: 47%; font-size: 14px">Blogs</div>
          <el-row :gutter="10" style="width: 50%; margin: 0 auto">
            <el-col :span="8" v-for="blog in blogs" :key="blog.id">
              <br>
              <el-card style="height: 100px" shadow="hover">
                <el-link @click="toBlog(blog.id)" style="color: #58A6FF; margin-left: 1px">
                  {{ blog.title }}
                </el-link>
              </el-card>
            </el-col>
          </el-row><br>

          <el-pagination class="mpage"
                        background
                        layout="prev, pager, next"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        :total="total"
                        @current-change=page>
          </el-pagination>
        </el-main>
      </el-container>
    </el-container>
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
        values: [],
        currentPage: 1,
        today: new Date(),
        user: {
          username: '请先登录',
          avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.cwq.com%2F201712%2F1513090030590881.jpeg&refer=http%3A%2F%2Fimg.cwq.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1641122100&t=ab3415d9c369021a9e836e22362b0122'
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

      initUser() {
        const userId = typeof this.$route.params.id === 'undefined' ? this.$store.getters.getUser.id : this.$route.params.id;
        this.$axios.get("/user/getUser/" + userId).then(res => {
          this.user.username = res.data.data.username;
          this.user.avatar = res.data.data.avatar;
        });
        this.initBlogs(userId);
      },
      initBlogs(userId){
        this.$axios.get("/blogsByUserId/" + userId + '?currentPage=' + this.currentPage).then(res => {
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
        const userId = typeof this.$route.params.id === 'undefined' ? this.$store.getters.getUser.id : this.$route.params.id;
        this.$axios.get("/records/" + userId).then(res => {
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

      this.getRecord();

    


      

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

</style>