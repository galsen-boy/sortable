async function getHeroes() {
    let url =
        "https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json";
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
    console.log(res);
}
let sortHeroes;
let sortedHeroes;

const createTable = (list, value) => {
    let table = document.createElement("table");
    table.setAttribute("id", "heroesTable");
    for (let i = 0; i < value; i++) {
        let row = table.insertRow(i);
        row.insertCell(0).innerHTML = `<img src = ${list[i].images.xs} >`;
        row.insertCell(1).innerHTML = list[i].name;
        row.insertCell(2).innerHTML = list[i].biography.fullName;
        row.insertCell(3).innerHTML = list[i].powerstats.intelligence;
        row.insertCell(4).innerHTML = list[i].powerstats.strength;
        row.insertCell(5).innerHTML = list[i].powerstats.speed;
        row.insertCell(6).innerHTML = list[i].powerstats.durability;
        row.insertCell(7).innerHTML = list[i].powerstats.power;
        row.insertCell(8).innerHTML = list[i].powerstats.combat;
        row.insertCell(9).innerHTML = list[i].appearance.race;
        row.insertCell(10).innerHTML = list[i].appearance.gender;
        row.insertCell(11).innerHTML = list[i].appearance.height[1];
        row.insertCell(12).innerHTML = list[i].appearance.weight[1];
        row.insertCell(13).innerHTML = list[i].biography.placeOfBirth;
        row.insertCell(14).innerHTML = list[i].biography.alignment;
    }
    document.body.append(table);
};

const createSortedTable = (list, value) => {
    let table = document.createElement("tbody");
    table.setAttribute("id", "heroesTable");
    for (let i = 0; i < value; i++) {
        let row = table.insertRow(i);
        row.insertCell(0).innerHTML = "<img src =" + list[i].images.xs + ">";
        row.insertCell(1).innerHTML = list[i].name;
        row.insertCell(2).innerHTML = list[i].biography.fullName;
        row.insertCell(3).innerHTML = list[i].powerstats.intelligence;
        row.insertCell(4).innerHTML = list[i].powerstats.strength;
        row.insertCell(5).innerHTML = list[i].powerstats.speed;
        row.insertCell(6).innerHTML = list[i].powerstats.durability;
        row.insertCell(7).innerHTML = list[i].powerstats.power;
        row.insertCell(8).innerHTML = list[i].powerstats.combat;
        row.insertCell(9).innerHTML = list[i].appearance.race;
        row.insertCell(10).innerHTML = list[i].appearance.gender;
        row.insertCell(11).innerHTML = list[i].appearance.height[1]; // [ft+inch, cm] using cm[1] metric
        row.insertCell(12).innerHTML = list[i].appearance.weight[1]; // [lb, kg] using kg[1] metric
        row.insertCell(13).innerHTML = list[i].biography.placeOfBirth;
        row.insertCell(14).innerHTML = list[i].biography.alignment;
    }
    document.querySelector("table").appendChild(table);
};

const sortAscending = (arr, a, b) => {
    arr.sort((a, b) => {
        if (a === null || a === "-") {
            return 1;
        }

        if (b === null || b === "-") {
            return -1;
        }

        if (a === b) {
            return 0;
        }
        return a < b ? -1 : 1;
    });
};

const sortDescending = (arr, a, b) => {
    arr.sort((a, b) => {
        if (a === null || a === "-") {
            return 1;
        }

        if (b === null || b === "-") {
            return -1;
        }

        if (a === b) {
            return 0;
        }
        return a < b ? 1 : -1;
    });
};

const convertHeight = (a) => {
    if (a.includes("cm")) {
        return parseInt(a);
    } else if (a.includes("meters")) {
        return parseInt(a) * 100;
    }
};

const convertWeight = (a) => {
    if (a.includes("kg")) {
        return parseInt(a);
    } else if (a.includes("tons")) {
        if (a.includes(",")) {
            return parseInt(a) * (1000 * 1000);
        } else {
            return parseInt(a) * 1000;
        }
    }
};

const checkImage = (x) => {
    if (x.includes("no-portrait")) {
        return true;
    }
    return false;
};

