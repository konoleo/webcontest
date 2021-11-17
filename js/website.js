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
	const nav = document.getElementsByTagName("nav")[0];
	const hamburger = document.getElementById("hamburger");
	function toggleMenu() {
		hamburger.classList.toggle("checked");
		nav.classList.toggle("hide");
	}
	hamburger.addEventListener("click", toggleMenu);
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
			toggleMenu();
		});
	}
	lang();
	addRemovePara();
});

(function(d) {
	var config = {
		kitId: 'hsd2xde',
		scriptTimeout: 3000,
		async: true
	},
	h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
})(document);