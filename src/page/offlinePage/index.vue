<template>
 <div class="container">
     <img src="./images/offline.png" />
     <span>该活动已被强制下线</span>
 </div>
</template>

<script type="text/ecmascript-6">
export default {
 data() {
  return {

  }
 },
}
</script>

<style lang="less" scoped>
.container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &>img{
        width:100%;
        margin-top: 200px;
    }
    &>span{
        margin-top: 50px;
        color: #6e6e6e;
    }

}
</style>
