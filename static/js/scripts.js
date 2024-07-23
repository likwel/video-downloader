
(function($) {
    "use strict"; 
	
	/* Preloader */
	$(window).on('load', function() {
		var preloaderFadeOutTime = 500;
		function hidePreloader() {
			var preloader = $('.spinner-wrapper');
			setTimeout(function() {
				preloader.fadeOut(preloaderFadeOutTime);
			}, 500);
		}
		hidePreloader();
	});

	
	/* Navbar Scripts */
	// jQuery to collapse the navbar on scroll
    $(window).on('scroll load', function() {
		if ($(".navbar").offset().top > 60) {
			$(".fixed-top").addClass("top-nav-collapse");
		} else {
			$(".fixed-top").removeClass("top-nav-collapse");
		}
    });

	// jQuery for page scrolling feature - requires jQuery Easing plugin
	$(function() {
		$(document).on('click', 'a.page-scroll', function(event) {
			var $anchor = $(this);

            var headerHeight = $('#nav-menu').outerHeight();

			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top - headerHeight
			}, 600, 'easeInOutExpo');
			event.preventDefault();
		});
	});

    // closes the responsive menu on menu item click
    $(".navbar-nav li a").on("click", function(event) {
    if (!$(this).parent().hasClass('dropdown'))
        $(".navbar-collapse").collapse('hide');
    });


    /* Image Slider - Swiper */
    var imageSlider = new Swiper('.image-slider', {
        autoplay: {
            delay: 2000,
            disableOnInteraction: false
		},
        loop: true,
        spaceBetween: 30,
        slidesPerView: 5,
		breakpoints: {
            // when window is <= 580px
            580: {
                slidesPerView: 1,
                spaceBetween: 10
            },
            // when window is <= 768px
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // when window is <= 992px
            992: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            // when window is <= 1200px
            1200: {
                slidesPerView: 4,
                spaceBetween: 20
            },

        }
    });


    /* Card Slider - Swiper */
	var cardSlider = new Swiper('.card-slider', {
		autoplay: {
            delay: 4000,
            disableOnInteraction: false
		},
        loop: true,
        navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		}
    });
    

    /* Video Lightbox - Magnific Popup */
    $('.popup-youtube, .popup-vimeo').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
        iframe: {
            patterns: {
                youtube: {
                    index: 'youtube.com/', 
                    id: function(url) {        
                        var m = url.match(/[\\?\\&]v=([^\\?\\&]+)/);
                        if ( !m || !m[1] ) return null;
                        return m[1];
                    },
                    src: 'https://www.youtube.com/embed/%id%?autoplay=1'
                },
                vimeo: {
                    index: 'vimeo.com/', 
                    id: function(url) {        
                        var m = url.match(/(https?:\/\/)?(www.)?(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/);
                        if ( !m || !m[5] ) return null;
                        return m[5];
                    },
                    src: 'https://player.vimeo.com/video/%id%?autoplay=1'
                }
            }
        }
    });


    /* Lightbox - Magnific Popup */
	$('.popup-with-move-anim').magnificPopup({
		type: 'inline',
		fixedContentPos: false, /* keep it false to avoid html tag shift with margin-right: 17px */
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: false,
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-slide-bottom'
	});
    
    
    /* Move Form Fields Label When User Types */
    // for input and textarea fields
    $("input, textarea").keyup(function(){
		if ($(this).val() != '') {
			$(this).addClass('notEmpty');
		} else {
			$(this).removeClass('notEmpty');
		}
    });


    /* Request Form */
    $("#requestForm").validator().on("submit", function(event) {
    	if (event.isDefaultPrevented()) {
            // handle the invalid form...
            rformError();
            rsubmitMSG(false, "Please fill all fields!");
        } else {
            // everything looks good!
            event.preventDefault();
            rsubmitForm();
        }
    });

    function rsubmitForm() {
        // initiate variables with form content
		var name = $("#rname").val();
		var email = $("#remail").val();
		var phone = $("#rphone").val();
        var select = $("#rselect").val();
        var terms = $("#rterms").val();
        
        $.ajax({
            type: "POST",
            url: "php/requestform-process.php",
            data: "name=" + name + "&email=" + email + "&phone=" + phone + "&select=" + select + "&terms=" + terms, 
            success: function(text) {
                if (text == "success") {
                    rformSuccess();
                } else {
                    rformError();
                    rsubmitMSG(false, text);
                }
            }
        });
	}

    function rformSuccess() {
        $("#requestForm")[0].reset();
        rsubmitMSG(true, "Request Submitted!");
        $("input").removeClass('notEmpty'); // resets the field label after submission
    }

    function rformError() {
        $("#requestForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
	}

    function rsubmitMSG(valid, msg) {
        if (valid) {
            var msgClasses = "h3 text-center tada animated";
        } else {
            var msgClasses = "h3 text-center";
        }
        $("#rmsgSubmit").removeClass().addClass(msgClasses).text(msg);
    }
    

    /* Contact Form */
    $("#contactForm").validator().on("submit", function(event) {
    	if (event.isDefaultPrevented()) {
            // handle the invalid form...
            cformError();
            csubmitMSG(false, "Please fill all fields!");
        } else {
            // everything looks good!
            event.preventDefault();
            csubmitForm();
        }
    });

    function csubmitForm() {
        // initiate variables with form content
		var name = $("#cname").val();
		var email = $("#cemail").val();
        var message = $("#cmessage").val();
        var terms = $("#cterms").val();
        $.ajax({
            type: "POST",
            url: "php/contactform-process.php",
            data: "name=" + name + "&email=" + email + "&message=" + message + "&terms=" + terms, 
            success: function(text) {
                if (text == "success") {
                    cformSuccess();
                } else {
                    cformError();
                    csubmitMSG(false, text);
                }
            }
        });
	}

    function cformSuccess() {
        $("#contactForm")[0].reset();
        csubmitMSG(true, "Message Submitted!");
        $("input").removeClass('notEmpty'); // resets the field label after submission
        $("textarea").removeClass('notEmpty'); // resets the field label after submission
    }

    function cformError() {
        $("#contactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
	}

    function csubmitMSG(valid, msg) {
        if (valid) {
            var msgClasses = "h3 text-center tada animated";
        } else {
            var msgClasses = "h3 text-center";
        }
        $("#cmsgSubmit").removeClass().addClass(msgClasses).text(msg);
    }


    /* Privacy Form */
    $("#privacyForm").validator().on("submit", function(event) {
    	if (event.isDefaultPrevented()) {
            // handle the invalid form...
            pformError();
            psubmitMSG(false, "Please fill all fields!");
        } else {
            // everything looks good!
            event.preventDefault();
            psubmitForm();
        }
    });

    function psubmitForm() {
        // initiate variables with form content
		var name = $("#pname").val();
		var email = $("#pemail").val();
        var select = $("#pselect").val();
        var terms = $("#pterms").val();
        
        $.ajax({
            type: "POST",
            url: "php/privacyform-process.php",
            data: "name=" + name + "&email=" + email + "&select=" + select + "&terms=" + terms, 
            success: function(text) {
                if (text == "success") {
                    pformSuccess();
                } else {
                    pformError();
                    psubmitMSG(false, text);
                }
            }
        });
	}

    function pformSuccess() {
        $("#privacyForm")[0].reset();
        psubmitMSG(true, "Request Submitted!");
        $("input").removeClass('notEmpty'); // resets the field label after submission
    }

    function pformError() {
        $("#privacyForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
	}

    function psubmitMSG(valid, msg) {
        if (valid) {
            var msgClasses = "h3 text-center tada animated";
        } else {
            var msgClasses = "h3 text-center";
        }
        $("#pmsgSubmit").removeClass().addClass(msgClasses).text(msg);
    }
    

    /* Back To Top Button */
    // create the back to top button
    $('body').prepend('<a href="body" class="back-to-top page-scroll">Back to Top</a>');
    var amountScrolled = 700;
    $(window).scroll(function() {
        if ($(window).scrollTop() > amountScrolled) {
            $('a.back-to-top').fadeIn('500');
        } else {
            $('a.back-to-top').fadeOut('500');
        }
    });


	/* Removes Long Focus On Buttons */
	$(".button, a, button").mouseup(function() {
		$(this).blur();
	});

    var today = new Date();
    let aa = today.getFullYear();

    $(".annee-copyright").text(aa)


})(jQuery);

function getP(){

    let link = document.querySelector("#d_link").value

    let url ="";

    if(link.includes("www.youtube.com")){

        var full_url = new URL(link);

        // Extract the protocol, hostname, and pathname
        const fullPath = `${full_url.protocol}//${full_url.hostname}${full_url.pathname}`;

        var urlParams = new URLSearchParams(new URL(link).search);

        let videoId = urlParams.get('v');

        url = fullPath +"?v="+videoId

    }else{
        url = link;
    }
    
    let format_list = document.querySelector("#preview-format");
    
    format_list.innerHTML =`

    <tr class="text-center my-5">
        <td colspan="2" class="text-center">
            <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden"></span>
            </div>
        </td>
    </tr>
    `

    showVideo(url)

    fetch("/get_formats",{
        method: 'POST',
        headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        body: `url=${encodeURIComponent(url)}`
    })
    .then(res=>res.json())
    .then(vFormats=>{
        console.log(vFormats);

        format_list.innerHTML =""

        vFormats.sort(function(a, b) { return b.filesize - a.filesize; });
        vFormats.sort(function(a, b) { return b.width * b.height - a.width * a.height; });

        if(vFormats.length > 0){

            vFormats.forEach((vf, index)=>{

                if((vf.ext == "mp4" || vf.ext == "webm")/* && vf.filesize != null*/){
                    let tr = document.createElement("tr");

                    let form = document.createElement("form");
                    //form.setAttribute("action",`/download/${vf.format_id}`);
                    // form.setAttribute("method","POST");
                    form.setAttribute("data-toggle","validator");
                    form.setAttribute("data-focus","false");
                    form.setAttribute("class","text-center");
                    form.classList ="downloadForm w-100"
                    form.setAttribute("onsubmit","start_down(event)");


                    let td1 = document.createElement("td");
                    td1.classList ="w-75"
                    td1.innerHTML = `<div class="alert alert-primary d-flex justify-content-between"><div>Taille : ${vf.filesize? (vf.filesize / (1024 * 1024)).toFixed(2) +" MB " : " ∞ "}</div><div>${vf.width} x ${vf.width}</div><div> Type : ${vf.ext}</div></div>`;

                    let td2 = document.createElement("td");
                    td2.classList ="w-25"

                    // let td2 = document.createElement("td");
                    form.innerHTML = `<input value="${vf.format_id}" type="hidden" name="fId" class="fId"> <button type="submit" class="btn btn-success btn-start-down"><i class="fa-solid fa-cloud-arrow-down"></i> Download</button>`;

                    // let td3 = document.createElement("td");
                    form.innerHTML += `<input value="${url}" type="hidden" name="fUrl" class="fUrl">`;

                    td2.appendChild(form);

                    tr.appendChild(td1)
                    tr.appendChild(td2)

                    format_list.appendChild(tr)

                }                                           
            })

        }else{
            format_list.innerHTML +=`
            <tr>
                <td colspan="2" class="text-center alert alert-warning">No available video formats found.</td>
            </tr>
            `
        }
    })

}

$('#d_link').on('input', function() {
    var url = $(this).val();
    // $('#video-preview').hide();
    // $('#video-player').html(''); // Clear previous video

    getP()

    
    // Add conditions for other platforms here
});

function showVideo(url){

    $('#video-preview').hide();
    $('#video-player').html(''); // Clear previous video

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        var videoId = getYouTubeVideoId(url);
        if (videoId) {
            loadYouTubeVideo(videoId);
            $('#video-preview').show();
        }
    } else if (url.includes('facebook.com')) {
        loadFacebookVideo(url);
        $('#video-preview').show();
    }else{
        other(url);
        $('#video-preview').show();
    }
}

