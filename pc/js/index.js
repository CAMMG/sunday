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
        redParketSuccess();
    }else{
        $('.countdown').downCount({
                date: '12/12/2016 10:00:00',
                offset: +10
            }, function () {
                redParketSuccess();
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
        codeTimer=null;
        /* Act on the event */
    });
    // redParketSuccess();
    function redParketSuccess(){
        $('.main').addClass('toBePaid');
        $('.toBePaid .finally-hide').remove();
    }
    $('.countdown').downCount({
            date: '12/12/2016 10:00:00',
            offset: +8
        }, function () {
            $('.finally-hide').empty();
            $('.main').addClass('toBePaid');
            $('.smscode').removeClass('hide');
    });
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
                    dataType: 'json',
                    data:{
                        phoneNum: tel,
                        trackId: trackId,
                        ip:returnCitySN["cip"]
                    },
                    success: function(data){
                    },
                    error: function(data){
                        console.log(data);
                        if(data.status == 200){
                            downCountSixty();
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
                codeTimer=null;
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
})();