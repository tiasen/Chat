$(function () {
    var socket = io();
    socket.on('defaultNameResult', function (defaultNameResult) {
        console.log(defaultNameResult);
        var $nick = $('#nick');
        $nick.val(defaultNameResult.name);
        $('#nameBj button').click(function () {            
            $('#nameBj button').attr('disabled', true);
            if ($nick.val().trim() === defaultNameResult.name) {
                showMain(defaultNameResult);
            } else {
                socket.emit('changeName', $nick.val().trim());

            }

        })
    });

    socket.on('memberList',function(result){
        console.log(result);
        $('.memberList ul').empty();
        result.forEach(function(item,i){
            $('.memberList ul').append('<li>'+(i+1)+'.'+item+'</li>');
        })
    })

    socket.on("changeNameResult", function (changeNameResult) {
        if (changeNameResult.success) {
            $('.tips').removeClass('error');
            $('#tipsText').text('昵称修改成功，即将跳转到聊天页...');
            setTimeout(function () {
                showMain(changeNameResult);
            }, 1000)
        } else {
            $('#tipsText').text(changeNameResult.message);
            $('.tips').addClass('error');            
            $('#nameBj button').attr('disabled', false);
        }
    })

    socket.on('chat message', function (msg) {
        var str = '<li><span class="chatName">'
            + msg.name
            + '</span>: <span class="chatDate">'
            + msg.date
            + '</span><br /><span class="chatMsg">'
            + msg.text
            + '</span></li>';
        $('#msgBox').append(str);
        // console.log($('#msgBox').height()-$('#messages').height())
        $('#messages').scrollTop($('#msgBox').height() - $('#messages').height())
    });

    function showMain(result) {
        socket.emit('startChat','start');
        $('#nameBj').hide();
        $('#messages').show();
        // showMain(result);
        $('#m').focus();
        $('form button').click(function () {
            var $m = $('#m');
            socket.emit('chat message', {
                name: result.name,
                date: new Date().toLocaleString(),
                text: $m.val()
            });
            $m.val('');
            return false;
        });

        // socket.on('hi', function (msg) {
        //     $('#msgBox').append($('<li><i></i></li>').text(msg));
        // })
    }




})