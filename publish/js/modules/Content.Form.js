VHV.Content.Form = VHV.extend(VHV.Module, {
    rules: {},
    messages: {},
    redirectURL: '',
    reloadAfterSubmit: false,
    displayErrorInline: true,
    clearForm: false,
    typeError: 'error',
    responseMessages: {
        'SUCCESS': "Cập nhật thành công",
        'FAIL': "Cập nhật thất bại"
    },
    placeHolderText: false,
    init: function(success) {
        var that = this;
        for (var i in this.rules) {
            if (this.rules[i] && typeof(this.rules[i]) == 'object') {
                for (var j in this.rules[i]) {
                    if (typeof(this.rules[i][j]) == 'string' && this.rules[i][j].indexOf('javascript:') == 0) {
                        eval('this.rules[i][j] = ' + this.rules[i][j].substr(('javascript:').length) + ';');
                    }
                }
            }
        }
        if (this.saveFormName && !this.itemId && !this.$('fields[name=id]').val()) {
            this.restoreForm();
        }
        VHV.load('3rdparty/jQuery/jquery.validate/jquery.validate.min.js', '3rdparty/jQuery/jquery.form.js', function() {
            if (!VHV.initedValidateMethod) {
                VHV.initedValidateMethod = 1;
                jQuery.validator.addMethod("regex", function(value, element, param) {
                    return value.match(new RegExp(param));
                });
                jQuery.validator.addMethod("call", function(value, element, result) {
                    if (result && result.message) {
                        $(element.form).data('validator').settings.messages[element.name] = result.message;
                    }
                    return this.optional(element) || (result && ((typeof(result) == 'object' && result.status == 'SUCCESS') || typeof(result) != 'object'));
                });
                jQuery.validator.addMethod("username", function(value, element, param) {
                    return !value.match(/[^\w\.\@\-\_]/);
                });
                jQuery.validator.addMethod("email", function(value, element) {
                    return this.optional(element) || (value.match(/^[a-zA-Z0-9]+([-._][a-zA-Z0-9]+)*@([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,4}$/));
                }, '' + "Email sai định dạng" + '');
                jQuery.validator.addMethod("phoneVN", function(value, element) {
                    var value2 = value;
                    value = value.replace(/[\.\s\-]/g, '');
                    return this.optional(element) || ((value.length > 9) && value.replace(/\s+/g, '').match(/^(0|\+?84|\(\+?84\))(9[0-9]|8[1-9]|7[0-3,6-9]|5[2,5,6,8,9]|3[2-9]|2\d{2})\d{7}$/) && !value2.match(/^[\s|\.|\-]+|[\s|\.|\-]+$/));
                }, '' + "Số điện thoại không hợp lệ" + '');
                jQuery.validator.addMethod("phoneVN2", function(value, element) {
                    value = value.replace(/[\.\s\-]/g, '');
                    return this.optional(element) || ((value.length > 9) && /^(\+?84-?\d|04|08|09|0[2-3,5-7])?\d{8}$/.test(value.replace(/\s+/g, '')));
                }, '' + "Số điện thoại không hợp lệ" + '');
                jQuery.validator.addMethod("phoneVN3", function(value, element) {
                    value = value.replace(/[\.\s\-]/g, '');
                    return this.optional(element) || ((value.length > 9) && /^(\+?84|0)(2\d{2}|[3-9]\d)\d{7}$/.test(value));
                }, '' + "Số điện thoại không hợp lệ" + '');
                jQuery.validator.addMethod("phoneLO", function(value, element) {
                    var value2 = value;
                    value = value.replace(/[\.\s\-]/g, '');
                    return this.optional(element) || ((value.length >= 9) && value.match(/^$|^(0|\+?856)(20[2,5,7,9]\d|30[2,5,7,9])\d{6}$/));
                }, '' + "Số điện thoại không hợp lệ" + '');
                jQuery.validator.addMethod("phoneKH", function(value, element) {
                    var value2 = value;
                    value = value.replace(/[\.\s\-]/g, '');
                    return this.optional(element) || ((value.length >= 9) && value.match(/^$|^(0|\+?855)(1[0,1,2,3,5,6,7]|6[1,9]|7[0,7,8,9]|8[0,1,3,4,5,6,7,9]|9[2,3,5,8,9]|18\d|3[1,8]\d|6[0,6,7,8]\d|7[1,6]\d|88\d|9[0,6,7]\d)\d{6}$/));
                }, '' + "Số điện thoại không hợp lệ" + '');
                jQuery.validator.addMethod("phoneKH2", function(value, element) {
                    var value2 = value;
                    value = value.replace(/[\.\s\-]/g, '');
                    return this.optional(element) || ((value.length >= 9) && value.match(/^$|^(0|\+?84)(9[0-9]|8[1-689]|7[06-9]|5[6,8,9]|3[2-9])\d{7}$/));
                }, '' + "Số điện thoại không đúng định dạng" + '');
                jQuery.validator.addMethod("gte", function(value, element, params) {
                    if (params) {
                        var title = $(element).attr('placeholder'),
                            messages = $(element.form).data('validator').settings.messages,
                            target = that.$().find('[name="' + params + '"]');
                        if (!target.length) {
                            target = $(element).parents('form:first').find('[name="' + params + '"]');
                        }
                        if (!title) {
                            title = $(element).parents('.form-group:first').children('label:first').text().replace('(*)', '').trim();
                        }
                        var d2 = check = target.val();
                        if (!d2) {
                            d2 = 0;
                        }
                        if (parseFloat(value) < parseFloat(d2) && check !== '') {
                            if (!messages[$(element).attr('name')]['gte']) {
                                messages[element.name] = (title ? title + ':' : '') + " Phải lớn hơn " + d2;
                            }
                            return false;
                        }
                    }
                    return true;
                }, '' + "Giá trị không hợp lệ" + '');
                jQuery.validator.addMethod("lte", function(value, element, params) {
                    if (params) {
                        var title = $(element).attr('placeholder'),
                            messages = $(element.form).data('validator').settings.messages,
                            target = that.$().find('[name="' + params + '"]');
                        if (!target.length) {
                            target = $(element).parents('form:first').find('[name="' + params + '"]');
                        }
                        if (!title) {
                            title = $(element).parents('.form-group:first').children('label:first').text().replace('(*)', '').trim();
                        }
                        var d2 = check = target.val();
                        if (!d2) {
                            d2 = 0;
                        }
                        if (parseFloat(value) > parseFloat(d2) && check !== '') {
                            if (!messages[$(element).attr('name')]['lte']) {
                                messages[element.name] = (title ? title + ':' : '') + " Phải nhỏ hơn " + d2;
                            }
                            return false;
                        }
                    }
                    return true;
                }, '' + "Giá trị không hợp lệ" + '');
                jQuery.validator.addMethod("notLikeTo", function(value, element, to) {
                    if (to) {
                        var title = $(element).attr('placeholder'),
                            messages = $(element.form).data('validator').settings.messages,
                            valueTo = that.$().find('[name="' + to + '"]').val();
                        if (!valueTo) {
                            valueTo = '';
                        }
                        if (value && valueTo && value.toLowerCase().indexOf(valueTo.toLowerCase()) != -1) {
                            if (!messages[$(element).attr('name')]['notLikeTo']) {
                                messages[element.name] = (title ? title + ':' : '') + " Không được chứa chuỗi " + valueTo.toLowerCase();
                            }
                            return false;
                        }
                    }
                    return true;
                }, '' + "Giá trị không hợp lệ" + '');
                jQuery.validator.addMethod("notEqual", function(value, element, compareValue) {
                    if (compareValue) {
                        var title = $(element).attr('placeholder'),
                            messages = $(element.form).data('validator').settings.messages,
                            compareValues = compareValue.split(';');
                        if (value && compareValues && compareValues.indexOf(value) != -1) {
                            if (!messages[$(element).attr('name')]['notEqual']) {
                                messages[element.name] = (title ? title + ':' : '') + " Không được là " + compareValue;
                            }
                            return false;
                        }
                    }
                    return true;
                }, '' + "Giá trị không hợp lệ" + '');
                jQuery.validator.addMethod("dateVN", function(value, element, params) {
                    if (value) {
                        value = value.replace(/\s+/, ' ').replace(/^\s*(\d)\/(\d\d?)\/(\d{4})(\s\d{1,2}:\d{1,2})\s*?$/, '0$1/$2/$3$4').replace(/^(\d\d)\/(\d)\/(\d{4})/, '$1/0$2/$3').replace(/\s(\d):/, ' 0$1:').replace(/:(\d)$/, ':0$1').trim();
                        var originValue = value;
                        value = value.replace(/\-/g, '/').replace(/\s+(\d{2})\:(\d{2})\:(\d{2})/, '/$1/$2/$3').replace(/\s+(\d{2})\:(\d{2})/, '/$1/$2').replace(/[\s]/g, '');
                        if (value) {
                            var bits = value.split('/'),
                                d = new Date(bits[2], bits[1] - 1, bits[0], bits[3] ? bits[3] : 0, bits[4] ? bits[4] : 0, bits[5] ? bits[5] : 0),
                                messages = $(element.form).data('validator').settings.messages;
                            if (d && d.getDate() != bits[0]) {
                                if (!messages[element.name]) {
                                    messages[element.name] = "Ngày tháng không đúng định dạng dd/mm/YYYY hoặc không tồn tại";
                                } else if (messages[element.name + 'dateVNMessage']) {
                                    messages[element.name] = messages[element.name + 'dateVNMessage'];
                                }
                                return false;
                            }
                            if (d && d.format('d/m/Y H:i') != originValue && d.format('d/m/Y H:i:s') != originValue && d.format('d/m/Y') != originValue) {
                                if (!messages[element.name]) {
                                    messages[element.name] = "Ngày tháng không đúng định dạng dd/mm/YYYY hoặc không tồn tại";
                                } else if (messages[element.name + 'dateVNMessage']) {
                                    messages[element.name] = messages[element.name + 'dateVNMessage'];
                                }
                                return false;
                            }
                            if (VHV.site == 21036) {
                                if (bits[2] < 1970 && !/birthDate/.test(element.name)) {
                                    messages[element.name] = "Ngày tháng năm phải lớn hơn năm 1970";
                                    return false;
                                } else if (bits[2] > 9999) {
                                    messages[element.name] = "Ngày tháng năm phải nhỏ hơn năm 9999";
                                    return false;
                                }
                            }
                            if (bits[2] < 1000 || bits[2] > 9999) {
                                messages[element.name] = "Ngày tháng không đúng định dạng dd/mm/YYYY hoặc không tồn tại";
                                return false;
                            }
                            if (d && ((d.getMonth() + 1) == bits[1])) {
                                var ops = {
                                    lte: "nhỏ hơn hoặc bằng",
                                    gte: "lớn hơn hoặc bằng",
                                    lt: "nhỏ hơn",
                                    gt: "lớn hơn"
                                };
                                for (var op in ops) {
                                    if (params && params[op]) {
                                        var d2, d2Value = params[op];
                                        if (element.form[params[op]]) {
                                            d2Value = element.form[params[op]].value;
                                        }
                                        if (d2Value) {
                                            bits = d2Value.replace(/\-/g, '/').replace(/\s+(\d{2})\:(\d{2})\:(\d{2})/, '/$1/$2/$3').replace(/\s+(\d{2})\:(\d{2})/, '/$1/$2').split('/');
                                            if (bits.length >= 3) {
                                                d2 = new Date(bits[2], bits[1] - 1, bits[0], bits[3] ? bits[3] : 0, bits[4] ? bits[4] : 0, bits[5] ? bits[5] : 0);
                                                if ((d2.getMonth() + 1) != parseInt(bits[1])) {
                                                    return true;
                                                }
                                                if (!d2 || (((op == 'lte') && (d > d2)) || ((op == 'gte') && (d < d2)) || ((op == 'lt') && (d >= d2)) || ((op == 'gt') && (d <= d2)))) {
                                                    if (!messages[element.name + 'OldMessage']) {
                                                        messages[element.name + 'OldMessage'] = messages[element.name];
                                                    }
                                                    if (messages[element.name] && messages[element.name]['dateVN'] && !messages[element.name + 'dateVNMessage']) {
                                                        messages[element.name + 'dateVNMessage'] = messages[element.name]['dateVN'];
                                                    }
                                                    messages[element.name] = params[op + 'Message'] ? params[op + 'Message'] : ('' + "Phải" + ' ' + ops[op] + ' ' + d2Value);
                                                    return false;
                                                }
                                            }
                                        }
                                    }
                                }
                                return true;
                            }
                            if (messages[element.name + 'OldMessage']) {
                                messages[element.name] = messages[element.name + 'OldMessage'];
                            }
                            return false;
                        }
                        return this.optional(element);
                    } else {
                        return true;
                    }
                }, "Ngày tháng không đúng định dạng dd/mm/YYYY hh:ii hoặc không tồn tại");
                var oldValidatorElement = jQuery.validator.prototype.check;
                jQuery.validator.prototype.check = function(element) {
                    var obj = $(element);
                    if (element.id) {
                        if (window.CKEDITOR && window.CKEDITOR.instances[element.id]) {
                            obj = $(element).next('div');
                        } else if ($('#multiSelect-' + element.id).data('pa.smartselect')) {
                            obj = $('#multiSelect-' + element.id).next();
                        } else if ($(element).hasClass('vhv-birthdate')) {
                            obj = $(element).next().find('select');
                        }
                    }
                    obj.removeClass('error');
                    if (obj.hasClass('formNumberInput')) {
                        obj = $(element).prev().removeClass('error');
                        obj = $(element).next('label.error').hide();
                    }
                    if (obj.data('toogle') == 'tooltip') {
                        obj.tooltip('hide');
                    }
                    if (oldValidatorElement) {
                        var result = oldValidatorElement.call(this, element);
                        if (result === false) {
                            obj.addClass('error');
                            setTimeout(function() {
                                if (obj.hasClass('vhv-form-number error')) {
                                    obj = $(element).next().addClass('error');
                                }
                                if (obj.next().length && obj.next()[0].tagName == 'SELECT') {
                                    obj = $(element).next().addClass('error');
                                }
                            }, 100);
                        }
                        return result;
                    }
                };
                jQuery.validator.prototype.getLength = function(value, element) {
                    if (element.id && window.CKEDITOR && CKEDITOR.instances[element.id]) {
                        CKEDITOR.instances[element.id].updateElement();
                        var html = $('#' + element.id).val(),
                            dom = document.createElement("DIV"),
                            validator = $(element.form).data('validator'),
                            countWord = $(element.form).find('.numOfWords[data-for="' + element.name + '"]');
                        if (countWord.data('countBrief')) {
                            html += ' ' + $(element.form).find('textarea[name="fields[brief]"]').val() + ' ' + VHV.notag($(element.form).find('[name="fields[title]"]').val());
                        }
                        html = html.replace(/<script/ig, '&ltscript').replace(/</ig, ' <');
                        dom.innerHTML = html;
                        $(dom).find('figcaption').remove();
                        var text = $.trim(dom.textContent || dom.innerText),
                            lengthOfText = text.length;
                        if (!lengthOfText && !countWord.data('countBrief') && (html.indexOf('<img') != -1 || html.indexOf('<iframe') != -1 || html.indexOf('<video') != -1 || html.indexOf('<audio') != -1)) {
                            lengthOfText = 2;
                        }
                        $(element.form).find('.numOfChars[data-for="' + element.name + '"]').text(lengthOfText);
                        if (countWord.length) {
                            var s = text.replace(/[\-\_\/]/g, '').replace(/[\s,\.\/\"\'\;\:\&\=\+\!\<\>\[\]\{\}\|]+/g, ' ');
                            countWord.text(s ? s.split(' ').filter(function(x) {
                                return x.length > 0;
                            }).length : 0);
                        }
                        var countImages = $(element.form).find('.numOfImages[data-for="' + element.name + '"]');
                        if (countImages.length) {
                            countImages.text($('img', dom).length + ((countWord.data('countBrief') && $(element.form).find('textarea[name="fields[image]"]').val()) ? 1 : 0));
                        }
                        if (validator && validator.settings.rules[element.name] && validator.settings.rules[element.name].maxlength) {
                            $(element.form).find('.remainChars[data-for="' + element.name + '"]').text(validator.settings.rules[element.name].maxlength - lengthOfText);
                        }
                        return lengthOfText;
                    }
                    switch (element.nodeName.toLowerCase()) {
                        case 'select':
                            return $("option:selected", element).length;
                        case 'input':
                            if (this.checkable && this.checkable(element))
                                return this.findByName(element.name).filter(':checked').length;
                            break;
                        default:
                            break;
                    }
                    return $.trim(value).length;
                };
            }
            setTimeout(function() {
                that.$('.numOfChars,.numOfWords').each(function() {
                    var element = $(this).data('for');
                    if (element) {
                        element = that.$('[name="' + element + '"]');
                        if (element.length) {
                            jQuery.validator.prototype.getLength(element.val(), element[0]);
                        }
                    }
                });
            }, 500);
            VHV.Module.prototype.init.call(that, success);
        });
        setTimeout(function() {
            that.$(".input-type-number").each(function() {
                if ($(this).val() != '') {
                    if ($(this).attr('type') == 'text' && $(this).prev().attr('type') != 'hidden') {
                        $('<input type="hidden" class="input-type-number" name="' + $(this).attr('name') + '">').insertBefore($(this));
                        $(this).prev().val($(this).val().toString().replace(/\./g, ''));
                        $(this).removeAttr('name');
                        $(this).val($(this).val().toString().replace(/(\d)(?=(\d{3})+$)/g, '$1.'));
                    } else if ($(this).attr('type') == 'text') {
                        $(this).prev().val($(this).val().toString().replace(/\./g, ''));
                        $(this).val($(this).val().toString().replace(/(\d)(?=(\d{3})+$)/g, '$1.'));
                    };
                };
            });
        }, 1000);
        this.$().on('keypress', '.input-type-number', function(event) {
            var x = event.which || event.keyCode;
            if (x === 48 || x === 49 || x === 50 || x === 51 || x === 52 || x === 53 || x === 54 || x === 55 || x === 56 || x === 57) {
                if (($(this).val() == '' || $(this).val() == 0) && x === 48) {
                    return false;
                } else {
                    if ($(this).attr('type') == 'text' && $(this).prev().attr('type') != 'hidden') {
                        $('<input type="hidden" class="input-type-number" name="' + $(this).attr('name') + '">').insertBefore($(this));
                        $(this).removeAttr('name');
                    }
                }
            } else {
                return false;
            }
        });
        this.$().on('keyup', '.input-type-number', function(event) {
            var num = $(this).val().toString().replace(/\./g, ''),
                num = num.replace(/[^0-9]/g, '');
            $(this).prev().val(num);
            num = num.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1.");
            $(this).val(num);
        });
        if (VHV.site == 21036 && !that.placeHolderText) {
            $('#form' + that.id + ' input').each(function() {
                if ($(this).attr('placeholder')) {
                    if ($(this).parents('.form-group:first').children('label:first').html()) {
                        var htmlLabel = $(this).parents('.form-group:first').children('label:first').html().trim();
                        if (htmlLabel.length) {
                            $(this).removeAttr('placeholder');
                        }
                    }
                }
            });
        }
        $('#form' + that.id).on('change', 'input:not([type="file"])', function() {
            if (this.value && this.value.match(/(^\s|\s$)/)) {
                $(this).val($(this).val().trim());
            }
        });
        this.$().on('click', 'label', function(event) {
            if (!$(this).find('input,select,textarea').length && $(this).parent().hasClass('form-group')) {
                $(this).parent().find('select,input[type=checkbox]:first,input[type=radio]:first').click();
                $(this).parent().find('input[type=text]:first,textarea:first').focus();
            }
        });
        var titleInput = this.$('[name="fields[title]"]');
        if (!titleInput.length) {
            titleInput = this.$('input[name^="fields["][type=text]:not([data-x-suggest]):first');
        }
        if (titleInput.length && titleInput.offset().top < 500) {
            setTimeout(function() {
                if (titleInput[0].name) {
                    titleInput.focus();
                }
            }, 200);
        }
        this.$('[data-x-suggest]').each(function() {
            var input = this,
                value = this.value;
            if (value && (value.length === 24 || value.split(',')[0].length === 24)) {
                $(input).data('value', value);
                VHV.Model($(this).attr('data-x-suggest'))({
                    term: JSON.stringify(value.split(','))
                }, function(response) {
                    var items = JSON.parse(response),
                        label = [];
                    for (var j in items) {
                        if (items[j].label) {
                            label.push(items[j].label);
                        }
                    }
                    if (input.tagName === 'SELECT') {
                        $(input).data('label', label.join(','));
                    } else {
                        $(input).val(label.join(','));
                    }
                    VHV.initSuggest(input);
                });
            }
        });
    },
    beforeSubmit: function() {
        if (VHV.site == 21036) {
            var isOk = true,
                that = this;
            $('#form' + this.id + ' input[type=file]').each(function() {
                if (typeof this.files[0] !== 'undefined') {
                    var maxSize = 10 * 1024 * 1024 + 1,
                        size = this.files[0].size;
                    isOk = maxSize > size;
                    if (!isOk) {
                        if (that.messageType) {
                            VHV.alert('File tải lên tối đa là 10MB', {
                                type: 'error',
                                messageType: that.messageType
                            });
                        } else {
                            VHV.alert('File tải lên tối đa là 10MB', {
                                type: 'error',
                                delay: 3000
                            });
                        }
                    }
                    return isOk;
                }
            });
            return isOk;
        }
    },
    submit: function() {
        if (!this.isSubmiting && !this.isClickSubmiting) {
            var that = this;
            this.isClickSubmiting = true;
            $('#form' + this.id).submit();
            setTimeout(function() {
                that.isClickSubmiting = false;
            }, 3000);
        }
    },
    initEvents: function() {
        this.isSubmiting = false;
        var captcha = $('#form' + this.id + ' input.capcha-text');
        if (captcha.length && captcha[0].name) {
            $('#form' + this.id + ' a.BDC_ReloadLink').attr('title', "Thay đổi mã CAPTCHA");
            for (var i in {
                    rules: 1,
                    messages: 1
                }) {
                if (this[i].captcha) {
                    if (this[i].captcha.remote) {
                        delete this[i].captcha.remote;
                    }
                    this[i][captcha[0].name] = this[i].captcha;
                }
            }
        }
        var that = this,
            isMobile = that.iOS();
        if ($('#form' + this.id).find('.numOfWords[data-for="fields[content]"]').data('countBrief')) {
            $('#form' + this.id).find('[name="fields[title]"],[name="fields[brief]"]').change(function() {
                jQuery.validator.prototype.getLength('', $('#form' + that.id).find('[name="fields[content]"]')[0]);
            });
        }
        that.$('[data-x-suggest]').each(function() {
            if (this.name && $(this).data('value')) {
                var hidden = $('<input name="' + this.name + '" type="hidden">');
                hidden.val($(this).data('value')).data('value', $(this).data('value'));
                $(this).before(hidden);
                this.name = '';
            }
        });
        var validateParams = {
            rules: that.rules,
            messages: that.messages,
            focusInvalid: (typeof that.focusInvalid !== 'undefined') ? that.focusInvalid : (isMobile ? false : true),
            ignore: "[disabled],[contenteditable]",
            success: function(label, element) {
                $(element).parents('.error-parent:first').removeClass('error-parent');
                $(element).parents('.form-group:first,.control-bound:first').find('.error-label:first').addClass('hide').html('');
            },
            submitHandler: function(form, event) {
                var validator = this;
                if (window.CKEDITOR) {
                    for (var instance in CKEDITOR.instances) {
                        if ($('#' + instance).length) {
                            CKEDITOR.instances[instance].updateElement();
                        }
                    }
                }
                if (validator.form()) {
                    $('#form' + that.id + ' input:submit, #form' + that.id + ' button[type="submit"]').prop('disabled', true);
                    if (that.beforeSubmit() === false) {
                        $('#form' + that.id + ' input:submit, #form' + that.id + ' button[type="submit"]').prop('disabled', false);
                        return;
                    }
                    VHV.lastResponseText = null;
                    var ok = !that.isSubmiting;
                    if (VHV.readyFlags[that.id]) {
                        for (var i in VHV.readyFlags[that.id]) {
                            if (VHV.readyFlags[that.id][i]) {
                                ok = false;
                            }
                        }
                    }
                    if (ok) {
                        if (that.targetForm && (typeof(that.targetForm) == 'object')) {
                            that.targetForm.reload(VHV.serializeForm(form), function() {
                                $('#form' + that.id + ' input:submit, #form' + that.id + ' button[type="submit"]').prop('disabled', false);
                            });
                        } else {
                            that.isSubmiting = true;
                            var url = that.submitService ? VHV.Model(that.submitService).url({}, true) : that.submitURL({
                                    cmd: 'submit'
                                }),
                                data = {};
                            if (/\&accountId=(\w+)/.test(url)) {
                                data.accountId = RegExp.$1;
                                url = url.replace(/\&accountId=(\w+)/, '');
                            }
                            jQuery(form).ajaxSubmit({
                                url: url,
                                data: data,
                                success: function(responseText) {
                                    $('#form' + that.id + ' input:submit, #form' + that.id + ' button[type="submit"]').prop('disabled', true);
                                    if (that.gridModuleParentId && VHV.App.modules[that.gridModuleParentId]) {
                                        VHV.App.modules[that.gridModuleParentId].justEdited = 1;
                                    }
                                    var img = that.$('.form-captcha img')[0];
                                    if (img) {
                                        img.src = img.src.replace(/\&t=\d+/, '&t=' + (new Date().getTime()));
                                    }
                                    VHV.lastResponseText = responseText;
                                    that.success(responseText);
                                    $('#form' + that.id + ' img.BDC_CaptchaImage').each(function() {
                                        var src = this.src.split('&x=');
                                        this.src = src[0] + '&x=' + (new Date().getTime());
                                    });
                                    if (!that.clearForm || VHV.site == '21036') {
                                        var status = responseText.indexOf('{') !== -1 ? JSON.parse(responseText)['status'] : responseText;
                                        if (status != 'SUCCESS') {
                                            $('#form' + that.id + ' input:submit, #form' + that.id + ' button[type="submit"]').prop('disabled', false);
                                        }
                                    }
                                },
                                error: function(request, status, error) {
                                    if (that.submitError) {
                                        that.submitError(request, status, error);
                                    }
                                    that.isSubmiting = false;
                                    setTimeout(function() {
                                        $('#form' + that.id + ' input:submit, #form' + that.id + ' button[type="submit"]').prop('disabled', false);
                                    }, 2000);
                                },
                                complete: function() {
                                    if (that.submitComplete) {
                                        that.submitComplete();
                                    }
                                    that.isSubmiting = false;
                                    setTimeout(function() {
                                        $('#form' + that.id + ' input:submit, #form' + that.id + ' button[type="submit"]').prop('disabled', false);
                                    }, 2000);
                                },
                                clearForm: that.clearForm
                            });
                        }
                        return false;
                    } else {
                        var alertLoading = (typeof that.alertLoading !== 'undefined') ? that.alertLoading : 1;
                        if (alertLoading) {
                            VHV.alert('' + "Form hiện đang tải" + '...');
                        }
                    }
                } else {
                    that.validateFail();
                }
            }
        };
        if (!this.displayErrorInline) {
            validateParams.errorPlacement = function(error, element) {
                if (element.data('errorSelector')) {
                    element.parents(element.data('errorSelector') + ':first').addClass('error-parent');
                }
                $(element).parents('.form-group:first,.control-bound:first').find('.error-label:first').removeClass('hide').html(error);
            };
            validateParams.invalidHandler = function(e, validator) {
                that.$('.error-parent').each(function() {
                    var input = $('[data-error-selector]:first', this);
                    if (input.length && !input.hasClass('error')) {
                        $(this).removeClass('error-parent');
                    }
                });
                if (!that.$('.error-label').length) {
                    var count = validator.numberOfInvalids(),
                        messages = [];
                    if (count) {
                        for (var i in validator.errorList) {
                            var prefix = '',
                                elem = validator.errorList[i].element;
                            if (elem) {
                                if (elem.placeholder && !that.notPlaceholder) {
                                    prefix = elem.placeholder + ': ';
                                }
                            }
                            var m = prefix + validator.errorList[i].message;
                            if (messages.indexOf(m) == -1 && messages.length < 4) {
                                messages.push(m);
                            }
                        }
                        $('.lobibox-notify-wrapper').remove();
                        var titleType = that.errorBoxTitle ? that.errorBoxTitle : "Lỗi";
                        if (that.typeError == 'warning') {
                            var titleType = that.warningBoxTitle ? that.warningBoxTitle : "Thông báo";
                        }
                        VHV.alert(messages.join('<br>'), {
                            type: that.typeError,
                            title: count + ' ' + titleType
                        });
                        validator.focusInvalid();
                    }
                }
            };
        }
        for (var i in {
                errorPlacement: 1,
                invalidHandler: 1,
                onkeyup: 1,
                onclick: 1,
                onfocusout: 1,
                onfocusin: 1
            }) {
            if (typeof that[i] !== 'undefined') {
                validateParams[i] = that[i];
            }
        }
        if (this.displayErrorInline && !validateParams.errorPlacement) {
            validateParams.errorPlacement = VHV.Content.Form.errorPlacement;
        }
        if (that.validateParams) {
            validateParams = $.extend(validateParams, that.validateParams);
        }
        var validator = $('#form' + that.id).validate(validateParams);
        if (window.CKEDITOR) {
            $('#form' + that.id + ' textarea').each(function() {
                if (this.id && CKEDITOR.instances[this.id] && this.name && (that.$('.numOfImages[data-for="' + this.name + '"]').length || that.$('.remainChars[data-for="' + this.name + '"]').length)) {
                    (function(that) {
                        CKEDITOR.instances[that.id].on('contentDom', function() {
                            validator.getLength('', that);
                        });
                    })(this);
                }
            });
        }
        var multiDivs = that.$('.multiple-input[id$=multi' + that.id + ']');
        if (multiDivs.length) {
            VHV.load('Common.Input.Multiple', function() {
                multiDivs.each(function() {
                    var obj = this;
                    try {
                        if (!$(obj).data('multiplize')) {
                            var name = obj.id.replace('-multi' + that.id, '');
                            $(obj).multiplize({
                                items: that[name] ? that[name] : []
                            });
                        }
                    } catch (e) {
                        console.log(e);
                    }
                });
            });
        }
        if (that.$('textarea.input-ckeditor[id^="editor' + that.id + '-"]').length) {
            that.$('textarea.input-ckeditor[id^="editor' + that.id + '-"]').each(function() {
                VHV.Content.Form.initCKEditor(this);
            });
        }
        VHV.updateDisplay();
        if (that.$(".bootstrap-table").length) {
            VHV.load('3rdparty/bootstrap-table/dist/bootstrap-table.min.css', '3rdparty/bootstrap-table/dist/extensions/sticky-header/bootstrap-table-sticky-header.min.css', '3rdparty/bootstrap-table/dist/extensions/fixed-columns/bootstrap-table-fixed-columns.css', '3rdparty/bootstrap-table/dist/extensions/dragtable/dragtable.css', '3rdparty/jQuery/jqueryui/themes/smoothness/jquery-ui.css', '3rdparty/bootstrap-table/dist/extensions/jquery-resizable-columns/jquery.resizableColumns.css');
            VHV.load('3rdparty/bootstrap-table/dist/bootstrap-table.min.js', '3rdparty/jQuery/jqueryui/jquery-ui.min.js', function() {
                VHV.load('3rdparty/bootstrap-table/dist/locale/bootstrap-table-vi-VN.min.js', '3rdparty/bootstrap-table/dist/locale/bootstrap-table-en-US.min.js', '3rdparty/bootstrap-table/dist/extensions/jquery-resizable-columns/jquery.resizableColumns.min.js', '3rdparty/bootstrap-table/dist/extensions/sticky-header/bootstrap-table-sticky-header.min.js', '3rdparty/bootstrap-table/dist/extensions/cookie/bootstrap-table-cookie.min.js', '3rdparty/bootstrap-table/dist/extensions/reorder-columns/bootstrap-table-reorder-columns.min.js', '3rdparty/bootstrap-table/dist/extensions/dragtable/jquery.dragtable.js', '3rdparty/bootstrap-table/dist/extensions/fixed-columns/bootstrap-table-fixed-columns.js', '3rdparty/bootstrap-table/dist/extensions/resizable/bootstrap-table-resizable.min.js', '3rdparty/bootstrap-table/dist/extensions/key-events/bootstrap-table-key-events.min.js', '3rdparty/bootstrap-table/dist/extensions/editable/bootstrap-table-editable.min.js', '3rdparty/bootstrap-table/dist/extensions/mobile/bootstrap-table-mobile.min.js', '3rdparty/bootstrap-table/dist/extensions/tableExport.jquery.plugin/tableExport.min.js', '3rdparty/bootstrap-table/dist/extensions/export/bootstrap-table-export.min.js', function() {
                    that.$("table.bootstrap-table").each(function() {
                        var table = $(this),
                            sortname = (that.orderBy && that.orderBy.split) ? that.orderBy.split(' ') : [],
                            cookieId = 'List' + VHV.pageId.replace(/\./g, '') + that.id,
                            height = table.data('stickyHeaderOffsetY');
                        if (!height) height = $('.app-header').height();
                        if (!height) height = $('.cms-header').parent().height();
                        if (!height) height = $('.ant-layout-header-wrapper').height();
                        if (!height) height = $('.navbar-fixed-top').height();
                        if (!height) height = 113;
                        localStorage.removeItem(cookieId + '.bs.table.sortOrder');
                        localStorage.removeItem(cookieId + '.bs.table.sortName');
                        try {
                            table.attr('id', 'bootstrap-table' + that.id).bootstrapTable({
                                sidePagination: (table.data('pagination') == 'true' || table.data('pagination') === true) ? 'client' : 'server',
                                sortName: sortname[0] ? sortname[0] : undefined,
                                stickyHeader: (table.data('stickyHeader') == 'false') ? false : true,
                                stickyHeaderOffsetY: height + 'px',
                                mobileResponsive: table.data('noMobile') ? false : true,
                                checkOnInit: (table.data('checkOnInit') == 'false') ? false : true,
                                search: false,
                                height: table.data('height') ? table.data('height') : '',
                                pagination: (table.data('pagination') == 'true' || table.data('pagination') === true) ? true : false,
                                showColumns: (table.data('showColumns') == 'true' || table.data('showColumns') === true) ? true : false,
                                showExport: (table.data('showExport') == 'true' || table.data('showExport') === true) ? true : false,
                                resizable: (table.data('resizable') == 'true') ? true : false,
                                fixedColumns: (table.data('fixedNumber')) ? true : false,
                                fixedNumber: (table.data('fixedNumber')) ? table.data('fixedNumber') : '',
                                cookieStorage: 'localStorage',
                                cookie: true,
                                cookieIdTable: cookieId,
                                sortOrder: sortname[1] ? sortname[1].toLowerCase() : 'asc',
                                onSort: function(name, order) {
                                    that.orderBy = name + ' ' + order.toUpperCase();
                                    that.reload();
                                    return true;
                                },
                            });
                            if (table.data('fixedNumber')) {
                                table.parents('.fixed-table-body:first').css('overflow-x', 'auto').css('overflow-y', 'auto');
                            }
                        } catch (e) {}
                        if (that.$('.box-body-controls:first').length && !that.$('.box-body-controls:first .fixed-table-toolbar').length) {
                            table.parents('.bootstrap-table:first').find('.fixed-table-toolbar:first').addClass('pull-right').appendTo(that.$('.box-body-controls:first')).find('>div').css('margin-top', 0)
                        }
                    });
                });
            });
        }
        if (VHV.site == 21036 && !that.placeHolderText) {
            $('#form' + that.id + ' input').each(function() {
                if ($(this).attr('placeholder')) {
                    if ($(this).parents('.form-group:first').children('label:first').html()) {
                        var htmlLabel = $(this).parents('.form-group:first').children('label:first').html().trim();
                        if (htmlLabel.length) {
                            $(this).removeAttr('placeholder');
                        }
                    }
                }
            });
        }
    },
    validateFail: function() {},
    saveForm: function() {
        var that = this,
            data = {};
        this.$('[name^="fields["]').each(function() {
            var name;
            if (/^fields\[(\w+)\]$/.test(this.name)) {
                name = RegExp.$1;
            } else {
                return;
            }
            if (that.saveFormExclude && that.saveFormExclude.indexOf(name) != -1) {
                return;
            }
            var value = this.value;
            if (this.type == 'radio' || this.type == 'checkbox') {
                if (!this.checked) return;
            }
            data[name] = value;
        });
        localStorage.setItem(that.saveFormName, JSON.stringify(data));
    },
    restoreForm: function(data) {
        var fromLocalStorage = false;
        if (!data) {
            fromLocalStorage = true;
            data = localStorage.getItem(this.saveFormName);
            if (data) {
                data = JSON.parse(data);
            }
        }
        if (data) {
            VHV.Content.Form.disableCascade = 1;
            for (var i in data) {
                if (fromLocalStorage && this.saveFormExclude && this.saveFormExclude.indexOf(i) != -1) {
                    continue;
                }
                var e = this.$('[name="fields[' + i + ']"]');
                if (!e.length) {
                    e = this.$('[name="filters[' + i + ']"]');
                }
                if (!e.length) {
                    e = this.$('[name="' + i + '"]');
                }
                if (e.length) {
                    if (e[0].type == 'radio') {
                        this.$('[name="fields[' + i + ']"][value="' + data[i] + '"],[name="filters[' + i + ']"][value="' + data[i] + '"]').prop('checked', 'checked');
                    } else if (e[0].type == 'checkbox') {
                        this.$('[name="fields[' + i + ']"],[name="filters[' + i + ']"]').prop('checked', 'checked');
                    } else if (typeof(data[i]) !== 'undefined') {
                        var cascadeParams = e.data('xCascade');
                        if (cascadeParams) {
                            cascadeParams = cascadeParams.split(',');
                            var serviceData = e.data('serviceData');
                            if (serviceData && serviceData.service) {
                                for (var k in cascadeParams) {
                                    var cascadeParam = $.trim(cascadeParams[k]),
                                        p = cascadeParam.indexOf(':'),
                                        name = ((p != -1) ? cascadeParam.substr(0, p) : cascadeParam),
                                        code = ((p != -1) ? cascadeParam.substr(p + 1) : name.replace('filters[', '').replace('fields[', '').replace(']', ''));
                                    if (code) {
                                        serviceData[code] = (data[name] ? data[name] : this.$(((name.indexOf('[') == -1) ? '[name="fields[' + name + ']"],[name="filters[' + name + ']"],' : '') + '[name="' + name + '"]').val());
                                    }
                                }
                                serviceData.value = data[i] + '';
                                VHV.Content.Form._cascadeUpdateInput(e[0], serviceData);
                            }
                        } else if (e[0].id) {
                            var ss = $('#multiSelect-' + e[0].id).data('pa.smartselect');
                            if (ss) {
                                e.val(data[i]);
                                if (ss._isMultiple) {
                                    ss.selectOptions((data[i] + '').split(','));
                                } else {
                                    ss.selectOption(data[i] + '');
                                }
                                ss.closeDropdown();
                            } else if (window.CKEDITOR && CKEDITOR.instances[e[0].id]) {
                                CKEDITOR.instances[e[0].id].setData(data[i]);
                            } else {
                                e.val(data[i]);
                                if (e.hasClass('vhv-form-number')) {
                                    e.next('.formNumberInput').val(data[i]).change();
                                }
                            }
                        } else {
                            e.val(data[i]);
                        }
                    }
                }
            }
            setTimeout(function() {
                VHV.Content.Form.disableCascade = 0;
            }, 1000);
        }
    },
    success: function(responseText) {
        this.$('.captcha-refresh').click();
        var success = false,
            status = responseText,
            alertType = 'error',
            alertMessage = '',
            that = this;
        if (responseText === 'BotDetect') {
            VHV.alert('Mã bảo mật không đúng', {
                'type': 'error',
                'delay': 5000
            });
            this.$('input.capcha-text').addClass('error').focus();
            return;
        }
        if ((typeof(responseText) == 'string') && (responseText.indexOf('{') != -1)) {
            responseText = JSON.parse(responseText);
        }
        if (responseText.status) {
            status = responseText.status;
            alertMessage = responseText.message ? responseText.message : (this.responseMessages[status] ? this.responseMessages[status] : '');
        }
        if (status === 'SUCCESS') {
            if (this.saveFormName) {
                this.saveForm();
            }
            success = true;
            alertType = 'success';
            alertMessage = alertMessage ? alertMessage : '' + "Thành công" + '';
        } else {
            if (responseText.field) {
                responseText.errorField = responseText.field;
            }
            if (responseText.errorField || responseText.errorFields) {
                that.errorField(responseText);
                return;
            }
            alertMessage = alertMessage ? alertMessage : '' + "Thao tác không thành công" + '';
        }
        if (!responseText.silent) {
            VHV.alert(alertMessage, {
                type: alertType,
                delay: 3000
            });
        }
        if (responseText.invalidData) {
            that.downloadImportResult(responseText.invalidData);
        }
        if (success) {
            if (that.clearForm) {
                $('#form' + this.id)[0].reset();
            }
            if (typeof(Storage) !== "undefined") {
                if (localStorage.hasFilter == 0) {
                    $('.main-sidebar').addClass('sidebar-collapse');
                } else if (localStorage.hasFilter == 1) {
                    $('.main-sidebar').removeClass('sidebar-collapse');
                }
            }
            if (this.redirectURL) {
                setTimeout(function() {
                    location = that.redirectURL;
                }, 2000);
            } else
            if (this.reloadAfterSubmit || responseText.reloadAfterSubmit) {
                setTimeout(function() {
                    location.reload();
                }, 1000);
            } else {
                if (this.parent) {
                    if (!responseText.silent) {
                        this.closeModal();
                        if (that.parent.targetForm) {
                            $(document).trigger('VHV.Module.show', {
                                module: that.parent.targetForm
                            });
                        }
                        setTimeout(function() {
                            that.parent.reload((responseText.mode == 'add') ? null : 'current');
                        }, this.reloadDelay ? this.reloadDelay : 100);
                    }
                } else if ($('#module' + this.id).parents('.animatedModal-content').length || this.$().parents('.modal').length) {
                    var gridModuleParentId = this.gridModuleParentId;
                    if (this.$().parents('.modal').length) {
                        this.$().parents('.modal').modal('hide');
                    } else {
                        $('#module' + this.id).parents('.animatedModal-content').parent().find('.close-animatedModal:first').click();
                    }
                    if (this.toInputId && responseText.id) {
                        var data = $('#' + this.toInputId).data('serviceData'),
                            cb = $('#' + this.toInputId).data('popupCallback');
                        if (data) {
                            data.value = responseText.id;
                            VHV.Content.Form._cascadeUpdateInput('#' + this.toInputId, data);
                        } else {
                            $('#' + this.toInputId).val(responseText.id);
                        }
                        if (cb) {
                            cb.call(this);
                        }
                    } else if (gridModuleParentId && VHV.App.modules[gridModuleParentId]) {
                        setTimeout(function() {
                            VHV.App.modules[gridModuleParentId].reload((responseText.mode == 'add') ? null : 'current');
                        }, 3000);
                    }
                } else if (window.currentWorkspace && (this.gridModuleParentId || (this.type == 'Category'))) {
                    var type = this.type,
                        gridModuleParentId = this.gridModuleParentId;
                    currentWorkspace.closeTab();
                    delete VHV.App.modules[this.id];
                    if (type == 'Category') {
                        if (VHV.currentCategoryDiagram) {
                            var response = responseText;
                            VHV.currentCategoryDiagramCallback(response);
                        }
                        if ($.fn.dynatree) {
                            var tree = $('#menu-1 .tree-category:first').dynatree("getTree");
                            if (tree) {
                                tree.options.children = null;
                                tree.reload();
                            }
                        }
                    }
                    if (gridModuleParentId && VHV.App.modules[gridModuleParentId]) {
                        setTimeout(function() {
                            VHV.App.modules[gridModuleParentId].reload((responseText.mode == 'add') ? null : 'current');
                        }, 1000);
                    }
                } else if (this.successMesssage) {
                    $('#module' + this.id).html(this.successMesssage);
                }
                if (that.afterSuccess) {
                    that.afterSuccess(responseText);
                }
            }
        }
    },
    downloadImportResult: function(rows) {
        var csvContent = "";
        rows.forEach(function(rowArray) {
            var row = rowArray.map(x => '"' + x + '"').join(",");
            csvContent += row + "\r\n";
        });
        var universalBOM = "\uFEFF";
        var a = window.document.createElement('a');
        a.setAttribute('href', 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM + csvContent));
        a.setAttribute('download', new Date().format('dmy') + '_Ket_qua_import_cau_hoi.csv');
        window.document.body.appendChild(a);
        a.click();
    },
    errorField: function(responseText) {
        if (responseText) {
            if (responseText.errorField) {
                var element = $('#form' + this.id + ' [name="fields[' + responseText.errorField + ']"],#form' + this.id + ' [name="' + responseText.errorField + '"]');
                VHV.Content.Form.errorPlacement(responseText.message, element);
                element.focus();
            } else if (responseText.errorFields) {
                var first = true;
                for (var i in responseText.errorFields) {
                    var element;
                    if (!isNaN(i)) {
                        element = $('#form' + this.id + ' [name="fields[' + responseText.errorFields[i] + ']"],#form' + this.id + ' [name="' + responseText.errorFields[i] + '"]');
                        VHV.Content.Form.errorPlacement(responseText.message, element);
                    } else {
                        element = $('#form' + this.id + ' [name="fields[' + i + ']"],#form' + this.id + ' [name="' + i + '"]');
                        VHV.Content.Form.errorPlacement(responseText.errorFields[i], element);
                    }
                    if (first) {
                        first = false;
                        element.focus();
                    }
                }
            }
        }
    },
    closeModal: function() {
        if (this.$().parents('.modal').length) {
            this.$().parents('.modal').modal('hide');
        } else if (this.$().parents('.animatedModal-content').length) {
            this.$().parents('.animatedModal-content').parent().find('.close-animatedModal:first').click();
        } else {
            this.$().hide();
        }
    },
    exportExcel: function(options) {
        var that = this;
        if (this.filters && VHV.sizeof(this.filters)) {
            options.filters = $.extend(options.filters ? options.filters : {}, this.filters);
        }
        if (this.orderBy && typeof(this.orderBy) == 'string') {
            options.orderBy = this.orderBy;
        }
        if (this.type) {
            options.type = this.type;
        }
        location = VHV.Model(options.exportMethod ? options.exportMethod : VHV.changeTail(this.service, 'exportExcel')).url(options);
    },
    iOS: function() {
        var iDevices = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'];
        if (!!navigator.platform) {
            while (iDevices.length) {
                if (navigator.platform === iDevices.pop()) {
                    return true;
                }
            }
        }
        return false;
    }
});
VHV.Content.Form.refreshCaptcha = function(target) {
    var date = new Date();
    var captcha_time = date.getTime();
    $(typeof(target) != 'undefined' ? target : "#reg-captchaimage-student img").attr({
        src: staticURL + '3rdparty/captcha_simple/create_image.php?' + captcha_time
    });
};
VHV.Content.Form.cascadeUpdate = function(obj, fields, relateFields, name, value) {
    var form = obj.form,
        code = name ? name : obj.name.replace('fields[', '').replace(']', ''),
        extendData = {},
        moduleId = form.id,
        currentModule, lastDisableReload = false;
    if (moduleId) {
        moduleId = moduleId.toString().replace('form', '');
    }
    if (moduleId) {
        currentModule = VHV.App.modules[moduleId];
        if (currentModule) {
            lastDisableReload = currentModule.disableReload;
            currentModule.disableReload = 1;
        }
    }
    extendData[code] = value ? value : $(obj).val();
    if (relateFields) {
        for (var i in relateFields) {
            var fromField = relateFields[i],
                toField = relateFields[i];
            if (typeof(i) != 'number') {
                fromField = i;
            }
            var field = form['fields[' + fromField + ']'];
            if (!field) {
                field = form[fromField];
            }
            if (field) {
                extendData[toField] = $(field).val();
            }
        }
    }
    for (var i = 0; i < fields.length; i++) {
        var field = form['fields[' + fields[i] + ']'];
        if (!field) {
            field = form[fields[i]];
        }
        var data = $(field).data('serviceData');
        if (field && data && data.service) {
            $.extend(data, extendData);
            VHV.Content.Form._cascadeUpdateInput(field, data);
        }
    }
    if (currentModule) {
        currentModule.disableReload = lastDisableReload;
    }
};
VHV.Content.Form.isCascading = 0;
VHV.Content.Form._cascadeUpdateInput = function(field, data) {
    var obj = $(field),
        oldValue = (data && data.value) ? data.value : obj.val(),
        temp = obj.next(),
        mcDropdown = true,
        isMultiSelect = !!temp.data('pa.smartselect'),
        ss;
    if (!temp.attr('id') || ((temp.attr('id').indexOf('multi-input') == -1) && (temp.attr('id').indexOf('multiSelect-input') == -1))) {
        temp = obj;
        mcDropdown = false;
    }
    VHV.Content.Form.isCascading++;
    VHV.Model(data.service)(data, function(responseText) {
        var items, option = temp.find('option[value=""]'),
            checkOneItem = false;
        if (option.length) {
            option = {
                id: '',
                title: option.text()
            };
        } else {
            option = false;
        }
        if (isMultiSelect) {
            ss = temp.smartselect().getsmartselect();
        }
        temp.empty();
        if (responseText) {
            items = JSON.parse(responseText);
            if (items) {
                if (items.items) {
                    items = items.items;
                }
                if (option) {
                    var hasEmpty = false;
                    for (var i in items) {
                        if (items[i] && !items[i].value && !items[i].id) {
                            hasEmpty = true;
                            break;
                        }
                    }
                    if (!hasEmpty) {
                        var newItems = [option];
                        for (var i in items) {
                            newItems.push(items[i]);
                        }
                        items = newItems;
                    }
                }
                var ids = {};
                for (var j in items) {
                    ids[(typeof(items[j].id) != 'undefined') ? items[j].id : ((typeof(items[j].value) != 'undefined') ? items[j].value : ((typeof(items[j].code) != 'undefined') ? items[j].code : ''))] = j;
                }
                for (var j in items) {
                    temp.append('<option value="' + ((typeof(items[j].id) != 'undefined') ? items[j].id : items[j].code).toString().replace(/"/g, '&quot;') + '"' + (items[j].level ? ' data-level="' + (items[j].level + '').replace(/"/g, '&quot;') + '"' : '') + (items[j].disabled ? ' disabled="disabled"' : '') + '>' + (VHV.notag(items[j].title ? items[j].title : items[j].label) + '') + '</option>');
                }
                if (ss) {
                    ss.syncSelect();
                    var t = [];
                    ss._extractSelectData(t);
                    ss._buildOption(t);
                }
            }
        }
        if ((!items || !VHV.sizeof(items)) && option) {
            temp.append('<option value="' + option.id + '">' + option.title + '</option>');
            obj.val('');
        }
        if (oldValue) {
            if (mcDropdown) {
                var values = (oldValue + '').split(',');
                for (var i = 0; i < values.length; i++) {
                    if (values[i]) {
                        $('option[value="' + values[i] + '"]', temp).attr('selected', 'selected');
                    }
                }
                if (isMultiSelect && values.length && ss) {
                    try {
                        if (ss._isMultiple) {
                            ss.selectOptions(values, true);
                        } else {
                            ss.selectOption(values[0], false);
                        }
                    } catch (e) {
                        try {
                            ss.deselectAllOptions();
                        } catch (e) {}
                    }
                    ss.closeDropdown();
                }
                if (isMultiSelect) {
                    window.ss1 = ss;
                    ss.syncSelect();
                } else if (temp.multiselect) {
                    temp.multiselect('refresh');
                }
            } else {
                var values = [];
                obj.find('option').each(function() {
                    values.push($(this).val());
                });
                if (values.indexOf(oldValue) !== -1) {
                    obj.val(oldValue);
                } else {
                    obj.val('');
                }
            }
        }
        if (items && VHV.site == '21036' && data.name && data.type && data.type == 'Form.MultiSelect') {
            $('[name="' + data.name + '"]').parent().find('ul.dropdown-menu').find('li').each(function() {
                var text = $(this).html().replace(/<\/?[^>]+>/gi, '');
                $(this).attr('title', text);
            });
        }
        VHV.Content.Form.isCascading--;
    });
}
VHV.Content.Form.initCKEditor = function(obj) {
    if (!window.CKEDITOR) {
        window.CKEDITOR_BASEPATH = VHV.staticURL + '3rdparty/ckeditor-' + (VHV.ckeVersion ? VHV.ckeVersion : '4.6.2') + '/';
    }
    VHV.load('3rdparty/ckeditor-' + (VHV.ckeVersion ? VHV.ckeVersion : '4.6.2') + '/ckeditor.js', '3rdparty/ckfinder/ckfinder.js', function() {
        if (window.CKEDITOR) {
            if (VHV.language == 'vi') {
                CKEDITOR.config.language = 'vi';
            }
            var editor = CKEDITOR.inline(obj.id, $.extend({
                    height: Math.min(30, obj.height ? obj.height : $(obj).height()),
                    skin: "bootstrapck",
                    width: '98%'
                }, $('#sharedToolbar').length ? {
                    sharedSpaces: {
                        top: 'sharedToolbar'
                    }
                } : {}, $(obj).data('toolbar') ? {
                    toolbar: $(obj).data('toolbar')
                } : {})),
                height = obj.height ? obj.height : $(obj).height();
            if (height > 30) {
                $(obj).next('.cke_textarea_inline').css('min-height', height + 'px');
            }
            CKFinder.setupCKEditor(editor, VHV.staticURL + '3rdparty/ckfinder/');
        }
    });
};
VHV.Content.Form.errorPlacement = function(error, element) {
    if (element.data('errorSelector')) {
        element.parents(element.data('errorSelector') + ':first').addClass('error-parent');
    }
    var control = $(element).parents('.form-group:first,.control-bound:first');
    var child = control.find('[name^="fields"]'),
        appendNext = false;
    if (!control.length || child.length > 1) {
        control = $(element).parent('td,.col-xs-9,.col-sm-6,.col-md-6,.col-md-4,.col-md-3');
        if (!control.length) {
            control = $(element).parent().parent('td,.col-xs-9,.col-sm-6,.col-md-6,.col-md-4,.col-md-3');
        }
        if (!control.length) {
            control = $(element).parent('div');
            if (control.hasClass('qq-upload-button')) {
                control = control.parents('.wrap-file-uploader:first').parent();
            } else if (element[0] && element[0].nodeName !== 'TEXTAREA') {
                appendNext = true;
            }
        }
    }
    if (!control.length) {
        return;
    }
    control = $(control[0]);
    if (typeof(error) === 'string') {
        if (control.find('>.smartselect').length) {
            control.find('>.smartselect').addClass('error');
        } else {
            $(element).addClass('error');
        }
        error = $('<label class="error hide"></label>').html(error);
    }
    error.show().removeClass('hide').css('display', 'inline');
    var placement = $(element).nextAll('label.error:first');
    if (!placement.length && element.attr('name')) {
        placement = control.find('label.error[for="' + element.attr('name') + '"]');
    }
    if (!placement.length && !appendNext) {
        placement = control.find('label.error:first');
    }
    if (!placement.length) {
        if (control.hasClass('group-input-inline')) {
            control.children().not('label').wrapAll('<div class="group-input-inline-div"></div>');
            control.find('.group-input-inline-div').append(error);
        } else if (appendNext) {
            $(element).after(error);
        } else {
            control.append(error);
        }
    } else {
        placement.replaceWith(error);
    }
    if (!error.is(':visible')) {
        var panel = error.parents('.panel-collapse:first');
        if (panel.length && !panel.hasClass('in')) {
            panel.collapse('show');
        }
    }
    var p = control.parent();
    if (p.hasClass('col-md-6') || p.hasClass('col-sm-6') || p.hasClass('col-md-4') || p.hasClass('col-md-3')) {
        p.parent().addClass('row-eq-height');
    }
};