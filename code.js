function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

function haalOrderGegevensOp(ordernummer) {
  var sheet = SpreadsheetApp.openById('1nnh9smugzVM5N-bSycZU7-tacZKgb6bGLvs9tnPHe7g').getSheetByName('Input');
  var data = sheet.getDataRange().getValues();

  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === ordernummer) {
      return {
        klantnaam: data[i][3],
        adres: data[i][4],
        plaats: data[i][6],
      };
    }
  }
  return null;
}

function controleerOrdernummer(ordernummer) {
    Logger.log("controleerOrdernummer aangeroepen met ordernummer: " + ordernummer);

    var sheet = SpreadsheetApp.openById("1nnh9smugzVM5N-bSycZU7-tacZKgb6bGLvs9tnPHe7g").getSheetByName("Indicatiedatum");
    var data = sheet.getDataRange().getValues();

    for (var i = 0; i < data.length; i++) {
        if (data[i][0] === ordernummer) {
            Logger.log("Ordernummer gevonden: " + ordernummer);
            Logger.log("Datum: " + data[i][1] + ", Dagdeel: " + data[i][2]);
            return {
                bestaat: true,
                datum: data[i][1],
                dagdeel: data[i][2],
                status: data[i][3] // Voeg de status toe
            };
        }
    }
    Logger.log("Ordernummer niet gevonden: " + ordernummer);
    return { bestaat: false };
}


function verwerkGegevens(ordernummer, bezorgdatum, dagdeel, status) {
    var sheet = SpreadsheetApp.openById("1nnh9smugzVM5N-bSycZU7-tacZKgb6bGLvs9tnPHe7g").getSheetByName("Indicatiedatum");
    var data = sheet.getDataRange().getValues();
    var rowToUpdate = -1;

    for (var i = 0; i < data.length; i++) {
        if (data[i][0] === ordernummer) {
            rowToUpdate = i;
            break;
        }
    }

    if (rowToUpdate !== -1) {
        sheet.getRange(rowToUpdate + 1, 2).setValue(bezorgdatum);
        sheet.getRange(rowToUpdate + 1, 3).setValue(dagdeel);
        sheet.getRange(rowToUpdate + 1, 4).setValue(status); // Update status
    } else {
        sheet.appendRow([ordernummer, bezorgdatum, dagdeel, status]); // Voeg nieuwe rij toe
    }
}

function updateStatus(ordernummer, status) {
    var sheet = SpreadsheetApp.openById("1nnh9smugzVM5N-bSycZU7-tacZKgb6bGLvs9tnPHe7g").getSheetByName("Indicatiedatum");
    var data = sheet.getDataRange().getValues();

    for (var i = 0; i < data.length; i++) {
        if (data[i][0] === ordernummer) {
            sheet.getRange(i + 1, 4).setValue(status); // Update de status in de 4e kolom
            break;
        }
    }
}

function haalBestelnummersOpVoorAanpassing() {
    var sheet = SpreadsheetApp.openById("1nnh9smugzVM5N-bSycZU7-tacZKgb6bGLvs9tnPHe7g").getSheetByName("Indicatiedatum");
    var data = sheet.getDataRange().getValues();
    var bestelnummers = [];

    data.forEach(function(row) {
        if (row[3] === "Indicatie") { // Status is in de 4e kolom (index 3)
            bestelnummers.push(row[0]); // Bestelnummer is in de 1e kolom
        }
    });

    return bestelnummers;
}


