(function e(t, n, r) {
	function s(o, u) {
		if (!n[o]) {
			if (!t[o]) {
				var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
			}var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
				var n = t[o][1][e];return s(n ? n : e);
			}, f, f.exports, e, t, n, r);
		}return n[o].exports;
	}var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) s(r[o]);return s;
})({ 1: [function (require, module, exports) {
		const app = {};

		app.randomNum = length => {
			var random = Math.floor(Math.random() * length);
			return random;
		};

		app.createItem = (name, url, lyr, price, where) => {

			const markup = `
		<div class="container_box">
		    <img src="${url}">
		    <h2>${name}</h2> 
		    <p class="lyr">${lyr}</p>
		    <p class="price">${price}</p> 
		</div>
	`;

			$(`.${where}`).append(markup);
		};

		app.calculate = responce => {

			const jacketArray = responce.filter(function (item) {
				return item.type == "jacket";
			});
			const baseArray = responce.filter(function (item) {
				return item.type == "baselayer";
			});
			const glovesArray = responce.filter(function (item) {
				return item.type == "gloves";
			});
			const hatArray = responce.filter(function (item) {
				return item.type == "hat";
			});
			const shirtArray = responce.filter(function (item) {
				return item.type == "shirt";
			});
			const vestArray = responce.filter(function (item) {
				return item.type == "vest";
			});

			const select = (array, max = 10, min = 0) => {
				const tempArray = array.filter(it => it.lvl >= min && it.lvl <= max);
				const tempNum = app.randomNum(tempArray.length);
				console.log(tempNum);
				console.log(tempArray);
				if (tempArray.length !== 0) {
					app.createItem(tempArray[tempNum].name, tempArray[tempNum].url, tempArray[tempNum].lyr, tempArray[tempNum].price, tempArray[tempNum].type);
				} else {
					console.log(`No Product Found in ${array[0].type}`);
				}
			};

			if (app.weatherIndicator() >= 15) {

				if (app.itemIndicator() == 1) {
					console.log("shirt 0+");
					select(shirtArray);
				}
			} else if (app.weatherIndicator() < 15 & app.weatherIndicator() >= 10) {

				if (app.itemIndicator() == 1) {
					console.log("high lvl shirt 5+");
					select(shirtArray, 10, 5);
				} else if (app.itemIndicator() == 2) {
					console.log("normal shirt 0-7 and vest 0-5");
					select(shirtArray, 7, 0);
					select(vestArray, 5, 0);
				}
			} else if (app.weatherIndicator() < 10 & app.weatherIndicator() >= 1) {

				if (app.itemIndicator() == 2) {
					console.log("shirt 3-7 + light jacket 0-5");
					select(shirtArray, 7, 3);
					select(jacketArray, 5, 0);
				} else if (app.itemIndicator() == 3) {
					console.log("shirt 0-5 + vest 0-4 + lightest jacket 0-4");
					select(hatArray, 5, 0);
					select(shirtArray, 4, 0);
					select(vestArray, 4, 0);
					select(jacketArray, 4, 0);
				}
			} else if (app.weatherIndicator() < 1 & app.weatherIndicator() >= -15) {

				select(hatArray, 10, 5);

				if (app.itemIndicator() == 2) {
					console.log("shirt 5+ + heavy jacket 7+");
					select(shirtArray, 10, 0);
					select(jacketArray, 10, 7);
				} else if (app.itemIndicator() == 3) {
					console.log("baselayer 4-7 + shirt 3+ + light jacket 3-7");
					console.log("shirt 3+ + vest 4-8 + light jacket 3-7");
					select(baseArray, 7, 4);
					select(shirtArray, 10, 3);
					select(jacketArray, 7, 3);
				} else if (app.itemIndicator() == 4) {
					console.log("baselayer 0-5 + shirt 0+ + vest 3-6 + jacket 3-7");
					select(baseArray, 5, 0);
					select(shirtArray, 10, 0);
					select(vestArray, 6, 3);
					select(jacketArray, 7, 3);
				}
			} else if (app.weatherIndicator() < -15 & app.weatherIndicator() >= -30) {

				select(hatArray, 10, 6);
				select(glovesArray, 10, 6);

				if (app.itemIndicator() == 2) {
					console.log("baselayer 5+ + heavy jacket 7+");
					select(baseArray, 10, 7);
					select(jacketArray, 10, 8);
				} else if (app.itemIndicator() == 3) {
					console.log("baselayer 5+ + shirt 0+ + heavy jacket 7+");
					console.log("shirt 0+ + vest 3-7 + heavy jacket 5+");
					select(baseArray, 10, 5);
					select(shirtArray, 10, 0);
					select(jacketArray, 10, 7);
				} else if (app.itemIndicator() == 4) {
					console.log("baselayer 3-7 + shirt 0+ + vest 0-5 + heavy jacket 5+");
					select(baseArray, 7, 3);
					select(shirtArray, 10, 0);
					select(vestArray, 10, 5);
					select(jacketArray, 9, 5);
				}
			} else {}
		};

		app.getJSON = () => {
			$.ajax({
				url: "./public/js/product_list.json",
				dataType: "json",
				success: function (res) {
					app.calculate(res.products);
				}
			});
		};

		app.itemIndicator = () => {
			const itemNum = $('#selectable .ui-selected')[0].innerText;
			return itemNum;
		};
		app.weatherIndicator = () => {
			const weather = $('#custom-handle').text();
			return weather;
		};

		app.init = () => {
			$('button[type="submit"]').on("click", () => {
				$(`.item-b`).empty();
				$(`.item-c`).empty();

				app.getJSON();
			});

			var handle = $("#custom-handle");
			var $bg = $('.background-color:before').css('opacity');
			$("#slider").slider({

				min: -30,
				max: 20,
				create: function () {
					handle.text($(this).slider("value"));
				},
				slide: function (event, ui) {

					handle.text(ui.value);
					$('#selectable li').removeClass("disabled");
					if (ui.value >= 15) {
						console.log("1");
						$('#selectable li[data-val="4"]').addClass("disabled").removeClass("ui-selected");
						$('#selectable li[data-val="3"]').addClass("disabled").removeClass("ui-selected");
						$('#selectable li[data-val="2"]').addClass("disabled").removeClass("ui-selected");
						$('#selectable li[data-val="1"]').addClass("ui-selected");
					} else if (ui.value >= 10) {
						console.log("1 2");
						$('#selectable li[data-val="4"]').addClass("disabled").removeClass("ui-selected");
						$('#selectable li[data-val="3"]').addClass("disabled").removeClass("ui-selected");
					} else if (ui.value <= 10 && ui.value >= 0) {
						console.log("2 3");
						$('#selectable li[data-val="4"]').addClass("disabled").removeClass("ui-selected");
						$('#selectable li[data-val="1"]').addClass("disabled").removeClass("ui-selected");
					} else if (ui.value <= -1) {
						console.log("2 3 4");
						$('#selectable li[data-val="1"]').addClass("disabled").removeClass("ui-selected");
					}
				}
			});

			$("#selectable").selectable();
			//  $( "input" ).checkboxradio();      // Needs to be worked on. 
		};

		$(function () {

			app.init();
		});
	}, {}] }, {}, [1]);