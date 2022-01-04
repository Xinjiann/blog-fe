<template>
  <div class="m-content">
    <h3>欢迎来到树洞博客</h3>
    <div class="block">
      <el-avatar @click.native="toProfile" :size="50" :src="user.avatar" style="cursor: pointer"></el-avatar>
      <div>
        <el-link @click.native="toProfile">@{{ user.username }}</el-link>
      </div>
    </div>

    <span v-if="showSearch" class="maction" style="margin-left: 22.5%">
      <span><el-link href="/blogs">主页</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link type="success" @click="addBlog">发表</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span v-show="!hasLogin"><el-link type="primary" href="/login">登录</el-link></span>
      <span v-show="hasLogin"><el-link type="danger" @click="logout">退出</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link @click="signUp">注册</el-link></span>      
    </span>

    <div v-else class="maction" style="margin-left: 0%">
      <span><el-link href="/blogs">主页</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link type="success" @click="addBlog">发表</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span v-show="!hasLogin"><el-link type="primary" href="/login">登录</el-link></span>
      <span v-show="hasLogin"><el-link type="danger" @click="logout">退出</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link @click="signUp">注册</el-link></span> 
    </div>

    <span v-show="showSearch">
      <el-input style="width: 17%; margin-left: 5.5%" v-model="input" placeholder="搜索文章" prefix-icon="el-icon-search" @keyup.enter.native="search">
      </el-input>
    </span>

  </div>
</template>

<script>
  export default {
    name: "Header",
    props: ['blogsPage', 'showSearch'],
    data() {
      return {
        avatar: '',
        user: {
          username: '游客',
          avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F02%2F63%2F69%2F59fc9e8a7a49e_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1643737983&t=20c09318fb5b88ccf706c093b748fcf1'
        },
        hasLogin: false,
        input: '',
      }
    },
    methods: {
      addBlog() {
        if(!this.$store.getters.getUser.id) {
          this.$message.error("请先登录")
        } else {
          this.$router.push("/blog/add");
        }
        
      },
      async initUser(){
        if(this.$store.getters.getUser.username) {
          this.user.username = this.$store.getters.getUser.username
          await this.$axios.get('/user/getUserByName/'+this.user.username).then(res => {
            this.avatar = res.data.data.avatar
          })
          this.hasLogin = true
          if (this.avatar != '') {
            this.$axios.get("/file/getUrl/"+this.avatar).then(res =>{
              this.user.avatar = res.data.data;
            })
          }
        }
      },
      toProfile(){
        this.$router.push({ name: 'Profile', params: { id: this.$store.getters.getUser.id } })
      },

      signUp(){
        this.$router.push("/signUp");
      },
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
          // 保存记录
          this.$axios.get('/records/add/'+ this.$store.getters.getUser.id + '?type=logout')
          _this.$store.commit("REMOVE_INFO")
          _this.$router.push("/login")

        })
      }
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

</style>