
const util = {
    //提取时间戳
    ToTimeTamp (datetime) {
        if (datetime){
            let startIndex = datetime.indexOf('(') + 1,
                endIndex = datetime.indexOf(')');
            return datetime.substring(startIndex, endIndex) * 1;
        }
    },
    layer(str,icon = '',time){
        window.layui.use('layer',function(){
            let layer = window.layui.layer;
            if(icon){
                layer.ready(function(){
                    layer.msg(str, {
                        icon,
                        time
                    })
                })
            }else{
                layer.ready(function(){
                    layer.msg(str)
                })
            }
        })
    },
    close(){
        window.layui.use('layer', function () {
            let layer = window.layui.layer;
            layer.closeAll();
        })
    }
}

export default util;