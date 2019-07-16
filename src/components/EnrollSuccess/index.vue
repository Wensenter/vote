<template>
    <div @touchmove.prevent class="wrap">
        <div class="ctx">
            <img class="success_icon" src="./images/enrollSuccess.png">
            <span>{{str}}</span>
            <button type="button" @click="goto">我知道了</button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
 props:{
     str:String
 },
 data() {
  return {
      
  }
 },
 methods: {
     goto(){
         this.$store.commit('UPDATE_SHOW_ENROLL_SUCCESS',false);
         this.$router.push({path:'/homePage'});
     }
 }
}
</script>

<style lang="less" scoped>
    .wrap{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.43);
        z-index: 1000;
        .ctx{
            width: 553px;
            height: 496px;
            position: absolute;
            top: 414px;
            left: 103px;
            right:94px;
            background: #ffffff;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            .close_icon{
                width: 24px;
                height: 24px;
                position: absolute;
                top: 27px;
                right: 29px;
            }
            .success_icon{
                width: 205px;
                height: 126px;
                margin-top: 77px;
            }
            &>p{
                color: #080808;
                font-weight: bold;
            }
            &>span{
                width: 387px;
                height: 59px;
                color: #818181;
                font-size: 26px;
                text-align: center;
            }
            &>button{
                width: 240px;
                height: 66px;
                border-radius: 11px;
                background: #4381FD;
                color: #ffffff;
                outline: none;
                border: 0;
                margin-bottom: 55px;
            }
        }
    }
</style>
