$(document).ready(function () {

    var meta = {
        Add: function (e) { // ADD
            var message = $('#message');
            message.html('');
            if (e.keyCode == 13) {
                if ($(this).val().length > 0) {
                    $.ajax({
                        url: '/api/addTasks',
                        data: { Name: $(this).val() },
                        type: "POST",
                        dataType: 'json',
                        success: function (data) {
                            if (data.Error == false) {
                                meta.load();
                            }
                            message.html(data.Message);
                            message.removeAttr('class');
                            message.addClass(data.Class);
                        }
                    });
                    $(this).val('');
                    $(this).blur();
                }
            }
        },
        Check: function () { // CHECK
            var element = $(this);            
            var label = element.parent().next('.checkbox-label');
            var id = label.next('.hidden').val();
            var check = false;
            
            var message = $('#message');
            message.html('');

            if (element.is(':checked')) {
                check = true;
            } else {
                check = false;
            }

            $.ajax({
                url: '/api/updateTasks',
                data: { Id: id, Check: check },
                type: "POST",
                dataType: 'json',
                success: function (data) {
                    if (data.Error == false) {
                        if (check) {
                            label.addClass('checked');
                        } else {
                            label.removeClass('checked');
                        }
                    } else {
                        if (check) {
                            element.removeAttr('checked');
                        } else {
                            element.prop('checked', true);
                        }
                    }
                    message.html(data.Message);
                    message.removeAttr('class');
                    message.addClass(data.Class);
                }
            });

        },
        load:function() { // LOAD
        var lines = $('lines');
        var result = "";
        var count = $('count');
        var message = $('#message');
        message.html('');

    $.ajax({
        url: '/api/GetTasks',
        success: function (data) {
            var s = 0;
            $.each(data, function (id, task) {
                s++;
                var checked = "";
                if(task.Check)
                {
                    var checked = " checked";
                }
                result += "<line>" +
                            "<label for=\'checkbox" + task.Id + "\' class=\'small-checkbox-checkbox init\' id=\'string" + task.Id + "\'>" +
                            "<input class='checkbox-input' id='checkbox" + task.Id + "' type='checkbox'" +  checked  + ">" +
                            "<span class='checkbox-flag checkbox-normal-flag'>" +
                            "<span class='checkbox-flag-icon'></span>" + 
                            "</span>" +
                            "<span class='checkbox-label'></span>" + 
                            "</label>" + 
                            "<span class='checkbox-label" + checked + "'>" + task.Name + "</span>" +
                            "<input type=\'hidden\' class=\'hidden\' value=\'" + task.Id + "\' />" +
                            "</line>";

            });

            if (s < 6) {
                for (var i = s; i < 6; i++) {
                    result += "<line></line>";
                }
            }

            lines.empty();
            count.empty();

            count.append(s);
            lines.append(result);
        }
    });
}
    };

    // proxy
    $("body").off('click', '.checkbox-input', $.proxy(meta.Check));
    $("body").on('click', '.checkbox-input', $.proxy(meta.Check));

    $("body").off('keydown', '#iwant', $.proxy(meta.Add));
    $("body").on('keydown', '#iwant', $.proxy(meta.Add));

    meta.load();

    
});