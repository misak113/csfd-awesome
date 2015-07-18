
(function ($) {
	var movieUriPatern = /^http:\/\/www\.csfd\.cz\/film\/(\d+)-([\w-]+)\/$/;
	var creatorUriPatern = /^http:\/\/www\.csfd\.cz\/tvurce\/(\d+)-([\w-]+)\/$/;
	if (movieUriPatern.test(window.location.href)) {
		setTimeout(function () { (new CsfdMovie()).run() });
	}
	if (creatorUriPatern.test(window.location.href)) {
		setTimeout(function () { (new CsfdCreator()).run() });
	}

	var $popupTemplate = $('<div/>').addClass('csfd-awesome-popup')
	.css({
		position: 'absolute',
		backgroundColor: 'white',
		border: '1px solid black',
		borderRadius: '3px',
		padding: '5px'
	});

	function CsfdMovie() {
		this.$creators = $('#profile .info .creators a');
	}
	CsfdMovie.prototype.run = function () {
		this.extendCreators();
	};
	CsfdMovie.prototype.extendCreators = function () {
		var _this = this;
		this.$creators
		.on('mouseover', function (ev) {
			$('.csfd-awesome-popup').remove();
			var $creator = $(ev.target);
			var creatorUrn = $creator.attr('href');
			var $popup = $popupTemplate.clone();
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
	CsfdMovie.prototype.getCreatorInfo = function (urn, next) {
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

	function CsfdCreator() {
		this.$movies = $('#filmography .content a');
	}
	CsfdCreator.prototype.run = function () {
		this.extendCreators();
	};
	CsfdCreator.prototype.extendCreators = function () {
		var _this = this;
		this.$movies
		.on('mouseover', function (ev) {
			$('.csfd-awesome-popup').remove();
			var $movie = $(ev.target);
			var movieUrn = $movie.attr('href');
			var $popup = $popupTemplate.clone();
			$popup.css({
				left: $movie.offset().left + 150,
				top: $movie.offset().top + 15,
			});
			_this.getMovieInfo(movieUrn, function (detail) {
				$popup.append(detail);
				$('body').append($popup);
			});
			$movie.on('mouseout', function () {
				$popup.remove();
			})
		});
	};
	CsfdCreator.prototype.getMovieInfo = function (urn, next) {
		$.ajax({
			url: 'http://' + window.location.host + urn,
			success: function (data) {
				var detail = $(data).find('#profile > .content');
				detail.find('#poster').css({ float: 'left' });
				next(detail.html());
			}
		});
	};
})(jQuery);
