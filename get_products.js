var request = require('request');
var cheerio = require('cheerio');
var Email = require('./send_email.js');

var page, total, arrayItems;
var run_server = false;
var textMessage = '';

var getAll = function(Price, server) {
	if (server) run_server = true;
	clearVariables();
	console.log('Call getSubmarinoSmartphones');
	getSubmarinoSmartphones(Price);
}

var getSubmarinoSmartphones = function(Price) {
	request(`http://www.submarino.com.br/ajax/ofertas/linha/350374/celulares-e-telefonia-fixa/smartphone?ofertas.limit=90&ofertas.offset=${page}`, function(err, res, body) {
		if (err || res.statusCode != 200) console.log(err);

		var $ = cheerio.load(body);
		if (body.length > 0 && $('.products-area').find('.single-product').length > 0) {

			$('.products-area .single-product').each(function() {
				var store = 'Submarino';
				var idProduct = $(this).find('.productId').val();
				var name = $(this).find('.productInfo .top-area-product a span').text().trim();
				var category = 'Smartphone';
				var price = $(this).find('.productInfo .product-info .price-area .sale.price strong').text().trim().replace('.', '').replace(',', '.').replace('R$ ', '');
				var link = $(this).find('.url').attr('href');

				if (price) {
					arrayItems.push({
						'store': store,
						'idProduct': idProduct,
						'name': name,
						'category': category,
						'price': price,
						'oldPrice': price,
						'lowerPrice': price,
						'percent': 0,
						'link': link
					});
					// console.log(`${name} (${price})`);
					total++;
				}
			});

			page = page + 90;
			getSubmarinoSmartphones(Price);
		} else {
			console.log(`Total: ${total}`);
			saveAll(Price, getSubmarinoCervejas);
		}

	});
}

var getSubmarinoCervejas = function(Price) {
	request(`http://www.submarino.com.br/ajax/ofertas/sublinha/300088/alimentos-e-bebidas/bebidas-alcoolicas/cervejas-especiais?ofertas.limit=90&ofertas.offset=${page}`, function(err, res, body) {
		if (err || res.statusCode != 200) console.log(err);

		var $ = cheerio.load(body);
		if (body.length > 0 && $('.products-area').find('.single-product').length > 0) {

			$('.products-area .single-product').each(function() {
				var store = 'Submarino';
				var idProduct = $(this).find('.productId').val();
				var name = $(this).find('.productInfo .top-area-product a span').text().trim();
				var category = 'Cerveja';
				var price = $(this).find('.productInfo .product-info .price-area .sale.price strong').text().trim().replace('.', '').replace(',', '.').replace('R$ ', '');
				var link = $(this).find('.url').attr('href');

				if (price) {
					arrayItems.push({
						'store': store,
						'idProduct': idProduct,
						'name': name,
						'category': category,
						'price': price,
						'oldPrice': price,
						'lowerPrice': price,
						'percent': 0,
						'link': link
					});
					// console.log(`${name} (${price})`);
					total++;
				}
			});

			page = page + 90;
			getSubmarinoCervejas(Price);
		} else {
			console.log(`Total: ${total}`);
			saveAll(Price, getEmporioCervejas);
		}

	});
}

var getEmporioCervejas = function(Price) {
	request(`http://www.emporiodacerveja.com.br/buscapagina?fq=C%3a%2f9%2f&PS=45&sl=d3798342-50b3-490e-aac9-c1aa0d5f63d8&cc=3&sm=0&PageNumber=${page}`, function(err, res, body) {
		if (err || res.statusCode != 200) console.log(err);

		var $ = cheerio.load(body);
		if (body.length > 0) {

			$('.prateleira  ul .cervejas').each(function() {
				var store = 'Emporio';
				var idProduct = $(this).find('.x-id').val();
				var name = $(this).find('h3 a').text().trim();
				var category = 'Cerveja';
				var price = $(this).find('.x-bestPrice strong').text().trim().replace('.', '').replace(',', '.').replace('R$ ', '');
				var link = $(this).find('.x-productImage').attr('href');

				if (price) {
					arrayItems.push({
						'store': store,
						'idProduct': idProduct,
						'name': name,
						'category': category,
						'price': price,
						'oldPrice': price,
						'lowerPrice': price,
						'percent': 0,
						'link': link
					});
					// console.log(`${name} (${price})`);
					total++;
				}
			});

			page = page + 1;
			getEmporioCervejas(Price);
		} else {
			console.log(`Total: ${total}`);
			saveAll(Price, getGearbestSmartphones);
		}

	});
}

