// L
//     the-new-york-times
//     abc-news
// C
//     the-wall-street-journal
//     usa-today
// R
//     fox-news
//     breitbart-news

'use strict'

const sourceArray = ['the-new-york-times', 'abc-news', 'the-wall-street-journal', 'usa-today', 'fox-news', 'breitbart-news'];

const newsApiKey = '86b856af98974f2e98d7934417bf165e';
const youtubeApiKey = 'AIzaSyBPTJbMptjE_RRXTGxcf4GWIQdo4h_EWEg';

const newsSearchUrl = 'https://newsapi.org/v2/everything';
const youtubeSearchUrl = 'https://www.googleapis.com/youtube/v3/search';


$(function () {
    console.log('App working. Ready to serve you, developer.')
    watchForm();
})


function watchForm() {
    $('form.search-button').on('submit', function (e) {
        e.preventDefault();
        let userInput = $('#search-news').val();
        console.log('userInputtttt', userInput);
        getNews(userInput);
        getYoutubeVids(userInput);
    })
}

function getYoutubeVids(query) {

    let params = {

    }

    let queryString = formatString(params)
    let url = newsSearchUrl + '?' + queryString;
    console.log('final news url', url)

    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statustext);
    })
    .then(responseJson => displayYoutubeResults(responseJson))
    .catch(err => $('.error-message').text(`Error: ${err.message}`))
}


function displayYoutubeResults(responseJson) {
    console.log(responseJson)
}




function formatString(params) {
    let result = [];
    for (let key in params) {
        result.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    }
    return result.join('&')
}

//external API call to NewsAPI
function getNews(query) {

    for (let i = 0 ; i < sourceArray.length ; i++) {
        let params = {
            q: query,
            sources: `${sourceArray[i]}`,
            lang: "en",
            sortBy: "relevancy",
            pageSize: 5
            // page: ,
        };

        let queryString = formatString(params)
        let url = newsSearchUrl + '?' + queryString;
        console.log('final news url', url)

        let options = {
            headers: new Headers ({
                'X-Api-Key': newsApiKey
            })
        }
        
        fetch(url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayNewsResults(responseJson))
        .catch(err => {
            $('.error-message').text(`Error: ${err.message}`)
        })
    } 
}

//displays NewsAPI results for each source onto DOM
function displayNewsResults(responseJson) {
    console.log(responseJson);
    $(`#${responseJson.articles[0].source.id}`).empty();
    //responseJson.articles[0].urlToImage

    $(`#${responseJson.articles[0].source.id}`).append(`<img class="article-image" src="${responseJson.articles[0].urlToImage}" alt="first article's image">`)

    for (let i = 0 ; i < responseJson.articles.length; i++) {
        $(`#${responseJson.articles[0].source.id}`).append(`
            <li class="article-list">
                <h4><a href="${responseJson.articles[i].url}" target="_blank">${responseJson.articles[i].title}</a></h4>
                <p>${responseJson.articles[i].description}</p>
            </li>
        `)
    }

    $('.newsapi').removeClass('hidden')
}



