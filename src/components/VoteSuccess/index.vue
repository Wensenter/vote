<template>
 <div @touchmove.prevent @click.prevent class="wrap">
     <div class="ctx">
         <img @click="close" class="close_icon" src="./images/close.png">
         <img class="success_icon" src="./images/VoteSuccess.png">
         <p>投票成功</p>
         <button type="button" @click="goto">参与抽奖</button>
     </div>
 </div>
</template>

<script type="text/ecmascript-6">
export default {
 props:{
     url:'',
 },
 data() {
  return {

  }
 },
 methods: {
     goto(){
         window.location.href = this.url;
     },
     close(){
         this.$emit('scrollable');
         this.$store.commit('UPDATE_SHOW_VOTE_SUCCESS', false);
     }
 }
}
</script>

<style lang="less" scoped>
    .wrap{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
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
                width: 352px;
                height: 157px;
                margin-top: 71px;
            }
            &>p{
                color: #080808;
                font-weight: bold;
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
