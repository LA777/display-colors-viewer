(function ($) {
    var showColors = function () {
        var columnCount = 3;

        for (var i = 0; i < colors.length; i++) {
            if (i == 0 || i % columnCount === 0) {
                $('.color-cards').append('<div class="row"></div>')
            }

            var rowElement = $('div.color-cards').find('div.row').last();
            rowElement.append(`<div class="col-sm">
                            <button array-index="${i}" class="btn-card color-card color-${colors[i].name}">
                            </button>
                        </div>`);
        }
    };

    var showGradients = function () {
        var columnCount = 3;

        for (var i = 0; i < gradients.length; i++) {
            if (i == 0 || i % columnCount === 0) {
                $('.gradients-cards').append('<div class="row"></div>')
            }

            var rowElement = $('div.gradients-cards').find('div.row').last();
            rowElement.append(`<div class="col-sm">
                            <button array-index="${i}" class="btn-card color-card color-${gradients[i].name}">
                            </button>
                        </div>`);
        }
    };

    var showPictures = function () {
        var columnCount = 3;

        for (var i = 0; i < pictures.length; i++) {
            if (i == 0 || i % columnCount === 0) {
                $('.pictures-cards').append('<div class="row"></div>')
            }

            var rowElement = $('div.pictures-cards').find('div.row').last();
            rowElement.append(`<div class="col-sm">
                            <button array-index="${i}" class="color-card picture-card" 
                                style="background-image: url('pics/${pictures[i].name}.${pictures[i].extension}')">
                            </button>
                        </div>`);
        }
    };

    var paintNextColor = function () {
        log('paintNextColor currentColorIndex: ' + currentColorIndex);
        var nextColorIndex = currentColorIndex + 1;
        if (nextColorIndex > currentCardArray.length - 1) {
            nextColorIndex = 0;
        }
        $('.background').addClass('color-' + currentCardArray[nextColorIndex].name);
        log('background new color: ' + currentCardArray[nextColorIndex].name);
        $('.background').removeClass('color-' + currentCardArray[currentColorIndex].name);
        log('background old color: ' + currentCardArray[currentColorIndex].name);
        currentColorIndex = nextColorIndex;
        log('paintNextColor updated currentColorIndex: ' + currentColorIndex);
    };

    var paintPrevColor = function () {
        log('paintPrevColor currentColorIndex: ' + currentColorIndex);
        var prevColorIndex = currentColorIndex - 1;
        if (prevColorIndex < 0) {
            prevColorIndex = currentCardArray.length - 1;
        }
        $('.background').addClass('color-' + currentCardArray[prevColorIndex].name);
        log('background new color: ' + currentCardArray[prevColorIndex].name);
        $('.background').removeClass('color-' + currentCardArray[currentColorIndex].name);
        log('background old color: ' + currentCardArray[currentColorIndex].name);
        currentColorIndex = prevColorIndex;
        log('paintPrevColor updated currentColorIndex: ' + currentColorIndex);
    };

    var currentColorIndex = 0;
    var currentArrayIndex = 0;
    var currentCardArray = [];
    var isFullScreen = false;
    var isImagesTabActive = false;

    var paintColor = function (colorIndex) {
        var colorIndexNumber = Number(colorIndex);
        log('paintColor colorIndexNumber: ' + colorIndexNumber);
        currentColorIndex = colorIndexNumber;
        $('.background').addClass('color-' + currentCardArray[colorIndexNumber].name);
        log('background color: ' + currentCardArray[colorIndexNumber].name);
    };

    var escapeFullScreen = function () {
        $('.background').hide();
        $('.content').show();
        log('currentColorIndex: ' + currentColorIndex);
        $('.background').removeClass('color-' + currentCardArray[currentColorIndex].name);
        $('.background').removeClass('picture-card');
        $('.background').css('background-image', '');
        log('background old color: ' + currentCardArray[currentColorIndex].name);
        currentColorIndex = 0;
        log('updated currentColorIndex: ' + currentColorIndex);
        isFullScreen = false;
    };

    var displayPicture = function (pictureIndex) {
        var pictureIndexNumber = Number(pictureIndex);
        log('displayPicture pictureIndexNumber: ' + pictureIndexNumber);
        currentArrayIndex = pictureIndexNumber;
        $('.background').css('background-image', `url('pics/${pictures[currentArrayIndex].name}.${pictures[currentArrayIndex].extension}')`);
        $('.background').addClass('picture-card');
        log('background image: ' + pictures[currentArrayIndex].name);
    };

    var displayNextPicture = function () {
        log('displayNextPicture currentArrayIndex: ' + currentArrayIndex);
        var nextArrayIndex = currentArrayIndex + 1;
        if (nextArrayIndex > currentCardArray.length - 1) {
            nextArrayIndex = 0;
        }

        $('.background').css('background-image',
            `url('pics/${pictures[nextArrayIndex].name}.${pictures[nextArrayIndex].extension}')`);

        currentArrayIndex = nextArrayIndex;
        log('displayNextPicture updated currentArrayIndex: ' + currentArrayIndex);
    };

    var displayPrevPicture = function () {
        log('displayPrevPicture currentArrayIndex: ' + currentArrayIndex);
        var nextArrayIndex = currentArrayIndex - 1;
        if (nextArrayIndex < 0) {
            nextArrayIndex = currentCardArray.length - 1;
        }

        $('.background').css('background-image',
            `url('pics/${pictures[nextArrayIndex].name}.${pictures[nextArrayIndex].extension}')`);

        currentArrayIndex = nextArrayIndex;
        log('displayPrevPicture updated currentArrayIndex: ' + currentArrayIndex);
    };

    $.app = function () {
        this.run = function () {
            showColors();
            currentCardArray = colors;
            showGradients();
            showPictures();

            $('button.btn-card').click(function (item) {
                var colorIndex = Number($(item.target).attr('array-index'));
                $('.content').hide();
                $('.background').show();
                paintColor(colorIndex);
                isFullScreen = true;
            });

            $('button.picture-card').click(function (item) {
                var pictureIndex = Number($(item.target).attr('array-index'));
                $('.content').hide();
                $('.background').show();
                displayPicture(pictureIndex);
                isFullScreen = true;
                isImagesTabActive = true;
            });

            $('.background').mousedown(function (e) {
                if (e.which === 3) {
                    log('Escape - ' + e.which);
                    event.preventDefault();
                    escapeFullScreen();
                } else {
                    if (isImagesTabActive) {
                        displayNextPicture();
                    } else {
                        paintNextColor();
                    }
                }
            });

            $(document).contextmenu(function () {
                return false;
            });

            $(document).keydown(function (e) {
                const escapeKeyCode = 27;
                const leftArrowKeyCode = 37;
                const rightArrowKeyCode = 39;
                const n1KeyCode = 49;
                const n2KeyCode = 50;
                const n3KeyCode = 51;
                const n4KeyCode = 52;

                if (e.which === escapeKeyCode) {
                    log('Escape - ' + e.which);
                    if (isFullScreen) {
                        e.preventDefault();
                        escapeFullScreen();
                    }
                } else if (e.which === rightArrowKeyCode) {
                    if (isFullScreen) {
                        if (isImagesTabActive) {
                            displayNextPicture();
                        } else {
                            paintNextColor();
                        }
                    }
                } else if (e.which === leftArrowKeyCode) {
                    if (isFullScreen) {
                        if (isImagesTabActive) {
                            displayPrevPicture();
                        } else {
                            paintPrevColor();
                        }
                    }
                } else if (e.which === n1KeyCode && e.altKey) {
                    if (!isFullScreen) {
                        $('#navTab li:eq(0) a').tab('show');
                    }
                } else if (e.which === n2KeyCode && e.altKey) {
                    if (!isFullScreen) {
                        $('#navTab li:eq(1) a').tab('show');
                    }
                } else if (e.which === n3KeyCode && e.altKey) {
                    if (!isFullScreen) {
                        $('#navTab li:eq(2) a').tab('show');
                    }
                } else if (e.which === n4KeyCode && e.altKey) {
                    if (!isFullScreen) {
                        $('#navTab li:eq(3) a').tab('show');
                    }
                }
            });

            $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
                var val = $(e.target).attr('aria-controls');
                log(val);
                isImagesTabActive = false;

                if (val === 'colors') {
                    currentCardArray = colors;
                } else if (val === 'gradients') {
                    currentCardArray = gradients;
                } else if (val === 'images') {
                    isImagesTabActive = true;
                    currentCardArray = pictures;
                }
            });
        };

        return this;
    };

    var log = function (text) {
        console.log(text);
    };

    var colors = [
        { name: "red" },
        { name: "green" },
        { name: "blue" },
        { name: "cyan" },
        { name: "magenta" },
        { name: "yellow" },
        { name: "white" },
        { name: "gray" },
        { name: "black" }
    ];

    var gradients = [
        { name: "red-green-vertical" },
        { name: "green-blue-vertical" },
        { name: "blue-red-vertical" },
        { name: "cyan-magenta-vertical" },
        { name: "magenta-yellow-vertical" },
        { name: "yellow-cyan-vertical" },
        { name: "red-blue-circle" },
        { name: "rainbow-vertical" },
        { name: "white-black-vertical" },
        { name: "whites-vertical" },
        { name: "blacks-vertical" },
        { name: "grays-vertical" },
        { name: "red-green-horizontal" },
        { name: "green-blue-horizontal" },
        { name: "blue-red-horizontal" },
        { name: "cyan-magenta-horizontal" },
        { name: "magenta-yellow-horizontal" },
        { name: "yellow-cyan-horizontal" },
        { name: "rainbow-horizontal" },
        { name: "white-black-horizontal" },
        { name: "grays-horizontal" },
    ];

    var pictures = [
        { name: "beach_nature_13-wallpaper-1920x1080", extension: "jpg" },
        { name: "canyon_overlook_zion_landscape_black_and_white-wallpaper-1920x1080", extension: "jpg" },
        { name: "chinarose_2-wallpaper-1920x1080", extension: "jpg" },
        { name: "colorful_background_7-wallpaper-1920x1080", extension: "jpg" },
        { name: "colorful_chameleon_4k-1920x1080", extension: "jpg" },
        { name: "efe-kurnaz-unsplash-1920x1080", extension: "jpg" },
        { name: "fresh_lemon-wallpaper-1920x1080", extension: "jpg" },
        { name: "hd_fluid_spiral_waves-1920x1080", extension: "jpg" },
        { name: "most_beautiful_woman-wallpaper-1920x1080", extension: "jpg" },
        { name: "smile_to_the_camera-wallpaper-1920x1080", extension: "jpg" },
        { name: "wallpaperflare10 -1920x1080", extension: "jpg" },
        { name: "wallpaperflare51-1920x1080", extension: "jpg" },
        { name: "wallpaperflare54-1920x1080", extension: "jpg" },
        { name: "wallpaperflare82-1920x1080", extension: "jpg" },
        { name: "wallpaperflare410-1920x1080", extension: "jpg" }
    ];

}(jQuery));