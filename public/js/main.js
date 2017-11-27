$(document).ready(function() {
    $("#to_two_btn").click(function(){
        if($("#step-1").find("input:invalid").length) {
            
        } else {
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

 // // Example starter JavaScript for disabling form submissions if there are invalid fields
// (function() {
//   "use strict";
//   window.addEventListener("load", function() {
//     var form = document.getElementById("stepOneForm");
//     form.addEventListener("submit", function(event) {
//       if (form.checkValidity() == false) {
//         event.preventDefault();
//         event.stopPropagation();
//       }
//       form.classList.add("was-validated");
//     }, false);
//   }, false);
// }());