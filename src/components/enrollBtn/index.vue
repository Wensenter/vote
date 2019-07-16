<template>
    <div :class="enroll" @click="enrolls">
        <i :class="enroll_icon"></i>
        {{enrollctx}}
    </div>
</template>

<script>
export default {
props:{
    enrollflag:{
        default:false
    },
    IsShow:'',
    VoteOptionId:{},
    ApplyEndDate:{},
    ApplyStartDate:{},
},
 data() {
  return {

  }
 },
 methods: {
     enrolls(){
         if(this.enrollflag){
             if(this.IsShow == 0){
                 this.$util.layer('涉嫌违规,操作已被限制',7,2000)
             }else if(this.IsShow == 1){
                this.$router.push('/partyInfoPage')
                sessionStorage.setItem('VoteOptionId',this.VoteOptionId)
             }
         }else{
            let EndDateStr = this.ApplyEndDate.split('(')[1].split(')')[0];
            let StartDateStr = this.ApplyStartDate.split('(')[1].split(')')[0];
            if(StartDateStr*1 - Date.parse(new Date()) >0){
                this.$util.layer('报名尚未开始',7,2000);
            }else{
                if( EndDateStr*1-Date.parse(new Date()) < 0){
                    this.$util.layer('报名已结束',7,2000);
                }else{
                    this.$router.push('/enrollPage')
                }
            }
            
         }
     }
 },
 computed: {
     enroll(){
         return this.enrollflag?'my':'enroll';
     },
     enroll_icon(){
         return this.enrollflag?'my_icon':'enroll_icon';
     },
     enrollctx(){
         return this.enrollflag?'我的':'报名';
     }
 }
}
</script>

<style lang="less" scoped>
@import "../../css/tool";
.enroll{
    z-index: 1000;
    width: 84px;
    height: 84px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 8px;
    bottom: 120px;
    background: #fff;
    box-shadow:0px 4px 18px 0px rgba(60,151,218,0.57);
    border-radius: 50%;
    color: #0099EE;
    .enroll_icon{
        ._icon("./images/enroll_icon.png",32px,29px);
    }
}
.my{
    z-index: 1000;
    position: absolute;
    right: 8px;
    bottom: 100px;
    width: 85px;
    height: 85px;
    border-radius: 50%;
    box-shadow:0px 4px 18px 0px rgba(60,151,218,0.57);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fff;
    color: #0099EE;
    .my_icon{
    ._icon("./images/my_icon.png",32px,29px);
    }
}
</style>
