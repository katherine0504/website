$(document).ready(function() {
    $("#quest_query").click(function(){
        if($("#query").find("input:invalid").length) {
            
        } else {
            $.ajax({
                method: "post",
                url: "./order_query",
                data: {
                    userID: $("#id_userID").val(),
                },
                success: function(res) {
                    console.log(res);
                    $('#numofOrder').text(res.length);
                    for (result of res) {
                        $('#query_result').append(
                            `
                            <hr>
                            <li>
                                <h3 style="margin-top:10px"> 訂單編號: ${result.orderID} </h3>
                            </li>
                            <li>
                                <h4> 投標價格 (元): ${result.price} </h4>
                            </li>
                            <li>
                                <h4> 投標數量: ${result.quantity} </h4>
                            </li>
                            `
                        );
                    }
                    $('#result').show();
                },
                error: function(err) {
                    console.log(err);
                }
            })
        }
    })
})