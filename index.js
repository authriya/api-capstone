'use strict'

const apiKey = 'teY9qqK1';

const baseURL = 'https://www.rijksmuseum.nl/api/en/collection/';

function watchFormSubmit() {
    $('.search-form').submit(event => {
        event.preventDefault();
        const artist= $('.artist').val();
        const year= $('.year').val();
        const searchQuery= $('.random-query').val();
        const listNumber= $('.number').val();
        if(year == false & listNumber <= 50) {
            getParamsSubmit(artist, year, searchQuery, listNumber)
        }
        else if(year > 21 || year < 0) {
            alert('Please enter a century value between 0 and 21. We wish we could predict great art too.')
        } else if(listNumber > 50) {
            alert('Please limit the number of objects you want to see between 1 and 50.')
        } else {getParamsSubmit(artist, year, searchQuery, listNumber)}
    });
}

function watchFormRandom () {
    $('.random-form').submit(event => {
        event.preventDefault();
        getParamsRandom();
    })
}

function generateRandomNumber() {
    let number= Math.random();
    return number
}

function getParamsRandom() {
    const params = {
        p: Math.floor(generateRandomNumber()*1000),
        key: apiKey,
        format: 'json',
        s: 'relevance',
        toppieces: 'true'
    }
    console.log(params);
    getObjectsRandom(params);
}

function getParamsSubmit(artist, year, searchQuery, listNumber) {
    const params = {
        maker: artist,
        'f.dating.period': year,
        ps: listNumber,
        s: 'relevance',
        format: 'json',
        key: apiKey,
        q: searchQuery
    };
    
    console.log(params);
    getObjectsSubmit(params);
}

function getObjectsSubmit(params) {
    const queryString = formatQueryParams(params);
    const url = baseURL + '?' + queryString;
    console.log(url);
    let responseJson = fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayArtSubmit(responseJson))
    .catch(err => {
        $('.results').empty();
        $('.results').append(`Something went wrong: ${err.message}.`);
    })
}

function getObjectsRandom(params) {
    const queryString = formatQueryParams(params);
    const url = baseURL + '?' + queryString;
    console.log(url);
    let responseJson = fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayArtRandom(responseJson))
    .catch(err => {
        $('.results').empty();
        $('.results').append(`Something went wrong: ${err.message}.`);
    })
}

function formatQueryParams(params) {
    const items = Object.keys(params).map(key => `${key}=${params[key]}`);
    return items.join('&');
}

function displayArtSubmit(responseJson) {
    console.log(responseJson);
    $('.results').empty();
    const listNumber= $('.number').val();
    for (let i = 0; i < listNumber & i < responseJson.artObjects.length; i++) {
        if (responseJson.artObjects[i].hasImage === true) {
            $('.results').append(`<div class="item"><img src="${responseJson.artObjects[i].webImage.url}" class="object-image" id="object-image-${i}" alt="image for ${responseJson.artObjects[i].title}"> <h3 class="list-text"> ${responseJson.artObjects[i].longTitle} </h3> <p class="list-text">Click <a href="${responseJson.artObjects[i].links.web}" target="_blank">here</a> for more information</p><p class="list-text">This object's number is: ${responseJson.artObjects[i].objectNumber}</p></div>`);
        }
        else {$('.results').append(`
        <div class="item"><h3 class="list-text"> ${responseJson.artObjects[i].longTitle} </h3><p class="list-text"> This object has no image </p> <p class="list-text">Click <a href="${responseJson.artObjects[i].links.web}" target="_blank">here</a> for more information</p><p class="list-text">This object's number is: ${responseJson.artObjects[i].objectNumber}</p></div>`)
        }
    };
}

function displayArtRandom(responseJson) {
    console.log(responseJson);
    $('.results').empty();
    let x = Math.floor((generateRandomNumber())*responseJson.artObjects.length);
    console.log(x);
    if (responseJson.artObjects[x].hasImage === true) {
        $('.results').append(`<div class="item"><img src="${responseJson.artObjects[x].webImage.url}" class="object-image" id="object-image-${x}" alt="image for ${responseJson.artObjects[x].title}"> <h3 class="list-text"> ${responseJson.artObjects[x].longTitle} </h3> <p class="list-text">Click <a href="${responseJson.artObjects[x].links.web}" target="_blank">here</a> for more information</p><p class="list-text">This object's number is: ${responseJson.artObjects[x].objectNumber}</p></div>`);
    }
    else {$('.results').append(`
    <div class="item"><h3 class="list-text"> ${responseJson.artObjects[x].longTitle} </h3><p class="list-text"> This object has no image </p> <p class="list-text">Click <a href="${responseJson.artObjects[x].links.web}" target="_blank">here</a> for more information</p><p class="list-text">This object's number is: ${responseJson.artObjects[x].objectNumber}</p></div>`)
    }
}

$(watchFormSubmit);
$(watchFormRandom);