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

function ordinalSuffix(num) {
	var j = num % 10,
		k = num % 100;
	if (j == 1 && k != 11) {
		return num + "st";
	}
	if (j == 2 && k != 12) {
		return num + "nd";
	}
	if (j == 3 && k != 13) {
		return num + "rd";
	}
	return num + "th";
}
function addNensei(grade, lang) {
	switch (lang) {
		case "ja":
			return `${grade}年生${grade === 4 ? "（前期）" : ""}`;
		case "en":
			return `${ordinalSuffix(grade)} grade${grade === 4 ? " (first semester)" : ""}`;
		default:
			break;
	}
}
function addNenseiToElem(grade, elem, query) {
	supportedLang.forEach(lang => {
		elem.querySelector(`${query || ""}:lang(${lang})`).textContent = addNensei(grade, lang);
	});
}

function filterBy(data, options, keyValueAll, aa) {
	const filtered = Object.keys(data).filter(key => {
		let bools = [];
		Object.entries(options).forEach(([optKey, optValue]) => {
			let bool = "";
			switch (typeOf(optValue)) {
				case "string":
				case "boolean":
				case "number":
					bool = data[key][optKey] === optValue;
					break;
				case "array":
					bool = optValue.includes(data[key][optKey]);
					break;
				default:
					break;
			}
			bools.push(bool);
		});
		if (!bools.includes(false)) {
			return true;
		}
	});
	switch (keyValueAll) {
		case "key":
			var result = filtered;
			break;
		case "value":
			var result = filtered.map(key => {data[key]});
			break;
		case "all":
			var result = {};
			filtered.forEach(key => {
				result[key] = data[key];
			});
			break;
		default:
			break;
	}
	return result;
}

function shuffle(array) {
	const newArray = Array(array.length);
	array.forEach(elem => {
		const key = Math.floor(Math.random() * (array.length + 1));
		newArray.splice(key, 0, elem);
	});
	return newArray.filter(value => value);
}

