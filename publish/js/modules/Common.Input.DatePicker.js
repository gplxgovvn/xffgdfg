VHV.load('Common.Input.Input', function() {
    VHV.extend('Common.Input.DatePicker', 'Common.Input.Input', {
        draw: function() {
            var that = this,
                options = that.options;
            VHV.load('3rdparty/jQuery/jqueryui/themes/smoothness/jquery-ui.css');
            VHV.load('3rdparty/jQuery/jqueryui/jquery-ui.min.js', function() {
                if (VHV.language == 'vi' && !options.langDefault) {
                    VHV.load('3rdparty/jQuery/jqueryui/ui/i18n/jquery-ui-i18n.min.js', function() {
                        VHV.load('3rdparty/jQuery/jqueryui/ui/i18n/jquery.ui.datepicker-vi.min.js', function() {
                            $.datepicker.setDefaults($.datepicker.regional["vi"]);
                            that.initDatePicker();
                        });
                    });
                } else {
                    that.initDatePicker();
                }
            });
        },
        initDatePicker: function() {
            var that = this,
                options = that.options;
            if (options.langDefault) {
                if (options.langDefault == 'zh-CN') {
                    $.datepicker.regional['zh-CN'] = {
                        closeText: '关闭',
                        prevText: '&#x3c;上月',
                        nextText: '下月&#x3e;',
                        currentText: '今天',
                        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                        monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
                        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
                        weekHeader: '周',
                        dateFormat: 'yy-mm-dd',
                        firstDay: 1,
                        isRTL: false,
                        showMonthAfterYear: true,
                        yearSuffix: '年'
                    };
                }
                $.datepicker.setDefaults($.datepicker.regional[options.langDefault]);
            }
            var obj = that.element,
                value = obj.val();
            if (value && /^\d+$/.test(value)) {
                var d = new Date(parseInt(value) * 1000);
                obj.val(((d.getDate() < 10) ? '0' : '') + d.getDate() + '-' + ((d.getMonth() < 10) ? '0' : '') + d.getMonth() + '-' + d.getFullYear());
            }
            setTimeout(function() {
                var opts = {
                    dateFormat: 'dd/mm/yy',
                    autoClose: true,
                    autoHide: true,
                    changeYear: that.options.changeYear !== false && that.options.changeYear !== 'false',
                    changeMonth: that.options.changeMonth !== false && that.options.changeMonth !== 'false',
                    onSelect: function() {
                        $(this).change();
                    },
                    scrollMonth: false,
                    scrollInput: false
                };
                if (options.yearRange) {
                    if (options.yearRange.from) {
                        opts.yearRange = options.yearRange.from + ':' + (options.yearRange.to ? options.yearRange.to : (new Date()).getFullYear());
                    } else {
                        opts.yearRange = options.yearRange;
                    }
                }
                if (options.maxDate) {
                    opts.maxDate = options.maxDate;
                }
                if (options.minDate) {
                    opts.minDate = options.minDate;
                }
                if (options.noWeekend) {
                    opts.beforeShowDay = function(date) {
                        var day = date.getDay();
                        return [(day != 0), ''];
                    }
                }
                obj.css({
                    'z-index': 10,
                    position: 'relative'
                }).datepicker(opts);
                var check = function() {
                    console.log($(this));
                    setTimeout(function() {
                        var value = obj.val().replace(/^(\d\d?)\/(\d\d?)\/([0-4][0-9])$/, '$1/$2/20$3').replace(/^(\d\d?)\/(\d\d?)\/([5-9][0-9])$/, '$1/$2/19$3').replace(/^\s*(\d\d?)\/(\d\d?)\/(\d{4})(.*)$/, '$1/$2/$3').replace(/^(\d)\/(\d\d?)\/(\d{4})$/, '0$1/$2/$3').replace(/^(\d\d)\/(\d)\/(\d{4})/, '$1/0$2/$3');
                        if (value) {
                            if (!value.match(/^(\d\d)\/(\d\d)\/(\d{4})$/)) {
                                obj.addClass('error');
                            } else if ((new Date(value.replace(/^(\d\d)\/(\d\d)\/(\d{4})$/, '$3/$2/$1'))).format('d/m/Y') != value) {
                                obj.addClass('error');
                            } else {
                                obj.removeClass('error').val(value);
                                var element = that.element[0];
                                if (element && element.id) {
                                    $('label#' + element.id + '-error').hide();
                                }
                            }
                        }
                    });
                };
                obj.change(check);
                if (value) {
                    check();
                }
            }, 500);
            $(".modal,.modal .form-edit" + that.options.mid).scroll(function() {
                if ($(".ui-datepicker:visible").length) {
                    $(".ui-datepicker").hide();
                }
            });
        }
    });
});
$('body').append('<style>.note-icon-date {display: inline-block;position: absolute;right: 10px;bottom: 10px;color: #999;}.form-group{position: relative;}.ui-datepicker select.ui-datepicker-month, .ui-datepicker select.ui-datepicker-year {width: auto !important;}</style>');