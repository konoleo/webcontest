const ua = window.navigator.userAgent.toLowerCase();
if (ua.indexOf("chrome") !== -1) {
	document.body.classList.add("chromium");
	if (ua.indexOf("android") !== -1) {
		document.body.classList.add("android");
	}
} else if (ua.indexOf("safari") !== -1) {
	document.body.classList.add("safari");
} else if (ua.indexOf("firefox") !== -1) {
	document.body.classList.add("firefox");
}

const url = new URL(location);
const supportedLangs = ["ja", "en"];
const pageLang = (() => {
	const pathname = url.pathname;
	if (pathname.match(/\/$/) || pathname.match(/\/[^-]+?\.html$/)) {
		return "ja";
	}
	for (const lang of supportedLangs) {
		if (pathname.match(new RegExp(`-${lang}.html$`))) {
			return lang;
		}
	}
	// サポートされていない言語の場合
	return "ja";
})();
const userLang = navigator.language.toLowerCase().match(/^([^-]+?)(-|$)/)[1];
const langDialog = {
	"ja": {
		"text": "日本語のページに移動しますか?",
		"move": "移動",
		"cancel": "移動しない"
	},
	"en": {
		"text": "Will you move to English page?",
		"move": "Move",
		"cancel": "Cancel"
	}
};
if (userLang !== pageLang) {
	const ref = document.referrer === "" ? null : new URL(document.referrer);
	if ((
			supportedLangs.includes(userLang) ||
			(!supportedLangs.includes(userLang) && pageLang === "ja")
		) && (!ref || ref.host !== url.host)
	) {
		const moveToYourLang = document.getElementById("moveToYourLang");
		const messageLang = supportedLangs.includes(userLang) ? userLang : "en";
		Object.entries(langDialog[messageLang]).forEach(([key, value]) => {
			const elem = moveToYourLang.querySelector(`#${key}`);
			elem.textContent = value;
			if (key === "cancel") {
				elem.addEventListener("click", () => {
					moveToYourLang.close();
				});
			}
		});
		moveToYourLang.showModal();
	}
}

const hamburger = document.getElementById("hamburger");
const nav = document.getElementsByTagName("nav")[0];
const siteLogo = document.getElementById("siteLogo");
const toggleMenu = () => {
	hamburger.classList.toggle("checked");
	nav.classList.toggle("hide");
	const hide = nav.classList.contains("hide");
	nav.querySelectorAll("[tabindex]").forEach(elem => {
		elem.setAttribute("tabindex", hide ? -1 : 0);
	});
	document.querySelectorAll("nav ~ * :is([tabindex], a, input, button)").forEach(elem => {
		elem.setAttribute("tabindex", hide ? 0 : -1);
	});
	siteLogo.classList.toggle("hide");
};
hamburger.addEventListener("click", toggleMenu);
hamburger.addEventListener("keydown", e => {
	if (e.key === "Enter") {
		toggleMenu();
	}
});