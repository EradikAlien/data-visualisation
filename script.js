import Chart from "chart.js/auto";

// récuperer les tableaux sous forme de variables
const tableCrime = document.querySelector("#table1");
const tableCrimeRows = tableCrime.querySelectorAll("tbody tr");
const tableHomicide = document.querySelector("#table2");
const tableHomicideRows = tableHomicide.querySelectorAll("tbody tr");
const parentTableCrime = tableCrime.parentElement;
const parentTableHomicide = tableHomicide.parentElement;
const mainTitle = document.querySelector("#firstHeading");
const parentMainTitle = mainTitle.parentElement;
const bodyData = document.querySelector("#bodyContent");

// créer les canvas
const canvasCrime = document.createElement("canvas");
const canvasHomicide = document.createElement("canvas");
const canvasData = document.createElement("canvas");

// donner une ID au canvas
canvasCrime.id = "canvascrime";
canvasHomicide.id = "canvashomicide";
canvasData.id = "canvasdata";

// fonction crime
function importCrimeChart() {
  // créer un tableau vide
  let labelYear = [];
  let dataSet = [];
  // récuperer les données dans le tableau tableCrime
  tableCrimeRows.forEach((elementTableCrimeRows, rowIndex) => {
    if (rowIndex === 0) {
      elementTableCrimeRows.childNodes.forEach((year) => {
        if (year.textContent.length === 4) {
          labelYear.push(year.textContent);
        }
      });
      //console.log(labelYear);
      return;
    }
    const tableCrimeColumns = elementTableCrimeRows.querySelectorAll("td");
    let data = [];
    tableCrimeColumns.forEach((cell, index) => {
      //insérer les valeurs de l'index 0 dans le tableau label (pays)
      if (index === 0) {
        dataSet.push({
          label: cell.textContent,
          data: [],
        });
        return;
      }
      // transformer les valeurs numériques du tableau en nombre
      data.push(Number(cell.textContent.replace(",", ".")));
    });
    // assigner les nombres a la variable dataSet
    Object.assign(dataSet[rowIndex - 1], { data });
  });
  //   console.log(dataSet);

  // création du graphique Crime
  new Chart(canvasCrime, {
    type: "line",
    data: {
      labels: labelYear,
      datasets: dataSet,
    },
    options: {
      scales: {
        y: {
          type: "logarithmic",
          ticks: {
            font: {
              size: 14,
            },
          },
        },
        x: {
          ticks: {
            font: {
              size: 13,
            },
          },
        },
      },
      responsive: true,
    },
  });
  // attache le graphique avant le tableau dans l'html
  parentTableCrime.insertBefore(canvasCrime, tableCrime);
}

// fonction homicide
function importHomicideChart() {
  // établir les variables vide
  let labelCountry = [];
  let dataSet = [];
  let dataSet2 = [];

  // récuperer les données dans le tableau homicide
  tableHomicideRows.forEach((elementTableHomicideRows, rowIndex) => {
    const tableHomicideColumns =
      elementTableHomicideRows.querySelectorAll("td");
    let data = [];
    tableHomicideColumns.forEach((cell, index) => {
      // récupérer les pays
      if (index === 0) {
        labelCountry.push(cell.textContent);
        // récupérer les stats de 2007 à 2009
      } else if (index === 1) {
        dataSet.push(cell.textContent);
        // récupérer les stats de 2010 à 2012
      } else if (index === 2) {
        dataSet2.push(cell.textContent);
      }
    });

    // assigner les nombres a la variable dataSet
    Object.assign(dataSet[rowIndex], { data });
  });
  //   console.log(labelCountry);
  //   console.log(dataSet);
  //   console.log(dataSet2);

  // création du graphique homicide
  new Chart(canvasHomicide, {
    type: "bar",
    data: {
      labels: labelCountry,
      datasets: [
        {
          data: dataSet,
          label: "2007-09",
        },
        {
          data: dataSet2,
          label: "2010-12",
        },
      ],
    },
    options: {
      scales: {
        y: {
          ticks: {
            font: {
              size: 14,
            },
          },
        },
        x: {
          ticks: {
            font: {
              size: 13,
            },
          },
        },
      },
      responsive: true,
    },
  });

  // attache le graphique avant le tableau dans l'html
  parentTableHomicide.insertBefore(canvasHomicide, tableHomicide);
}

// appelé la fonction
importCrimeChart();
importHomicideChart();
insertChart();
// fetch data
async function fetchData() {
  let value1 = [];
  let value2 = [];
  await fetch("https://canvasjs.com/services/data/datapoints.php", {
    cache: "no-store",
  })
    .then((dataPoints) => dataPoints.json())
    .then((stringData) => {
      //console.log(stringData);
      stringData.forEach((element) => {
        // console.log(element);
        value1.push(element[0]);
        value2.push(element[1]);
      });
      //   console.log(value1);
      //   console.log(value2);
    });
  return [value1, value2];
}
function insertChart() {
  const chart = new Chart(canvasData, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          label: "valeur",
        },
      ],
    },
  });
  parentMainTitle.insertBefore(canvasData, bodyData);
  setInterval(async () => {
    const [value1, value2] = await fetchData();
    chart.data.labels = value1;
    chart.data.datasets[0].data = value2;
    chart.update();
  }, 1000);
}
