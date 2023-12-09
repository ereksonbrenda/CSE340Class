'use strict'

// get the list of items in the inv from classification_id
let classificationList = document.querySelector('#classificationList')
    classificationList.addEventListener('change', function() {
    let classification_id = classificationList.value;
    console.log(`classification_id: ${classification_id}`)
    // get the inv from the server
    let classIDURL ="/inv/getInv/" + classification_id
    
    fetch(classIDURL)
    .then(function (response) {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Network response was not ok.')
    })

    .then(function (data) {
      console.log(data);
      buildInvList(data);
    })

    .catch(function (error) {
      console.log(
        'There has been a problem with your fetch operation: ',
        error.message
      )
    })
})

// build the inv list
function buildInvList(data) {
  let invDisplay = document.querySelector('#invDisplay');
  // Set up the table labels
  let dataTable = '<thead>';
  dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
  dataTable += '</thead>';
  // Set up the table body
  dataTable += '<tbody>';
  // Iterate over all vehicles in the array and put each in a row
  data.forEach(function (element) {
    console.log(element.inv_id + "," + element.inv_model);
    dataTable += '<tr><td>${element.inv_make} ${element.inv_model}</td>';
    dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to Update'>Modify</a></td>`;
    dataTable += `<td><a href="/inv/delete/${element.inv_id}" title='Click to delete>Delete</a></td>`;
  })
  dataTable += '</tbody>';
   
  // Display the inv in the table in the management view
  invDisplay.innerHTML = dataTable;
}
