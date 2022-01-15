<template>
  <div>
    <el-container  style="width:100%; margin: 0 auto">
      <el-header>
        <!-- <img
          class="mlogo"
          src="https://xinjian-blog.oss-cn-beijing.aliyuncs.com/helloWorld.jpg?Expires=1641660933&OSSAccessKeyId=TMP.3KeKqEfPmRxg5rDu1ZtESnBaGPDDE6TY5TQoas2eYq22ySyNRFdD64NAdaBVykwCoGMhUxfQjAsEFWoLb4KCDzgQsUqWLT&Signature=Lmui7%2F49RmWYx1cO73Ktzy7Va2E%3D"
          alt=""
        /> -->
        <h3 style="line-height: 30px">欢迎来到树洞博客</h3>
      </el-header>
      <el-main>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          style="width: 50%; margin-left: 36.5%"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input :type="type" v-model="ruleForm.password">
              <i
                slot="suffix"
                class="icon-style"
                :class="elIcon"
                autocomplete="auto"
                @click="flag = !flag"
              />
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="submitForm('ruleForm')" style="margin-right: 4px">登陆</el-button>
            <el-button size="small" @click="signUp">注册</el-button>
            <el-button size="small" @click="toResetPassWord">重置密码</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      flag: false,
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    type() {
      return this.flag ? "text" : "password";
    },
    elIcon() {
      return this.flag ? "el-icon-minus" : "el-icon-view";
    },
  },
  methods: {
    toResetPassWord() {
      this.$router.push("/resetPassword");
    },
    signUp(){
      this.$router.push("/signUp");
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this;
          this.$axios.post('/login', this.ruleForm).then(res => {
            const jwt = res.headers['authorization'];
            const userInfo = res.data.data;
            // 把数据共享出去
            _this.$store.commit("SET_TOKEN", jwt)
            _this.$store.commit("SET_USERINFO", userInfo)
            // 保存记录
            this.$axios.get('/records/add/'+ userInfo.id + '?type=login')
            

            _this.$router.push("/blogs")
          });
          
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.ruleForm.username = "";
      this.ruleForm.password = "";
    },

  },
};
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  /* background-color: #E9EEF3; */
  color: #333;
  text-align: center;
  line-height: 160px;

}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.mlogo {
  height: 60%;
  margin-top: 10px;
}

.demo-ruleForm {
  max-width: 500px;
  margin: 0 auto;
}
</style>