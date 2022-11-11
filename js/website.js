const ua = window.navigator.userAgent.toLowerCase();
if (ua.indexOf("chrome") !== -1) {
	document.body.classList.add("chromium");
	if (ua.indexOf("android") !== -1) {
		document.body.classList.add("android");
	}
} else if (ua.indexOf("safari") !== -1) {
	document.body.classList.add("safari");
}

const url = new URL(location);
const supportedLang = ["ja", "en"];
let navLang = window.navigator.language;
supportedLang.forEach(lang => {
	if (new RegExp(lang).test(navLang)) {
		navLang = lang;
	}
});
if (!supportedLang.includes(navLang)) {
	navLang = "en";
}
if (!supportedLang.includes(navLang)) {
	navLang = "en";
}
if (ua.indexOf("Googlebot") !== -1) {
	navLang = "ja";
}
const paraLang = url.searchParams.get("lang");
let userLang = paraLang || navLang;
function lang() {
	document.getElementsByTagName("html")[0].setAttribute("lang", userLang);
	document.title = document.getElementsByTagName("title")[0].getAttribute(`data-${userLang}`);
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
	const aE = document.querySelectorAll("a:not([target])");
	for (let i = 0; i < aE.length; i++) {
		aE[i].setAttribute("href", location.search ? aE[i].getAttribute("href") + location.search : aE[i].getAttribute("href").replace(/\?.+/, ""));
	}
}

const hamburger = document.getElementById("hamburger");
const nav = document.getElementsByTagName("nav")[0];
const siteName = document.getElementById("siteName");
const mainAndFooter = document.querySelectorAll("nav ~ *");
function toggleMenu() {
	hamburger.classList.toggle("checked");
	nav.classList.toggle("hide");
	const hide = nav.classList.contains("hide");
	nav.querySelectorAll("[tabindex]").forEach(e => {
		e.setAttribute("tabindex", hide ? -1 : 0);
	});
	mainAndFooter.forEach(parent => {
		parent.querySelectorAll("[tabindex], a, input, button").forEach(e => {
			e.setAttribute("tabindex", hide ? 0 : -1);
		});
	});
	siteName.classList.toggle("hide");
}
hamburger.addEventListener("click", toggleMenu);
hamburger.addEventListener("keydown", e => {
	if (e.key === "Enter") {
		toggleMenu();
	}
});
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
		toggleMenu();
		lang();
		addRemovePara();
	});
}
lang();
addRemovePara();