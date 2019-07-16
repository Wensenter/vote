<template>
    <div>   
        <router-view :homedata="data" class="routeview" :style="{background:bgColor}" @ourfocus="_focus" @ourblur="_blur" @vote-add="reloadVote" />
        <ul class="menu" ref="menu">
        <li class="home" :class="{selected:isThis=='/homePage'}">
            <router-link :to="{path:'/homePage'}">
            <i class="home_icon"></i>
            首页
            </router-link>
        </li>
        <li class="rank" :class="{selected:isThis=='/rankPage'}">
            <router-link :to="{path:'/rankPage'}">
            <i class="rank_icon"></i>
            排行榜
            </router-link>
        </li>
        <li class="explain" :class="{selected:isThis=='/explainPage'}">
            <router-link :to="{path:'/explainPage'}">
            <i class="explain_icon"></i>
            活动说明
            </router-link>
        </li>
        <li class="layout" v-if="data.IsBottom == 1">
            <a :href="data.BottomUrl">
            <i class="layout_icon"></i>
            {{data.BottomName}}
            </a>
        </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'App',
  data () {
    return {
      data:{
        VoteId:'',
        DeviceType:''
      },
      bgColor: '',
      Music:'',
    }
  },
  created () {
    this.VoteId = sessionStorage.getItem('VoteId');
    this.DeviceType = sessionStorage.getItem('DeviceType');
    this.getVoteHome(this.VoteId,this.DeviceType);
  },
  methods: {
    getVoteHome(VoteId,DeviceType){
      this.$api.VoteHome(VoteId,DeviceType).
      then(res=>{
        window.document.title = res.Data.Title
        this.bgColor = res.Data.TopBackGColor;
        this.data = res.Data;
        this.Music = res.Data.Music;
        if(res.Data.Status === 9){
          this.$router.push('/offlinePage')
        }
      })
    },
    reloadVote(){
      this.getVoteHome(this.VoteId,this.DeviceType);
    },
    _focus(){
      this.$refs.menu.style.position = 'static';
    },
    _blur(){
      this.$refs.menu.style.position = 'fixed';
    }
  },
  computed: {
    isThis(){
      return this.$route.path
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../css/tool";
.routeview{
  background: rgb(120, 217, 253);
  position: absolute;
  height: 99%;
  width: 100%;
  overflow-y: auto;
}
  .menu{
    position: fixed;
    z-index: 2000;
    bottom: 0;
    width: 100%;
    height: 100px;
    background: rgba(247,247,250,1);
    z-index: 100;
    display: flex;
    justify-content: space-around;
    align-items: center;
    &>li>a{
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 24px;
      color: #7F8389;
      text-decoration: none;
    }
    .home{
      &>a{
        .home_icon{
          ._icon("./images/homeBtn.png",38px,34px);
          background-size: 100% 100%;
        }
      }
    }
    .rank{
      &>a{
        .rank_icon{
          ._icon("./images/rankBtn.png",44px,36px);
          background-size: 100% 100%;
        }
      }
    }
    .explain{
      &>a{
        .explain_icon{
          ._icon("./images/explainBtn.png",32px,34px);
          background-size: 100% 100%;
        }
      }
    }
    .layout{
      &>a{
        .layout_icon{
          ._icon("./images/layoutBtn.png",29px,30px);
          background-size: 100% 100%;
        }
      }
    }
    .selected{
      color:#267DDA;
      &>a{
        .home_icon{
          ._icon("./images/homeBtn_active.png",50px,40px);
        }
        .rank_icon{
          ._icon("./images/rankBtn_active.png",45px,40px);
        }
        .explain_icon{
          ._icon("./images/explainBtn_active.png",45px,40px);
        }
        .layout_icon{
          ._icon("./images/layoutBtn.png",29px,30px);
        }
      }
    }
  }
</style>
