<template>
 <div ref="body_wrapper">
   <div class="scroll-hook">
    <img :src="SortImg" class="rankheadImg">
        <div class="list_wrapper">
            <ul class="list_head">
                <li>排名</li>
                <li>参赛选手</li>
                <li>票数</li>
            </ul>
            <div class="body_wrapper" v-if="ranklist.length">
              <ul class="list_body">
                  <li v-for="(item,index) in ranklist" :key="item.rank" class="rank_item">
                    <ul>
                      <li>
                        <span class="rank">{{index+1}}</span>
                      </li>
                      <li>
                        <img :src="item.ApplyImg" class="ranker_img">
                        <span class="renker">{{item.Name}}</span>
                        </li>
                      <li>
                        <span class="num">{{item.Number}}票</span>
                      </li>
                    </ul>
                  </li>
              </ul>
            </div>
            <div class="noData" v-else ref="noData">
                <img src="./images/noData.png" class="noDataPic">
                <span v-if="homedata.AutoApply != 1" >暂无数据</span>
                <span v-if="homedata.AutoApply == 1" >还没有参赛选手<br>快去报名吧~</span>
                <img v-if="homedata.AutoApply == 1"  src="./images/arrow.png" class="arrow">
            </div>
            <enrollBtn 
            :enrollflag="homedata.RegisterStatus == 1"
            v-if="homedata.AutoApply == 1" 
            :IsShow="homedata.IsShow"
            :VoteOptionId="homedata.VoteOptionId" 
            :ApplyEndDate="homedata.ApplyEndDate"
            :ApplyStartDate="homedata.ApplyStartDate"
            ></enrollBtn>
        </div>
   </div>
 </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import enrollBtn from "@/components/enrollBtn";
export default {
  props:{
    homedata:{
      type:Object
    }
  },
  data() {
    return {
      // enroll:false,
      ranklist: [],
      AutoApply:'',
      SortImg:'',
      getRankListJson:{
        VoteId:25,
        PageNumber:1,
        Limit:10
      }
    };
  },
  created () {
    this.getRankListJson.VoteId = sessionStorage.getItem('VoteId');
    this.getRankList(this.getRankListJson);
  },
  components: {
    enrollBtn
  },
  methods: {
    _initScroll(){
      if(!this.scroll){
        this.scroll = new BScroll(this.$refs.body_wrapper,{
          click:true,
        });
        this.scroll.on('touchEnd', () => {
          // 下拉动作
          if(this.scroll.y <= (this.scroll.maxScrollY - 50 )){
            this.getRankListJson.PageNumber++;
            this.getRankList(this.getRankListJson);
          }
        })
      }else{
        this.scroll.refresh();
      }
          console.log(this.scroll)
    },
    getRankList({VoteId,PageNumber,Limit}){
      let List = this.ranklist;
      this.$api.RankList(VoteId,PageNumber,Limit)
      .then(res=>{
        this.SortImg = res.Data.SortImg;
        this.AutoApply = res.Data.AutoApply;
        this.VoteOptionId = res.Data.VoteOptionId;
        if(res.Data.VoteOption.length > 0){
          this.ranklist = List.concat(res.Data.VoteOption);
        }else{
          this.ranklist = List;
          this.getRankListJson.PageNumber--;
        }
        if(this.ranklist.length == 0){
          this.$refs.noData.style.display = 'flex';
        }
        this.$nextTick(()=>{
          this._initScroll();
        })
      })
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../css/tool";
.scroll-hook{
  min-height: 100vh;
  padding: 0 35px 0;
  .rankheadImg{
    width: 590px;
    height: 160px;
    margin-top:31px; 
    position: relative;
    left: 50%;
    margin-left: -295px;
    z-index: 100;
  }
  .list_wrapper{
    width: 680px;
    background: #fff;
    padding-top: 60px;
    box-sizing: border-box;
    position: relative;
    top: -60px;
    min-height: 1050px;
    .list_head{
      width: 680px;
      height: 70px;
      background: #E9FAFF;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #262626;
      font-size: 32px;
    }
    .body_wrapper{
      width: 680px;
      padding-bottom: 50px;
      // overflow-y: scroll;
      .list_body{
        .rank_item{
          &>ul{
            display: flex;
            height: 95px;
            justify-content: space-around;
            align-items: center;
            border-bottom: 1px solid #EEEEEE;
            &>li{
              display: flex;
              justify-content: center;
              align-items: center;
              .rank{
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background:rgba(7,152,240,0.4);
                display: flex;
                justify-content: center;
                align-items: center;
                color: #F7F7FA;
                font-size: 24px;
                margin-left: 10px;
              }
              .ranker_img{
                width: 58px;
                height: 58px;
                border-radius: 50%;
              }
              .renker{
                width: 150px;
                margin-left: 22px;
                color: #262626;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .num{
                margin-right: 20px;
                color:#FFB400;
              }
            }
          }
        }
      }
    }
    .noData{
      display: none;
      flex-direction: column;
      align-items: center;
      position: relative;
      height: 890px;
      .noDataPic{
        width: 178px;
        height: 143px;
        margin-top: 122px;
        margin-bottom: 32px;
      }
      .arrow{
        position: absolute;
        width: 144px;
        height: 363px;
        bottom: 182px;
        right: 98px;
      }
    }
  }
}
</style>
