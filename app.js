// L
//     the-new-york-times
//     abc-news
// C
//     the-wall-street-journal
//     bloomberg
// R
//     fox-news
//     breitbart-news

'use strict'

const sourceArray = ['the-new-york-times', 'abc-news', 'the-wall-street-journal', 'bloomberg', 'fox-news', 'breitbart-news'];

const apiKey = '86b856af98974f2e98d7934417bf165e';

const searchUrl = 'https://newsapi.org/v2/everything';

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
    })
}

function formatString(params) {
    let result = [];
    for (let key in params) {
        result.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    }
    return result.join('&')
}


function getNews(query) {

    let params = {
        q: query,
        sources: "abc-news",
        lang: "en",
        sortBy: "relevancy",
        // pageSize: ,
        // page: ,
    };

    let queryString = formatString(params)
    let url = searchUrl + '?' + queryString;
    console.log('final url', url)

    let options = {
        headers: new Headers ({
            'X-Api-Key': apiKey
        })
    }
    
    fetch(url, options)
    .then(response => response.json())
    .then(responseJson => console.log(responseJson))
}

