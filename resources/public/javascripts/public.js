/**
 * document ready handler
 */
$(document).ready(()=>{
    console.log('public.js loaded');

    // Start socket connection
    socketHandler();

    // Refresh the public lottery widget every 10 seconds
    if($('.lottery').length) {
        setInterval(() => {
            getPageAsync(window.location);
        }, 10000);
    }
});

/**
 * Connect socket, handle messages
 */
let applicantAnimationQueue = [];
let applicantAnimationIsRunning = false;
function socketHandler() {
    io = io.connect('', {query: 'lotteryId=' + $('#lotteryId').attr('data-lottery-id')});

    // Hello handler
    io.on('Hello', function(message) {
        console.log(message.type, message);
    });

    // Error handler
    io.on('Error', function(message) {
        console.log(message.type, message);
    });

    // NewApplicant handler
    io.on('NewApplicant', function(message) {
        console.log(message.type, message);
        if($('#applicant'+message.data.LotteryID).length) {
            applicantAnimationQueue.push(message);
        }
    });

    // DrawWinner handler
    io.on('DrawWinner', function(message) {
        console.log(message.type, message);
        if($('#winner'+message.data.LotteryID).length) {
            winnerAnimationHandler(message);
        }
    });

    // Start animation queue handler
    applicantAnimationQueueHandler();
}

/**
 * Run winning animation
 * @param message
 */
function winnerAnimationHandler(message) {
    $('#winner' + message.data.LotteryID + ' .PublicName div').html(message.data.PublicName);
    $('#winner' + message.data.LotteryID + ' .PublicMessage div').html(message.data.PublicMessage);

    // Calculate elemenet height and center position
    let elementHeight = $('#winner' + message.data.LotteryID).outerHeight();
    let elementWidth = $('#winner' + message.data.LotteryID).outerWidth();
    let centerHeight = Math.round(Math.max(0, ($(window).height() - elementHeight) / 2));

    // Set animation targets (default from bottom to top)
    let fromTop = '100%';
    let fromLeft = '0';
    let toTop = '-' + elementHeight + 'px';
    let toLeft = '0';
    if($('#winner' + message.data.LotteryID).hasClass('fromBottom')) {
        // Use defaults
    }
    if($('#winner' + message.data.LotteryID).hasClass('fromTop')) {
        fromTop = '-' + elementHeight + 'px';
    }
    if($('#winner' + message.data.LotteryID).hasClass('fromLeft')) {
        fromTop = centerHeight + 'px';
        toTop = centerHeight + 'px';
        fromLeft = '-' + elementWidth + 'px';
    }
    if($('#winner' + message.data.LotteryID).hasClass('fromRight')) {
        fromTop = centerHeight + 'px';
        toTop = centerHeight + 'px';
        fromLeft = '100%';
    }
    if($('#winner' + message.data.LotteryID).hasClass('toBottom')) {
        // Use defaults
        toTop = '100%';
    }
    if($('#winner' + message.data.LotteryID).hasClass('toTop')) {
        // Use defaults
    }
    if($('#winner' + message.data.LotteryID).hasClass('toLeft')) {
        toTop = centerHeight + 'px';
        toLeft = '-' + elementWidth + 'px';
    }
    if($('#winner' + message.data.LotteryID).hasClass('toRight')) {
        toTop = centerHeight + 'px';
        toLeft = '100%';
    }

    // Set delay times (default short)
    let delayTime = 4000;
    if($('#winner' + message.data.LotteryID).hasClass('delayShort')) {
        // Use default
    }
    if($('#winner' + message.data.LotteryID).hasClass('delayMedium')) {
        delayTime = 8000;
    }
    if($('#winner' + message.data.LotteryID).hasClass('delayLong')) {
        delayTime = 12000;
    }

    // Set movement speed (defaults to fast)
    let moveSpeed = 1000;
    if($('#winner' + message.data.LotteryID).hasClass('moveVeryfast')) {
        moveSpeed = 500;
    }
    if($('#winner' + message.data.LotteryID).hasClass('moveFast')) {
        // Use default
    }
    if($('#winner' + message.data.LotteryID).hasClass('moveSlow')) {
        moveSpeed = 2000;
    }

    // Run animation
    $('#winner' + message.data.LotteryID)
        .css({top: fromTop, left: fromLeft, opacity: 0})
        .animate({top: centerHeight + 'px', left: '0', opacity: 1}, moveSpeed, () => {
            // Play sound
            if ($('#winnerAudio' + message.data.LotteryID).length) {
                $('#winnerAudio' + message.data.LotteryID)[0].currentTime = 0;
                $('#winnerAudio' + message.data.LotteryID)[0].volume = $($('#winnerAudio' + message.data.LotteryID)[0]).attr('audio-volume');
                let promise = $('#winnerAudio' + message.data.LotteryID)[0].play();
                if (promise !== undefined) {
                    promise.then((_) => {}).catch((error) => {});
                }
            }
        })
        .delay(delayTime)
        .animate({top: toTop, left: toLeft, opacity: 0}, moveSpeed);
}

