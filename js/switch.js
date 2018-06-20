$(function() {
    var current_data;
    var select_data = [{
        "model": "总计",
        "name": "",
        "original_price": "",
        "unit_price": "",
        "count": "",
        "amount": "",
        "unit_price_discount": "",
        "purchase_price_discount": "",
        "purchase_price": "",
        "purchase_total_price": ""
    }];

    //全部
    $(document).on('click', '#all_btn', function(e) {
        $("#induce_part").addClass("hide");
        $("#search_type_part").removeClass("hide");
        setShowData(current_data);
        return;
    });
    //选中的
    $(document).on('click', '#select_btn', function(e) {
        $("#induce_part").removeClass("hide");
        $("#search_type_part").addClass("hide");
        setSelectData(select_data);
        return;
    });
    //切换
    $("#switch_data_type").change(function() {
        var switch_file = $("#switch_data_type").val();
        getLocalJson(switch_file);

    });
    //搜索
    $(document).on('click', '#switch_search', function(e) {
        var text = $("#switch_text").val();
        var searchData = searchByIndexOf(text, current_data);
        setShowData(searchData);
        return;
    });
    //回车查询
    $(document).on('keydown', '#switch_text', function(e) {
        var text = $("#switch_text").val();
        var searchData = searchByIndexOf(text, current_data);
        setShowData(searchData);
        return;
    });

    //数量回车查询 改变金额、改变进价总价
    $(document).on('input porpertychange', '.select_input', function(e) {
        var select = $(this).attr("id");
        var index = select.substring(7); //下标
        var select_length = select_data.length - 1; //总长度（最后一行）
        if (isRealNum(index) && index <= select_length) {
            var sum_item = select_data[select_length]; //总计 item
            var item = select_data[index]; //当前改变 item
            var new_count = $(this).val(); //新count
            sum_item.count = setNum(sum_item.count) - setNum(item.count) + setNum(new_count); //总计 先减去旧count，再加新count
            item.count = new_count; //当前item 再赋值新count
            //计算金额 总计 先减去旧的当前item总计，再加上新count*单价
            sum_item.amount = setNum(sum_item.amount) - setNum(item.amount) + setNum(item.count) * setNum(item.unit_price);
            //当前item 赋值计算新的金额
            item.amount = setNum(item.count) * setNum(item.unit_price);

            //计算进价总价 总计 先减去旧的当前item总计，再加上新count*进价单价
            sum_item.purchase_total_price = setNum(sum_item.purchase_total_price) - setNum(item.purchase_total_price) + setNum(item.count) * setNum(item.purchase_price);
            //当前item 赋值计算新的进价总价
            item.purchase_total_price = setNum(item.count) * setNum(item.purchase_price);

            select_data[select_length] = sum_item;
            select_data[index] = item;

            $("#select_" + select_length).val(sum_item.count); //赋值总价count
            $("#sum_" + select_length).html(setFixNum(sum_item.amount)); //赋值总价金额
            $("#sum_" + index).html(setFixNum(item.amount)); //赋值当前行金额
            $("#purchase_total_price_" + index).html(setFixNum(item.purchase_total_price)); //赋值当前行进价总价
        }
        return;
    });
    //进价折扣回车查询 改变进价、改变进价总价
    $(document).on('input porpertychange', '.purchase_price_discount_input', function(e) {
        var select = $(this).attr("id");
        var index = select.substring(24); //purchase_price_discount_
        var select_length = select_data.length - 1;
        if (isRealNum(index) && index <= select_length) {
            var sum_item = select_data[select_length];
            var item = select_data[index];
            var new_discount = $(this).val(); //新进价折扣
            //直接赋值新进价折扣
            item.purchase_price_discount = new_discount;
            //当前item 进价 =  进价折扣*原价
            item.purchase_price = setNum(item.purchase_price_discount) * setNum(item.original_price);
            //新进价总价 总计进价总价 =  旧总价-原先item总价+数量*新进价
            sum_item.purchase_total_price = setNum(sum_item.purchase_total_price) - setNum(item.purchase_total_price) + setNum(item.count) * setNum(item.purchase_price);
            //赋值item总价
            item.purchase_total_price = setNum(item.count) * setNum(item.purchase_price);

            select_data[select_length] = sum_item;
            select_data[index] = item;

            var enterStr = "purchase_total_price_" + index;
            $("#purchase_total_price_" + select_length).html(setFixNum(sum_item.purchase_total_price)); //赋值总价进价总价
            $("#purchase_total_price_" + index).html(setFixNum(item.purchase_total_price)); //赋值当前行进价总价
            $("#purchase_price_" + index).html(setFixNum(item.purchase_price)); //赋值当前行进价单价
        }
        return;
    });

    //单价折扣回车查询  （改变单价、金额）
    $(document).on('input porpertychange', '.unit_price_discount_input', function(e) {
        var select = $(this).attr("id");
        var index = select.substring(20);
        var select_length = select_data.length - 1;
        if (isRealNum(index) && index <= select_length) {
            var sum_item = select_data[select_length];
            var item = select_data[index];
            var new_discount = $(this).val()
            //赋值新单价折扣
            item.unit_price_discount = new_discount;
            //当前item 单价 =  进单价折扣*原价
            item.unit_price = setNum(item.unit_price_discount) * setNum(item.original_price);
            //计算金额 总计 先减去旧的当前item总计，再加上新count*单价
            sum_item.amount = setNum(sum_item.amount) - setNum(item.amount) + setNum(item.count) * setNum(item.unit_price);
            //当前item 赋值计算新的金额
            item.amount = setNum(item.count) * setNum(item.unit_price);

            select_data[select_length] = sum_item;
            select_data[index] = item;

            $("#sum_" + select_length).html(setFixNum(sum_item.amount)); //总价 金额
            $("#unit_price_" + index).html(setFixNum(item.unit_price)); //当前item 单价
            $("#sum_" + index).html(setFixNum(item.amount)); //当前item 金额
        }
        return;
    });
    //点击删除
    $(document).on('click', '.delete_line', function(e) {
        if (window.confirm('确定要删除此行数据')) {
            var select = $(this).attr("id");
            var index = select.substring(12);
            var select_length = select_data.length - 1;
            if (isRealNum(index) && index <= select_length) {
                var sum_item = select_data[select_length];
                var item = select_data[index];
                //计算金额 总计 先减去旧的当前item总计
                sum_item.amount = setNum(sum_item.amount) - setNum(item.amount);
                sum_item.purchase_total_price = setNum(sum_item.purchase_total_price) - setNum(item.purchase_total_price);
                sum_item.count = setNum(sum_item.count) - setNum(item.count);

                select_data[select_length] = sum_item;
                // $("#select_" + select_length).val(sum_item.count); //赋值总价count
                // $("#sum_" + select_length).html(setFixNum(sum_item.amount)); //总价 金额
                // $("#purchase_total_price_" + select_length).html(setFixNum(sum_item.purchase_total_price)); //赋值总价进价总价
                select_data.splice(index, 1);
                // $(this).parent().parent().remove();
                setSelectData(select_data);
            }
            return true;
        } else {
            //alert("取消");
            return false;
        }

    });

    //选择框
    $(document).on('click', '.show_box', function(e) {
        if ($(this).is(":checked")) {
            var select = $(this).attr("id");
            var index = select.substring(5);
            if (isRealNum(index) && index < current_data.length) {
                var item = current_data[index];
                select_data.splice(select_data.length - 1, 0, shadowCopy(item));
            }
        }

        return;
    });
    //重置
    $(document).on('click', '#switch_reset', function(e) {
        $("#switch_text").val("");
        setShowData(current_data);
        return;
    });
    //导出
    $(document).on('click', '#export_excel', function(e) {
        // $("#select_table").table2excel({
        //     name: "开关信息表",
        //     filename: "开关信息表",
        //     exclude_img: true,
        //     exclude_links: true,
        //     exclude_inputs: true
        // });
        // return;
        var option = {};
        option.fileName = '开关价格信息';
        option.datas = [{
            sheetData: select_data,
            sheetName: '开关价格信息表',
            sheetFilter: ['model', 'name', 'count', 'unit_price', 'amount', 'original_price', 'unit_price_discount', 'purchase_price_discount', 'purchase_price', 'purchase_total_price'],
            sheetHeader: ['型号', '名称', '数量', '单价', '金额', '原价', '单价折扣', '进价折扣', '进价', '进价总价']
        }];
        var toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();

        return;
    });

    //利用字符串的indexOf方法
    function searchByIndexOf(keyWord, list) {
        if (!(list instanceof Array)) {
            return;
        }
        var len = list.length;
        var arr = [];
        $.each(list, function(i, item) {
            var model = str(item.model);
            var name = str(item.name);
            if ((model.indexOf(keyWord) >= 0) || (name.indexOf(keyWord) >= 0)) {
                arr.push(list[i]);
            }
        });
        return arr;
    }

    //字符串
    function str(strVal) {
        if (strVal == '' || strVal == null || strVal == undefined) {
            return "";
        }
        return strVal;
    }

    function setNum(strVal) {
        strVal = parseFloat(strVal);
        if (isNaN(strVal)) {
            return 0;
        }
        return strVal;
    }

    function setFixNum(strVal) {
        strVal = saveTwoPlaces(parseFloat(strVal));
        if (isNaN(strVal)) {
            return 0;
        }
        return strVal;
    }

    function saveTwoPlaces(num) {
        return Math.round(num * 100) / 100;
    }

    function isRealNum(val) {
        // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
        if (val === "" || val == null) {
            return false;
        }
        if (!isNaN(val)) {
            return true;
        } else {
            return false;
        }
    }
    //对象浅复制
    function shadowCopy(obj) {
        if (typeof obj !== 'object') return;
        var newObj;
        //保留对象的constructor属性
        if (obj.constructor === Array) {
            newObj = [];
        } else {
            newObj = {};
            newObj.constructor = obj.constructor;
        }
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                newObj[prop] = obj[prop];
            }
        }
        return newObj;
    }

    function getSwitchDataJson() {
        $.ajax({
            url: "../datajson/all_switch_data.json", //json文件位置
            type: "GET", //请求方式为get
            dataType: "json", //返回数据格式为json
            contentType: "application/json",
            success: function(data) {
                setSitchOption(data);
            },
            error: function() {
                alert("加载本地json文件失败,请查看路径是否正确!");
            }
        });
    }

    function setSitchOption(data) {

        $('#switch_data_type').empty();
        var trHtml = "";
        $.each(data, function(i, item) {
            trHtml += "<option value='" + str(item.switch_file) + "'>" + str(item.switch_name) + "</option>";
            if (i == 0) {
                getLocalJson(item.switch_file);
            }
        });
        $("#switch_data_type").append(trHtml);

    }


    function getLocalJson(switch_file) {
        $.ajax({
            url: "../datajson/" + switch_file, //json文件位置
            type: "GET", //请求方式为get
            dataType: "json", //返回数据格式为json
            contentType: "application/json",
            success: function(data) {
                current_data = data;
                setShowData(data);
            },
            error: function() {
                alert("加载本地json文件失败,请查看路径是否正确!");
            }
        });

    }

    function setShowData(data) {
        $('#table_data').empty();
        var trHtml = "";
        $.each(data, function(i, item) {
            trHtml += "<tr>" +
                "<td width='40'><input type='checkbox' class='js-check-item show_box' id='" + "show_" + i + "'/></td>" +
                "<td>" + i + "</td>" +
                "<td>" + str(item.model) + "</td>" +
                "<td>" + str(item.name) + "</td>" +
                "<td><img src='../image/images/" + str(item.model) + ".png' height='40' width='40' /></td>" +
                "<td>" + setFixNum(item.original_price) + "</td>" +
                "<td></td>" +
                "</tr>";
        });
        $("#table_data").append(trHtml);
    }

    function setSelectData(data) {
        $('#table_select_data').empty();
        var trHtml = "";
        $.each(data, function(i, item) {
            if (i == (data.length - 1)) { //最后一行（合计）
                trHtml += "<tr>" +
                    // "<td width='40'><input type='checkbox' class='js-check-item' /></td>" +
                    "<td>" + i + "</td>" +
                    "<td>" + str(item.model) + "</td>" +
                    "<td>" + str(item.name) + "</td>" +
                    "<td></td>" +
                    "<td><input type='text' readonly='readonly' class='ipt-gray-style1-xs select_input' id='" + "select_" + i + "' value='" + str(item.count) + "'/></td>" +
                    "<td></td>" +
                    "<td id='" + "sum_" + i + "'>" + setFixNum(item.amount) + "</td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td id='" + "purchase_total_price_" + i + "'>" + setFixNum(item.purchase_total_price) + "</td>" +
                    "<td></td>" +
                    "</tr>";
            } else {
                trHtml += "<tr>" +
                    // "<td width='40'><input type='checkbox' class='js-check-item' /></td>" +
                    "<td>" + i + "</td>" +
                    "<td>" + str(item.model) + "</td>" +
                    "<td>" + str(item.name) + "</td>" +
                    "<td><img src='../image/images/" + str(item.model) + ".png' height='40' width='40' /></td>" +
                    "<td><input type='text' class='ipt-gray-style1-xs select_input' id='" + "select_" + i + "' value='" + str(item.count) + "'/></td>" +
                    "<td id='" + "unit_price_" + i + "'>" + setFixNum(item.unit_price) + "</td>" +
                    "<td id='" + "sum_" + i + "'>" + setFixNum(item.amount) + "</td>" +
                    "<td><input type='text' class='ipt-gray-style1-xs unit_price_discount_input' id='" + "unit_price_discount_" + i + "' value='" + str(item.unit_price_discount) + "'/></td>" +
                    "<td></td>" +
                    "<td>" + setFixNum(item.original_price) + "</td>" +
                    "<td><input type='text' class='ipt-gray-style1-xs purchase_price_discount_input' id='" + "purchase_price_discount_" + i + "' value='" + str(item.purchase_price_discount) + "'/></td>" +
                    "<td id='" + "purchase_price_" + i + "'>" + setFixNum(item.purchase_price) + "</td>" +
                    "<td id='" + "purchase_total_price_" + i + "'>" + setFixNum(item.purchase_total_price) + "</td>" +
                    "<td><img src='../pub-ui/images/icon-close-gray.png' height='40' width='40' class='delete_line' id='" + "delete_line_" + i + "' title='删除该行' /></td>" +
                    "</tr>";
            }
        });
        $("#table_select_data").append(trHtml);
    }

    getSwitchDataJson();

});