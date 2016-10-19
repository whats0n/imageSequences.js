

module.exports = (function(root, factory) {

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		module.exports = factory();
	} else {
		// Browser global
		root.Sequence = factory();
	}

} (this, function() {
	'use strict';
	//factory
	class Sequences {

		constructor(config) {

			this._canvasList = document.querySelectorAll(config.canvas);

			Array.prototype.forEach.call(this._canvasList, (canvas) => {
				new Sequence(canvas, config);
			});

		}

	}

	//factory item

	class Sequence {

		constructor(canvas, config) {
			//config
			this._dir = config.path || 'img/sequence/';
			this._extension = `.${config.extension}` || '.png';
			this._format = config.format || '0';
			this._imgName = config.imgName || 'Sequence';
			this._amount = config.amount || 0;
			this._size = config.size || 'contain';
			this._delay = 30;
			//storage
			this._images = [];
			//flags
			this._imagesLoaded = false;
			//canvas
			this._canvas = canvas;
			this._ctx = this._canvas.getContext('2d');
			this._parent = this._canvas.parentNode;
			//functions
			this._init();
		}

		_init() {
			//get initial size
			this._getSizeByParent();
			//check loaded
			this._loadImages();
		}

		_loadImages() {

			let fileName = this._dir + this._imgName;
			let img;
			let counter = 0;

			//HELPERS
			function zeroPad(num) {

				let len = this._format.length;
				let numLen = ('' + num).length;

				return this._format.substring(0, len - numLen) + num;

			}

			function loadImg(img) {
				img.onload = function() {
					counter++;

					if (counter == this._amount) {
						this._imagesLoaded = true;
						//start sequence

						//set initial size
						this._setCanvasSize();
						//play
						this._playCanvas();
					}

				}.bind(this);
			}
			//END HELPERS

			for (let i = 0; i < this._amount; i++) {
				img = new Image();
				img.src = fileName + zeroPad.call(this, i) + this._extension;

				loadImg.call(this, img);

				this._images.push(img);
			}
		}

		_getSizeByParent() {
			this._parentWidth = this._parent.offsetWidth;
			this._parentHeight = this._parent.offsetHeight;
		}

		_setCanvasSize() {
			this._imgWidth = this._images[0].width;
			this._imgHeight = this._images[0].height;

			function getRatio(x, y) {
				return x/y;
			}

			let getSizes = () => {
				if (this._imgWidth < this._parentWidth && this._imgHeight < this._parentHeight) {
					return {
						width: this._imgWidth,
						height: this._imgHeight
					};
				} else {
					let ratio = null;

					if (this._imgWidth > this._imgHeight) {
						ratio = getRatio(this._imgWidth, this._parentWidth);
					} else {
						ratio = getRatio(this._imgHeight, this._parentHeight);
					}

					return {
						width: this._imgWidth/ratio,
						height: this._imgHeight/ratio
					};
				}

			};

			this._canvasWidth = getSizes().width;
			this._canvasHeight = getSizes().height;

			switch(this._size) {
				case 'cover':
					console.log('cover');
					break;
				default :
					console.log('contain');
					this._canvas.width = this._canvasWidth;
					this._canvas.height = this._canvasHeight;
					break;
			}
		}

		_playCanvas() {
			// this._images
			let counter = 0;
			let that = this;

			let timer = setTimeout(function play() {
				if (that._images.length > counter) {
					that._ctx.drawImage(that._images[counter], 0, 0, that._canvasWidth, that._canvasHeight);
					counter++;
					timer = setTimeout(play, that._delay);
				}
			}, that._delay);

		}
	}

	return Sequences;

}));