/**
 * Run animations in queue
 */
function applicantAnimationQueueHandler() {
    // Animation queue handling
    setInterval( () => {
        if(applicantAnimationIsRunning == false && applicantAnimationQueue.length > 0) {
            applicantAnimationIsRunning = true;
            let message = applicantAnimationQueue[0];

            $('#applicant' + message.data.LotteryID + ' .PublicName div').html(message.data.PublicName);
            $('#applicant' + message.data.LotteryID + ' .PublicMessage div').html(message.data.PublicMessage);

            // Calculate elemenet height and center position
            let elementHeight = $('#applicant' + message.data.LotteryID).outerHeight();
            let elementWidth = $('#applicant' + message.data.LotteryID).outerWidth();
            let centerHeight = Math.round(Math.max(0, ($(window).height() - elementHeight) / 2));

            // Set animation targets (default from bottom to top)
            let fromTop = '100%';
            let fromLeft = '0';
            let toTop = '-' + elementHeight + 'px';
            let toLeft = '0';
            if($('#applicant' + message.data.LotteryID).hasClass('fromBottom')) {
                // Use defaults
            }
            if($('#applicant' + message.data.LotteryID).hasClass('fromTop')) {
                fromTop = '-' + elementHeight + 'px';
            }
            if($('#applicant' + message.data.LotteryID).hasClass('fromLeft')) {
                fromTop = centerHeight + 'px';
                toTop = centerHeight + 'px';
                fromLeft = '-' + elementWidth + 'px';
            }
            if($('#applicant' + message.data.LotteryID).hasClass('fromRight')) {
                fromTop = centerHeight + 'px';
                toTop = centerHeight + 'px';
                fromLeft = '100%';
            }
            if($('#applicant' + message.data.LotteryID).hasClass('toBottom')) {
                // Use defaults
                toTop = '100%';
            }
            if($('#applicant' + message.data.LotteryID).hasClass('toTop')) {
                // Use defaults
            }
            if($('#applicant' + message.data.LotteryID).hasClass('toLeft')) {
                toTop = centerHeight + 'px';
                toLeft = '-' + elementWidth + 'px';
            }
            if($('#applicant' + message.data.LotteryID).hasClass('toRight')) {
                toTop = centerHeight + 'px';
                toLeft = '100%';
            }

            // Set delay times (default short)
            let delayTime = 2000;
            if($('#applicant' + message.data.LotteryID).hasClass('delayShort')) {
                // Use default
            }
            if($('#applicant' + message.data.LotteryID).hasClass('delayMedium')) {
                delayTime = 3000;
            }
            if($('#applicant' + message.data.LotteryID).hasClass('delayLong')) {
                delayTime = 4000;
            }

            // Set movement speed (defaults to fast)
            let moveSpeed = 1000;
            if($('#applicant' + message.data.LotteryID).hasClass('moveVeryfast')) {
                moveSpeed = 500;
            }
            if($('#applicant' + message.data.LotteryID).hasClass('moveFast')) {
                // Use default
            }
            if($('#applicant' + message.data.LotteryID).hasClass('moveSlow')) {
                moveSpeed = 2000;
            }

            // Run animation
            $('#applicant' + message.data.LotteryID)
                .css({top: fromTop, left: fromLeft, opacity: 0})
                .animate({top: centerHeight + 'px', left: '0', opacity: 1}, moveSpeed, () => {
                    // Play sound
                    if ($('#applicantAudio' + message.data.LotteryID).length) {
                        $('#applicantAudio' + message.data.LotteryID)[0].currentTime = 0;
                        $('#applicantAudio' + message.data.LotteryID)[0].volume = $($('#applicantAudio' + message.data.LotteryID)[0]).attr('audio-volume');
                        let promise = $('#applicantAudio' + message.data.LotteryID)[0].play();
                        if (promise !== undefined) {
                            promise.then((_) => {}).catch((error) => {});
                        }
                    }
                })
                .delay(delayTime)
                .animate({top: toTop, left: toLeft, opacity: 0}, moveSpeed)
                .delay(moveSpeed).queue((next) => {
                    applicantAnimationIsRunning = false;
                    applicantAnimationQueue.shift();
                    next();
                });
        }
    }, 500);
}

/**
 * Get the page async (http get)
 * @param uri
 */
function getPageAsync(uri) {
    $.get({
        url: uri
    }).done( (maincontent) => {
        let bodyContent = /<body[^>]*>((.|[\n\r])*)<\/body>/img.exec(maincontent)[1];
        let divContent = /<div[^>]*>((.|[\n\r])*)<\/div>/img.exec(bodyContent)[0];
        $('.maincontent').replaceWith(divContent);
        window.scrollTo(0,0);
    });
}
