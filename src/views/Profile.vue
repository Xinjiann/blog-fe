<template>
  <div class="m-content">
    <h3>欢迎来到树洞博客</h3>
    <div class="block">
      <el-avatar :size="50" :src="user.avatar"></el-avatar>
      <div>{{ user.username }}</div>
    </div>

    <calendar-heatmap style="width: 50%" :endDate="today" :values="values"/>
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
        today: new Date(),
        user: {
          username: '请先登录',
          avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.cwq.com%2F201712%2F1513090030590881.jpeg&refer=http%3A%2F%2Fimg.cwq.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1641122100&t=ab3415d9c369021a9e836e22362b0122'
        },
        hasLogin: false,
        input: '',
        days: [],
      }
    },
    methods: {

      initUser() {
        const userId = this.$route.params.id;
        this.$axios.get("/user/getUser/" + userId).then(res => {
          this.user.username = res.data.data.username;
          this.user.avatar = res.data.data.avatar;
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

</style>