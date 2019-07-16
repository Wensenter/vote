<template>
 <div class="wrapper">
     <div class="form_wrapper">
         <h3 class="form_title">填写参赛信息</h3>
         <div class="form_body" v-for="(item,index) in items" :key="index">
             <div class="form_item" v-if="item.Type === 1|| item.Type === 0 ">
                 <input @blur="inputBlur" type="text" v-model.trim = "inputValue[index]" :maxlength="maxLengthArr[index]" :placeholder="item.PromptMessage">
             </div>
             <div class="form_item" v-if="item.Type === 2">
                 <ul class="imgList">
                    <li class="list_item" v-for="(img,i) in loadImgUrl" :key="i">
                        <img class="deleted" src="./images/deleted.png" @click="deleted(i)">
                        <img class="img_item" :src="img">
                    </li>
                     <li class="load_item">
                         <div class="imgLoad">
                             <i class="add_icon"></i>
                             <span>上传图片</span>
                         </div>
                         <input ref="filElem" class="filElem" type="file" accept="image/*" @click="closeLayer" @change="getFile">
                     </li>
                 </ul>
                 <span>最多可上传4张</span>
             </div>
            <div class="form_item" v-if="item.Type === 3">
                <textarea type="text" @blur="inputBlur" v-model.trim = "inputValue[index]" :maxlength="maxLengthArr[index]" :placeholder="item.PromptMessage"></textarea>
            </div>
         </div>
         <div class="form_footer">
             <button type="button" @click="enRoll">立即报名</button>
         </div>
     </div>
     <EnrollSuccess :str="SuccessStr" v-show="this.$store.state.showEnrollSuccess"></EnrollSuccess>
 </div>
</template>

<script type="text/ecmascript-6">
import EnrollSuccess from "@/components/EnrollSuccess"
import {photoCompress, canvasDataURL, convertBase64UrlToBlob,getOrientation} from '@/utils/photoCompress'
import CheckWxScroll from '@/utils/checkWxScroll'
export default {
 data() {
  return {
      items:[],
      loadImgUrl:[],
      inputValue:[],
      requireds:[],
      FieldName:[],
      SuccessStr:'',
      maxLengthArr:[20,300,50],
      enrollButtonState: true
  }
 },
 mounted () {
    this.$api.VoteApplyField(sessionStorage.getItem('VoteId'))
    .then(res=>{
        this.items = res.Data.VoteApplyField;
        let that = this;
        res.Data.VoteApplyField.map(function(item,index){
            let required = item.IsEmpty == 1?true:false;
            that.inputValue[index]='';
            that.requireds[index] = required;
            that.FieldName[index] = item.FieldName;
        })
        let length = res.Data.VoteApplyField.length - 3;
        for(var i=0; i<length;i++){
            this.maxLengthArr.push(30);
        }  
    })
 },
 methods: {
    getFile(){
        const inputFile = this.$refs.filElem[0].files[0];
        const _this = this;
        if(this.$refs.filElem[0].files[0].size>1024*1024*10){
            this.$util.layer('图片不能大于10M',7,2000);
            return false;
        }
        if(this.loadImgUrl.length == 4){
                    this.$util.layer('最多上传4张图片',7,2000);
                    this.$refs.filElem[0].value = '';
                    return false  
        }else{
            if(inputFile.size/1024 > 1024){
                let quality = 1024*1024/inputFile.size;
                photoCompress(inputFile,{quality},function(base64) {
                    let bl = convertBase64UrlToBlob(base64);
                    _this.$api.Image(bl)
                    .then(res=>{
                        _this.loadImgUrl.push(res.Data.url);
                        _this.$refs.filElem[0].value = '';
                    });  
                })
            }else{
                this.$api.Image(inputFile)
                .then(res=>{
                    this.loadImgUrl.push(res.Data.url+'?imageMogr2/auto-orient');
                    this.$refs.filElem[0].value = '';
                });  
            }
        }
    },
    closeLayer(){
        this.$util.close();
    },
    enRoll(){
        const that = this;
        let filed = [];
        let partyName = '';
        let Declaration = '';
        let falg = true;
        for(var i = 0;i<this.inputValue.length;i++){
            if(i == 0){
                if(this.inputValue[i] == ''){
                    this.$util.layer('请填写'+that.FieldName[i],7,2000);
                    falg = false;
                    return false  
                }else{
                    falg = true;
                    partyName = this.inputValue[i];
                }
            }else if(i == 1){
                if(this.inputValue[i] == ''){
                    this.$util.layer('请填写'+that.FieldName[i],7,2000);
                    falg = false;
                    return false  
                }else{
                    falg = true;
                    Declaration = this.inputValue[i];
                }
            }else if(i == 2){
                if(that.loadImgUrl.length == 0){
                    this.$util.layer('至少上传1张图片',7,2000);
                    falg = false;
                    return false  
                }else{
                    falg = true;
                }
            }else if(i > 2){
                if(that.requireds[i]){
                    if(this.inputValue[i] == ''){
                            this.$util.layer('请填写'+that.FieldName[i],7,2000);
                            falg = false;
                            return false;
                    }else{
                        falg = true;
                        filed.push(this.inputValue[i]);
                    }
                }else{
                    falg = true;
                    filed.push(this.inputValue[i]);
                }
            }
        }
        if(falg){
            if(this.enrollButtonState){
                this.$api.VoteRegister(sessionStorage.getItem('VoteId'),partyName,Declaration,this.loadImgUrl.join(','),filed.join(','),sessionStorage.getItem('DeviceType'))
                .then(res=>{
                    if(res.ResultCode == 1000){
                        this.$store.commit('UPDATE_SHOW_ENROLL_SUCCESS',true);
                        this.SuccessStr = res.Message;
                    }else{
                        this.$util.layer(res.Message,7,2000);
                        this.enrollButtonState = true;
                    }
                });
                this.enrollButtonState = false;
            }
        }
    },
    deleted(i){
        this.loadImgUrl.splice(i,1);
    },
    inputBlur(){
        CheckWxScroll()
    }
 },
 components: {
     EnrollSuccess
 }
}
</script>