function typeOf(obj) {
	return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

function sliceByNum(array, num) {
	let newArr = new Array(Math.ceil(array.length / num)).fill([]);
	newArr = newArr.map((_, i) => array.slice(num * i, num * (i + 1)));
	return newArr;
}

let fragment = document.createDocumentFragment();

fetch("../data/kanjidata.json").then(response => {
	if (response.ok) {
		return response.json();
	} else {
		return Promise.reject(new Error("JSONファイルにアクセスできません。"));
	}
}).then(jsonData => {
	const newData = {};
	Object.entries(jsonData).forEach(([kanji, data1]) => {
		if (data1.readings) {
			data1.readings.forEach(data2 => {
				data2.strokesNum = data1.strokesNum;
				data2.readingForSort = data1.readingForSort;
				const key = `${kanji}${data2.reading ? "（" + data2.reading + "）" : ""}`;
				newData[key] = data2;
			});
		} else {
			if (data1.isUniqueReading) {
				const newQuizzes = [];
				data1.quizzes.forEach(quiz => {
					quiz.phrase.forEach((item, i) => {
						if (item.answer) {
							const answer = item.answer;
							const kanjis = [...item.answer.matchAll(/[一-龠]/g)];
							kanjis.forEach(matched => {
								const newQuiz = JSON.parse(JSON.stringify(quiz));
								const newAnswerArr = [];
								const before = answer.substr(0, matched.index);
								const newAnswer = answer.substr(matched.index, matched.index + 1);
								const after = answer.substr(matched.index + 1);
								if (before !== "") {
									newAnswerArr.push({"text": before});
								}
								newAnswerArr.push({"answer": newAnswer});
								if (after !== "") {
									newAnswerArr.push({"text": after});
								}
								newQuiz.phrase[i].answer = newAnswerArr;
								newQuizzes.push(newQuiz);
							});
						}
					});
				});
				data1.quizzes = newQuizzes;
			}
			newData[kanji] = data1;
		}
	});
	return newData;
}).then(kanjiData => {

	const makeTestBtn = document.getElementById("makeTest");
	const testSectionE = document.getElementById("testSection");

	// 全ての学習年をデータから取得
	const allGrades = [...new Set(Object.values(kanjiData).map(elem => elem.studyGrade))].sort((a, b) => a - b);

	// 学習年の選択肢を作る
	const studyGradesOptTemp = document.getElementById("studyGradesOptTemp");
	fragment = document.createDocumentFragment();
	allGrades.forEach(grade => {
		const clone = studyGradesOptTemp.content.cloneNode(true);
		const studyGradesOptE = clone.querySelector("[name=studyGradesOpt]")
		studyGradesOptE.value = grade;
		studyGradesOptE.addEventListener("change", reselectGrades);
		addNenseiToElem(grade, clone);
		fragment.append(clone);
	});
	studyGradesOptTemp.parentElement.append(fragment);
	const studyGradesOpts = document.getElementsByName("studyGradesOpt")

	// 「漢字を選択」タブの中を作る
	const detailsTemp = document.getElementById("detailsTemp");
	const strokeNumTitleTemp = document.getElementById("strokeNumTitleTemp");
	const kanjiChoicesTemp = document.getElementById("kanjiChoicesTemp");
	fragment = document.createDocumentFragment();
	allGrades.forEach(grade => {
		const clone1 = detailsTemp.content.cloneNode(true);
		const detailsE = clone1.querySelector("details");
		detailsE.id = `details${grade}`;
		addNenseiToElem(grade, clone1, "h2 > ");
		// 「全て選択」ボタン
		const selectAllBtn = clone1.querySelector(".selectAllBtn");
		selectAllBtn.addEventListener("click", () => {
			const inputs = detailsE.querySelectorAll("[name=kanjiChoices]");
			const wantToSelect = selectAllBtn.classList.contains("select");
			for (const input of inputs) {
				input.checked = wantToSelect;
				input.dispatchEvent(new Event("change"));
			}
			selectAllBtn.classList.toggle("select");
			const text = {
				ja: {wantToSelect: "選択", wantToDeselect: "選択解除"},
				en: {wantToSelect: "Select", wantToDeselect: "Deselect"}
			};
			Object.entries(text).forEach(([lang, value]) => {
				const elem = selectAllBtn.querySelector(`:lang(${lang})`);
				elem.textContent = elem.textContent.replace(wantToSelect ? value.wantToSelect : value.wantToDeselect, wantToSelect ? value.wantToDeselect : value.wantToSelect);
			});
		});
		// その年に学習した漢字を取得
		const kanjis = filterBy(kanjiData, {studyGrade: grade}, "all");
		// 画数ごとに分ける
		const strokeNums = [...new Set(Object.values(kanjis).map(elem => elem.strokesNum))]
		strokeNums.sort((a, b) => a - b);
		strokeNums.forEach(strokeNum => {
			let filteredByStrokeNum;
			const clone2 = strokeNumTitleTemp.content.cloneNode(true);
			if (strokeNum === undefined) {
				filteredByStrokeNum = filterBy(kanjis, {isUniqueReading: true}, "key");
				clone2.querySelector(":lang(ja)").textContent = "特別な読み方";
				clone2.querySelector(":lang(en)").textContent = "Unique readings";
			} else {
				filteredByStrokeNum = filterBy(kanjis, {strokesNum: strokeNum}, "key");
				clone2.querySelector(":lang(ja)").textContent = `${strokeNum}画`;
				clone2.querySelector(":lang(en)").textContent = `${strokeNum} stroke${strokeNum !== 1 ? "s" : ""}`;
			}
			const kanjiChoicesDiv = clone2.querySelector(".kanjiChoicesDiv");
			detailsE.append(clone2);
			// 読みで並び替え
			filteredByStrokeNum.sort((a, b) => {
				const readingA = kanjiData[a].readingForSort;
				const readingB = kanjiData[b].readingForSort;
				if (readingA <= readingB) {
					return -1;
				} else {
					return 1;
				}
			});
			filteredByStrokeNum.forEach(kanji => {
				const clone3 = kanjiChoicesTemp.content.cloneNode(true);
				clone3.querySelector("[name=kanjiChoices]").value = kanji;
				const kanjiChoicesLabelE = clone3.querySelector(".kanjiChoices");
				let html = kanjiChoicesLabelE.innerHTML;
				html = html.trim();
				html += kanji;
				kanjiChoicesLabelE.innerHTML = html;
				kanjiChoicesDiv.append(clone3);
			});
		});
		fragment.append(clone1);
	});
	detailsTemp.parentElement.append(fragment);

	// ボタンをfooterMenuにコピー
	const btnsE = document.getElementById("btns");
	const footerMenu = document.getElementById("footerMenu");
	const parent = document.createElement("div");
	parent.classList.add("btns");
	const btns = {};
	for (const btn of btnsE.children) {
		const clone = btn.cloneNode(true);
		clone.classList.add(`${clone.id}Clone`);
		btns[clone.id] = [btn, clone];
		clone.removeAttribute("id");
		parent.append(clone);
	}
	footerMenu.append(parent);

	// 漢字の選択が変更された時
	const kanjiChoicesEs = document.getElementsByName("kanjiChoices");
	const qCounterEs = document.getElementsByClassName("qCounter");
	const sheetsCounterEs = document.getElementsByClassName("sheetsCounter");
	const beVerb = document.getElementById("beVerb");
	const nouns = document.getElementsByClassName("nouns");
	for (const elem of kanjiChoicesEs) {
		elem.addEventListener("change", () => {
			if (elem.checked) {
				elem.parentElement.classList.add("checked");
			} else {
				elem.parentElement.classList.remove("checked");
			}
			// カウンター表示変更
			const qNum = getMultiple(kanjiChoicesEs).length;
			const sheetsNum = qNum === 0 ? 0 : Math.ceil(Math.ceil((qNum - 16) / 8) / 3) + 1;
			for (let i = 0; i < qCounterEs.length; i++) {
				qCounterEs[i].textContent = qNum;
				sheetsCounterEs[i].textContent = sheetsNum;
				beVerb.textContent = qNum === 1 ? "is" : "are";
				for (const noun of nouns) {
					if ((noun.classList.contains("qNum") ? qNum : sheetsNum) === 1) {
						noun.textContent = noun.textContent.replace(/s$/, "");
					} else {
						noun.textContent += /s$/.test(noun.textContent) ? "" : "s";
					}
				}
			}
		});
		elem.addEventListener("click", () => {
			// テストの更新
			if (!testSectionE.hasAttribute("hidden")) {
				makeTestBtn.click();
			}
		});
	}

	// 「ランダムに選択」ボタン
	const randomSelectBtn = document.getElementById("randomSelect");
	const qNumE = document.getElementById("qNum");
	randomSelectBtn.addEventListener("click", randomSelect);
	qNumE.addEventListener("focus", () => {
		randomSelectBtn.removeEventListener("click", randomSelect);
	});
	qNumE.addEventListener("blur", () => {
		randomSelectBtn.addEventListener("click", randomSelect);
	});
	qNumE.addEventListener("change", randomSelect);
	function randomSelect() {
		for (const choiceE of document.querySelectorAll("[name=kanjiChoices]:checked")) {
			choiceE.checked = false;
			choiceE.dispatchEvent(new Event("change"));
		}
		const shuffled = shuffle([...kanjiChoicesEs]).slice(0, qNumE.value);
		shuffled.forEach(choiceE => {
			choiceE.checked = true;
			choiceE.dispatchEvent(new Event("change"));
		});
		// テストの更新
		if (!testSectionE.hasAttribute("hidden")) {
			makeTestBtn.click();
		}
	}

	// カウンター表示
	const r1 = footerMenu.getBoundingClientRect();
	window.addEventListener("scroll", () => {
		const r2 = makeTestBtn.getBoundingClientRect().top + window.pageYOffset - 600;
		if (r2 < r1.top + window.pageYOffset) {
			footerMenu.setAttribute("hidden", "");
		} else {
			footerMenu.removeAttribute("hidden");
		}
	});

	// 学習年を選び直した時
	function reselectGrades() {
		// 問題数の最大値を漢字の数に合わせる
		const selectedGrades = getMultiple(studyGradesOpts);
		const maxKanjiNum = filterBy(kanjiData, {"studyGrade": selectedGrades}, "key").length;
		qNumE.max = maxKanjiNum;

		// 入力された問題数を変更
		if (qNumE.value === "0") {
			qNumE.value = 40;
		}
		if (Number(qNumE.value) > Number(qNumE.max)) {
			qNumE.value = qNumE.max;
		}

		// 「n年生の漢字が全て出るテストを作ります。」を変更
		const text = {ja: "", en: ""};
		selectedGrades.forEach((grade, i) => {
			text.ja += addNensei(grade, "ja");
			text.en += addNensei(grade, "en");
			if (selectedGrades.length !== i + 1) {
				text.ja += "、";
				text.en += selectedGrades.length === i + 2 ? " and " : ", ";
			}
		});
		document.querySelector(":lang(ja) > .selectedGrades").textContent = text.ja;
		document.querySelector(":lang(en) > .selectedGrades").textContent = text.en;

		// 「漢字を選択」タブの中の表示する学年を変更
		allGrades.forEach(grade => {
			const details = document.getElementById(`details${grade}`);
			if (selectedGrades.includes(grade)) {
				details.removeAttribute("hidden", "");
			} else {
				details.setAttribute("hidden", "");
			}
		});

		// 選択解除された学年の問題の選択解除
		const deselectedGradeChoicesEs = document.querySelectorAll(".gradeDetails[hidden] [name=kanjiChoices]:checked");
		for (const choiceE of deselectedGradeChoicesEs) {
			choiceE.checked = false;
			choiceE.dispatchEvent(new Event("change"));
		}

		// テストを更新
		if (!testSectionE.hasAttribute("hidden")) {
			makeTestBtn.click();
		}
	}
	reselectGrades();

	// テストを作る
	const printTestBtn = document.getElementById("printTest");
	const printAnswerBtn = document.getElementById("printAnswer");
	btns.makeTest.forEach(btn => {
		btn.addEventListener("click", makeTest);
	});
	const tabContent = document.querySelectorAll("#tab01 .tabContents .tabWrapper");
	const testPrintE = document.getElementById("testPrint");
	const maxScoreE = document.getElementById("maxScore");
	const okuriganaTemp = document.getElementById("okuriganaTemp");
	const tangoTemp = document.getElementById("tangoTemp");
	function makeQuestions(clone, textData, i, basisNum, basisE, kind) {
		if (textData.answer) {
			// 問題部分
			const reading = clone.querySelector(".reading");
			reading.textContent += textData.reading || "";
			const answer = clone.querySelector(".answer");
			if (kind === "okurigana" && textData.answer.length >= 4) {
				// 送り仮名問題 && 答えが長い場合
				answer.classList.add("long");
			}
			if (typeOf(textData.answer) === "array") {
				// 特別な読み方の場合
				basisE.classList.add("unique");
				const basisNum2 = textData.answer.findIndex(elem => elem.answer);
				const basisE2 = clone.querySelector(".blank");
				textData.answer.forEach((textData2, i2) => {
					makeQuestions(clone, textData2, i2, basisNum2, basisE2, "unique");
				});
				if (textData.reading.length <= textData.answer.length) {
					// 読みが短い場合2
					reading.classList.add("short2");
				} else if (textData.reading.length <= textData.answer.length + 1) {
					// 読みが短い場合1
					reading.classList.add("short1");
				} else if (textData.reading.length >= textData.answer.length + 3) {
					// 読みが長い場合
					reading.classList.add("long");
				}
			} else {
				// 通常の読み方の場合
				answer.textContent = textData.answer;
				if (kind === "tango" && textData.reading.length >= 3) {
					// 単語問題 && 読みが長い場合
					reading.classList.add("long");
				}
			}
		} else {
			// テキスト部分
			switch (i) {
				case basisNum - 1:
					basisE.before(textData.text);
					break;
				case basisNum + 1:
					basisE.after(textData.text);
					break;
				default:
					break;
			}
		}
	}
	function makeTest() {
		// ランダムか漢字の選択か判定
		const kind = [...tabContent].filter(elem => elem.classList.contains("activeContent"))[0].id;

		// テストが作れるか判定
		const selectedGrades = getMultiple(studyGradesOpts);
		if (!selectedGrades.length) {
			alert("学習年をひとつ以上選択してください。");
			return;
		}
		if (kind === "select" && !getMultiple(kanjiChoicesEs).length) {
			alert("漢字をひとつ以上選択してください。");
			return;
		}

		// 今ある問題を削除
		const rows = document.getElementsByClassName("row");
		while (rows[0]) {
			rows[0].remove();
		}

		// 漢字を決定
		let qKanji;
		switch (kind) {
			case "grade":
				qKanji = filterBy(kanjiData, {studyGrade: selectedGrades}, "key");
				qKanji = shuffle(qKanji);
				break;
			case "select":
				qKanji = shuffle(getMultiple(kanjiChoicesEs));
				break;
			default:
				break;
		}
		const qNum = qKanji.length;
		maxScoreE.textContent = qNum;

		qKanji = sliceByNum(qKanji, 8);
		fragment = document.createDocumentFragment();
		qKanji.forEach(kanjis => {
			const div = document.createElement("div");
			div.classList.add("row");
			kanjis.forEach(kanji => {
				const quizzes = kanjiData[kanji].quizzes;
				const phraseData = quizzes[Math.floor(Math.random() * quizzes.length)];
				let clone, basisE, kind;
				if (phraseData.hasOkurigana) {
					// 送り仮名を書かせる問題
					clone = okuriganaTemp.content.cloneNode(true);
					basisE = clone.querySelector(".reading");
					kind = "okurigana";
				} else {
					// 単語内の漢字を書かせる問題
					clone = tangoTemp.content.cloneNode(true);
					basisE = clone.querySelector(".main");
					kind = "tango";
				}
				const basisNum = phraseData.phrase.findIndex(elem => elem.answer);
				phraseData.phrase.forEach((textData, i) => {
					makeQuestions(clone, textData, i, basisNum, basisE, kind);
				});
				clone.children[0].innerHTML = clone.children[0].innerHTML.replace(/[\n\t]/g, "");
				div.append(clone);
			});
			fragment.append(div);
		});
		testPrintE.append(fragment);

		// テスト内の漢字を学年に合わせる
		const maxGrade = Math.max(...selectedGrades);
		const maxGradeEs = document.querySelectorAll(`[data-grade="${maxGrade}"]`);
		for (const maxGradeE of maxGradeEs) {
			maxGradeE.removeAttribute("hidden");
		}
		const otherGrades = allGrades.filter(num => num !== maxGrade);
		otherGrades.forEach(grade => {
			const otherGradesEs = document.querySelectorAll(`[data-grade="${grade}"]`);
			for (const otherGradesE of otherGradesEs) {
				otherGradesE.setAttribute("hidden", "");
			}
		});

		// 解答を表示
		showAnswer();

		// テスト要素の親の高さを変更
		changeHeightOfTestSection();

		// 最初のみ
		if (testSectionE.hasAttribute("hidden")) {
			btns.makeTest.forEach(btn => {
				// テスト部分を表示
				testSectionE.removeAttribute("hidden");
				// テキスト変更
				const text = {
					ja: "問題を更新",
					en: "Update questions"
				};
				btn.querySelector(":lang(ja)").textContent = text.ja;
				btn.querySelector(":lang(en)").textContent = text.en;
				// ボタンを表示
				[printTestBtn, printAnswerBtn].forEach(btn => {
					btns[btn.id].forEach(btn2 => {
						btn2.removeAttribute("hidden");
					});
				});
			});

			// スケールを変更
			changeScaleOfPrint();
		}
	}

	// 画面上のプリントのサイズを画面幅に合わせる
	window.addEventListener("resize", changeScaleOfPrint);
	function changeScaleOfPrint() {
		const scale = testPrintE.parentElement.offsetWidth / testPrintE.offsetWidth;
		testPrintE.style.setProperty("--scale", scale);
		changeHeightOfTestSection();
	}
	function changeHeightOfTestSection() {
		let height = 0;
		for (const sibling of testPrintE.parentElement.children) {
			if (sibling !== testPrintE) {
				height += sibling.offsetHeight;
			}
		}
		testPrintE.parentElement.style.height = testPrintE.offsetHeight * testPrintE.style.getPropertyValue("--scale") + height + "px";
	}

	// 解答を表示
	const answerBtn = document.getElementById("answer");
	answerBtn.addEventListener("change", showAnswer);
	function showAnswer() {
		const answerEs = document.getElementsByClassName("answer");
		for (const elem of answerEs) {
			elem.removeAttribute("hidden");
		}
		if (answerBtn.checked) {
			for (const elem of answerEs) {
				elem.removeAttribute("hidden");
			}
		} else {
			for (const elem of answerEs) {
				elem.setAttribute("hidden", "");
			}
		}
	}

	// 印刷ボタン
	[printTestBtn, printAnswerBtn].forEach(btn => {
		const wantToShowAnswer = btn === printAnswerBtn;
		btns[btn.id].forEach(btn2 => {
			btn2.addEventListener("click", () => {
				console.log("wantToShowAnswer: ", wantToShowAnswer);
				window.onbeforeprint = function() {
					answerBtn.checked = wantToShowAnswer;
					showAnswer();
				};
				const original = answerBtn.checked;
				window.onafterprint = function() {
					answerBtn.checked = original;
					showAnswer();
				};
				window.print();
			});
		});
	});

	window.addEventListener("beforeprint", () => {
		const printArea = document.createElement("div");
		printArea.setAttribute("id", "printArea");
		document.body.appendChild(printArea);
		printArea.appendChild(testPrintE.cloneNode(true));
		document.body.firstElementChild.setAttribute("hidden", "");
	});
	window.addEventListener("afterprint", () => {
		const elem = document.body.firstElementChild;
		if (elem.hasAttribute("hidden")) {
			elem.removeAttribute("hidden");
			document.getElementById("printArea").remove();
		}
	});

	lang();

}).catch(e => {
	console.error(e.message);
});