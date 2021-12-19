const axios = require('axios').default
const cheerio = require('cheerio')
// const Film = require('../models/film_info')
// /**
//  * 得到网页源代码
//  */
// async function getStationCode(url) {
//   const movieData = await axios.get(url)
//   return movieData.data
// }

// /**
//  * 得到所有电影的url
//  */
// // async function getMovieLinks() {
// //   //正在热映和即将上映的链接
// //   // const stationHtml = await getStationCode('https://movie.douban.com/cinema/nowplaying/zhanjiang/')
// //   //推荐链接
// //   const stationHtml = await getStationCode('https://movie.douban.com/')
// //   const $ = cheerio.load(stationHtml)
// //   console.log(stationHtml)
// //   //正在热映
// //   // const nowplayings = $('#nowplaying .mod-bd .lists .list-item .poster a')
// //   // const nowplayingsLinks = nowplayings.map((i, m) => {
// //   //   return m.attribs['href']
// //   // }).get()
// //   //即将上映
// //   // const upcomings = $('#upcoming .mod-bd .lists .list-item .poster a')
// //   // const upcomingsLinks = upcomings.map((i, m) => {
// //   //   return m.attribs['href']
// //   // }).get()
// //   // return upcomingsLinks
// //   const recommands = $('.gaia-movie .list-wp .slider')
// //   console.log(recommands.length)
// //   const recommandsLinks = recommands.map((i, m) => {
// //     return m.attribs['href']
// //   }).get()
// //   console.log(recommandsLinks)
// // }
// // getMovieLinks()
// const movieLinks = [
//   'https://movie.douban.com/subject/27594653/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/34805873/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/30464264/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/34869441/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/34884701/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/34869362/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/30458949/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/26342391/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/34902639/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/24733428/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/24298954/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/30171424/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/35173737/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/34983332/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/30428359/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/34850598/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/30128916/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/25862300/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/30257787/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/30284141/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/34894753/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/30352897/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/33591810/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/35069520/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/33408026/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/33400537/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/35051512/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/30482481/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/34845781/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/30444960/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/2609258/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/34281687/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/34811098/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/26754233/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/34982759/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/34797212/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/30373723/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/34869387/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/30346025/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/35154957/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/27073752/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/30489388/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/35135958/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/34960094/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/30323120/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/30443686/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/25907124/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/34962956/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/30403683/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/35198986/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/35155748/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/34816495/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/33476040/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/35069506/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/35231832/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/27042738/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/27589933/?tag=%E7%83%AD%E9%97%A8&from=gaia_video',
//   'https://movie.douban.com/subject/30425219/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/35275115/?tag=%E7%83%AD%E9%97%A8&from=gaia',
//   'https://movie.douban.com/subject/33427533/?tag=%E7%83%AD%E9%97%A8&from=gaia'
// ]
/**
 * 得到单个电影的详情数据
 * @param {*} url 
 */


getMovieDetail("https://www.letpub.com.cn/nsfcfund_search.php?mode=advanced&datakind=list&currentpage=1")
async function getMovieDetail(url) {

  for (let i = 0; i < table.length; i++) {
    let data = {
      'person' : table[i],
      'startTime' : '2007',
      'endTime' : '2019',
      'searchsubmit' : 'true',
  }
    const movieDetail = await axios.post(url, data)
    console.log(movieDetail)
    return
  }
  
}

/**
 * 得到所有电影详情数据
 */
async function getAllMoviesInfo() {
  const moviesLinks = movieLinks
  const proms = []
  for (let i = 0, mLen = moviesLinks.length; i < mLen; i++) {
    proms.push(await getMovieDetail(moviesLinks[i]))
  }
  const allMoviesData = await Promise.all(proms)
  Film.bulkCreate(allMoviesData)
}
// getAllMoviesInfo()
