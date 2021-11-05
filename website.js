window.addEventListener("load", () => {
	const nav = document.getElementsByTagName("nav")[0];
	const hamburger = document.getElementById("hamburger");
	hamburger.addEventListener("click", () => {
		hamburger.classList.toggle("checked");
		nav.classList.toggle("hide");
	});
});