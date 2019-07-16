<template>
    <div>
        <div class="enrollwrapper">
            <img :src="ApplyImg" class="userpic">
            <ul class="state" v-show="stateshow">
                <li :style="{color: VDetailNoColor}">
                    <span class="num">{{Code}}</span>
                    <span class="ctx">编号</span>
                </li>
                <li :style="{color: VDetailCountColor}">
                    <span class="num">{{VotesNumber}}</span>
                    <span class="ctx">票数</span>
                </li>
                <li :style="{color: VDetailSortColor}">
                    <span class="num">{{Ranking}}</span>
                    <span class="ctx">排行</span>
                </li>
            </ul>
            <div class="competitionContents">
                <p class="title">{{Title}}</p>
                <p class="ctx" v-html="Declarationed"></p>
                <div class="pic_list" v-for="(item,index) in piclist" :key="index">
                    <img :src="item">
                </div>
            </div>
            <div class="enroll_footer">
                <button type="button" @click="vote">{{VoteStr}}</button>
            </div>
        </div>
        <VoteSuccess @scrollable="scrollable" :url="this.$store.state.VoteSuccessUrl" v-show="this.$store.state.showVoteSuccess"></VoteSuccess>
    </div>
</template>

<script type="text/ecmascript-6">
import VoteSuccess from "@/components/VoteSuccess";
export default {
 data() {
  return {
      stateshow:true,
      Code:'',
      VDetailNoColor:'',
      VotesNumber:'',
      VDetailCountColor:'',
      Ranking:'',
      VDetailSortColor:'',
      ApplyImg:'',
      Title:'',
      Declaration:'',
      VoteOptionId:'',
      status:'',
      VoteStatus:'',
      VoteStr:'',
      piclist:[],
      voteButtonSate:true,
  }
 },
 created () {
    this.VoteOptionDetails(sessionStorage.getItem('VoteOptionId'),sessionStorage.getItem('VoteId'));
 },
 methods: {
     vote(){
         if(this.voteButtonSate){
            if(this.VoteStatus == 2){
                if(this.status == 0){
                    this.voteButtonSate = false;
                    this.$api.AddVote(this.VoteOptionId,sessionStorage.getItem('VoteId'),sessionStorage.getItem('DeviceType'))
                    .then(res=>{
                        if(res.Data && res.Data.Url){
                            if(res.Data.ActivityId>0){
                                this.$store.commit('UPDATE_SHOW_VOTE_SUCCESS', true);
                                this.$store.commit('UPDATE_VOTE_SUCCESS_URL', res.Data.Url);
                            }
                        }else{
                            this.$util.layer(res.Message,7,2000);
                            this.voteButtonSate = true;
                        }
                        this.VoteOptionDetails(sessionStorage.getItem('VoteOptionId'),sessionStorage.getItem('VoteId'));
                    })
                }else if(this.status == 1){
                    this.$util.layer('投票暂停中，请联系主办方',7,2000);
                }else if(this.status == 2 || this.status == 3 || this.status == 5){
                    this.$util.layer('投票尚未开始',7,2000);
                }else if(this.status == 8){
                    this.$util.layer('投票已结束',7,2000);
                }
            }else if(this.VoteStatus == 1){
                this.$util.layer('报名审核中',7,2000);
            }else if(this.VoteStatus == 3){
                this.$router.push('/enrollPage')
            }
         }
     },
     VoteOptionDetails(VoteOptionId,VoteId){
        this.$api.VoteOptionDetails(VoteOptionId,VoteId)
        .then(res=>{
            this.VoteStatus = res.Data.VoteStatus;
            this.stateshow = res.Data.VoteDetailType == 1?true:false;
            this.Code = res.Data.Code;
            this.VDetailNoColor = res.Data.VDetailNoColor;
            this.VotesNumber = res.Data.VotesNumber;
            this.VDetailCountColor = res.Data.VDetailCountColor;
            this.Ranking = res.Data.Ranking;
            this.VDetailSortColor = res.Data.VDetailSortColor;
            this.ApplyImg = res.Data.ApplyImg;
            this.Title = res.Data.Title;
            this.Declaration = res.Data.Declaration;
            this.VoteOptionId = res.Data.VoteOptionId;
            this.piclist = res.Data.Imgs.split(',');
            this.status = res.Data.Status;
            if(res.Data.VoteStatus == 3){
                this.VoteStr = '审核失败,请重新报名';
            }else{
                this.VoteStr = '投票';
            }
        })
     },
     scrollable(){
         this.voteButtonSate = true;
     }
 },
 computed: {
   Declarationed(){
       return this.Declaration.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');   //.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
   }  
 },
 components: {
     VoteSuccess
 }
}
</script>

<style lang="less" scoped>
.enrollwrapper{
    background: #fff;
    margin: 42px 35px 130px;
    padding: 0 36px 15px;
    width: 680px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    overflow-y: scroll;
    box-sizing: border-box;
    .userpic{
        width: 132px;
        height: 132px;
        border-radius: 50%;
        margin-top: 42px;
    }
    .state{
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 53px;
        width: 100%;
        &>li{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #212121;
            .num{
                font-size: 32px;
                font-weight: 800;
            }
            .ctx{
                font-size: 30px;
            }
        }
    }
    .competitionContents{
        margin-top: 73px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .title{
            width: 598px;
            text-align: center;
            word-wrap: break-word;
            color: #000000;
            font-weight: 500;
            font-size: 36px;
        }
        .ctx{
            text-indent: 1em;
            width: 598px;
            margin-top: 25px;
            color: #262626;
            font-size: 30px;
            word-wrap: break-word;
        }
        .pic_list{
            margin-top: 23px;
            &>img{
                width: 606px;
                height: 356px;
            }
        }
    }
    .enroll_footer{
        width: 100%;
        height: 130px;
        background: #F7F7FA;
        position: fixed;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        &>button{
            width: 550px;
            height: 80px;
            background: #4381FD;
            border-radius: 11px;
            outline: none;
            border: 0;
            color: #fff;
        }
    }
}
</style>
