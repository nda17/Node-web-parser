const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const colors = require('colors')
const uniqid = require('uniqid')

const parser = async () => {
	
	try {
		const getHtml = async (url) => {
			const { data } = await axios.get(url)
			return cheerio.load(data)
		}

		const idFileName = uniqid.time()

		//Ссылка на страницу с нужной информацией:
		const page = await getHtml('https://www.litres.ru/new/?languages=en&art_types=text_book&only_litres_exclusives=true')

		// Находим все кнопки со страницами (в данном случае 200 кнопок <li class='Paginator_page___fg9G'><a href='?page=NUMBER-PAGE'>NUMBER-PAGE</a></li>):
		const pageNumber = page('li.Paginator_page___fg9G').eq(-1).text()

		console.info('|$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$|'.bgRed)
		console.info(`|$#$#$#$#$#$#$#$#$#$#$|_START PARSING_|$#$#$#$#$#$#$#$#$#$#$|`.bgRed)
		console.info('|$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$|'.bgRed)

		//Цикл запросов к каждой странице (1-200), c получением нужных данных, форматированием и сохранением в сгенерированный файл файл в папке result:
		for (let i = 1; i <= pageNumber; i++) {
			const selector = await getHtml(`https://www.litres.ru/new/?languages=en&art_types=text_book&only_litres_exclusives=true&page=${i}`)

			selector('.ArtInfo_wrapper__GoMsb').each((i, element) => {
				const title = selector(element).find('p.ArtInfo_title__h_5Ay').text()
				const link = `https://www.litres.ru${selector(element).find('a').attr('href')}`
				console.log(title.green, link.cyan);
				fs.appendFileSync(`./result/Parsing-result-${idFileName}.txt`, `${title} ${link}\n`)
			})
		}

		console.info('|$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$|'.bgRed)
		console.info(`|$#$#$#$#$#$#$#$#$#$|_PARSING COMPLETED_|$#$#$#$#$#$#$#$#$#$|`.bgRed)
		console.info('|$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$|'.bgRed)
		console.info(`Result: /result/Parsing-result-${idFileName}.txt`.bgMagenta)

	} catch (error) {
		console.error(error)
		throw error
	}
}

parser()
