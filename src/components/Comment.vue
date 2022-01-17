<!--评论模块-->
<template>
  <div class="container">
    
    <div style="font-size: 1.5em;">评论区</div>
    <br>
    
    <el-input class="gray-bg-input"
              v-model="inputComment"
              type="textarea"
              :rows="3"
              autofocus
              placeholder="写下你的评论"
              >
    </el-input>
    <br>
    <br>
    
    <el-button class="btn" style="float: right;" type="success" round @click="commitComment(inputComment)">确定</el-button>
    <br>
    <br>
    
    <div class="comment" v-for="(item,index) in comments" :key="index">
      <div class="info">
        <img class="avatar" :src="item.userAvatar" width="36" height="36" @click="toProfile(item.createUserId)" style="cursor: pointer"/>
        <div class="right">
          <div class="name">
            <el-link @click="toProfile(item.createUserId)">{{item.createUser}}</el-link>
          </div>
          <div class="date">{{item.createTime}}</div>
        </div>
      </div>
      <div class="content">{{item.content}}</div>
      <div class="control">
        <span class="like" :class="{active: item.isLike}" @click="likeClick(item.id, index)">
          <i class="iconfont icon-like"></i>
          <span class="like-num">{{item.likes > 0 ? item.likes + '人赞' : '赞'}}</span>
        </span>
        <span class="comment-reply" @click="showCommentInput(item)">
          <i class="iconfont icon-comment"></i>
          <span>回复</span>
        </span>
        <span class="comment-delete" @click="deleteComment(item.id)" v-if="item.createUserId === userInfo.id">
          <i class="iconfont icon-comment"></i>
          <span>删除</span>
        </span>
      </div>
      <div class="reply">
        <div class="item" v-for="(reply,index) in item.reply.replies" :key="index">
          <div class="reply-content">
            <span class="from-name">
              <el-link @click="toProfileByname(reply.createUser)">{{reply.createUser}}</el-link>
            </span><span>: </span>
            <!-- <span class="to-name">@{{reply.toName}}</span> -->
            <span>{{reply.content}}</span>
          </div>
          <!-- <div class="reply-bottom">
            <span>{{reply.createTime}}</span>
            <span class="reply-text" @click="showCommentInput(item, reply)">
              <i class="iconfont icon-comment"></i>
              <span>回复111</span>
            </span>
          </div> -->
        </div>
        <div class="write-reply" v-if="item.reply.replies.length > 0" @click="showCommentInput(item)">
          <i class="el-icon-edit"></i>
          <span class="add-comment">添加新评论</span>
        </div>
        <transition name="fade">
          <div class="input-wrapper" v-if="showItemId === item.id">
            <el-input class="gray-bg-input"
                      v-model="inputComment"
                      type="textarea"
                      :rows="3"
                      autofocus
                      placeholder="写下你的评论"
                      >
            </el-input>
            <div class="btn-control">
              <span class="cancel" @click="cancel">取消</span>
              <el-button class="btn" type="success" round @click="commitReply(item.id, inputComment)">确定</el-button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>

  import Vue from 'vue'

  export default {
    props: {
      comments: {
        type: Array,
        required: true
      },
    },
    components: {},
    data() {
      return {
        inputComment: '',
        showItemId: '',
        userInfo: '',
      }
    },
    computed: {},
    methods: {
      deleteComment(id) {
        this.$emit('delete', id);
        
      },
      toProfile(createUser) {
        this.$axios.get('/user/getUser/'+createUser).then(res => {
          const userId = res.data.data.id;
          this.$router.push({ name: 'Profile', params: { id:  userId} })
        })
      },
      toProfileByname(createUser){
        this.$axios.get('/user/getUserByName/'+createUser).then(res => {
          const userId = res.data.data.id;
          this.$router.push({ name: 'Profile', params: { id:  userId} })
        })
      },
      /**
       * 点赞
       */
      likeClick(commentId, index) {
        if(!this.$store.getters.getUser.id){
          this.$message('请先登录');
        } else {
          this.$emit('like', commentId, index);
        }
      },
      /**
       * 点击取消按钮
       */
      cancel() {
        this.showItemId = ''
      },

      /**
       * 提交评论
       */
      commitComment(inputComment) {
        this.$emit('comment', inputComment)
        this.inputComment='';
      },

      commitReply(commentId, inputComment) {
        if(!this.$store.getters.getUser.id){
          this.$message('请先登录')
        } else {
          if(inputComment===''){
            this.$message('回复内容不能为空')
          }else {
            const replyForm = {
              commentId: commentId,
              content: inputComment,
              createUser: this.userInfo.username,
              userAvatar: this.userInfo.avatar,
            }
            this.$axios.post('/comment/reply', replyForm).then(res => {
              // 保存记录
              this.$axios.get('/records/add/'+ this.$store.getters.getUser.id + '?type=reply')
              this.$alert('操作成功', '提示', {
                callback: action => {
                  this.$router.go(0);
                }
              });
            })
          }
        }
      },


      /**
       * 点击评论按钮显示输入框
       * item: 当前大评论
       * reply: 当前回复的评论
       */
      showCommentInput(item, reply) {
        if (reply) {
          this.inputComment = "@" + reply.fromName + " "
        } else {
          this.inputComment = ''
        }
        this.showItemId = item.id
      }
    },
    created() {
      this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    }
  }
