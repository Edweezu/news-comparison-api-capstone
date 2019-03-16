'use strict'

const sourceArray = ['the-new-york-times', 'abc-news', 'the-wall-street-journal', 'usa-today', 'fox-news', 'breitbart-news', 'cnn', 'bbc-news', 'daily-mail'];

const newsApiKey = '86b856af98974f2e98d7934417bf165e';
const youtubeApiKey = 'AIzaSyA9Ln2n2KJAwTHSQtsCbTdKudR0hbBL7I8';

const newsSearchUrl = 'https://newsapi.org/v2/everything';
const youtubeSearchUrl = 'https://www.googleapis.com/youtube/v3/search';

let newsArray = [];


$(function () {
    console.log('App working. Ready to serve you, developer.');
    watchForm();
    searchButton();
})

//When user clicks the search button in the nav, scroll to the search input 
function searchButton () {
    $('#nav-search').on('click', function (e) {
        e.preventDefault();
        let liText = $(this).text();
        // console.log(liText)
        $('html, body').animate({
            scrollTop: $('.article-selection-container').offset().top - 58
        })
    })
}


function watchForm() {
    $('form.search-button').on('submit', function (e) {
        e.preventDefault();
        let userInput = $('#search-news').val();
        let leftInput = $('select#left-input').find(":selected").val();
        let rightInput = $('select#right-input').find(":selected").val();
        let centerInput = $('select#center-input').find(":selected").val();
        // console.log('leftInputtttt', leftInput)
        // console.log('rightInputtttt', rightInput)
        // console.log('centerInputtttt', centerInput)
        // console.log('userInputtttt', userInput);
        newsArray.push(leftInput, rightInput, centerInput)

        for (let i = 0 ; i < sourceArray.length ; i++) {
            for (let j = 0 ; j < newsArray.length ; j++) {
                if (!newsArray.includes(sourceArray[i])) {
                    $(`#${sourceArray[i]}`).parent().addClass('hidden');
                }
            }
        }

        $('.no-news-container').empty();
        $('.articles').empty();
        getNews(userInput);
        getYoutubeVids(userInput);
    })
}

//Retrieves youtube videos from Youtube API & converts to JSON
function getYoutubeVids(query) {
    let params = {
        key: youtubeApiKey,
        q: query,
        part: 'snippet',
        type: 'video',
        order: 'Relevance',
        relevanceLanguage: 'en',
        safeSearch: 'moderate',
        maxResults: 8
    }

    let queryString = formatString(params);
    let url = youtubeSearchUrl + '?' + queryString;
    // console.log('final news url', url);

    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statustext);
    })
    .then(responseJson => displayYoutubeResults(responseJson))
    .catch(err => console.log(err.message))
}

//Displays youtube results to the DOM 
function displayYoutubeResults(responseJson) {
    // console.log(responseJson)
    $('#youtube-list').empty();
    if (responseJson.items.length === 0) {
        $('#youtube-list').append(`Sorry, No Youtube Videos were found with that term. Please check for correct spelling, spacing, and punctuation.`)
    } else {
        let showTitle = '';
        let showDescription = '';
        for (let i = 0 ; i < responseJson.items.length ; i++) {
            showTitle = responseJson.items[i].snippet.title;
            showDescription = responseJson.items[i].snippet.description;
        
            $('#youtube-list').append(`
                <li class="article-list">
                    <h4><a href="https://youtube.com/embed/${responseJson.items[i].id.videoId}" target="_blank">${showTitle}</a></h4>
                    <img src="${responseJson.items[i].snippet.thumbnails.default.url}">
                    <p>${showDescription}></p>
                    
                </li>
            `);
        }
    }
    $('.youtubeapi').removeClass('hidden')
}

//Formats parameters in order to successfully perform an API request 
function formatString(params) {
    let result = [];
    for (let key in params) {
        result.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    }
    return result.join('&')
}

//external API call to NewsAPI
function getNews(query) {
    let appended = false;
    // console.log('newsArrayyyyyy', newsArray)
    for (let i = 0 ; i < newsArray.length ; i++) {
        let params = {
            q: query,
            sources: `${newsArray[i]}`,
            lang: "en",
            sortBy: "relevancy",
            pageSize: 8
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
        .then(responseJson => {
            if (responseJson.articles.length === 0 && appended === false) {
                $('.no-news-container').append(`
                <h2>News API</h2>
                <ul>Sorry, No News Articles were found with that term. Please check for correct spelling, spacing, and punctuation.</ul>
                `)
                appended = true;
                $('.no-news-container').removeClass('hidden');
                $('.articles').empty();
                $('.source-container').addClass('hidden');
                newsArray = [];
            } 
            displayNewsResults(responseJson)
        })
        .catch(err => console.log(err.message))
    } 
}

//displays NewsAPI results for each source onto DOM
function displayNewsResults(responseJson) {
    console.log('hi', responseJson);
    console.log('lengthhh', responseJson.articles.length)
    
    $(`#${responseJson.articles[0].source.id}`).empty();

    for (let i = 0 ; i < responseJson.articles.length; i++) {
        $(`#${responseJson.articles[0].source.id}`).append(`
        <li class="article-list">
            <h4><a href="${responseJson.articles[i].url}" target="_blank">${responseJson.articles[i].title}</a></h4>
            <img class="article-image" src="${responseJson.articles[i].urlToImage}" alt="video's image">
            <p>${responseJson.articles[i].description}</p>
        </li>
        `)
    }

    $(`#${responseJson.articles[0].source.id}`).parent().removeClass('hidden')
    $('.newsapi').removeClass('hidden')
    $('.no-news-container').addClass('hidden'); 
    newsArray = [];
}
