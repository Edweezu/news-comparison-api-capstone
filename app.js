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

    for (let i = 0 ; i < sourceArray.length ; i++) {
        let params = {
            q: query,
            sources: `${sourceArray[i]}`,
            lang: "en",
            sortBy: "relevancy"
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
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            alert(`Error message: ${err.message}`)
        })
    } 
}

function displayResults(responseJson) {
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
}


