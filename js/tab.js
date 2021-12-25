const tabs = document.getElementsByClassName("tabs");
for (const tab of tabs) {
	const tabId = tab.getAttribute("id");
	const radio = document.getElementsByName(tabId);
	const tabContent = tab.getElementsByClassName("tabContent");
	radio.forEach((element, i) => {
		element.addEventListener("change", (e) => {
			tab.getElementsByClassName("activeLabel")[0].classList.remove("activeLabel");
			e.target.parentElement.classList.add("activeLabel");
			tab.getElementsByClassName("activeContent")[0].classList.remove("activeContent");
			tabContent[i].classList.add("activeContent");
		});
		element.onfocus = (e) => {
			e.target.parentElement.classList.add("focus-visible");
		};
		element.addEventListener("blur", (e) => {
			e.target.parentElement.classList.remove("focus-visible");
		});
		element.parentElement.addEventListener("touchend", () => {
			element.onfocus = "";
		});
	});
}