const messeage = {
	"en": "scrollable",
	"ja": "スクロールできます"
};
new ScrollHint(".js-scrollable", {
	i18n: {scrollable: messeage[userLang]}
});