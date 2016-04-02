function goToEdit() {
	var courses = document.getElementsByName("courses")[0];
	var c = courses.value;
	console.log(c);
	
	window.location.href = "/courseEdit/" + c;
}