</script>

<style scoped lang="scss">

  @import "../assets/scss/index";

  .container {
    padding: 0 10px;
    box-sizing: border-box;
    .comment {
      display: flex;
      flex-direction: column;
      padding: 10px;
      border-bottom: 1px solid $border-fourth;
      .info {
        display: flex;
        align-items: center;
        .avatar {
          border-radius: 50%;
        }
        .right {
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          .name {
            font-size: 16px;
            color: $text-main;
            margin-bottom: 5px;
            font-weight: 500;
          }
          .date {
            font-size: 12px;
            color: $text-minor;
          }
        }
      }
      .content {
        font-size: 16px;
        color: $text-main;
        line-height: 20px;
        padding: 10px 0;
      }
      .control {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: $text-minor;
        .like {
          display: flex;
          align-items: center;
          margin-right: 20px;
          cursor: pointer;
          &.active, &:hover {
            color: $color-main;
          }
          .iconfont {
            font-size: 14px;
            margin-right: 5px;
          }
        }
        .comment-reply {
          display: flex;
          align-items: center;
          cursor: pointer;
          &:hover {
            color: $text-333;
          }
          .iconfont {
            font-size: 16px;
            margin-right: 5px;
          }
        }
        .comment-delete {
          display: flex;
          align-items: center;
          cursor: pointer;
          margin-left: 18px;
          &:hover {
            color: $text-333;
          }
          .iconfont {
            font-size: 16px;
            margin-right: 5px;
          }
        }

      }
      .reply {
        margin: 10px 0;
        border-left: 2px solid $border-first;
        .item {
          margin: 0 10px;
          padding: 10px 0;
          border-bottom: 1px dashed $border-third;
          .reply-content {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: $text-main;
            .from-name {
              color: $color-main;
            }
            .to-name {
              color: $color-main;
              margin-left: 5px;
              margin-right: 5px;
            }
          }
          .reply-bottom {
            display: flex;
            align-items: center;
            margin-top: 6px;
            font-size: 12px;
            color: $text-minor;
            .reply-text {
              display: flex;
              align-items: center;
              margin-left: 10px;
              cursor: pointer;
              &:hover {
                color: $text-333;
              }
              .icon-comment {
                margin-right: 5px;
              }
            }
          }
        }
        .write-reply {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: $text-minor;
          padding: 10px;
          cursor: pointer;
          &:hover {
            color: $text-main;
          }
          .el-icon-edit {
            margin-right: 5px;
          }
        }
        .fade-enter-active, fade-leave-active {
          transition: opacity 0.5s;
        }
        .fade-enter, .fade-leave-to {
          opacity: 0;
        }
        .input-wrapper {
          padding: 10px;
          .gray-bg-input, .el-input__inner {
            /*background-color: #67C23A;*/
          }
          .btn-control {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-top: 10px;
            .cancel {
              font-size: 16px;
              color: $text-normal;
              margin-right: 20px;
              cursor: pointer;
              &:hover {
                color: $text-333;
              }
            }
            .confirm {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
</style>