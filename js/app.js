(function($) {
    var showColors = function() {
        var columnCount = 3;

        for (var i = 0; i < colors.length; i++) {
            if (i == 0 || i % columnCount === 0) {
                $('.color-cards').append('<div class="row"></div>')
            }

            var rowElement = $('div.color-cards').find('div.row').last();
            rowElement.append(`<div class="col-sm d-flex justify-content-center">
                            <button array-index="${i}" class="btn-card color-card color-${colors[i].name}">
                            </button>
                        </div>`);
        }
    };

    var showGradients = function() {
        var columnCount = 3;

        for (var i = 0; i < gradients.length; i++) {
            if (i == 0 || i % columnCount === 0) {
                $('.gradients-cards').append('<div class="row"></div>')
            }

            var rowElement = $('div.gradients-cards').find('div.row').last();
            rowElement.append(`<div class="col-sm d-flex justify-content-center">
                            <button array-index="${i}" class="btn-card color-card color-${gradients[i].name}">
                            </button>
                        </div>`);
        }
    };

    var showPictures = function() {
        var columnCount = 3;

        for (var i = 0; i < pictures.length; i++) {
            if (i == 0 || i % columnCount === 0) {
                $('.pictures-cards').append('<div class="row"></div>')
            }

            var rowElement = $('div.pictures-cards').find('div.row').last();
            rowElement.append(`<div class="col-sm d-flex justify-content-center">
                            <button array-index="${i}" class="color-card picture-card"
                                style="background-image: url('${getImageUrl(i)}')">
                            </button>
                        </div>`);
        }

        subscribeOnPictureCard();
    };

    var showJudderBox = function() {
        var columnCount = 6;
        var itemsCount = 24;

        for (var i = 0; i < itemsCount; i++) {
            if (i == 0 || i % columnCount === 0) {
                $('.judder-box').append('<div class="row"></div>')
            }

            var rowElement = $('div.judder-box div.row').last();
            rowElement.append(`<div class="col-sx d-flex justify-content-center">
                                  <button array-index="${i}" class="box-item">
                                  </button>
                               </div>`);
        }

        moveJumpBoxToNextBox(0);
    };

    function moveJumpBoxToNextBox(itemIndex) {
        var boxes = $('div.judder-box button.box-item').toArray();

        if (itemIndex >= boxes.length) {
            itemIndex = 0;
        } else if (itemIndex < 0) {
            itemIndex = boxes.length - 1;
        }

        $('div.judder-box button.box-item.jump-box').removeClass('jump-box');
        $(boxes[itemIndex]).addClass('jump-box');

        var timeoutDelay = 35;
        if (isJudderTabActive) {
            setTimeout(function() {
                moveJumpBoxToNextBox(itemIndex + 1);
            }, timeoutDelay);
        } else {
            $('div.judder-box button.box-item.jump-box').removeClass('jump-box');
        }
    };

    var paintNextColor = function() {
        var nextColorIndex = currentColorIndex + 1;
        if (nextColorIndex > currentCardArray.length - 1) {
            nextColorIndex = 0;
        }
        $('.background').addClass('color-' + currentCardArray[nextColorIndex].name);
        $('.background').removeClass('color-' + currentCardArray[currentColorIndex].name);
        currentColorIndex = nextColorIndex;
    };

    var paintPrevColor = function() {
        var prevColorIndex = currentColorIndex - 1;
        if (prevColorIndex < 0) {
            prevColorIndex = currentCardArray.length - 1;
        }
        $('.background').addClass('color-' + currentCardArray[prevColorIndex].name);
        $('.background').removeClass('color-' + currentCardArray[currentColorIndex].name);
        currentColorIndex = prevColorIndex;
    };

    var currentColorIndex = 0;
    var currentArrayIndex = 0;
    var currentCardArray = [];
    var isFullScreen = false;
    var isImagesTabActive = false;
    var imageResolution = "FHD";
    var isJudderTabActive = false;

    var paintColor = function(colorIndex) {
        var colorIndexNumber = Number(colorIndex);
        currentColorIndex = colorIndexNumber;
        $('.background').addClass('color-' + currentCardArray[colorIndexNumber].name);
    };

    var escapeFullScreen = function() {
        $('.background').hide();
        $('.content').show();
        $('.background').removeClass('color-' + currentCardArray[currentColorIndex].name);
        $('.background').removeClass('picture-card');
        $('.background').css('background-image', '');
        currentColorIndex = 0;
        isFullScreen = false;
    };

    var displayPicture = function(pictureIndex) {
        var pictureIndexNumber = Number(pictureIndex);
        currentArrayIndex = pictureIndexNumber;
        $('.background').css('background-image', `url('${getImageUrl(currentArrayIndex)}')`);
        $('.background').addClass('picture-card');
    };

    var displayNextPicture = function() {
        var nextArrayIndex = currentArrayIndex + 1;
        if (nextArrayIndex > currentCardArray.length - 1) {
            nextArrayIndex = 0;
        }

        $('.background').css('background-image', `url('${getImageUrl(nextArrayIndex)}')`);
        currentArrayIndex = nextArrayIndex;
    };

    var displayPrevPicture = function() {
        var nextArrayIndex = currentArrayIndex - 1;
        if (nextArrayIndex < 0) {
            nextArrayIndex = currentCardArray.length - 1;
        }

        $('.background').css('background-image', `url('${getImageUrl(nextArrayIndex)}')`);
        currentArrayIndex = nextArrayIndex;
    };

    var getImageUrl = function(index) {
        var imgUrl = `pics/${imageResolution}/${pictures[index].name}.${pictures[index].extension}`;
        return imgUrl;
    }

    var subscribeOnPictureCard = function() {
        $('button.picture-card').click(function(item) {
            var pictureIndex = Number($(item.target).attr('array-index'));
            $('.content').hide();
            $('.background').show();
            displayPicture(pictureIndex);
            isFullScreen = true;
            isImagesTabActive = true;
        });
    }

    $.app = function() {
        this.run = function() {
            showColors();
            currentCardArray = colors;
            showGradients();
            showPictures();
            showJudderBox();

            $('button.btn-card').click(function(item) {
                var colorIndex = Number($(item.target).attr('array-index'));
                $('.content').hide();
                $('.background').show();
                paintColor(colorIndex);
                isFullScreen = true;
            });

            $('.background').mousedown(function(e) {
                if (e.which === 3) {
                    e.preventDefault();
                    escapeFullScreen();
                } else {
                    if (isImagesTabActive) {
                        displayNextPicture();
                    } else {
                        paintNextColor();
                    }
                }
            });

            $(document).contextmenu(function() {
                return false;
            });

            $(document).keydown(function(e) {
                const escapeKeyCode = 27;
                const leftArrowKeyCode = 37;
                const rightArrowKeyCode = 39;
                const n1KeyCode = 49;
                const n2KeyCode = 50;
                const n3KeyCode = 51;
                const n4KeyCode = 52;
                const n5KeyCode = 53;

                if (e.which === escapeKeyCode) {
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
                } else if (e.which === n5KeyCode && e.altKey) {
                    if (!isFullScreen) {
                        $('#navTab li:eq(4) a').tab('show');
                    }
                }
            });

            $('a[data-bs-toggle="tab"]').on('show.bs.tab', function(e) {
                var val = $(e.target).attr('aria-controls');
                isImagesTabActive = false;
                isJudderTabActive = false;

                if (val === 'colors') {
                    currentCardArray = colors;
                } else if (val === 'gradients') {
                    currentCardArray = gradients;
                } else if (val === 'images') {
                    isImagesTabActive = true;
                    currentCardArray = pictures;
                } else if (val === 'judder') {
                    isJudderTabActive = true;
                    moveJumpBoxToNextBox(0);
                }
            });

            var url = window.location.href;
            if (url.indexOf("#") > 0) {
                var activeTab = url.substring(url.indexOf("#") + 1);
                $('.nav[role="tablist"] a[href="#' + activeTab + '"]').tab('show');
            }

            $('a[role="tab"]').on("click", function() {
                var newUrl;
                const hash = $(this).attr("href");
                newUrl = url.split("#")[0] + hash;
                history.replaceState(null, null, newUrl);
            });

            $("#resolution-select").change(function() {
                var selectedResolution = $(this).val();
                imageResolution = selectedResolution;
                $('.pictures-cards').empty();
                showPictures();
            });
        };

        return this;
    };

    var log = function(text) {
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
        { name: "grays-horizontal" }
    ];

    var pictures = [
        { name: "eric-combeau-Tw0eeOOzCVs-unsplash", extension: "jpg" },
        { name: "luca-huter-7m-Zigjxc8E-unsplash", extension: "jpg" },
        { name: "nasa-WKT3TE5AQu0-unsplash", extension: "jpg" },
        { name: "ospan-ali-t1QJcs6_rrQ-unsplash", extension: "jpg" },
        { name: "ricardo-gomez-angel-2AQtPacdfp8-unsplash", extension: "jpg" },
        { name: "ricardo-gomez-angel-3kzlCL3rj8A-unsplash", extension: "jpg" },
        { name: "zac-wolff-uuwA21vmI3o-unsplash", extension: "jpg" },
        { name: "backround-1209772", extension: "jpg" },
        { name: "car-5715618", extension: "jpg" },
        { name: "cityscape-5543223", extension: "jpg" },
        { name: "death-valley-4242451", extension: "jpg" },
        { name: "doctor-5650894", extension: "jpg" },
        { name: "farmhouse-5325758", extension: "jpg" },
        { name: "fire-4765470", extension: "jpg" },
        { name: "flower-4333046", extension: "jpg" },
        { name: "flower-5058011", extension: "jpg" },
        { name: "flower-5425134", extension: "jpg" },
        { name: "fruit-1838216", extension: "jpg" },
        { name: "grass-4985635", extension: "jpg" },
        { name: "grimsel-hospiz-4970076", extension: "jpg" },
        { name: "hong-kong-4093186", extension: "jpg" },
        { name: "landscape-5364882", extension: "jpg" },
        { name: "lane-4942998", extension: "jpg" },
        { name: "leaves-1959160", extension: "jpg" },
        { name: "mandala-2983622", extension: "jpg" },
        { name: "milky-way-2740777", extension: "jpg" },
        { name: "nature-3039901", extension: "jpg" },
        { name: "nature-5169874", extension: "jpg" },
        { name: "omelet-2802968", extension: "jpg" },
        { name: "pencils-5474594", extension: "jpg" },
        { name: "purple-2493896", extension: "jpg" },
        { name: "round-leaved-sundew-3528464", extension: "jpg" },
        { name: "sheet-5128375", extension: "jpg" },
        { name: "split-1585457", extension: "jpg" },
        { name: "sport-2264824", extension: "jpg" },
        { name: "studio-5222255", extension: "jpg" },
        { name: "sunflower-2511961", extension: "jpg" },
        { name: "tea-leaves-4547923", extension: "jpg" },
        { name: "textile-1824160", extension: "jpg" },
        { name: "texture-1838195", extension: "jpg" },
        { name: "tree-2387626", extension: "jpg" },
        { name: "water-1330252", extension: "jpg" },
        { name: "woman-5304216", extension: "jpg" },
        { name: "wood-1819542", extension: "jpg" },
        { name: "world-549425", extension: "jpg" }
    ];

}(jQuery));