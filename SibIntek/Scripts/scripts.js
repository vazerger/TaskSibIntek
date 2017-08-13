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
                        complete: function () {
                            $('#loader').hide();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if (jqXHR.status == 500) {
                                message.html('Internal error: ' + jqXHR.responseText);
                            } else {
                                message.html('Unexpected error.');
                            }

                            message.removeAttr('class');
                            message.addClass('red');
                        },
                        success: function (data) {
                            if (data.Error == false) {
                                meta.load();
                            }
                            message.html(data.Message);
                            message.removeAttr('class');
                            message.addClass(data.Class);
                            meta.hideMessage();
                        }
                    });
                    $(this).val('');
                    $(this).blur();
                } else {
                    message.html('Write something!');
                    message.removeAttr('class');
                    message.addClass('red');
                    meta.hideMessage();
                }
            }
        },
        Check: function () { // CHECK
            var element = $(this);            
            var label = element.parent().next('.checkbox-label');
            var del = element.parent().next().next().next();
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
                complete: function () {
                    $('#loader').hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status == 500) {
                        message.html('Internal error: ' + jqXHR.responseText);
                    } else {
                        message.html('Unexpected error.');
                    }

                    if (check) {
                        element.removeAttr('checked');
                        del.addClass('hidden');
                    } else {
                        element.prop('checked', true);
                        del.removeClass('hidden');
                    }

                    message.removeAttr('class');
                    message.addClass('red');
                },
                success: function (data) {
                    if (data.Error == false) {
                        if (check) {
                            label.addClass('checked');
                            del.removeClass('hidden');
                        } else {
                            label.removeClass('checked');
                            del.addClass('hidden');
                        }
                    } else {
                        if (check) {
                            element.removeAttr('checked');
                            del.addClass('hidden');
                        } else {
                            element.prop('checked', true);
                            del.removeClass('hidden');
                        }
                    }
                    message.html(data.Message);
                    message.removeAttr('class');
                    message.addClass(data.Class);
                    meta.hideMessage();
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
        beforeSend: function() {
            $('#loader').show();
        },
        complete: function() {
            $('#loader').hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 500) {
                message.html('Internal error: ' + jqXHR.responseText);
            } else {
                message.html('Unexpected error.');
            }

            message.removeAttr('class');
            message.addClass('red');
        },
        success: function (data) {
            if (data) {
                var s = 0;
                $.each(data, function (id, task) {
                    s++;
                    var checked = "";
                    var delHidden = " hidden";
                    if (task.Check) {
                        checked = " checked";
                        delHidden = "";
                    }
                    result += "<line>" +
                                "<label for=\'checkbox" + task.Id + "\' class=\'small-checkbox-checkbox init\' id=\'string" + task.Id + "\'>" +
                                    "<input class='checkbox-input' id='checkbox" + task.Id + "' type='checkbox'" + checked + ">" +
                                    "<span class='checkbox-flag checkbox-normal-flag'>" +
                                        "<span class='checkbox-flag-icon'></span>" +
                                    "</span>" +
                                    "<span class='checkbox-label'></span>" +
                                "</label>" +
                                "<span class='checkbox-label" + checked + "'>" + task.Name + "</span>" +
                                "<input type=\'hidden\' class=\'hidden\' value=\'" + task.Id + "\' />" +
                                "<span class=\'del" + delHidden + "\' title=\'Delete task\'></span>" +
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

            } else {
                message.html('Data is null');
                message.removeAttr('class');
                message.addClass('red');
            }
        }
    });
        },
        deleteTask: function () { // DELETE
            var message = $('#message');
            var id = $(this).prev().val();
            message.html('');
                    $.ajax({
                        url: '/api/deleteTask',
                        data: { Id: id },
                        type: "POST",
                        dataType: 'json',
                        complete: function () {
                            $('#loader').hide();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if (jqXHR.status == 500) {
                                message.html('Internal error: ' + jqXHR.responseText);
                            } else {
                                message.html('Unexpected error.');
                            }

                            message.removeAttr('class');
                            message.addClass('red');
                        },
                        success: function (data) {
                            if (data.Error == false) {
                                meta.load();
                            }
                            message.html(data.Message);
                            message.removeAttr('class');
                            message.addClass(data.Class);
                            meta.hideMessage();
                        }
                    });

        },
        hideMessage: function () {
            var message = $('#message');
            setTimeout(function () {
                message.html('');
            }, 2000);
        }
    };

    // proxy
    $("body").off('click', '.checkbox-input', $.proxy(meta.Check));
    $("body").on('click', '.checkbox-input', $.proxy(meta.Check));

    $("body").off('keydown', '#iwant', $.proxy(meta.Add));
    $("body").on('keydown', '#iwant', $.proxy(meta.Add));

    $("body").off('click', '.del', $.proxy(meta.deleteTask));
    $("body").on('click', '.del', $.proxy(meta.deleteTask));

    meta.load();

    
});