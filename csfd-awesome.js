
(function ($) {
	var movieUriPatern = /^http:\/\/www\.csfd\.cz\/film\/(\d+)-([\w-]+)\/$/;
	if (movieUriPatern.test(window.location.href)) {
		setTimeout(function () { (new Csfd()).run() });
	}

	function Csfd() {
		this.$creators = $('#profile .info .creators a');
		this.$popupTemplate = $('<div/>').addClass('csfd-awesome-popup')
		.css({
			position: 'absolute',
			backgroundColor: 'white',
			border: '1px solid black',
			borderRadius: '3px',
			padding: '5px'
		});
	}
	Csfd.prototype.run = function () {
		this.extendCreators();
	};
	Csfd.prototype.extendCreators = function () {
		var _this = this;
		this.$creators
		.on('mouseover', function (ev) {
			$('.csfd-awesome-popup').remove();
			var $creator = $(ev.target);
			var creatorUrn = $creator.attr('href');
			var $popup = _this.$popupTemplate.clone();
			$popup.css({
				left: $creator.offset().left,
				top: $creator.offset().top + 15,
			});
			_this.getCreatorInfo(creatorUrn, function (imgUri, name, detail) {
				var $img = $('<img/>').attr('src', imgUri);
				$popup.append($('<h5/>').text(name));
				$popup.append($('<p/>').html(detail));
				$popup.append($img);
				$('body').append($popup);
			});
			$creator.on('mouseout', function () {
				$popup.remove();
			})
		});
	};
	Csfd.prototype.getCreatorInfo = function (urn, next) {
		$.ajax({
			url: 'http://' + window.location.host + urn,
			success: function (data) {
				var img = $(data).find('#profile .image .creator-photo');
				var name = $(data).find('#profile .info h1');
				var detail = $(data).find('#profile .info ul li');
				next(img.attr('src'), name.text(), detail.html());
			}
		});
	};
})(jQuery);
