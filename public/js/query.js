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
                            <tr>
                                <td> ${result.orderID} </td>
                                <td> ${result.stocknum} </td>
                                <td> ${result.price} </td>
                                <td> ${result.quantity} </td>
                                <td>
                                <button data-orderid="${result.orderID}" class="delete-button btn btn-default btn-md" onclick="delete_order(this)">
                                    <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                                </button>
                            </td>
                            </tr>
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

function delete_order(element) {
    $.ajax({
        method: "post",
        url: "./delete_order",
        data: {
            orderid: $(element).data("orderid")
        },
        success: function(res) {
            console.log(res);
            if (res == 'OK') {
                alert('已成功取消訂單 ' + $(element).data("orderid"));
                window.location = './query.html`';
            } else if (res == 'Timeout') {
                alert( $(element).data("orderid") + '已結束投標，無法修改');
            }
        },
        error: function(err) {
            console.log(err);
            alert('取消失敗');
        }
    })
}
