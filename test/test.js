window.addEventListener("load", () => {

	fetch("../kanjidata.json").then(response => {
		if (response.ok) {
			return response.json();
		} else {
			return Promise.reject(new Error("JSONファイルにアクセスできません。"));
		}
	}).then((kanjiData) => {

		// 学習年で漢字をフィルター
		function kanjiStudyYear(year) {
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
			const kanjiArr = shuffle(kanjiStudyYear(year));
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
					values.push(Number(elems[i].value));
				}
			}
			return values;
		}

		function max(array) {
			return array.reduce((a, b) => {return Math.max(a, b)});
		}

		const questionsDiv = document.getElementById("questionsDiv");
		const studyYearElem = document.getElementsByName("studyYear");
		const qNumElem = document.getElementById("qNum");
		const answerBtn = document.getElementById("answer");

		// テストを作る
		function makeTest() {
			document.getElementById("testArea").removeAttribute("hidden");
			// 今ある問題を削除
			// while (questionsDiv.firstChild) {
			// 	questionsDiv.firstChild.remove();
			// }
			const studyYear = getMultiple(studyYearElem);
			const qNum = qNumElem.value;
			const qKanji = ramdomSelect(qNum, studyYear);
			qKanji.forEach(kanji => {
				const test = kanjiData[kanji].test;
				// どのフレーズを使うのか
				const phraseNum = Math.floor(Math.random() * test.length);
				const clone = document.getElementById("questionTemp").content.cloneNode(true);
				const questionElem = clone.querySelectorAll(".question")[0];
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
			// 答えを表示
			showAnswer();
		}
		
		makeTest();
	
		// 学習年を選び直したとき
		for (let i = 0; i < studyYearElem.length; i++) {
			studyYearElem[i].addEventListener("change", () => {
				// 問題数の最大値を漢字の数に合わせる
				const studyYear = getMultiple(studyYearElem);
				const maxKanjiNum = kanjiStudyYear(studyYear).length;
				if (maxKanjiNum < 50) {
					qNumElem.max = maxKanjiNum;
				} else {
					qNumElem.max = 50;
				}
				if (qNumElem.value > qNumElem.max) {
					qNumElem.value = qNumElem.max;
				}
				// テスト内の漢字を学年に合わせる
				const maxYear = max(studyYear);
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
			});
		}
		// changeイベントの発火
		studyYearElem[0].dispatchEvent(new Event("change"));

		// テスト作成
		document.getElementById("makeTest").addEventListener("click", makeTest);

		// 印刷するとき
		document.getElementById("printTest").addEventListener("click", () => {
			const elems = document.querySelectorAll("body > div > *:not(#testArea)");
			for (let i = 0; i < elems.length; i++) {
				elems[i].setAttribute("hidden", "");
			}
			// 8問ずつグルーピング
			function sliceByNumber(array, number) {
				const elements = Array.from(array);
				const length = Math.ceil(elements.length / number)
				return new Array(length).fill().map((_, i) =>
					elements.slice(i * number, (i + 1) * number)
				)
			}
			sliceByNumber(questionsDiv.children, 8).forEach(elemGroup => {
				const div = document.createElement("div");
				div.classList.add("row");
				elemGroup.forEach(elem => {
					div.appendChild(elem);
				});
				questionsDiv.appendChild(div);
			});
			window.print();
			for (let i = 0; i < elems.length; i++) {
				elems[i].removeAttribute("hidden");
			}
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
