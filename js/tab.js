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
		element.addEventListener("focus", (e) => {
			if (e.target.classList.contains("focus-visible")) {
				e.target.parentElement.classList.add("outline");
			}
		});
		element.addEventListener("blur", (e) => {
			e.target.parentElement.classList.remove("outline");
		});
	});
}