<style lang="less" scoped>
@import "../../css/tool";
    .wrapper{
        box-sizing: border-box;
        padding: 42px 35px 35px 44px;
        background: #78D9FD;
        height: 100vh;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .form_wrapper{
            background: #fff;
            padding: 60px 45px 76px;
            .form_title{
                font-size:37px;
                color: #000;
                font-family:PingFang-SC-Medium;
            }
            .form_body{
                .form_item{
                    margin-top: 37px;
                    &>input,&>textarea{
                        width: 100%;
                        box-sizing: border-box;
                        height: 80px;
                        border: 1px solid rgba(220,220,220,1); /*no*/
                        outline: none;
                        font-size: 28px;
                        padding-left: 23px;
                        border-radius: 6px;
                        -webkit-appearance: none; 
                        -webkit-tap-highlight-color: rgba(220,220,220,1);
                        &::-webkit-input-placeholder{
                            color: rgba(196,196,196,1);
                        }
                    }
                    &>textarea{
                        height: 300px;
                        width: 100%;
                        padding: 10px 28px;
                    }
                    .imgList{
                        display: flex;
                        flex-wrap: wrap;
                        .load_item{
                            width: 115px;
                            height: 115px;
                            background: #EBEBEB;
                            overflow: hidden;
                            position: relative;
                            margin-right: 19px;
                            margin-bottom: 17px;
                            .imgLoad{
                                width: 100%;
                                height: 100%;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: center;
                                .add_icon{
                                   ._icon("./images/pic_add.png",22px,22px); 
                                }
                                &>span{
                                    font-size: 22px;
                                    margin-top: 28px;
                                    color: #ADADAD;
                                }
                            }
                            &>input{
                                position: absolute;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                opacity: 0;
                            }
                        }
                        .list_item{
                            width: 115px;
                            height: 115px;
                            background: #EBEBEB;
                            position: relative;
                            margin-right: 19px;
                            margin-bottom: 17px;
                            .deleted{
                                position: absolute;
                                z-index: 100;
                                width: 26px;
                                height: 26px;
                                right: -13px;
                                top: -13px;
                            }
                            .img_item{
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
            }
            .form_footer{
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 137px;
              &>button{
                  width: 549px;
                  height: 82px;
                  outline: none;
                  border: 0;
                  color: #fff;
                  background: #4381FD;
                  border-radius: 11px;
              }
            }
        }
    }
</style>