async function loadHeroes() {
    let heroes = await getHeroes();
    sortHeroes = heroes;

    let size = document.getElementById("size-options");
    let value = size.options[size.selectedIndex].text;
    let pageSize = value;
    let currentPage = 1;

    size.addEventListener("change", (event) => {
        value = event.target.value;
        let table = document.querySelector("tbody");

        if (table !== null) table.remove();

        createTable(heroes, value);
        pageSize = value;
        currentPage = 1;
    });

    const previousPage = () => {
        if (currentPage !== 1) {
            if (currentPage >= 1) currentPage--;

            let newArray = heroes.slice((currentPage * pageSize) - pageSize, (currentPage * pageSize));
            let table = document.querySelector("tbody");

            if (table !== null) table.remove();

            value = pageSize;
            createTable(newArray, value);
        };
    };
    const nextPage = () => {
        if (currentPage <= heroes.length / pageSize) {
            if ((currentPage * pageSize) < heroes.length) currentPage++;
            let newArray = heroes.slice((currentPage * pageSize) - pageSize, (currentPage * pageSize));
            let table = document.querySelector("tbody");

            if (table !== null) table.remove();

            value = pageSize;

            if (currentPage > heroes.length / pageSize) value = heroes.length % pageSize;
            createTable(newArray, value);
        };
    };

    document.querySelector("#nextButton").addEventListener("click", nextPage, false);
    document.querySelector("#prevButton").addEventListener("click", previousPage, false);

    const attributes = {
        unparseable: [
            "icon",
        ],
        s1: [
            "name",
            "fullName",
        ],
        numerical: [
            "intelligence",
            "strength",
            "speed",
            "durability",
            "power",
            "combat",
        ],
        s2: [
            "race",
            "gender",
        ],
        m1: [
            "height",
            "weight",
        ],
        s3: [
            "placeOfBirth",
            "alignment",
        ]
    };

    const headers = Object.values(attributes).flat();

    const searchBox = document.getElementById("search-input");
    const controls = document.getElementById("controls")
    const select = document.getElementById("search-select");

    for (let i = 1; i < headers.length; i++) {
        const opt = headers[i];
        const el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }

    controls.appendChild(select);

    searchBox.addEventListener("keyup", (event) => {
        const characters = event.target.value.toLowerCase();
        const type = select.value;
        const filteredHeroes = heroes.filter((hero) => {
            if (attributes.numerical.includes(type)) {
                return hero.powerstats[type] == characters
            } else if (attributes.s1.includes(type) || attributes.s2.includes(type)) {
                return hero[type].toLowerCase().includes(characters)
            } else if (attributes.s3.includes(type)) {
                return hero.biography[type].toLowerCase().includes(characters)
            } else if (attributes.m1.includes(type)) {
                if (hero.appearance[type][1] !== undefined) {
                    return hero.appearance[type][1].toLowerCase().includes(characters)
                }
            }
            return false
        });
        let table = document.querySelector("tbody");

        if (table !== null) table.remove();

        value = filteredHeroes.length;

        if (characters === "") {
            currentPage = 1;
            value = 20;
            document.querySelector("#size-options").value = "20";
        }

        createTable(filteredHeroes, value);
        sortHeroes = filteredHeroes;
        document
            .querySelectorAll("#heroesTable thead tr th")
            .forEach((e) => e.addEventListener("click", sortTable));
    });

    value = pageSize;
    createTable(heroes, value);

    let tableOne = document.querySelector("table");

    let header = tableOne.createTHead();
    let headerRow = header.insertRow(0);

    for (let i = 0; i < headers.length; i++) {
        headerRow.insertCell(i).outerHTML = `<th data-column=\"${headers[i]}\" data-order=descending>${headers[i]}</th>`;
    }
    document.querySelectorAll("th").forEach(e => e.addEventListener("click", sortTable));

    function sortTable(x) {
        let column = x.target.getAttribute("data-column");
        let order = x.target.getAttribute("data-order");

        if (order === "descending" && column === "name") {
            x.target.setAttribute("data-order", "ascending");
            sortedHeroes = sortHeroes.sort((a, b) => a[column] > b[column] ? 1 : -1);
            let table = document.querySelector("tbody");

            if (table !== null) table.remove();

            createSortedTable(sortedHeroes, value);
        } else if (order === "ascending" && column === "name") {
            x.target.setAttribute("data-order", "descending");
            sortedHeroes = sortHeroes.sort((a, b) => a[column] < b[column] ? 1 : -1);
            let table = document.querySelector("tbody");

            if (table !== null) table.remove();
            createSortedTable(sortedHeroes, value);
        } else if (order === "descending" && column === "fullName") {
            x.target.setAttribute("data-order", "ascending");
            sortedHeroes = sortHeroes.sort((a, b) => {
                if (a.biography[column] === null ||
                    a.biography[column] === "-" ||
                    a.biography[column] === "") {
                    return 1;
                } else if (
                    b.biography[column] === null ||
                    b.biography[column] === "-" ||
                    b.biography[column] === ""
                ) {
                    return -1;
                } else if (a.biography[column] === b.biography[column]) {
                    return 0;
                } else {
                    return a.biography[column] < b.biography[column] ? -1 : 1;
                }
            });

            let table = document.querySelector("tbody");
            if (table !== null) table.remove();
            createSortedTable(sortedHeroes, value);
        } else if (order === "ascending" && column === "fullName") {
            x.target.setAttribute("data-order", "descending");
            sortedHeroes = sortHeroes.sort((a, b) => {
                if (a.biography[column] === null ||
                    a.biography[column] === "-" ||
                    a.biography[column] === "") {
                    return 1;
                } else if (b.biography[column] === null ||
                    b.biography[column] === "-" ||
                    b.biography[column] === "") {
                    return -1;
                } else if (a.biography[column] === b.biography[column]) {
                    return 0;
                } else {
                    return a.biography[column] < b.biography[column] ? 1 : -1;
                }
            });

            let table = document.querySelector("tbody");
            if (table !== null) table.remove();
            createSortedTable(sortedHeroes, value);
        } else if (order === "descending" && column === "intelligence") {
            x.target.setAttribute("data-order", "ascending");
            sortedHeroes = sortHeroes.sort((a, b) => a.powerstats[column] > b.powerstats[column] ? 1 : -1);
            let table = document.querySelector("tbody");
            if (table !== null) table.remove();

            createSortedTable(sortedHeroes, value);
        } else if (order === "ascending" && column === "intelligence") {
            x.target.setAttribute("data-order", "descending");
            sortedHeroes = sortHeroes.sort((a, b) => a.powerstats[column] < b.powerstats[column] ? 1 : -1);
            let table = document.querySelector("tbody");
            if (table !== null) table.remove();

            createSortedTable(sortedHeroes, value);
        } else if (order === "descending" && column === "strength") {
            x.target.setAttribute("data-order", "ascending");
            sortedHeroes = sortHeroes.sort((a, b) => a.powerstats[column] > b.powerstats[column] ? 1 : -1);
            let table = document.querySelector("tbody");
            if (table !== null) table.remove();

            createSortedTable(sortedHeroes, value);
        } else if (order === "ascending" && column === "strength") {
            x.target.setAttribute("data-order", "descending");
            sortedHeroes = sortHeroes.sort((a, b) => a.powerstats[column] < b.powerstats[column] ? 1 : -1);
            let table = document.querySelector("tbody");
            if (table !== null) table.remove();

            createSortedTable(sortedHeroes, value);
        } else if (order === "descending" && column === "speed") {
            x.target.setAttribute("data-order", "ascending");
            sortedHeroes = sortHeroes.sort((a, b) => a.powerstats[column] > b.powerstats[column] ? 1 : -1);
            let table = document.querySelector("tbody");
            if (table !== null) table.remove();

            createSortedTable(sortedHeroes, value);
        } else if (order === "ascending" && column === "speed") {
            x.target.setAttribute("data-order", "descending");
            sortedHeroes = sortHeroes.sort((a, b) => a.powerstats[column] < b.powerstats[column] ? 1 : -1);
            let table = document.querySelector("tbody");
            if (table !== null) table.remove();

            createSortedTable(sortedHeroes, value);
        } else if (order === "descending" && column === "durability") {
            x.target.setAttribute("data-order", "ascending");
            sortedHeroes = sortHeroes.sort((a, b) => a.powerstats[column] > b.powerstats[column] ? 1 : -1);
            let table = document.querySelector("tbody");
            if (table !== null) table.remove();

            createSortedTable(sortedHeroes, value);
        } else if (order === "ascending" && column === "durability") {
            x.target.setAttribute("data-order", "descending");
            sortedHeroes = sortHeroes.sort((a, b) =>
                a.powerstats[column] < b.powerstats[column] ? 1 : -1
            );
            let table = document.querySelector("tbody");
            if (table !== null) table.remove();

            createSortedTable(sortedHeroes, value);
        } else if (order === "descending" && column === "power") {
            x.target.setAttribute("data-order", "ascending");
            sortedHeroes = sortHeroes.sort((a, b) =>
                a.powerstats[column] > b.powerstats[column] ? 1 : -1
            );
            let table = document.querySelector("tbody");
            if (table !== null) table.remove();

            createSortedTable(sortedHeroes, value);
        } else if (order === "ascending" && column === "power") {
            x.target.setAttribute("data-order", "descending");
            sortedHeroes = sortHeroes.sort((a, b) =>
                a.powerstats[column] < b.powerstats[column] ? 1 : -1
            );
            let table = document.querySelector("tbody");
            if (table !== null) table.remove();

            createSortedTable(sortedHeroes, value);
        } else if (order === "descending" && column === "combat") {
            x.target.setAttribute("data-order", "ascending");
            sortedHeroes = sortHeroes.sort((a, b) =>
                a.powerstats[column] > b.powerstats[column] ? 1 : -1
            );
            let table = document.querySelector("tbody");
            if (table !== null) table.remove();

            createSortedTable(sortedHeroes, value);
        } else if (order === "ascending" && column === "combat") {
            x.target.setAttribute("data-order", "descending");
            sortedHeroes = sortHeroes.sort((a, b) =>
                a.powerstats[column] < b.powerstats[column] ? 1 : -1
            );
            let table = document.querySelector("tbody");
            if (table !== null) table.remove();

            createSortedTable(sortedHeroes, value);
        } else if (order === "descending" && column === "race") {
            x.target.setAttribute("data-order", "ascending");
            sortedHeroes = sortHeroes.sort((a, b) => {
                if (a.appearance[column] === null ||
                    a.appearance[column] === "-" ||
                    a.appearance[column] === "") {
                    return 1;
                } else if (b.appearance[column] === null ||
                    b.appearance[column] === "-" ||
                    a.appearance[column] === "") {
                    return -1;
                } else if (a.appearance[column] === b.appearance[column]) {
                    return 0;
                } else {
                    return a.appearance[column] < b.appearance[column] ? -1 : 1;
                }
            });
            let table = document.querySelector("tbody");

            if (table !== null) table.remove();
            createSortedTable(sortedHeroes, value);
        } else if (order === "ascending" && column === "race") {
            x.target.setAttribute("data-order", "descending");
            sortedHeroes = sortHeroes.sort((a, b) => {
                if (a.appearance[column] === null ||
                    a.appearance[column] === "-" ||
                    a.appearance[column] === "") {
                    return 1;
                } else if (
                    b.appearance[column] === null ||
                    b.appearance[column] === "-" ||
                    b.appearance[column] === ""
                ) {
                    return -1;
                } else if (a.appearance[column] === b.appearance[column]) {
                    return 0;
                } else {
                    return a.appearance[column] < b.appearance[column] ? 1 : -1;
                }
            });
            let table = document.querySelector("tbody");

            if (table !== null) table.remove();
            createSortedTable(sortedHeroes, value);
        } else if (order === "descending" && column === "gender") {
            x.target.setAttribute("data-order", "ascending");
            sortedHeroes = sortHeroes.sort((a, b) => {
                if (a.appearance[column] === null ||
                    a.appearance[column] === "-" ||
                    a.appearance[column] === "") {
                    return 1;
                } else if (b.appearance[column] === null ||
                    b.appearance[column] === "-" ||
                    a.appearance[column] === "") {
                    return -1;
                } else if (a.appearance[column] === b.appearance[column]) {
                    return 0;
                } else {
                    return a.appearance[column] < b.appearance[column] ? -1 : 1;
                }
            });
            let table = document.querySelector("tbody");

            if (table !== null) table.remove();
            createSortedTable(sortedHeroes, value);
        } else if (order === "ascending" && column === "gender") {
            x.target.setAttribute("data-order", "descending");
            sortedHeroes = sortHeroes.sort((a, b) => {
                if (a.appearance[column] === null ||
                    a.appearance[column] === "-" ||
                    a.appearance[column] === "") {
                    return 1;
                } else if (b.appearance[column] === null ||
                    b.appearance[column] === "-" ||
                    b.appearance[column] === "") {
                    return -1;
                } else if (a.appearance[column] === b.appearance[column]) {
                    return 0;
                } else {
                    return a.appearance[column] < b.appearance[column] ? 1 : -1;
                }
            });
            let table = document.querySelector("tbody");

            if (table !== null) table.remove();
            createSortedTable(sortedHeroes, value);
        } else if (order === "descending" && column === "height") {
            x.target.setAttribute("data-order", "ascending");
            sortedHeroes = sortHeroes.sort((a, b) => {
                if (
                    a.appearance[column] === null ||
                    a.appearance[column] === "-" ||
                    a.appearance[column] === "" ||
                    a.appearance[column][1] === undefined
                ) {
                    return 1;
                } else if (
                    b.appearance[column] === null ||
                    b.appearance[column] === "-" ||
                    a.appearance[column] === "" ||
                    b.appearance[column][1] === undefined
                ) {
                    return -1;
                } else if (
                    convertHeight(a.appearance[column][1]) ===
                    convertHeight(b.appearance[column][1])
                ) {
                    return 0;
                } else {
                    return convertHeight(a.appearance[column][1]) <
                        convertHeight(b.appearance[column][1])
                        ? -1
                        : 1;
                }
            });
            let table = document.querySelector("tbody");

            if (table !== null) table.remove();
            createSortedTable(sortedHeroes, value);
        } else if (order === "ascending" && column === "height") {
            x.target.setAttribute("data-order", "descending");
            sortedHeroes = sortHeroes.sort((a, b) => {
                if (
                    a.appearance[column] === null ||
                    a.appearance[column] === "-" ||
                    a.appearance[column] === "" ||
                    a.appearance[column][1] === undefined
                ) {
                    return 1;
                } else if (
                    b.appearance[column] === null ||
                    b.appearance[column] === "-" ||
                    a.appearance[column] === "" ||
                    b.appearance[column][1] === undefined
                ) {
                    return -1;
                } else if (
                    convertHeight(a.appearance[column][1]) ===
                    convertHeight(b.appearance[column][1])
                ) {
                    return 0;
                } else {
                    return convertHeight(a.appearance[column][1]) <
                        convertHeight(b.appearance[column][1])
                        ? 1
                        : -1;
                }
            });
            let table = document.querySelector("tbody");

            if (table !== null) table.remove();
            createSortedTable(sortedHeroes, value);
        } else if (order === "descending" && column === "weight") {
            x.target.setAttribute("data-order", "ascending");
            sortedHeroes = sortHeroes.sort((a, b) => {
                if (
                    a.appearance[column] === null ||
                    a.appearance[column] === "-" ||
                    a.appearance[column] === "" ||
                    a.appearance[column][1] === undefined
                ) {
                    return 1;
                } else if (
                    b.appearance[column] === null ||
                    b.appearance[column] === "-" ||
                    a.appearance[column] === "" ||
                    b.appearance[column][1] === undefined
                ) {
                    return -1;
                } else if (
                    //Q to add convertWeight function
                    convertWeight(a.appearance[column][1]) ===
                    convertWeight(b.appearance[column][1])
                ) {
                    return 0;
                } else {
                    return convertWeight(a.appearance[column][1]) <
                        convertWeight(b.appearance[column][1])
                        ? -1
                        : 1;
                }
            });
            let table = document.querySelector("tbody");

            if (table !== null) table.remove();
            createSortedTable(sortedHeroes, value);
        } else if (order === "ascending" && column === "weight") {
            x.target.setAttribute("data-order", "descending");
            sortedHeroes = sortHeroes.sort((a, b) => {
                if (
                    a.appearance[column] === null ||
                    a.appearance[column] === "-" ||
                    a.appearance[column] === "" ||
                    a.appearance[column][1] === undefined
                ) {
                    return 1;
                } else if (
                    b.appearance[column] === null ||
                    b.appearance[column] === "-" ||
                    a.appearance[column] === "" ||
                    b.appearance[column][1] === undefined
                ) {
                    return -1;
                } else if (
                    convertWeight(a.appearance[column][1]) ===
                    convertWeight(b.appearance[column][1])
                ) {
                    return 0;
                } else {
                    return convertWeight(a.appearance[column][1]) <
                        convertWeight(b.appearance[column][1])
                        ? 1
                        : -1;
                }
            });
            let table = document.querySelector("tbody");

            if (table !== null) table.remove();
            createSortedTable(sortedHeroes, value);
        } else if (order === "descending" && column === "placeOfBirth") {
            x.target.setAttribute("data-order", "ascending");
            sortedHeroes = sortHeroes.sort((a, b) => {
                if (
                    a.biography[column] === null ||
                    a.biography[column] === "-" ||
                    a.biography[column] === ""
                ) {
                    return 1;
                } else if (
                    b.biography[column] === null ||
                    b.biography[column] === "-" ||
                    b.biography[column] === ""
                ) {
                    return -1;
                } else if (a.biography[column] === b.biography[column]) {
                    return 0;
                } else {
                    return a.biography[column] < b.biography[column] ? -1 : 1;
                }
            });
            let table = document.querySelector("tbody");

            if (table !== null) table.remove();
            createSortedTable(sortedHeroes, value);
        } else if (order === "ascending" && column === "placeOfBirth") {
            x.target.setAttribute("data-order", "descending");
            sortedHeroes = sortHeroes.sort((a, b) => {
                if (
                    a.biography[column] === null ||
                    a.biography[column] === "-" ||
                    a.biography[column] === ""
                ) {
                    return 1;
                } else if (
                    b.biography[column] === null ||
                    b.biography[column] === "-" ||
                    b.biography[column] === ""
                ) {
                    return -1;
                } else if (a.biography[column] === b.biography[column]) {
                    return 0;
                } else {
                    return a.biography[column] < b.biography[column] ? 1 : -1;
                }
            });
            let table = document.querySelector("tbody");

            if (table !== null) table.remove();
            createSortedTable(sortedHeroes, value);
        } else if (order === "descending" && column === "alignment") {
            x.target.setAttribute("data-order", "ascending");
            sortedHeroes = sortHeroes.sort((a, b) => {
                if (
                    a.biography[column] === null ||
                    a.biography[column] === "-" ||
                    a.biography[column] === ""
                ) {
                    return 1;
                } else if (
                    b.biography[column] === null ||
                    b.biography[column] === "-" ||
                    b.biography[column] === ""
                ) {
                    return -1;
                } else if (a.biography[column] === b.biography[column]) {
                    return 0;
                } else {
                    return a.biography[column] < b.biography[column] ? -1 : 1;
                }
            });
            let table = document.querySelector("tbody");

            if (table !== null) table.remove();
            createSortedTable(sortedHeroes, value);
        } else if (order === "ascending" && column === "alignment") {
            x.target.setAttribute("data-order", "descending");
            sortedHeroes = sortHeroes.sort((a, b) => {
                if (
                    a.biography[column] === null ||
                    a.biography[column] === "-" ||
                    a.biography[column] === ""
                ) {
                    return 1;
                } else if (
                    b.biography[column] === null ||
                    b.biography[column] === "-" ||
                    b.biography[column] === ""
                ) {
                    return -1;
                } else if (a.biography[column] === b.biography[column]) {
                    return 0;
                } else {
                    return a.biography[column] < b.biography[column] ? 1 : -1;
                }
            });
            let table = document.querySelector("tbody");
            if (table !== null) table.remove();

            createSortedTable(sortedHeroes, value);
        } else if (order === "descending" && column === "icon") {
            x.target.setAttribute("data-order", "ascending");
            sortedHeroes = sortHeroes.sort((a, b) => {
                column = "xs";
                if (checkImage(a.images[column])) {
                    return 1;
                } else if (checkImage(b.images[column])) {
                    return -1;
                } else {
                    return parseInt(a.id) > parseInt(b.id) ? -1 : 1;
                }
            });
            let table = document.querySelector("tbody");
            if (table !== null) table.remove();

            createSortedTable(sortedHeroes, value);
        } else if (order === "ascending" && column === "icon") {
            x.target.setAttribute("data-order", "descending");
            sortedHeroes = sortHeroes.sort((a, b) => {
                column = "xs";
                if (checkImage(a.images[column])) {
                    return 1;
                } else if (checkImage(b.images[column])) {
                    return -1;
                } else {
                    return parseInt(a.id) > parseInt(b.id) ? 1 : -1;
                }
            });
            let table = document.querySelector("tbody");
            if (table !== null) table.remove();

            createSortedTable(sortedHeroes, value);
        }
    };
}
loadHeroes();