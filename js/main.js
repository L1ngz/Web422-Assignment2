/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ling Zhang Student ID: _150903219 Date: Sep, 25, 2022
*
********************************************************************************/

var page = 1
var perPage = 10
var url = 'https://good-blue-antelope-robe.cyclic.app/'

const loadMovieData = (title = null) => {
    if (title != null) {
        fetch(url + `api/movies?page=${page}&perPage=${perPage}&title=${title}`)
            .then((res) => { return res.json() })
            .then((data) => {
                var pagi = document.querySelector('.pagination')
                pagi.classList.add("d-none")
                addTrToTable(data)
                updatePage()
                addClickToRow()
                previousPage()
                nextPage()
                searchBt()
                clearBt()
            })
    }

    else {
        fetch(url + `api/movies?page=${page}&perPage=${perPage}`)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                addTrToTable(data)
                updatePage()
                addClickToRow()
                previousPage()
                nextPage()
                searchBt()
                clearBt()
            })

    }
}
document.addEventListener('DOMContentLoaded', function () {
    loadMovieData()
});



const createTrElement = (data) => {
    let trEle =
        `${data.map(a => (
            `
        <tr data-id=${a._id}>
            <td>${a.year}</td>
            <td>${a.title}</td>
            <td>${a.plot}</td>
            <td>${a.rated ? a.rated : "N/A"}</td>
            <td>${Math.floor(a.runtime / 60)}:${(a.runtime % 60).toString().padStart(2, '0')}</td>
        </tr>
        `
        )).join('')}`

    return trEle
}

const addTrToTable = (data) => {

    let trEle = createTrElement(data)
    let tableBody = document.querySelector('#moviesTable tbody')
    tableBody.innerHTML = trEle

}

const updatePage = () => {
    document.querySelector('#current-page').innerHTML = page

}

const addClickToRow = () => {
    let dataRows = document.querySelectorAll('tbody tr')
    dataRows.forEach(row => {
        row.addEventListener("click", () => {
            let id = row.getAttribute('data-id')
            fetch(url + `/api/movies/${id}`)
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    document.querySelector('.modal-title').innerHTML = data.title
                    if (data.poster) {
                        document.querySelector('.modal-body').innerHTML =
                            `
                        <img class="img-fluid w-100" src= ${data.poster}><br><br>
                        <strong>Directed By:</strong> ${data.directors.join(',')}<br><br>
                        <p>${data.fullplot}</p>
                        <strong>Cast:</strong> ${data.cast ? data.cast.join(',') : "N/A"}<br><br>
                        <strong>Awards:</strong> ${data.awards.text}<br>
                        <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes} votes)

                        `
                    }
                    else {
                        document.querySelector('.modal-body').innerHTML =
                            `
                        <strong>Directed By:</strong> ${data.directors.join(',')}<br><br>
                        <p>${data.fullplot}</p>
                        <strong>Cast:</strong> ${data.cast ? data.cast.join(',') : "N/A"}<br><br>
                        <strong>Awards:</strong> ${data.awards.text}<br>
                        <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes} votes)

                        `
                    }

                    let modal = new bootstrap.Modal(document.getElementById('detailsModal'), {
                        backdrop: 'static',
                        keyboard: false,
                    });

                    modal.show();

                    // row.setAttribute("data-bs-toggle", "modal")
                    // row.setAttribute("data-bs-target", "#detailsModal")

                })
        })
    })
}

const previousPage = () => {
    let bt = document.querySelector('#previous-page')
    bt.addEventListener('click', () => {
        if (page > 1)
            page--
        loadMovieData()
    })
}

const nextPage = () => {
    let bt = document.querySelector('#next-page')
    bt.addEventListener('click', () => {
        page++
        loadMovieData()
    })
}

const searchBt = () => {
    document.querySelector('#searchForm').addEventListener('submit', (event) => {
        event.preventDefault();
        loadMovieData(document.querySelector('#title').value);
    });
}

const clearBt = () => {
    document.querySelector('#clear').addEventListener("click", () => {
        document.querySelector('#title').value = ''
        loadMovieData()
    })
}

