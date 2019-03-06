//L
    //the-new-york-times
    //ABC News
//C
    //the-wall-street-journal
    //bloomberg
//R
    //fox-news
    //breitbart-news

$(function () {
    console.log('App working. Ready to serve you, developer.')
    watchForm();
})


function watchForm() {
    $('form.search-button').on('submit', function (e) {
        e.preventDefault();
        let userInput = $('#search-news').val();
        console.log(userInput);
        getNews(userInput);
    })
}

function getNews(userInput) {
    
}

