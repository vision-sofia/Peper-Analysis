$(window).on("resize", function () {
        if($(window).width() <= 767) {
            $(".filters li a").attr({
                'href' : '#'
            });
        } else {
            $(".filters li a").removeAttr('href');
        }
    }
)