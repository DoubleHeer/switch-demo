$(function() {
    var current_data;
    var select_data = [{ "model": "总计", "name": "", "firprice": "", "secprice": "", "count": "", "sum_money": "","discount":"","enterprice":"" }];
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

    //数量回车查询
    $(document).on('input porpertychange', '.select_input', function(e) {
        var select = $(this).attr("id");
        var index = select.substring(7);
        var select_length = select_data.length - 1;
        if (isRealNum(index) && index <= select_length) {
            var sum_item = select_data[select_length];
            var item = select_data[index];
            var new_count = $(this).val()
            sum_item.count = setNum(sum_item.count) - setNum(item.count) + setNum(new_count);
            item.count = new_count;

            sum_item.sum_money = setNum(sum_item.sum_money) - setNum(item.sum_money) + setNum(item.count) * setNum(item.secprice);
            item.sum_money = setNum(item.count) * setNum(item.secprice);

            select_data[select_length] = sum_item;
            select_data[index] = item;
            var sumStr = "sum_" + index;

            $("#select_" + select_length).val(sum_item.count);
            $("#sum_" + select_length).html(setFixNum(sum_item.sum_money));
            $("#" + sumStr).html(setFixNum(item.sum_money));
        }
        return;
    });
    //折扣回车查询
    $(document).on('input porpertychange', '.discount_input', function(e) {
        var select = $(this).attr("id");
        var index = select.substring(9);
        var select_length = select_data.length - 1;
        if (isRealNum(index) && index <= select_length) {
            var sum_item = select_data[select_length];
            var item = select_data[index];
            var new_discount = $(this).val()
            item.discount = new_discount;
            sum_item.enterprice = setNum(sum_item.enterprice) - setNum(item.enterprice) + setNum(item.count) * setNum(item.discount) * setNum(item.firprice);
            item.enterprice = setNum(item.count) * setNum(item.discount) * setNum(item.firprice);
            select_data[select_length] = sum_item;
            select_data[index] = item;

            var enterStr = "enterprice_" + index;
            $("#enterprice_" + select_length).html(setFixNum(sum_item.enterprice));
            $("#" + enterStr).html(setFixNum(item.enterprice));
        }
        return;
    });

    //选择框
    $(document).on('click', '.show_box', function(e) {
        if ($(this).is(":checked")) {
            var select = $(this).attr("id");
            var index = select.substring(5);
            if (isRealNum(index) && index < current_data.length) {
                var item = current_data[index];
                select_data.splice(select_data.length - 1, 0, item);
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
        var option = {};
        option.fileName = '开关价格信息';
        option.datas = [{
            sheetData: select_data,
            sheetName: '开关价格信息表',
            sheetFilter: ['model', 'name',  'secprice', 'count', 'sum_money','firprice','discount','enterprice'],
            sheetHeader: ['型号', '名称', '单价', '数量', '金额','原价', '折扣','进价']
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
        strVal = parseFloat(strVal).toFixed(2);
        if (isNaN(strVal)) {
            return 0;
        }
        return strVal;
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
                "<td>" + setFixNum(item.firprice) + "</td>" +
                "<td>" + setFixNum(item.secprice) + "</td>" +
                "</tr>";
        });
        $("#table_data").append(trHtml);
    }

    function setSelectData(data) {
        $('#table_select_data').empty();
        var trHtml = "";
        $.each(data, function(i, item) {
            if (i == (data.length - 1)) {
                trHtml += "<tr>" +
                    // "<td width='40'><input type='checkbox' class='js-check-item' /></td>" +
                    "<td>" + i + "</td>" +
                    "<td>" + str(item.model) + "</td>" +
                    "<td>" + str(item.name) + "</td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td><input type='text' readonly='readonly' class='ipt-gray-style1-xs select_input' id='" + "select_" + i + "' value='" + str(item.count) + "'/></td>" +
                    "<td id='" + "sum_" + i + "'>" + setFixNum(item.sum_money) + "</td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td id='" + "enterprice_" + i + "'>" + setFixNum(item.enterprice) + "</td>" +
                    "</tr>";
            } else {
                trHtml += "<tr>" +
                    // "<td width='40'><input type='checkbox' class='js-check-item' /></td>" +
                    "<td>" + i + "</td>" +
                    "<td>" + str(item.model) + "</td>" +
                    "<td>" + str(item.name) + "</td>" +
                    "<td><img src='../image/images/" + str(item.model) + ".png' height='40' width='40' /></td>" +
                    "<td>" + setFixNum(item.secprice) + "</td>" +
                    "<td><input type='text' class='ipt-gray-style1-xs select_input' id='" + "select_" + i + "' value='" + str(item.count) + "'/></td>" +
                    "<td id='" + "sum_" + i + "'>" + setFixNum(item.sum_money) + "</td>" +
                    "<td></td>" +
                    "<td>" + setFixNum(item.firprice) + "</td>" +
                    "<td><input type='text' class='ipt-gray-style1-xs discount_input' id='" + "discount_" + i + "' value='" + str(item.discount) + "'/></td>" +
                    "<td id='" + "enterprice_" + i + "'>" + setFixNum(item.enterprice) + "</td>" +
                    "</tr>";
            }
        });
        $("#table_select_data").append(trHtml);
    }

    getSwitchDataJson();
});