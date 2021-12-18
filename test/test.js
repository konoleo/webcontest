fetch("../data/kanjidata.json").then(response => {
	if (response.ok) {
		return response.json();
	} else {
		return Promise.reject(new Error("JSONファイルにアクセスできません。"));
	}
}).then((kanjiData) => {
	// 学習年で漢字をフィルター
	function filterByYear(year) {
		const kanjiArr = [];
		Object.keys(kanjiData).forEach(element => {
			if (year.includes(kanjiData[element].studyYear)) {
				kanjiArr.push(element);
			}
		});
		return kanjiArr;
	}

	// function shuffle(array) {
	// 	for (let i = (array.length - 1); 0 < i; i--){
	// 		const r = Math.floor(Math.random() * (i + 1));
	// 		const tmp = array[i];
	// 		array[i] = array[r];
	// 		array[r] = tmp;
	// 	}
	// 	return array;
	// }

	function ramdomSelect(qNum, year) {
		const kanjiArr = shuffle(filterByYear(year));
		const difference = kanjiArr.length - qNum;
		if (difference > 0) {
			kanjiArr.splice(0, difference);
		}
		return kanjiArr;
	}

	function getMultiple(elems) {
		const values = [];
		for (let i = 0; i < elems.length; i++) {
			if (elems[i].checked) {
				const num = Number(elems[i].value);
				if (Number.isNaN(num)) {
					values.push(elems[i].value);
				} else {
					values.push(Number(elems[i].value));
				}
			}
		}
		return values;
	}

	function ordinalSuffix(i) {
		var j = i % 10,
			k = i % 100;
		if (j == 1 && k != 11) {
			return i + "st";
		}
		if (j == 2 && k != 12) {
			return i + "nd";
		}
		if (j == 3 && k != 13) {
			return i + "rd";
		}
		return i + "th";
	}

	const settingTabs = document.getElementsByName("settingTab");
	const settingTabpanel = document.getElementsByClassName("settingTabpanel");
	const questionsDiv = document.getElementById("questionsDiv");
	const studyYearBtns = document.getElementsByName("studyYear");
	const qNumElem = document.getElementById("qNum");
	const kanjiChoicesElems = document.getElementsByName("kanjiChoices");
	const answerBtn = document.getElementById("answer");
	const makeTestBtn = document.getElementById("makeTest");
	const printBtn = document.getElementById("printTest");
	const printAnsBtn = document.getElementById("printAnswer");
	const testAreaElem = document.getElementById("testArea");
	const maxScoreElem = document.getElementById("maxScore");

	// 設定タブの初期設定
	const activeTab = document.getElementById("activeTab");
	activeTab.firstElementChild.setAttribute("checked", "");
	if (activeTab.firstElementChild === settingTabs[0]) {
		settingTabpanel[1].setAttribute("hidden", "");
	} else {
		settingTabpanel[0].setAttribute("hidden", "");
	}
	// 設定タブの動き
	for (let i = 0; i < settingTabs.length; i++) {
		settingTabs[i].addEventListener("click", () => {
			settingTabpanel[i].removeAttribute("hidden");
			settingTabpanel[Math.pow(0,i)].setAttribute("hidden", "");
			settingTabs[i].parentElement.id = "activeTab";
			settingTabs[Math.pow(0,i)].parentElement.removeAttribute("id");
		});
	}

	// 学習年を選び直した時に、選択肢を変える
	function changeChoices() {
		const detailsElems = settingTabpanel[1].getElementsByTagName("details");
		const studyYear = getMultiple(studyYearBtns);
		if (detailsElems.length) {
			studyYear.forEach((year, index) => {
				detailsElems[year-1].removeAttribute("hidden");
				if (index === 0 && detailsElems[year-1].open) {
					detailsElems[year-1].setAttribute("open", "true");
				}
			});
			const otherYears = [1, 2, 3].filter(num => !studyYear.includes(num));
			otherYears.forEach(year => {
				detailsElems[year-1].setAttribute("hidden", "");
			});
		} else {
			// 選択肢を表示
			studyYear.forEach((year, index) => {
				const choices = filterByYear([year]);
				if (choices.length) {
					const details = document.createElement("details");
					if (index === 0) {
						details.setAttribute("open", "true");
					}
					const summary = document.createElement("summary");
					const h3 = document.createElement("h3");
					h3.innerHTML = `
						<span lang="ja">${year}年生</span>
						<span lang="en-us" hidden>${ordinalSuffix(year)} grade</span>
					`;
					summary.appendChild(h3);
					details.appendChild(summary);
					const button = document.createElement("button");
					button.textContent = `${year}年生の漢字をすベて選択`;
					button.innerHTML = `
						<span lang="ja">${year}年生の漢字をすベて選択</span>
						<span lang="en-us" hidden>Select all ${ordinalSuffix(year)} grade Kanji</span>
					`;
					button.setAttribute("id", `all${year}check`);
					details.appendChild(button);
					const div = document.createElement("div");
					div.classList.add("kanjiChoicesDiv");
					details.appendChild(div);
					const temp = document.getElementById("kanjiChoicesTemp");
					choices.forEach(choice => {
						const clone = temp.content.cloneNode(true);
						const labelElem = clone.querySelector("label");
						labelElem.children[0].value = choice;
						let html = labelElem.innerHTML;
						html = html.trim();
						html += choice;
						labelElem.innerHTML = html;
						div.appendChild(clone);
					});
					details.appendChild(div);
					settingTabpanel[1].appendChild(details);
				}
			});
			lang();
		}
	}
	changeChoices();

	["all1check", "all2check", "all3check"].forEach(item => {
		const elem = document.getElementById(item);
		elem.addEventListener("click", () => {
			const inputs = elem.nextElementSibling.getElementsByTagName("input");
			for (let i = 0; i < inputs.length; i++) {
				inputs[i].checked = !elem.classList.contains("checked");
			}
			elem.classList.toggle("checked");
			const message = {
				"ja": ["をすベて選択", "の選択をすべて解除"],
				"en-us": ["Select", "Deselect"],
			};
			supportedLang.forEach(lang => {
				if (!elem.classList.contains("checked")) {
					message[lang].reverse();
				}
				elem.innerHTML = elem.innerHTML.replace(message[lang][0], message[lang][1]);
			});
		});
	});

	// テストを作る
	function makeTest() {
		// ランダムか漢字の選択か判定
		const hiddenElem = [...settingTabpanel].filter(elem => elem.hasAttribute("hidden"));
		const kind = hiddenElem[0] === settingTabpanel[1] ? "ramdom" : "select";
		
		// テストが作れるか判定
		const studyYear = getMultiple(studyYearBtns);
		if (!studyYear.length) {
			alert("学習年をひとつ以上選択してください。");
			return;
		}
		if (kind === "select" && !getMultiple(kanjiChoicesElems).length) {
			alert("漢字をひとつ以上選択してください。");
			return;
		}
		
		// テスト部分の表示
		document.getElementById("testH2").removeAttribute("hidden");
		testAreaElem.removeAttribute("hidden");

		// 今ある問題を削除
		while (questionsDiv.firstChild) {
			questionsDiv.firstChild.remove();
		}

		// 漢字を決定
		let qKanji, qNum;
		if (kind === "ramdom") {
			// 問題数を取得
			qNum = Number(qNumElem.value);
			if (qNumElem.max < qNum) {
				qNum = qNumElem.max;
				qNumElem.value = qNum;
			} else if (qNum < qNumElem.min) {
				qNum = qNumElem.min;
				qNumElem.value = qNum;
			}
			// 漢字をランダムに選ぶ
			qKanji = ramdomSelect(qNum, studyYear);
		} else {
			// 選ばれた漢字を取得
			const kanjis = getMultiple(kanjiChoicesElems);
			// 問題数を取得
			qNum = kanjis.length;
			// シャッフル
			qKanji = shuffle(kanjis);
		}
		maxScoreElem.textContent = qNum;

		const temp = document.getElementById("questionTemp");
		qKanji.forEach(kanji => {
			const test = kanjiData[kanji].test;
			const phraseNum = Math.floor(Math.random() * test.length);	// 何番目のフレーズか
			const clone = temp.content.cloneNode(true);
			const questionElem = clone.querySelector(".question");
			const phraseElem = questionElem.getElementsByClassName("phrase")[0];
			if (test[phraseNum].hasOkurigana) {
				// 送りがながある問題のとき
				questionElem.classList.add("okurigana");
				test[phraseNum].phrase.forEach(phrase => {
					if (phrase.answer) {
						// フレーズ
						const yomigana = document.createElement("span");
						yomigana.classList.add("yomigana");
						yomigana.textContent = phrase.text;
						phraseElem.appendChild(yomigana);
						// 四角
						const blankElem = document.createElement("div");
						blankElem.classList.add("blank");
						// 答え
						const answerElem = document.createElement("span");
						answerElem.textContent = phrase.answer;
						answerElem.classList.add("answer");
						if (phrase.answer.length >= 4) {
							answerElem.classList.add("more");
						}
						answerElem.setAttribute("hidden", "");
						blankElem.appendChild(answerElem);
						questionElem.appendChild(blankElem);
					} else {
						phraseElem.innerHTML += phrase.text;
					}
				});
			} else {
				// 単語の問題のとき
				questionElem.classList.add("tango");
				test[phraseNum].phrase.forEach(phrase => {
					if (phrase.answer) {
						// 四角
						const blankElem = document.createElement("div");
						blankElem.classList.add("blank");
						phraseElem.appendChild(blankElem);
						// フレーズ
						const yomigana = document.createElement("span");
						yomigana.classList.add("yomigana");
						if (phrase.text.length >= 3) {
							yomigana.classList.add("more");
						}
						yomigana.textContent = phrase.text;
						blankElem.appendChild(yomigana);
						// 答え
						const answerElem = document.createElement("span");
						answerElem.textContent = phrase.answer;
						answerElem.classList.add("answer");
						answerElem.setAttribute("hidden", "");
						blankElem.appendChild(answerElem);
					} else {
						phraseElem.innerHTML += phrase.text;
					}
				});
			}
			questionsDiv.appendChild(clone);
		});

		// 答えを表示する準備
		showAnswer();

		// テスト内の漢字を学年に合わせる
		const maxYear = Math.max(...studyYear);
		const maxYearElems = document.querySelectorAll(`[data-year="${maxYear}"]`);
		for (let i = 0; i < maxYearElems.length; i++) {
			maxYearElems[i].removeAttribute("hidden");
		}
		const otherYears = [1, 2, 3].filter(num => num !== maxYear);
		for (let i = 0; i < otherYears.length; i++) {
			const otherYearsElems = document.querySelectorAll(`[data-year="${otherYears[i]}"]`);
			for (let y = 0; y < otherYearsElems.length; y++) {
				otherYearsElems[y].setAttribute("hidden", "");
			}
		}
	}

	// 学習年を選び直したとき
	for (let i = 0; i < studyYearBtns.length; i++) {
		studyYearBtns[i].addEventListener("change", () => {
			// 問題数の最大値を漢字の数に合わせる
			const studyYear = getMultiple(studyYearBtns);
			const maxKanjiNum = filterByYear(studyYear).length;
			qNumElem.max = maxKanjiNum;
			if (qNumElem.value === "0") {
				qNumElem.value = 16;
			}
			if (Number(qNumElem.value) > Number(qNumElem.max)) {
				qNumElem.value = qNumElem.max;
			}
			// 漢字の選択肢を変更
			changeChoices();
		});
	}

	// テスト作成
	makeTestBtn.addEventListener("click", () => {
		makeTest();
		if (!testArea.hasAttribute("hidden")) {
			const message = {
				"ja": "テストを更新",
				"en-us": "Update test",
			};
			supportedLang.forEach(lang => {
				makeTestBtn.querySelector(`:lang(${lang})`).textContent = message[lang];
			});
			printBtn.removeAttribute("hidden");
			printAnsBtn.removeAttribute("hidden");
		}
	});

	// 印刷ボタン
	printBtn.addEventListener("click", () => {
		window.print();
	});
	printAnsBtn.addEventListener("click", () => {
		answerBtn.click();
		window.print();
		answerBtn.click();
	});

	// 印刷
	window.addEventListener("beforeprint", () => {
		const printArea = document.createElement("div");
		printArea.setAttribute("id", "printArea");
		// 8問ずつグルーピング
		function sliceByNumber(array, number) {
			const elements = [...array];
			const length = Math.ceil(elements.length / number);
			return new Array(length).fill().map((_, i) =>
				elements.slice(i * number, (i + 1) * number)
			);
		}
		sliceByNumber(questionsDiv.children, 8).forEach(elemGroup => {
			const div = document.createElement("div");
			div.classList.add("row");
			elemGroup.forEach(elem => {
				div.appendChild(elem);
			});
			questionsDiv.appendChild(div);
		});
		document.body.appendChild(printArea);
		printArea.appendChild(testAreaElem.cloneNode(true));
		document.body.firstElementChild.setAttribute("hidden", "");
	});
	window.addEventListener("afterprint", () => {
		document.body.firstElementChild.removeAttribute("hidden");
		document.getElementById("printArea").remove();
		const rowElem = document.getElementsByClassName("row");
		while (rowElem[0]) {
			while (rowElem[0].firstElementChild) {
				questionsDiv.appendChild(rowElem[0].firstElementChild);
			}
			rowElem[0].remove();
		}
	});

	// 答えを表示
	function showAnswer() {
		const answerElems = document.getElementsByClassName("answer");
		if (answerBtn.checked) {
			for (let i = 0; i < answerElems.length; i++) {
				answerElems[i].removeAttribute("hidden")
			}
		} else {
			for (let i = 0; i < answerElems.length; i++) {
				answerElems[i].setAttribute("hidden", "")
			}
		}
	}
	answerBtn.addEventListener("click", showAnswer);
	showAnswer();

}).catch(e => {
	console.error(e.message);
});