<template>
  <div ref="listwrapper">
    <div class="scroll-hook">
      <div class="banner">
        <img :src="homedata.BannerImg">
      </div>
      <div class="vote_state">
        <p class="count_down" :style="{color:homedata.CountdownColor}">
          <span v-if="homedata.Status == 0">
            投票结束倒计时: 
            {{countdown.d}}天{{countdown.h}}小时{{countdown.m}}分钟
          </span>
          <span v-else>{{status}}</span>
        </p>
        <ul v-if="homedata.VisitShow == 1">
          <li :style="{color:homedata.ApplyNumColor}">
            报名人数<br>{{homedata.RegisterNumber}}
          </li>
          <li :style="{color:homedata.ApplyNumColor}">
            累计投票<br>{{homedata.VotesNumber}}
          </li>
        </ul>
      </div>
      <div class="search_wrap">
        <i class="icon"></i>
        <input @blur="search" @focus="_focus" v-model="searchStr" ref="search" type="text" placeholder="请输入编号或名称">
      </div>
      <div class="vote_wrap">
        <ul class="vote_tab">
          <li @click="tabSelect('new')" :class="{selected:isNew}">最新参赛</li>
          <li @click="tabSelect('pop')" :class="{selected:!isNew}">人气排行</li>
        </ul>
        <div class="list_wrapper">
          <ul class="vote_list" v-if="votelist.length">
            <li v-for="item in votelist" :key="item.VoteOptionId" :style={border:ranklistBorder}>
              <div class="bg_img" v-show="rankBg"></div>
              <h3 class="number" :style={color:ranklistBg}>{{item.VoteCode}}</h3>
              <img :src="imgSplit(item.Imgs)" class="head_img" @click="Details(item.VoteOptionId)">
              <div class="theme_wrap">
                <p class="theme" :style={color:ranklistBg}>{{item.Title}}</p>
              </div>
              <div class="bollat">
                  <span class="title">{{item.VotesNumber}}</span>
                  票
              </div>
              <div class="vote_button" @click="vote(item.VoteOptionId)">
                <img :src="VoteButtonImg">
              </div>
            </li>
          </ul>
          <div class="noData" v-else>
              <span v-if="homedata.AutoApply == 1" >还没有参赛选手<br>快去报名吧~</span>
              <span v-if="homedata.AutoApply != 1">暂无数据</span>
              <img v-if="homedata.AutoApply == 1"  src="./images/arrow.png" class="arrow">
          </div>
        </div>
        <enrollBtn 
        v-if="homedata.AutoApply == 1" 
        :IsShow="homedata.IsShow"
        :VoteOptionId="homedata.VoteOptionId" 
        :ApplyEndDate="homedata.ApplyEndDate"
        :ApplyStartDate="homedata.ApplyStartDate"
        :enrollflag="homedata.RegisterStatus == 1"></enrollBtn>
      </div>
    </div>
    <VoteSuccess @scrollable="scrollable" :url="this.$store.state.VoteSuccessUrl" v-show="this.$store.state.showVoteSuccess"></VoteSuccess>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import enrollBtn from "@/components/enrollBtn";
