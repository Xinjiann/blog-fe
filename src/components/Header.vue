<template>
  <div class="m-content">
    <h3>欢迎来到树洞博客</h3>
    <div class="block">
      <el-avatar :size="50" :src="user.avatar"></el-avatar>
      <div>{{ user.username }}</div>
    </div>

    <span class="maction">
      
      <!-- <span><el-link href="/blogs" style="margin-left:23.2%;">主页</el-link></span> -->
      <span><el-link href="/blogs">主页</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link type="success" href="/blog/add">发表博客</el-link></span>

      <el-divider direction="vertical"></el-divider>
      <span v-show="!hasLogin"><el-link type="primary" href="/login">登录</el-link></span>

      <!-- <span v-show="hasLogin"><el-link type="danger" @click="logout" style="margin-right:8%;">退出</el-link></span> -->
      <span v-show="hasLogin"><el-link type="danger" @click="logout">退出</el-link></span>

      <!-- <span><el-input style="max-width: 250px;" v-model="input" placeholder="搜索文章" prefix-icon="el-icon-search" @keyup.enter.native="search"></el-input></span> -->
    </span>

    

  </div>
</template>

<script>
  export default {
    name: "Header",
    props: ['blogsPage'],
    data() {
      return {
        user: {
          username: '请先登录',
          avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.cwq.com%2F201712%2F1513090030590881.jpeg&refer=http%3A%2F%2Fimg.cwq.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1641122100&t=ab3415d9c369021a9e836e22362b0122'
        },
        hasLogin: false,
        input: '',
      }
    },
    methods: {
      search() {
        this.$emit("searchBlog", this.input)
      },
      logout() {
        const _this = this
        _this.$axios.get("/logout", {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
          _this.$store.commit("REMOVE_INFO")
          _this.$router.push("/login")

        })
      }
    },
    created() {
      if(this.$store.getters.getUser.username) {
        this.user.username = this.$store.getters.getUser.username
        this.user.avatar = this.$store.getters.getUser.avatar

        this.hasLogin = true
      }

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

</style>