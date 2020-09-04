function getVideo() {
    $.ajax({
        type: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/search',
        data: {
            key: 'AIzaSyDXMQa2QgfRoNXeCMz0pGtn_yXMlE8po_k',
            q: "best mobiles",
            part: 'snippet',
            maxResults: 1,
            type: 'video',
            videoEmbeddable: true,
        },
        success: function(data) {
            embedVideo(data)
        },
        error: function(response) {
            console.log("Request Failed");
        }
    });
}

function embedVideo(data) {
    $('iframe').attr('src', 'https://www.youtube.com/embed/' + data.items[0].id.videoId)
    $('h3').text(data.items[0].snippet.title)
    $('.description').text(data.items[0].snippet.description)
}


function getVideo2() {

    let flag = false;
    let tmp = $('input#model').val();
    if (tmp != "")
        flag = true;

    location.reload();
    if (flag) {
        $.ajax({
            type: 'GET',
            url: 'https://www.googleapis.com/youtube/v3/search',
            data: {
                key: 'AIzaSyDXMQa2QgfRoNXeCMz0pGtn_yXMlE8po_k',
                q: "iphone11",
                part: 'snippet',
                maxResults: 1,
                type: 'video',
                videoEmbeddable: true,
            },
            success: function(data) {
                embedVideo(data)
            },
            error: function(response) {
                console.log("Request Failed");
            }
        });
    }
}