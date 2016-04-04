/**
 * Convert CSV to JSON
 * @type {string} csv String of entire input file
 * @return {array] Array of JSON objects
 */
function csvToJson(csv){
	var lines = csv.split("\n");
	var result = [];
	var headers = lines[0].split(",");

	for (var i = 1; i < lines.length; i++) {
		var obj = {};
		var currentline=lines[i].split(",");
		
		for (var j=0; j < headers.length; j++) {
			obj[headers[j]] = currentline[j];
		}
		result.push(obj);
	}

	return JSON.parse(JSON.stringify(result)); 
}// End csvToJson

/**
 * Convert Hex color codes to RGBA 
 * @param  {string} hex 
 * @param  {float} opacity
 * @return {string} result
 */
function hexToRgba(hex, opacity) {
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}// End hexToRgba

/**
 * Generic call that sets interaction listeners
 */
function setListeners() {
	// Modal X close button
	$('.close-modal').click(function() {
		$('#detail-modal').modal('toggle');
	});
	
	// Thumbnail click 
	$('.thumbnail').click(function() {
		var slideid = $(this).data('slideid');
		var slideColor = hexToRgba($(this).data('color'), 88);
		var imgArray = [];
		// console.log("  >  slide # " + slideid);

		for (var i = 0; i <= 3; i++) {
			if (typeof window.flashcards[slideid]['Image' + i] !== 'undefined' 
				&& window.flashcards[slideid]['Image' + i] !== '') {
				imgArray.push(window.flashcards[slideid]['Image' + i].trim());
			}
			else {
				break;
			}
		}

		// *DEBUG*
		// console.log(imgArray);

		// Popup the modal
		$('#detail-modal').appendTo("body")
		$('#detail-modal').modal('show');
		// Clear stuff
		$('#modal-title').empty();
		$('#fullsize-images').empty();

		// Set modal title
		$('#modal-title').html(window.flashcards[slideid].Building);

		// Set modal header bg color
		$('.modal-header').css('background-color', slideColor);

		// Set background color of footer bar to be consistent
		$('.modal-footer').css('background-color', slideColor);

		for (var i = 0; i < imgArray.length; i++) {
			$objImage = $('<div>')
				.addClass('fullsizeImage')
				.html('<img class="img-responsive center-img" src="images/' + imgArray[i] + '">');

			$('#fullsize-images').append($objImage);
		}	
	});


	// MODAL 
	$('#contact').on('click', function() {
		
	});

	$('.close').on('click', function() {
		deselect($('#contact'));
		return false;
	});

}// End setListeners


function drawCards(data) {
	var $cardList = 
		$('<div>')
        	.addClass('row-fluid');
    
    //var cardsPerRow = 2;

    // Loop through all JSON (CSV) rows
	for (i = 0; i < data.length; i++) {	
		var cardColor = colors[data[i].Category.trim()];
		var category = data[i].Category.trim();

		// Fix this in spreadsheet, ideally
		if (category === 'Reactions Against Industrialization') {
			category = 'Anti-Industrialization';
		}

		// Flashcard parent div
		$slideCard = $('<div>')
			.attr('id', 'slide' + i)
			.attr('data-slideid', i)
			.attr('data-color', cardColor)	// Color bar mapped to Category
			.addClass('w388 h240 relative thumbnail col-sm-12 col-md-6 col-lg-3');

		// Prepare Architec + Building spans
	 	$topBlock = $('<div>')
	 		.append(
	 			'<span class="text-lg">' + data[i].Architect.trim()  + '</span>' + 
	 			'<span class="text-md">' + data[i].Building.trim()  + '</span>' + 
	 			'<span class="period-text absolute">' + category + '</span>');

		// Prepare Location + Date block?
		$bottomBlock = $('<div>')
			.addClass('color-bar')
			.css('background-color', cardColor)
			.append('<span class="date-text absolute">' + data[i].Place.trim() + 
					(data[i].Place.trim() !== "" ? ' ' : '') + 
					data[i].Era.trim()  + '</span>');

	 	// Set background image, if any
		if (window.flashcards[i].Image0.trim() !== '') {
			$slideCard.css('background-image','url(images/' + window.flashcards[i].Image0.trim() + ')');
		}

		// Add Top block (Architect/Object) + Bottom block (Category/Location/Year)
	 	$slideCard.append($topBlock);
	 	$slideCard.append($bottomBlock);

	 	// Add to the list
	 	$cardList.append($slideCard);
	}// End loop through JSON data

	$('#cards').append($cardList);

	// Append click listeners
	setListeners();
}// End function drawCards


/**
 * Simple deselect method 
 * @param  {event} e
 */
function deselect(e) {
  $('.pop').slideFadeToggle(function() {
    e.removeClass('selected');
  });    
}

/**
 * Read from CSV file, return JSON data
 * @param  {string} filename
 * @return {XMLHttpRequest}
 */
function getFlashcardData(filename) {
	return $.ajax({
		type: "GET",
		url: filename,
		dataType: "text",
		dataFilter: function (data) {
			var jsonData = csvToJson(data);
            return jsonData;
        },
		success: function(data) {
			//var jsonData = JSON.parse(csvToJson(data));
			//window.flashcards = jsonData;
			
		}, // End success callback
		error : function(code, message){
            // Handle error here
            alert('Unable to load data (' + message + ') ');
        }// End error callback
	});
}// getFlashcardData 