function loadYouTubeVideo(videoId) {
    var youtubeIframe = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    $('#video-player').html(youtubeIframe);
}

function loadFacebookVideo(url) {
    var fbIframe = `<iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560" width="100%" height="315" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>`;
    $('#video-player').html(fbIframe);
}

function other(url) {
    var otherIfr = `<video width="100%" height="315" controls>
    <source src="${url}" type="video/mp4"></video>`;

    $('#video-player').html(otherIfr);

}

function getYouTubeVideoId(url) {
    var videoId = '';
    if (url.includes('youtube.com')) {
        var urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v');
    } else if (url.includes('youtu.be')) {
        videoId = url.split('/').pop();
    }
    return videoId;
}

function start_down(event){
    event.preventDefault();

    // console.log(event.target);

    event.target.querySelector('button[type=submit]').disabled = true
    event.target.querySelector('button[type=submit]').innerHTML =`
            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
    <span role="status">Downloading...</span>
    `

    let progr = document.querySelector("#progress-anim")
    progr.classList.remove("d-none")

    let formatId = event.target.querySelector(".fId").value
    let url = event.target.querySelector(".fUrl").value

    fetch('/download/'+formatId, {
        method : "POST",
        headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        body: `fUrl=${encodeURIComponent(url)}`
    }).then(r=>{
        console.log(r);
        if(r.ok && r.status == 200){
            // return r.json()
            event.target.querySelector('button[type=submit]').disabled = false
            event.target.querySelector('button[type=submit]').innerHTML =`
            <i class="fa-regular fa-circle-check"></i> Downloaded
            `
            progr.querySelector("div").classList = "progress-bar bg-primary text-white"
            progr.querySelector("div").textContent = "100%"

            swal("Thanks!", "Download finished!", "success").then(r=>{
                progr.classList.add("d-none")
            });
        }else if(r.status ==999){
            return response.json().then(data => {
                // Handle the custom status code and message
                swal("Duplicate!", data.message, "warning").then(r=>{
                    progr.classList.add("d-none")
                });
            });
        }
    })

    // Fonction pour mettre à jour la progression
    function updateProgress() {
        fetch('/progress').then(response => response.json()).then(data => {
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');

            // Mettre à jour la barre de progression et le texte
            progressBar.style.width = data.percentage;
            progressText.textContent = `Progress: ${data.percentage}, Speed: ${data.speed}, ETA: ${data.eta}`;

            // Vérifier si le téléchargement est terminé
            if (data.status === 'downloading') {
                setTimeout(updateProgress, 1000); // Mettre à jour toutes les secondes
            }
        });
    }
}

document.getElementById('pasteButton').addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('d_link').value = text;
        getP()
    } catch (err) {
        // console.error('Failed to read clipboard contents: ', err);
        swal({
            title: "Not work!",
            text: 'Failed to read clipboard contents: '+ err,
            icon: "info",
            button: "Ok!",
        });
    }
});