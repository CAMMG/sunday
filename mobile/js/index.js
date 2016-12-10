(function(){
    var codeTimer = null;
    var trackId = '';
    var searchURL = window.location.search;  
    if(searchURL!=''){
        searchURL = searchURL.substring(1, searchURL.length);  
        var target = searchURL.split("&");
        try{
            if(target.length>0){
                $.each(target, function(index, item){
                    if(item.split('=')[0]=='trackId'){
                        trackId =item.split('=')[1];
                        return;
                    }
                });
            }
        }catch(e){

        }
    }
    if(new Date() > new Date('12/12/2016 10:00:00')){
        // redParketSuccess();
    }else{
        $('.countdown').downCount({
                date: '12/12/2016 10:00:00',
                offset: +8
            }, function () {
                // redParketSuccess();
        });
        initCount();
    }
    $('.rule-show').on('click', function(){
        $('#rule-box').toggleClass('hide');
    });
    $('.activity-close').on('click', function(event) {
        $('.activity-mask').toggleClass('hide');
        /* Act on the event */
    });
    $('.click-btn, .form-close').on('click', function(event) {
        $('#mask-form').toggleClass('hide');
        $('.to-hide-div').toggleClass('hide');
        /* Act on the event */
    });
    $('.sure-close').on('click', function(event) {
        $('#over').addClass('hide');
        $('input[name="tel"]').val('');
        $('input[name="code"]').val('');
        $('.form-error').text('');
        $('.getCode').text('获取验证码');
        clearInterval(codeTimer);
        codeTimer = null;
        /* Act on the event */
    });
    var btn = document.getElementById('copy');
    var clipboard = new Clipboard(btn);
    function redParketSuccess(){
        var ua = navigator.userAgent.toLowerCase();
        var isWeixin = ua.indexOf('micromessenger') != -1;
        $('.finally-hide').addClass('hide').remove();
        if(isWeixin){
            $('#weChat').removeClass('hide');
            $('.main').addClass('weChat');
        }else{
            $('.main').addClass('toBePaid');
            $('#mxxf').removeClass('hide');
        }        
    }
    readyGetCode();
    readyGetRedparket();
    function readyGetCode(){
        $('.getCode').on('click', function(){
            $('.form-error').text('');
            var tel = $.trim($('input[name="tel"]').val());
            if(!(/^1[34578]\d{9}$/.test(tel))||tel==''){
                $('.form-error').text('请输入正确手机号！');
            }
            if(tel.length==11){
                //获取验证码
                $.ajax({
                    url:'/sunday/api/users/verify-codes',
                    type: 'POST',
                    data:{
                        phoneNum: tel,
                        trackId: trackId,
                        ip:returnCitySN["cip"]
                    },
                    success: function(data){
                        downCountSixty();
                    },
                    error: function(data){
                        if(data.status == 200){
                            downCountSixty();
                        }else if(data.status>200){
                            var errorMessage = $.parseJSON(data.responseText);;
                            $('.form-error').text(errorMessage.message);
                        }
                    }
                })                
            }else{
                $('input[name="tel"]').val(tel);
            }
        });
    }

    function readyGetRedparket(){
        $('.getRedparket').on('click', function(){
            var tel = $.trim($('input[name="tel"]').val());
            var code = $.trim($('input[name="code"]').val());
            $('.form-error').text('');
            if(!(/^1[34578]\d{9}$/.test(tel))||tel==''){
                $('.form-error').text('请输入正确手机号！');
            }else if(code==''){
                $('.form-error').text('请输入验证码！');
            }
            if(tel.length==11&&code!=''){
                $.ajax({
                    url: '/sunday/api/marketing/redPacket',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        phoneNum: tel,
                        verifyCode: code,
                        trackId: trackId,
                        type: 0,
                    },
                    success: function(data){
                        // console.log(data);
                        redParketSuccess();
                        // if(data.errorCode){
                        //     $('.form-error').text(data.message);
                        // }
                        // if(false){
                        //     //if user have got before failed
                        //     $('#over').removeClass('hide');
                        // }else{
                        //     //if success
                        // }
                    },
                    error: function(data){
                        if(data.status>200){
                            var errorMessage = $.parseJSON(data.responseText);;
                            $('.form-error').text(errorMessage.message);
                            if(errorMessage.errorCode==10015){
                                $('#over').removeClass('hide');
                            }
                        }
                    }
                })
            }else{
                $('input[name="tel"]').val(tel);
                $('input[name="code"]').val(code);
            }                
        })
    }
    function downCountSixty(){
        $('.getCode').off('click');
        var count = 59;
        codeTimer = setInterval(function(){
            if(count > 0){
                $('.getCode').addClass('locked');
                $('.getCode').text(count + '秒');
                count --;
            }else{
                $('.getCode').removeClass('locked');
                $('.getCode').text('获取验证码');
                readyGetCode();
                clearInterval(codeTimer);
                codeTimer = null;
            }
        },1000);
    }
    function initCount(){
        $.ajax({
            url: '/sunday/api/marketing/current-datas',
            type: 'get',
            dataType: 'json',
            success: function(data){
                if(typeof data != null){
                    $('#money').text(data.totalNum/100);
                    $('#personCount').text(data.userNum);
                }
            }
        })        
    }
    /*微信分享*/
    $.ajax({
        url: '/sunday/api/weixin/config',
        type: 'GET',
        dataType: 'json',
        data: {url:window.location.href},
        success: function (data) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature,// 必填，签名，见附录1
                jsApiList:[data.jsApiList[0],data.jsApiList[1]] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

        }
    })
    /*分享*/
    wx.ready(function () {
         var shareImgUrl="http://activity.xxfgo.com/sundaypage";
        /*分享:朋友圈*/
        wx.onMenuShareTimeline({
            title: '双12用千万红包撩你，我够不够有诚意！', // 分享标题
            link: window.location.href, // 分享链接
            imgUrl: shareImgUrl+'/activity/mobile/images/shareImg.jpg', // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        /*分享:好友*/
        wx.onMenuShareAppMessage({
            title: '双12用千万红包撩你，我够不够有诚意！', // 分享标题
            desc: '喜相逢年末狂欢，拼团开抢3999万红包加豪礼！！！！', // 分享描述
            link: window.location.href, // 分享链接
            imgUrl: shareImgUrl+'/activity/mobile/images/shareImg.jpg', // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        })
    })
})();