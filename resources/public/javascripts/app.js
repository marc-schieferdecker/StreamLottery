/**
 * document ready handler
 */
$(document).ready(()=>{
    console.log('app.js loaded');

    // Selectpicker
    $('.selectpicker').selectize();

    // Image lightbox
    $( '.imagelightbox' ).imageLightbox({
        arrows: true,
        button: true,
        fullscreen: true,
        overlay: true,
        quitOnImgClick: true
    });

    // Copy to clipboard buttons
    new ClipboardJS('.copyToClipboard');
    $('.copyToClipboard').each((i,e)=>{
        $(e).tooltip({
            trigger: 'click',
            placement: 'bottom'
        }).show();
    });
    $('.copyToClipboard').on('click',(e)=>{
        $(e.target).tooltip().show();
    });
    $(document).on('shown.bs.tooltip', function (e) {
        setTimeout(function () {
            $(e.target).tooltip('hide');
        }, 1500);
    });

    // Colorpickers
    $('.colorpicker').each((i,e)=>{
        $(e).spectrum({
            preferredFormat: "hex",
            showAlpha: true,
            showInput: true,
            showInitial: true,
            color: $('#'+$(e).attr('colorpicker-data-target')).val(),
            cancelText: $(e).attr('colorpicker-text-cancel'),
            chooseText: $(e).attr('colorpicker-text-choose'),
            change: function(color) {
                $('#'+$(e).attr('colorpicker-data-target')).val('rgba('+parseInt(color._r)+','+parseInt(color._g)+','+parseInt(color._b)+','+color._a+')');
                $(e).find('i').css({color: $('#'+$(e).attr('colorpicker-data-target')).val()});
            }
        });
    });

    // Input chars left handler
    $('input[maxlength]').each((i,e)=>{
        $(e).on('keyup', (event) => {
            inputCharsLeftHandler(event, event.target);
        });
    });
});

/**
 * Shows how much chars left for an input field
 * Required attributes in <input>:
 *     maxlength
 *     data-target-maxlength
 * @param e (event)
 * @param element (dom element)
 */
function inputCharsLeftHandler(e,element) {
    let charsLeftTarget = $(element).attr('data-target-maxlength');
    if(charsLeftTarget) {
        let charsMaxlength = $(element).attr('maxlength');
        let charsCount = $(element).val().length;
        $('#' + charsLeftTarget).html((charsMaxlength - charsCount) + '/' + charsMaxlength);
        if (charsCount >= charsMaxlength) {
            e.preventDefault();
        }
    }
}

/**
 * This function checks if two password input fields have the same value
 * @param fieldId
 * @param checkfieldId
 * @returns {boolean}
 */
function checkPassword(fieldId, checkfieldId, errortitle, errormessage) {
    try {
        if($('#'+fieldId).val() != $('#'+checkfieldId).val()) {
            showToast(errortitle,errormessage);
            $('#'+fieldId).addClass('border-danger');
            $('#'+checkfieldId).addClass('border-danger');
        }
        else {
            $('#'+fieldId).removeClass('border-danger');
            $('#'+checkfieldId).removeClass('border-danger');
        }
        return $('#'+fieldId).val() == $('#'+checkfieldId).val();
    } catch (e) {
        console.log(e);
        return false;
    }
}


/**
 * Create a toast an display on the center of the screen
 * @param title
 * @param message
 */
function showToast(title, message) {
    $('<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="3000" style="position: fixed; top: 40%; left: 40%; min-height: 10%; width: 20%; max-width: 20%">\n' +
        '  <div class="toast-header">\n' +
        '    <strong class="mr-auto">' + title + '</strong>\n' +
        '    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">\n' +
        '      <span aria-hidden="true">&times;</span>\n' +
        '    </button>\n' +
        '  </div>\n' +
        '  <div class="toast-body">\n' +
        '' + message + '\n' +
        '  </div>\n' +
        '</div>').appendTo(document.body).toast('show');
}

