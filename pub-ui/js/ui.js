$(function(){
    /*input获得焦点文字改变*/
    $("input[type='text']").each(function(){
        var _input = $(this);
        if(_input[0].value != _input[0].defaultValue){
            _input.css("color","#333");
        }else{
            _input.css("color","#999");
        }
        _input.focus(function(){
            if(_input[0].value == _input[0].defaultValue){
                _input[0].value="";
            }
            _input.css("color","#333");
        })
        _input.blur(function(){
            if(_input[0].value != _input[0].defaultValue){
                _input.css("color","#333");
            }else{
                _input.css("color","#999");
            }
            if(_input[0].value==""){
                _input[0].value=_input[0].defaultValue;
                _input.css("color","#999");
            }
        })
    })
    /*zTree选中有对号*/
    $("#ztree").click(function(){;
        setTimeout(function(){
            $(".tree-selected").remove();
            $(".curSelectedNode").append("<span class='tree-selected'></span>")
        },30)
    });
    function myHeight(){
        /*页面高度计算*/
        var _H = $(window).height();
        $(".aside-left").height(_H);
        $(".main").height(_H);
        /*弹框高度控制*/
        $("div[class*='dialog-box']").css({'max-height':_H-150,'overflow-y':'auto'});
    }
    myHeight();
    $(window).resize(function(){
        myHeight();
    })
    /*左侧active切换*/
    $(".left-list").on("click",".left-list-item",function(){
        $(this).siblings().removeClass("active").end().addClass("active");
    })
    /*标签页*/
    $(".paging a:last-child").css({'border-right': '1px solid #dddddd'});
    $(".paging").on("click","a",function(){
        $(".paging").find("a").removeClass("active");
        $(this).addClass("active");
    })
    //$(".table-style-3 td:nth-of-type(2n)").css({'white-space': 'nowrap'});

        /*checkbox全选/全不选
        *全选项  增加类名js-check-all
        * 子选项 增加类名 js-check-item
        * */
        $(".js-check-all").click(function(){
            var _checkItem = $('.js-check-item');
            this.checked ?  _checkItem.prop("checked", true ):_checkItem.prop("checked", false );
        });
        $('.js-check-item').click(function(){
            var flag=true;
            var _checkAll = $(".js-check-all");
            $('.js-check-item').each(function(){
                if(!this.checked){
                    flag = false;
                }
            });
            flag ?_checkAll.prop('checked', true ):_checkAll.prop('checked', false );
        });
    $('.js-checkbox').on('click','input',function(){

        var _this= $(this);
        var flag= _this.prop('checked');
        if(flag){
            _this.parent().addClass('checked');
            _this.parent().siblings('.js-checkbox').removeClass('checked');
        }
    });
})

