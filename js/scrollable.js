const messeage = {
	"en-us": "scrollable",
	"ja": "スクロールできます"
};
new ScrollHint(".js-scrollable", {
	i18n: {scrollable: messeage[userLang]}
});