import VoteSuccess from "@/components/VoteSuccess";
import CheckWxScroll from "@/utils/checkWxScroll";
export default {
  name: 'HelloWorld',
  props:{
    homedata:{
      type:Object
    }
  },
  data () {
    return {
      tab: 'new',
      rankBg:true,
      endTime:'',
      VoteButtonImg:'',
      searchStr:'',
      getVoteHomePageJson:{
        VoteId:'',
        Name:'',
        Type:1,
        PageNumber:1
      },
      countdown:{
        d: '',
        h: '',
        m:''
      },
      votelist:[],
      countdown_color:'#469EFC',
      voteButtonState: true,
      initHeight:window.innerHeight
    }
  },
  created () {
    this.getVoteHomePageJson.VoteId = sessionStorage.getItem('VoteId');
  },
  mounted() {
    this._getVoteHomePage(this.getVoteHomePageJson);
      this.endTime =this.$util.ToTimeTamp(this.homedata.EndDateTime);
      if(this.homedata.Status === 0){
        this._countDown(this.endTime);
      }
      let newHeight = window.innerHeight;
      window.onresize = () => {
        if(this.initHeight - window.innerHeight == 0){
          if(this.$route.path == '/homePage'){
            this.$emit('ourblur');
            this.getVoteHomePageJson.Name = this.searchStr;
            this.getVoteHomePageJson.PageNumber = 1;
            this._getVoteHomePage(this.getVoteHomePageJson);
            this.$refs.search.blur()
          }
        }
      }
  },
  watch: {
    homedata(val){
      this.endTime =this.$util.ToTimeTamp(this.homedata.EndDateTime);
      if(this.homedata.Status === 0){
        this._countDown(this.endTime);
      }
    }
  },
  methods: {
    _getVoteHomePage({VoteId,Name,Type,PageNumber}){
      this.$api.VoteHomePage(VoteId,Name,Type,PageNumber,8)
      .then(res=>{
        this.rankBg = res.Data.OptionBackGType === 1? true: false;
        this.VoteButtonImg = res.Data.VoteButtonImg;
        this.votelist = res.Data.VoteOption;
        // console.log(this.votelist);
        // console.log(res.Data.VoteOption);
        // if(res.Data.VoteOption.length > 0){
        //   this.getVoteHomePageJson.PageNumber++;
        // }
        this.$nextTick(()=>{
          this._initScroll();
        })
      })
    },
    _getMoreHomePage({VoteId,Name,Type,PageNumber}){
      let List = this.votelist;
      this.$api.VoteHomePage(VoteId,Name,Type,PageNumber,8)
      .then(res=>{
        this.rankBg = res.Data.OptionBackGType === 1? true: false;
        this.VoteButtonImg = res.Data.VoteButtonImg;
        if(res.Data.VoteOption.length > 0){
          this.votelist = List.concat(res.Data.VoteOption);
        }else{
          this.votelist = List;
          this.getVoteHomePageJson.PageNumber--;
        }
        this.$nextTick(()=>{
          this._initScroll();
        })
      })
    },
    _countDown(endDateStr){
      const _this = this;
      // 结束时间
      let endDate = new Date(endDateStr);
      // 当前时间
      let nowDate = new Date();
      // 相差的总秒数
      var totalSeconds = parseInt((endDate - nowDate) / 1000);
      // 天数（转换成字符串类型，以防网不好的情况下，出现now）
      var day = totalSeconds / (60 * 60 * 24);
      var days=null;
      days=day.toString().split(".")[0];
      // 取模（余数）
      var modulo = totalSeconds % (60 * 60 * 24);
      // 小时数
      var hours = Math.floor(modulo / (60 * 60));
      modulo = modulo % (60 * 60);
      // 分钟
      var minutes = Math.floor(modulo / 60);
      //赋值
      this.countdown.d = days;
      this.countdown.h = hours;
      this.countdown.m = minutes;
      // 延迟一秒执行自己
      setTimeout(function() {
        if (endDate >= nowDate) {
         _this._countDown(endDateStr);
        }
      }, 1000)
    },
    tabSelect(state){
      this.tab = state;
      this.getVoteHomePageJson.Type = state == 'new'?1:2;
      this.getVoteHomePageJson.PageNumber = 1;
      this._getVoteHomePage(this.getVoteHomePageJson);
    },
    _initScroll(){ 
      if(!this.scroll){
        this.scroll = new BScroll(this.$refs.listwrapper,{
          click:true,
        });
        this.scroll.on('touchEnd', (pos) => {
          // 下拉动作
          if(this.scroll.y <= (this.scroll.maxScrollY - 50 )){
            this.getVoteHomePageJson.PageNumber++;
            this._getMoreHomePage(this.getVoteHomePageJson);
          }
        })
      }else{
        this.scroll.refresh();
      }
    },
    search(){
      CheckWxScroll()
      this.$emit('ourblur');
      this.getVoteHomePageJson.Name = this.searchStr;
      this.getVoteHomePageJson.PageNumber = 1;
      this._getVoteHomePage(this.getVoteHomePageJson);
    },
    vote(VoteOptionId){
      if(this.voteButtonState){
        if(this.homedata.Status == 0){
          this.voteButtonState = false;
          this.$api.AddVote(VoteOptionId,sessionStorage.getItem('VoteId'),sessionStorage.getItem('DeviceType'))
          .then(res=>{
            this.$emit('vote-add');
            this.getVoteHomePageJson.PageNumber = 1;
            this._getVoteHomePage(this.getVoteHomePageJson);
            if(res.Data && res.Data.Url){
              if(res.Data.ActivityId>0){
                this.scroll.disable();
                this.$store.commit('UPDATE_SHOW_VOTE_SUCCESS', true);
                this.$store.commit('UPDATE_VOTE_SUCCESS_URL', res.Data.Url);
              }
            }else{
                this.voteButtonState = true;
                this.$util.layer(res.Message,7,2000);
                this._getVoteHomePage(this.getVoteHomePageJson);
            }
          })
        }else if(this.homedata.Status == 1){
          this.$util.layer('投票暂停中，请联系主办方',7,2000)
        }else if(this.homedata.Status == 2 || this.homedata.Status == 3 || this.homedata.Status == 5){
          this.$util.layer('投票尚未开始',7,2000)
        }else if(this.homedata.Status == 8){
          this.$util.layer('投票已结束',7,2000)
        }
      }
    },
    scrollable(){
      this.scroll.enable();
      this.voteButtonState = true;
    }, 
    _focus(){
      this.$emit('ourfocus');
    },
    Details(VoteOptionId){
      this.$router.push('/partyInfoPage');
      sessionStorage.setItem('VoteOptionId',VoteOptionId)
    },
    imgSplit(imgs){
      return imgs.split(',')[0];
    }
  },
  computed: {
    isNew(){
      return this.tab == 'new';
    },
    ranklistBg(){
      return this.rankBg? '#FFFFFF':'#63C7FF'; 
    },
    ranklistBorder(){
      return this.rankBg? 'none':'1px solid rgba(120,217,253,1)'; 
    },
    status(){
      if(this.homedata){
        switch (this.homedata.Status) {
          case 1:
            return '活动暂停'
            break;
          case 2:
            return '活动即将开始'
            break;
          case 3:
            return '活动待发布'
            break;
          case 5:
            return '活动待支付'
            break;
          case 8:
            return '活动已结束'
            break;
          case 9:
            return '活动强制下线'
            break;
        }
      }
    }
  },
  components: {
    enrollBtn,
    VoteSuccess
  }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../../css/tool";
.banner {
  height: 425px;
  & > img {
    width: 100%;
    height: 100%;
  }
}
.vote_state {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  .count_down {
    margin-top: 60px;
    width: 630px;
    height: 70px;
    line-height: 70px;
    text-align: center;
    background: rgba(255, 255, 255, 0.5);
    font-size: 32px;
  }
  & > ul {
    margin-top: 43px;
    display: flex;
    justify-content: space-around;
    font-size: 34px;
    color: #ffffff;
    & > li {
      height: 82px;
      padding: 6px 105px 5px;
      text-align: center;
      &:first-child {
        border-right: 1px solid rgba(255, 255, 255, 0.5);
      }
    }
  }
}
.search_wrap {
  margin: 44px auto 0;
  width: 710px;
  height: 80px;
  background: rgba(244, 244, 244, 1);
  border-radius: 40px;
  display: flex;
  align-items: center;
  font-size: 30px;
  .icon {
    margin-left: 50px;
    ._icon("./images/search.png",30px,30px);
    width: 35px;
  }
  & > input {
    width: 700px;
    height: 80px;
    margin-left: 20px;
    background: transparent;
    border: 0;
    outline: none;
    &::-webkit-input-placeholder {
      color: rgba(0, 0, 0, 0.25);
    }
  }
}
.vote_wrap {
  margin: 25px 15px 0;
  background: #ffffff;
  position: relative;
  .vote_tab {
    display: flex;
    justify-content: space-around;
    font-size: 30px;
    border-bottom: 1px solid rgba(66,63,61,0.1);
    &>li{
      width: 358px;
      height:82px;
      text-align: center;
      line-height: 82px;
    }
    .selected {
      color: #50a7ff;
      border-bottom: 2px solid #50A7FF;
    }
  }
  .list_wrapper{
    min-height: 1240px;
    // overflow-y: auto;
    bottom: 0; 
    background: #fff;
    position: relative;
    .vote_list{
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      padding: 8px 0 100px 0;
      &>li{
        width: 324px;
        height: 541px;
        position: relative;
        margin: 25px 25px 0 25px;
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        padding: 0 15px 23px;
        box-sizing: border-box;
        &:nth-child(2n){
          margin-right: 0;
          margin-left:0;
        }
        &>h3,.head_img,.theme,.bollat,.vote_button{
          z-index: 5;
        }
        .bg_img{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url(./images/bgColor.png);
          background-size: 100% 100%;
        }
        &>h3{
          color: #fff;
          padding: 18px 145px;
          font-weight:bold;
          font-size: 34px;
        }
        .head_img{
          width: 291px;
          height: 205px;
        }
        .theme_wrap{
          z-index: 500;
          flex: 0 0 85px;
          .theme{
            color: #fff;
            font-size:28px;
            font-weight:500;
            height: 85px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-content: center;
            flex-direction: column;
          }
        }
        .bollat{
          width: 263px;
          flex: 0 0 44px;
          background: #32AEFF;
          border-radius: 10px;
          text-align: center;
          color: #fff;
          .title{
            color: #ECF429;
            font-size: 30px;
          }
        }
        .vote_button{
          width: 237px;
          height: 80px;
          margin-top: 32px;
          &>img{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .noData{
      height: 1040px;
      background: #ffffff;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32px;
      color: #A6A6A6;
      .arrow{
        width: 145px;
        height: 363px;
        position: absolute;
        right: 114px;
        bottom: 148px;
      }
    }
  }
}
</style>
