window.addEventListener("load", () => {

	fetch("../kanjidata.json").then(response => {
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
		
		function shuffle(array) {
			for (let i = (array.length - 1); 0 < i; i--){
				const r = Math.floor(Math.random() * (i + 1));
				const tmp = array[i];
				array[i] = array[r];
				array[r] = tmp;
			}
			return array;
		}
		
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

		const settingTabs = document.getElementsByName("settingTab");
		const settingTabpanel = document.getElementsByClassName("settingTabpanel");
		const questionsDiv = document.getElementById("questionsDiv");
		const studyYearBtns = {
			ramdom: document.getElementsByName("studyYear1"),
			select: document.getElementsByName("studyYear2")
		};
		const qNumElem = document.getElementById("qNum");
		const kanjiChoicesDiv = document.getElementById("kanjiChoicesDiv");
		const kanjiChoicesElems = document.getElementsByName("kanjiChoices");
		const answerBtn = document.getElementById("answer");
		const makeTestBtn = document.getElementById("makeTest");
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
			// 今ある選択肢の削除
			const first = kanjiChoicesDiv.firstElementChild;
			kanjiChoicesDiv.innerHTML = first.outerHTML;
			// 選択肢を表示
			const studyYear = getMultiple(studyYearBtns.select);
			studyYear.forEach(year => {
				const choices = filterByYear([year]);
				if (choices.length) {
					const element = document.createElement("h3");
					element.textContent = `${year}年生`;
					kanjiChoicesDiv.appendChild(element);
				}
				const temp = document.getElementById("kanjiChoicesTemp");
				choices.forEach(choice => {
					const clone = temp.content.cloneNode(true);
					const labelElem = clone.querySelector("label");
					labelElem.children[0].value = choice;
					let html = labelElem.innerHTML;
					html = html.trim();
					html += choice;
					labelElem.innerHTML = html;
					kanjiChoicesDiv.appendChild(clone);
				});
			});
		}

		// テストを作る
		function makeTest() {
			// ランダムか漢字の選択か判定
			let kind;
			const hiddenElem = [...settingTabpanel].filter(elem => elem.hasAttribute("hidden"));
			if (hiddenElem[0] === settingTabpanel[1]) {
				kind = "ramdom";
			} else {
				kind = "select";
			}
			
			// テストが作れるか判定
			const studyYear = getMultiple(studyYearBtns[kind]);
			if (!studyYear.length) {
				alert("学習年をひとつ以上選択してください。")
				return;
			}
			if (kind === "select") {
				if (!getMultiple(kanjiChoicesElems).length) {
					alert("漢字をひとつ以上選択してください。")
					return;
				}
			}
			
			// テスト部分の表示
			testAreaElem.removeAttribute("hidden");

			// 今ある問題を削除
			while (questionsDiv.firstChild) {
				questionsDiv.firstChild.remove();
			}

			// 漢字を決定
			const qNum = qNumElem.value;
			maxScoreElem.textContent = qNum;
			let qKanji;
			if (kind === "ramdom") {
				// 漢字をランダムに選ぶ
				qKanji = ramdomSelect(qNum, studyYear);
			} else {
				// 選ばれた漢字を取得 -> シャッフル
				qKanji = shuffle(getMultiple(kanjiChoicesElems));
			}

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

			// 問題数のカウント
			const counter = document.getElementsByClassName("counter");
			const numbers = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", "⑬", "⑭", "⑮", "⑯", "⑰", "⑱", "⑲", "⑳", "㉑", "㉒", "㉓", "㉔", "㉕", "㉖", "㉗", "㉘", "㉙", "㉚", "㉛", "㉜", "㉝", "㉞", "㉟", "㊱", "㊲", "㊳", "㊴", "㊵", "㊶", "㊷", "㊸", "㊹", "㊺", "㊻", "㊼", "㊽", "㊾", "㊿"];
			for (let i = 0; i < counter.length; i++) {
				counter[i].textContent = numbers[i];
			}

			// 答えを表示する準備
			showAnswer();

			// テスト内の漢字を学年に合わせる
			const maxYear = Math.max(...studyYear);
			const maxYearElems = document.querySelectorAll(`[data-year="${maxYear}"]`);
			for (let i = 0; i < maxYearElems.length; i++) {
				maxYearElems[i].removeAttribute("hidden");
			}
			const notMaxYear = [1, 2, 3].filter((num) => {
				return num !== maxYear
			});
			for (let i = 0; i < notMaxYear.length; i++) {
				const notMaxYearElems = document.querySelectorAll(`[data-year="${notMaxYear[i]}"]`);
				for (let y = 0; y < notMaxYearElems.length; y++) {
					notMaxYearElems[y].setAttribute("hidden", "");
				}
			}
		}

		// 学習年を選び直したとき
		for　(let key of Object.keys(studyYearBtns)) {
			const elements = studyYearBtns[key];
			for (let i = 0; i < elements.length; i++) {
				elements[i].addEventListener("change", () => {
					// 問題数の最大値を漢字の数に合わせる
					const studyYear = getMultiple(elements);
					const maxKanjiNum = filterByYear(studyYear).length;
					if (maxKanjiNum < 50) {
						qNumElem.max = maxKanjiNum;
					} else {
						qNumElem.max = 50;
					}
					if (qNumElem.value > qNumElem.max) {
						qNumElem.value = qNumElem.max;
					}
					// 同期
					if (key === "ramdom") {
						var kind = "select";
					} else {
						var kind = "ramdom";
					}
					if (elements[i].checked) {
						studyYearBtns[kind][i].checked = true;
					} else {
						studyYearBtns[kind][i].checked = false;
					}
					// ランダムではないとき、漢字の選択肢を変更
					changeChoices();
				});
			}
			elements[0].dispatchEvent(new Event("change"));	// changeイベントの発火
		}

		// テスト作成
		makeTestBtn.addEventListener("click", () => {
			makeTest();
			if (!testArea.hasAttribute("hidden")) {
				makeTestBtn.textContent = "テストを更新";
			}
		});

		// 印刷
		document.getElementById("printTest").addEventListener("click", () => {
			const printArea = document.createElement("div");
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
			window.print();
			document.body.firstElementChild.removeAttribute("hidden");
			printArea.remove();
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
});
