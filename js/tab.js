const tabs = document.getElementsByClassName("tabs");
for (const tab of tabs) {
	const tabId = tab.getAttribute("id");
	const radio = document.getElementsByName(tabId);
	const tabLabel = tab.querySelectorAll(".tabLabels .tabWrapper");
	const tabContent = tab.querySelectorAll(".tabContents .tabWrapper");
	radio.forEach((element, i) => {
		if (element.checked) {
			tabLabel[i].classList.add("activeLabel");
			tabContent[i].classList.add("activeContent");
		}
		element.addEventListener("change", () => {
			tab.getElementsByClassName("activeLabel")[0].classList.remove("activeLabel");
			element.parentElement.classList.add("activeLabel");
			if (tabContent[0]) {
				tab.getElementsByClassName("activeContent")[0].classList.remove("activeContent");
				tabContent[i].classList.add("activeContent");
			}
		});
		element.addEventListener("focus", () => {
			if (element.classList.contains("focus-visible")) {
				element.parentElement.classList.add("outline");
			}
		});
		element.addEventListener("blur", () => {
			element.parentElement.classList.remove("outline");
		});
	});
}