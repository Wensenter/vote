<template>
 <div class="comp-loading">
    <div class="comp-loading-box">
        <img :src="img"/>
    </div>
 </div>
</template>

<script type="text/ecmascript-6">
export default {
 data() {
  return {
      img:'',
  }
 },
 created () {
    let VoteId = sessionStorage.getItem('VoteId');
    let DeviceType = sessionStorage.getItem('DeviceType');
    this.$api.VoteHome(VoteId,DeviceType).
    then(res=>{
        this.img = res.Data.LoadingImg;
    })
 }
}
</script>

<style lang="less" scoped>
    .comp-loading{
        z-index: 10000;
        position: fixed;
        top: 40%;
        left: 50%;
        width: 160px;
        margin-left: -80px;
        padding: 30px 0;
        border-radius: 10px;
        // background-color: rgba(0,0,0,.7);
        img{
            display: block;
            width: 200px;
            height: 200px;
            margin: 0 auto;
            // animation: comp-loading-spin 1200ms infinite linear;
        }
        p{
            font-size: 26px;
            color: #fff;
            text-align: center;
            line-height: 26px;
            padding-top: 14px;
        }
    }
    // @keyframes comp-loading-spin {
    //     0% {transform: rotate(0deg);}
    //     100% {transform: rotate(360deg);}
    // }
</style>