var getGearbestSmartphones = function(Price) {
	request(`http://www.gearbest.com/cell-phones-c_11293/${page}.html?page_size=120`, function(err, res, body) {
		if (err || res.statusCode != 200) console.log(err);

		var $ = cheerio.load(body);
		if (body.length > 0) {

			$('#catePageList li').each(function() {
				try {
					var store = 'Gearbest';
					var idProduct = $(this).find('.js_addToCompare').attr('data-goodsid');
					var name = $(this).find('.all_proNam a').text().trim();
					var category = 'Smartphone';
					var price = $(this).find('.my_shop_price').attr('orgp').trim();
					var link = $(this).find('.all_proNam a').attr('href');
				} catch (err) {}

				if (price) {
					arrayItems.push({
						'store': store,
						'idProduct': idProduct,
						'name': name,
						'category': category,
						'price': price,
						'oldPrice': price,
						'lowerPrice': price,
						'percent': 0,
						'link': link
					});
					// console.log(`${name} (${price})`);
					total++;
				}
			});

			if ($('.cate_list_footer').find('.next').length > 0) {
				page = page + 1;
				getGearbestSmartphones(Price);
			} else {
				console.log(`Total: ${total}`);
				saveAll(Price, getGearbestComputadores);
			}
		} else {
			console.log(`Total: ${total}`);
			saveAll(Price, getGearbestComputadores);
		}

	});
}

var getGearbestComputadores = function(Price) {
	request(`http://www.gearbest.com/computers-networking-c_11257/${page}.html?page_size=120`, function(err, res, body) {
		if (err || res.statusCode != 200) console.log(err);

		var $ = cheerio.load(body);
		if (body.length > 0) {

			$('#catePageList li').each(function() {
				try {
					var store = 'Gearbest';
					var idProduct = $(this).find('.js_addToCompare').attr('data-goodsid');
					var name = $(this).find('.all_proNam a').text().trim();
					var category = 'Computador';
					var price = $(this).find('.my_shop_price').attr('orgp').trim();
					var link = $(this).find('.all_proNam a').attr('href');
				} catch (err) {}

				if (price) {
					arrayItems.push({
						'store': store,
						'idProduct': idProduct,
						'name': name,
						'category': category,
						'price': price,
						'oldPrice': price,
						'lowerPrice': price,
						'percent': 0,
						'link': link
					});
					// console.log(`${name} (${price})`);
					total++;
				}
			});

			if ($('.cate_list_footer').find('.next').length > 0) {
				page = page + 1;
				getGearbestComputadores(Price);
			} else {
				console.log(`Total: ${total}`);
				saveAll(Price, false);
			}
		} else {
			console.log(`Total: ${total}`);
			saveAll(Price, false);
		}

	});
}

var saveAll = function(Price, nextFunction) {
	for (var item in arrayItems) {
		if (arrayItems.hasOwnProperty(item)) {
			var lastProduct = false;
			if ((arrayItems.length - 1) == item) lastProduct = true;

			var product = new Price(arrayItems[item]);
			findOne(Price, product, lastProduct, nextFunction);
		}
	}
}

var findOne = function(Price, product, lastProduct, nextFunction) {
	var query = {
		store: product.store,
		idProduct: product.idProduct
	};

	var promise = Price.findOne(query).exec();

	promise.then(function(productFind) {

			if (productFind) {
				var priceNew = product.price;
				var priceCurrent = productFind.price;
				var priceOld = productFind.oldPrice;
				var priceLower = productFind.lowerPrice;

				if (priceNew != priceCurrent) {
					productFind.oldPrice = priceCurrent;
					productFind.price = priceNew;
					productFind.dateLastUpdate = Date.now();
					productFind.percent = (100 - ((priceNew * 100) / priceCurrent)).toFixed(2);
				}

				if (priceNew < priceLower) {
					productFind.lowerPrice = priceNew;
					productFind.dateLowerPrice = Date.now();
					if (productFind.percent > 10) textMessage = `Minimo (De: ${priceLower} Para: ${priceNew}) ${productFind.name} (${productFind.link}) <br><br>`;
				} else if (priceNew < priceCurrent) {
					if (productFind.percent > 10) textMessage = `Menor (De: ${priceCurrent} Para: ${priceNew}) ${productFind.name} (${productFind.link}) <br><br>`;
				} else if (priceNew > priceCurrent) {
					productFind.percent = 0;
				}

				return productFind.save();
			}
			return product.save();
		})
		.then(function() {
			if (lastProduct) {
				if (nextFunction) {
					clearVariables();
					console.log(`Call ${nextFunction.name}`);
					nextFunction(Price);
				} else {
					console.log(textMessage);
					if (textMessage != '') Email.send(textMessage);
					console.log('Fim');
					if (!run_server) process.exit();
				}
			}
		});
}

var clearVariables = function() {
	page = 0;
	total = 0;
	arrayItems = new Array();
}

module.exports = {
	getAll: getAll
}