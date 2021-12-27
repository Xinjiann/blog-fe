<template>
  <div>

    <el-page-header @back="goBack" content="注册">
    </el-page-header><br>

    <el-container>
      <el-header>欢迎注册</el-header>
      <el-main style="width:100%; margin-left: 0 auto">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="width: 400px; margin-left: 35%">
          <el-form-item label="账号" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
           <!-- placeholder="请输入账号" -->
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>

    
    


    
  </div>
</template>

<script>
  export default {
    data() {
      var checkEmail = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入邮箱'));
        } else{
          callback();
        }
      };

      var validateUserName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入账号'));
        } else if(value.length<2){
          callback(new Error('账号长度至少2位'));
        }else{
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else if(value.length<6){
          callback(new Error('密码长度至少六位'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
        
        
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      
      return {
        ruleForm: {
          username: '',
          password: '',
          checkPass: '',
          email:'',
        },
        rules: {
          username: [
            { validator: validateUserName, trigger: 'blur' },
            {required: true}
          ],
          password: [
            { validator: validatePass, trigger: 'blur' },
            {required: true}
          ],
          email: [
            { validator: checkEmail, trigger: 'blur' },
            {required: true}
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' },
            {required: true}
          ],
      
        }
      };
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('/signUp', this.ruleForm).then(res => {
              this.$alert('操作成功', '提示', {
                callback: action => {
                  this.$router.push("/login");
                }
              });
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>


<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
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
</style>