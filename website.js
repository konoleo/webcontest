const url = new URL(location);
let navLang = window.navigator.language;
if (/en/.test(navLang)) {
	navLang = "en-US";
}
const paraLang = url.searchParams.get("lang");
let userLang = paraLang || navLang;
const supportedLang = ["ja", "en-US"];
function lang() {
	document.getElementsByTagName("html")[0].setAttribute("lang", userLang);
	document.title = document.querySelector(`title:lang(${userLang})`).textContent;
	const hideLang = supportedLang.filter(item => userLang !== item);
	const showLangElems = document.querySelectorAll(`[lang=${userLang}]`);
	for (let i = 0; i < showLangElems.length; i++) {
		showLangElems[i].removeAttribute("hidden");
	}
	hideLang.forEach(item => {
		const hideLangElems = document.querySelectorAll(`[lang=${item}]`);
		for (let i = 0; i < hideLangElems.length; i++) {
			hideLangElems[i].setAttribute("hidden", "");
		}
	});
}

function addRemovePara() {
	const aE = document.getElementsByTagName("a");
	for (let i = 0; i < aE.length; i++) {
		aE[i].setAttribute("href", location.search ? aE[i].getAttribute("href") + location.search : aE[i].getAttribute("href").replace(/\?.+/, ""));
	}
}

window.addEventListener("load", () => {
	const selectLangE = document.getElementsByName("selectLang");
	for (let i = 0; i < selectLangE.length; i++) {
		const element = selectLangE[i];
		if (element.value === userLang) {
			element.checked = true;
		}
		element.addEventListener("change", () => {
			userLang = element.value;
			if (navLang !== userLang && !url.searchParams.has("lang")) {
				url.searchParams.append("lang", userLang);
				history.replaceState(null, null, url.toString());
			} else if (paraLang !== userLang) {
				url.searchParams.delete("lang");
				history.replaceState(null, null, url.toString());
			}
			lang();
			addRemovePara();
		});
	}
	lang();
	const nav = document.getElementsByTagName("nav")[0];
	const hamburger = document.getElementById("hamburger");
	hamburger.addEventListener("click", () => {
		hamburger.classList.toggle("checked");
		nav.classList.toggle("hide");
	});
	addRemovePara();
});