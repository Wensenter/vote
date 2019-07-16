<template>
  <div id="app">
    <Loading v-show="this.$store.state.showHttpLoading"></Loading>
    <audio :src="Music" id="music" style="display:none"></audio>
    <router-view/>
  </div>
</template>

<script>
import Loading from "./components/loading";
import MobileDetect from '@/utils/mobile-detect';
import GetUrlParam from '@/utils/getUrlParam'
import VoteSuccess from "@/components/VoteSuccess";
export default {
  name: 'App',
  data () {
    return {
      // bgColor: '#78D9FD',
      Music:'',
      isThis:0,
      showHttpLoading: false,
      showVoteSuccess: false,
      showEnrollSuccess:false,
      voteUrl:''
    }
  },
  created () {
    let device_type = navigator.userAgent.split(';')[0].split('(')[1];
    let Type = '';
    let VoteId = '';
    
    if(device_type != 'iPhone'){
      Type = 'Android';
    }else {
      Type = device_type;
    }
    VoteId = GetUrlParam('VoteId');
    VoteId = VoteId.split('#')[0];
    sessionStorage.setItem('DeviceType',Type);
    sessionStorage.setItem('VoteId',VoteId);

    this.$api.VoteHome(sessionStorage.getItem('VoteId'),sessionStorage.getItem('DeviceType'))
    .then(res=>{
      this.Music = res.Data.Music;
          let audio = document.getElementById('music');
          document.addEventListener('WeixinJSBridgeReady',function(){
            audio.load();
            audio.play();
          })
    })
  },
  components: {
    Loading,
  },
}
</script>

<style lang="less">
#app{
  overflow: hidden;
}
</style>
