$(document).ready(function() {
    $("#to_one_btn").click(function() {
        if ($("#id_stocknum").val().length == 0) {
            console.log("RRRRRRRRRR");
        } else {
            $.ajax({
                method: "post",
                url: "./stockquery",
                data: {
                    stockNum: $("#id_stocknum").val(),
                },
                success: function(res) {
                    console.log(res);
                    if (res.length == 0) {
                        alert('查無此股票編號');
                        $("#id_stocknum").val('');
                    } else {
                        console.log('test endtime: ' + res.endtime);
                        if (Date.now() < Date.parse(res.endtime)) {
                            $("#step-0").hide();
                            $("#step-1").show();
                        } else {
                            alert('此股票已結束競價拍賣');
                            $("#id_stocknum").val('');
                        }
                    }
                },
                error: function(err) {
                    alert('錯誤');
                    console.log(err);
                }
            })
        }
    })
    $("#to_two_btn").click(function(){
        if($("#step-1").find("input:invalid").length) {
            
        } else {
            $("#table_id_stocknum").text($("#id_stocknum").val());
            $("#table_id_account").text($("#id_account").val());
            $("#table_id_bidprice").text($("#id_bidprice").val());
            $("#table_id_bidquantity").text($("#id_bidquantity").val());
            $("#table_id_idnum").text($("#id_idnum").val());
            $("#table_id_bday").text($("#id_bday").val());
            $("#table_id_phone").text($("#id_phone").val());
            $("#table_id_cellphone").text($("#id_cellphone").val());

            $("#step-1").hide();
            $("#step-2").show();
        }
    })

    $("#to_three_btn").click(function(){
        $("#step-2").hide();
        $('#step-3').show();
    })

    $("#to_four_btn").click(function(){
        if($('#read_ckbx').is(':checked')){
            $.ajax({
                method: "post",
                url: "./order",
                data: {
                    stocknum: $("#id_stocknum").val(),
                    account: $("#id_account").val(),
                    bidprice: $("#id_bidprice").val(),
                    bidquantity: $("#id_bidquantity").val(),
                    idnum: $("#id_idnum").val(),
                    bday: $("#id_bday").val(),
                    phone: $("#id_phone").val(),
                    cellphone: $("#id_cellphone").val(),
                },
                success: function(res) {
                    console.log(res);
                    $('#showOrderID').text(res);
                    $("#step-3").hide();
                    $('#step-4').show();
                },
                error: function(err) {
                    console.log(err);
                }
            })
        } else {
            alert('請詳細閱讀後勾選同意');
        }
    })

    $("#to_query").click(function(){
        $("#step-4").hide();
        $('#query').show();
    })
})
