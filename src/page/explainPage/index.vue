<template>
 <div class="wrapper">
     <div class="context">
        <div class="explainItem">
            <dl>
                <dt>活动简介</dt>
                <dd>{{actDesJson.Profile}}</dd>
            </dl>
        </div>
        <div class="explainItem">
            <dl>
                <dt>报名时间</dt>
                <dd>{{actDesJson.ApplyStartDate}} - {{actDesJson.ApplyEndDate}}</dd>
            </dl>
        </div>
        <div class="explainItem">
            <dl>
                <dt>报名须知</dt>
                <dd>{{actDesJson.ApplyRequired}}</dd>
            </dl>
        </div>
        <div class="explainItem">
            <dl>
                <dt>投票时间</dt>
                <dd>{{actDesJson.StartDateTime}} - {{actDesJson.EndDateTime}}</dd>
            </dl>
        </div>
        <div class="explainItem">
            <dl>
                <dt>投票须知</dt>
                <dd>{{actDesJson.NeedKnow}}</dd>
            </dl>
        </div>
     </div>
 </div>
</template>

<script type="text/ecmascript-6">
export default {
 data() {
  return {
      VoteId:'',
      actDesJson:{

      }
  }
 },
 created () {
     this.VoteId = sessionStorage.getItem('VoteId');
     this.getActivityDescription(this.VoteId);
 },
 methods: {
    getActivityDescription(VoteId){
        this.$api.ActivityDescription(VoteId)
        .then(res=>{
            this.actDesJson = res.Data;
        })
    }
 }
}
</script>

<style lang="less" scoped>
    .wrapper{
        .context{
            padding: 42px 35px 144px;
            width: 677px;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            .explainItem{
                &>dl{
                    &>dt{
                        background: #EEE;
                        height: 68px;
                        line-height: 68px;
                        padding-left: 40px;
                        color: #000000;
                        font-size: 36px;
                        font-weight: 500;
                        font-family:PingFang-SC-Medium;
                    }
                    &>dd{
                        background: #fff;
                        padding: 30px 40px 46px 40px;
                        color: #262626;
                        font-weight: 400;
                    }
                }
         }
       }
    }
</style>