/**
 * display confirm modal
 * @param msg
 * @param locationHref
 * @param labelMsg
 * @param okMsg
 * @param closeMsg
 */
function modalConfirm(msg, locationHref, labelMsg, okMsg, closeMsg) {
    // Defaults
    labelMsg = typeof labelMsg == 'undefined' ? 'Sicher?' : labelMsg;
    okMsg = typeof okMsg == 'undefined' ? 'Fortfahren' : okMsg;
    closeMsg = typeof closeMsg == 'undefined' ? 'Abbrechen' : closeMsg;

    // Do not try to display multiple modals
    if($('#modalConfirm').length) {
        $('#modalConfirm').remove();
    }

    // Generate modal
    let modalTemplate = '' +
        '<div class="modal fade d-print-none" id="modalConfirm" tabindex="-1" role="dialog" aria-labelledby="jsModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<h4 class="modal-title" id="jsModalLabel">'+labelMsg+'</h4>' +
                        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">'+closeMsg+'</span></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                        '' + msg +
                    '</div>' +
                    '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-danger" onclick="location.href=\''+locationHref+'\';">'+okMsg+'</button>' +
                        '<button type="button" class="btn btn-outline-secondary" data-dismiss="modal">'+closeMsg+'</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';

    // Append modal to body and show it
    $('body').append(modalTemplate);
    $('#modalConfirm').modal({keyboard: true, focus:true, show:true});
}

/**
 * display confirm modal
 * @param msg
 * @param labelMsg
 */
function modalWait(msg, labelMsg) {
    // Defaults
    labelMsg = typeof labelMsg == 'undefined' ? 'Warten' : labelMsg;

    // Do not try to display multiple modals
    if($('#modalWait').length) {
        $('#modalWait').remove();
    }

    // Generate modal
    let modalTemplate = '' +
        '<div class="modal fade d-print-none" id="modalWait" tabindex="-1" role="dialog" aria-labelledby="jsModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<h4 class="modal-title" id="jsModalLabel">'+labelMsg+'</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                        '' + msg +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';

    // Append modal to body and show it
    $('body').append(modalTemplate);
    $('#modalWait').modal({keyboard: false, focus:true, show:true, backdrop: 'static'});
}

/**
 * display info modal
 * @param body
 * @param labelMsg
 * @param closeMsg
 */
function modalInfo(body, labelMsg, closeMsg) {
    // Defaults
    labelMsg = typeof labelMsg == 'undefined' ? 'Info' : labelMsg;
    closeMsg = typeof closeMsg == 'undefined' ? 'Schließen' : closeMsg;

    // Do not try to display multiple modals
    if($('#modalInfo').length) {
        $('#modalInfo').remove();
    }

    // Generate modal
    let modalTemplate = '' +
        '<div class="modal fade d-print-none" id="modalInfo" tabindex="-1" role="dialog" aria-labelledby="jsModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<h4 class="modal-title" id="jsModalLabel">'+labelMsg+'</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                        '' + body +
                    '</div>' +
                    '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-outline-secondary" data-dismiss="modal">'+closeMsg+'</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';

    // Append modal to body and show it
    $('body').append(modalTemplate);
    $('#modalInfo').modal({keyboard: true, focus:true, show:true});
}

/**
 * Check file upload size (limit to 2M)
 * @param fieldname
 * @param element
 */
function checkFileSize(fieldname, element) {
    try {
        let fileSize = (element.files[0].size / 1024 / 1024).toFixed(2);
        if(fileSize > 2) {
            $('#'+fieldname+'FileSize').text(fileSize + 'M (max. 2M)');
            $('#'+fieldname+'FileSize').addClass('text-danger').removeClass('text-success');
            $(element).val('');
        }
        else {
            $('#'+fieldname+'FileSize').text(fileSize + 'M');
            $('#'+fieldname+'FileSize').addClass('text-success').removeClass('text-danger');
        }
    } catch(e) {
        console.log('file upload size check exception', e, element.files);
    }
}
