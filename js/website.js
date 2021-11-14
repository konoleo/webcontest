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
	const aE = document.querySelectorAll("a:not([target])");
	for (let i = 0; i < aE.length; i++) {
		aE[i].setAttribute("href", location.search ? aE[i].getAttribute("href") + location.search : aE[i].getAttribute("href").replace(/\?.+/, ""));
	}
}

const imgLinks = [
	"aji",
	"fire",
	"hare",
	"ki",
	"kusa",
	"mori",
	"naka",
	"shita",
	"ue",
	"yama",
	"yasumu"
];

function shuffle(array) {
	for (let i = (array.length - 1); 0 < i; i--){
		const r = Math.floor(Math.random() * (i + 1));
		const tmp = array[i];
		array[i] = array[r];
		array[r] = tmp;
	}
	return array;
}

window.addEventListener("load", () => {
	const details = document.querySelector("#selectLi details");
	const optionsLang = document.getElementById("optionsLang");
	[["mouseover", "mouseout"], ["focusin", "focusout"]].forEach(elem => {
		details.addEventListener(elem[0], () => details.setAttribute("open", ""));
		[elem[1] === "focusout" ? details : optionsLang][0].addEventListener(elem[1], () => details.removeAttribute("open"));
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
	const footerImg = document.getElementsByTagName("footer")[0].previousElementSibling.children;
	const shuffleArr = shuffle(imgLinks);
	for (let i = 0; i < footerImg.length; i++) {
		const element = footerImg[i];
		element.setAttribute("src", `../origin/img/parts/${shuffleArr[i]}-${Math.floor(Math.random() * 2) + 1}.png`);
		element.setAttribute("alt", `${shuffleArr[i]}の絵`);
	}
});